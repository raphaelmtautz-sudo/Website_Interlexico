import Redis from "ioredis";
import { submitInquiry, type InquiryPayload } from "@/lib/one-client";
import { sendMail } from "@/lib/mailer";
import { reportIssue } from "@/lib/monitoring";
import { SITE } from "@/lib/site";

/**
 * Nachversand-Warteschlange für Anfragen, die beim Absenden NICHT an
 * Interlexico ONE übergeben werden konnten (ONE nicht erreichbar / 5xx).
 *
 * Ablauf: /api/inquiry legt die Anfrage hier ab → der Hintergrund-Job
 * (src/instrumentation.ts, alle 5 Minuten) versucht die Übergabe erneut.
 * Gelingt sie, wird der Eintrag gelöscht. Klappt sie 48 Stunden lang nicht,
 * geht eine Hinweis-Mail an das Anfragen-Postfach (die ursprüngliche
 * Benachrichtigung mit allen Daten ist dort schon angekommen, markiert mit
 * „[NICHT IN ONE]“) und der Eintrag wird verworfen.
 *
 * Speicher: geteilter Redis (ix_shared_cache), Hash mit TTL 7 Tage — die
 * Daten liegen also höchstens so lange zusätzlich vor, wie nötig.
 * Ohne Redis (lokal) gibt es keinen Nachversand; die markierte Mail bleibt
 * der Fallback.
 */
const KEY = "ixcom:inquiry-outbox";
const LOCK_KEY = "ixcom:inquiry-outbox:lock";
const KEY_TTL_SECONDS = 7 * 24 * 3600;
const GIVE_UP_AFTER_MS = 48 * 3600 * 1000;

type StoredAttachment = { filename: string; contentBase64: string; contentType: string };
type OutboxEntry = {
  payload: Omit<InquiryPayload, "attachment"> & { attachment?: StoredAttachment | null };
  kind: string;
  firstFailedAt: number;
  attempts: number;
  lastError: string;
};

let client: Redis | null = null;
function redis(): Redis | null {
  if (!process.env.REDIS_URL) return null;
  if (!client) {
    client = new Redis(process.env.REDIS_URL, { lazyConnect: false, maxRetriesPerRequest: 2 });
    client.on("error", () => {
      /* Verbindungsfehler werden beim jeweiligen Aufruf behandelt. */
    });
  }
  return client;
}

/** Legt eine nicht übertragene Anfrage zur späteren Übergabe ab. Gibt false zurück, wenn das nicht möglich war. */
export async function enqueueInquiry(payload: InquiryPayload, kind: string, lastError: string): Promise<boolean> {
  const r = redis();
  if (!r) return false;
  const entry: OutboxEntry = {
    payload: {
      ...payload,
      attachment: payload.attachment
        ? {
            filename: payload.attachment.filename,
            contentType: payload.attachment.contentType,
            contentBase64: payload.attachment.content.toString("base64"),
          }
        : null,
    },
    kind,
    firstFailedAt: Date.now(),
    attempts: 1,
    lastError,
  };
  try {
    await r.hset(KEY, payload.idempotencyKey, JSON.stringify(entry));
    await r.expire(KEY, KEY_TTL_SECONDS);
    return true;
  } catch {
    return false;
  }
}

/** Ein Durchlauf des Nachversands. Wird vom Hintergrund-Job aufgerufen. */
export async function processInquiryOutbox(): Promise<void> {
  const r = redis();
  if (!r) return;
  let entries: Record<string, string>;
  try {
    // Nur ein Durchlauf gleichzeitig (auch falls einmal mehrere Instanzen laufen).
    const locked = await r.set(LOCK_KEY, String(process.pid), "EX", 240, "NX");
    if (!locked) return;
    entries = await r.hgetall(KEY);
  } catch {
    return;
  }

  try {
    for (const [id, raw] of Object.entries(entries)) {
      let entry: OutboxEntry;
      try {
        entry = JSON.parse(raw);
      } catch {
        await r.hdel(KEY, id);
        continue;
      }
      const att = entry.payload.attachment;
      const result = await submitInquiry({
        ...entry.payload,
        attachment: att
          ? { filename: att.filename, contentType: att.contentType, content: Buffer.from(att.contentBase64, "base64") }
          : null,
      });

      if (result.ok) {
        await r.hdel(KEY, id);
        reportIssue(
          "[inquiry-outbox] Anfrage nachträglich an ONE übergeben",
          { area: "inquiry", idempotencyKey: id, kind: entry.kind, attempts: entry.attempts + 1 },
          "info",
        );
        continue;
      }

      const tooOld = Date.now() - entry.firstFailedAt > GIVE_UP_AFTER_MS;
      // 4xx von ONE (Validierung) wird durch Wiederholen nicht besser.
      const permanent = result.error.startsWith("one_rejected_");
      if (tooOld || permanent) {
        await r.hdel(KEY, id);
        reportIssue("[inquiry-outbox] Anfrage endgültig NICHT in ONE — bitte manuell anlegen", {
          area: "inquiry",
          idempotencyKey: id,
          kind: entry.kind,
          attempts: entry.attempts + 1,
          error: result.error,
        });
        await sendMail({
          to: SITE.inquiryEmail,
          subject: `[NICHT IN ONE] Anfrage bitte manuell anlegen — Ref. ${id.slice(0, 8)}`,
          text: [
            "Eine Website-Anfrage konnte nicht automatisch an Interlexico ONE übergeben werden.",
            permanent ? `ONE hat die Anfrage abgelehnt (${result.error}).` : "ONE war 48 Stunden lang nicht erreichbar.",
            "",
            `Referenz: ${id}`,
            `Art: ${entry.kind}`,
            "",
            "Bitte den Lead mit diesen Angaben manuell in ONE anlegen:",
            "",
            `Firma: ${entry.payload.companyName}`,
            `Ansprechpartner: ${entry.payload.contactName}`,
            `E-Mail: ${entry.payload.email}`,
            entry.payload.phone ? `Telefon: ${entry.payload.phone}` : "",
            "",
            entry.payload.otherInfo ?? "",
            att ? `\n(Anhang: ${att.filename} — liegt dieser Mail bei)` : "",
          ].join("\n"),
          attachments: att
            ? [{ filename: att.filename, contentType: att.contentType, content: Buffer.from(att.contentBase64, "base64") }]
            : undefined,
        }).catch((err) => reportIssue("[inquiry-outbox] Hinweis-Mail fehlgeschlagen", { area: "inquiry", idempotencyKey: id, error: String(err) }));
        continue;
      }

      entry.attempts += 1;
      entry.lastError = result.error;
      await r.hset(KEY, id, JSON.stringify(entry));
    }
  } finally {
    await r.del(LOCK_KEY).catch(() => {});
  }
}
