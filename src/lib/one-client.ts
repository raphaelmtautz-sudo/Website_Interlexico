import { randomUUID } from "crypto";

/**
 * Übergabeschicht an Interlexico ONE (das operative CRM). interlexico.com
 * erfasst Leads nur — Interlexico ONE ist die Single Source of Truth für
 * Leads/Kunden/Buchungen (siehe KONZEPT.md). Diese Funktion darf niemals
 * werfen: ein Ausfall von ONE darf keine Anfrage verlieren, siehe Aufrufer
 * (die E-Mail-Benachrichtigung läuft unabhängig weiter).
 *
 * Ziel ist der bestehende, produktive Endpunkt POST /api/public/inquiries
 * in apps/sales/backend (öffentlich, IP-ratelimitiert, kein API-Key nötig) —
 * NICHT ein eigenes /api/v1/leads. Der bestehende Endpunkt legt bereits
 * Company/Kontakt/Lead an, dedupliziert, weist per Round-Robin einem
 * Sales-Mitarbeiter zu und erstellt einen Angebots-Entwurf; ein separater,
 * schlankerer Lead-Endpunkt würde das nur redundant und schlechter nachbauen.
 */

const ONE_INQUIRIES_URL =
  process.env.ONE_INQUIRIES_URL || "https://interlexico.one/sales/api/public/inquiries";
const RETRY_DELAYS_MS = [300, 1000]; // Retry 1, Retry 2 — danach gilt der Versuch als fehlgeschlagen

export type InquiryPayload = {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  /** "digital" löst die Automation (Deal + Angebots-Entwurf) aus, "callback" nur eine Rückruf-Notiz. */
  contactMethod: "digital" | "callback";
  privacyConsent: boolean;
  /** Freitext mit allem, was sich nicht in den strukturierten Feldern unten abbildet. */
  otherInfo?: string;
  trainingType?: string;
  format?: string;
  participantCount?: string;
  startDate?: string;
  /** Stabil pro Formular-Sitzung — der Zielendpunkt hat kein Idempotency-Konzept, daher nur zur eigenen Fehlerkorrelation im Log. */
  idempotencyKey: string;
  attachment?: { filename: string; content: Buffer; contentType: string } | null;
};

export type InquiryTransferResult = { ok: true; leadId: string } | { ok: false; error: string };

export function newIdempotencyKey(): string {
  return randomUUID();
}

export async function submitInquiry(payload: InquiryPayload): Promise<InquiryTransferResult> {
  let lastError = "unknown_error";
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    if (attempt > 0) await sleep(RETRY_DELAYS_MS[attempt - 1]);
    try {
      const form = new FormData();
      form.set("companyName", payload.companyName);
      form.set("contactName", payload.contactName);
      form.set("email", payload.email);
      if (payload.phone) form.set("phone", payload.phone);
      form.set("contactMethod", payload.contactMethod);
      form.set("confirmed", "true");
      form.set("privacyConsent", String(payload.privacyConsent));
      if (payload.otherInfo) form.set("otherInfo", payload.otherInfo);
      if (payload.trainingType) form.set("trainingType", payload.trainingType);
      if (payload.format) form.set("format", payload.format);
      if (payload.participantCount) form.set("participantCount", payload.participantCount);
      if (payload.startDate) form.set("startDate", payload.startDate);
      if (payload.attachment) {
        form.set(
          "attachment",
          new Blob([new Uint8Array(payload.attachment.content)], { type: payload.attachment.contentType }),
          payload.attachment.filename,
        );
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(ONE_INQUIRIES_URL, {
        method: "POST",
        body: form,
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      if (res.ok) {
        const json = (await res.json().catch(() => null)) as { ok?: boolean; leadId?: string } | null;
        if (json?.ok && json.leadId) return { ok: true, leadId: json.leadId };
        lastError = "no_lead_id_returned";
        continue;
      }
      // 4xx (außer 429) sind Validierungsfehler, kein Retry sinnvoll.
      if (res.status >= 400 && res.status < 500 && res.status !== 429) {
        return { ok: false, error: `one_rejected_${res.status}` };
      }
      lastError = `one_status_${res.status}`;
    } catch {
      lastError = "one_unreachable";
    }
  }
  return { ok: false, error: lastError };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
