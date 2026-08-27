import { type NextRequest } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { SITE } from "@/lib/site";
import { sendMail } from "@/lib/mailer";
import { submitLead, newIdempotencyKey } from "@/lib/one-client";

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Serverseitige Entgegennahme des Englisch-Einstufungstests. Reading/Grammar,
 * Listening und die Speaking-Situationsfrage werden im Client automatisch
 * ausgewertet; Writing-Antwort und Speaking-Aufnahme können nur ein
 * Interlexico-Trainer beurteilen, daher gehen alle Antworten weiterhin per
 * Mail ans Team (Audio/Freitext lassen sich nicht sinnvoll in einen
 * Lead-Datensatz packen). Zusätzlich — analog zu /api/inquiry — wird der
 * Test als Lead mit Qualifizierungssignal in Interlexico ONE angelegt, damit
 * ein abgeschlossener Einstufungstest wie jede andere Anfrage im CRM landet
 * statt nur im Postfach.
 */
export async function POST(req: NextRequest) {
  const rl = await rateLimit(`einstufungstest:${clientKey(req)}`, { limit: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return Response.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  const form = await req.formData();

  // Honeypot
  if (clean(form.get("website"), 100)) {
    return Response.json({ ok: true });
  }

  const name = clean(form.get("name"), 200);
  const email = clean(form.get("email"), 200);
  const phone = clean(form.get("phone"), 60);
  const newsletter = form.get("newsletter") === "true";
  const level = clean(form.get("level"), 40);
  const answersJson = clean(form.get("answers"), 20000);
  const language = clean(form.get("language"), 5) || "de";
  const idempotencyKey = clean(form.get("idempotencyKey"), 100) || newIdempotencyKey();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }
  if (!name) {
    return Response.json({ ok: false, error: "missing_name" }, { status: 422 });
  }

  let answers: { id: string; skill: string; question: string; answer: string }[] = [];
  try {
    answers = JSON.parse(answersJson);
  } catch {
    // ignore malformed answers, still forward the lead
  }

  const lines = [
    `Test: Englisch-Einstufungstest`,
    `Automatische Einordnung: ${level || "n/a"}`,
    `Name: ${name}`,
    `E-Mail: ${email}`,
    phone && `Telefon: ${phone}`,
    `Newsletter/Infos gewünscht: ${newsletter ? "Ja" : "Nein"}`,
    "",
    "Antworten:",
    ...answers.map((a) => `— [${a.skill}] ${a.question}\n   ${a.answer}`),
  ].filter(Boolean) as string[];

  const attachments: { filename: string; content: Buffer; contentType?: string }[] = [];
  const recording = form.get("recording");
  if (recording instanceof File) {
    const buf = Buffer.from(await recording.arrayBuffer());
    if (buf.length > 0 && buf.length <= 10 * 1024 * 1024) {
      attachments.push({
        filename: `speaking-${Date.now()}.webm`,
        content: buf,
        contentType: recording.type || "audio/webm",
      });
    }
  }

  const [nameParts] = await Promise.all([
    Promise.resolve(splitName(name)),
    sendMail({
      to: SITE.inquiryEmail,
      replyTo: email,
      subject: `Einstufungstest Englisch — ${name}`,
      text: lines.join("\n"),
      attachments,
    }),
  ]);

  const transfer = await submitLead({
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    email,
    phone,
    notes: lines.join("\n"),
    kind: "einstufungstest",
    language,
    // Das Formular hat aktuell keine eigene DSGVO-Consent-Checkbox (nur den
    // Newsletter-Opt-in, der etwas anderes ist) — bewusst nicht als Consent
    // umdeklariert, siehe "Was noch offen ist" im Audit.
    consent: false,
    idempotencyKey,
    signal: { type: "PLACEMENT_TEST_COMPLETED", value: level || undefined, weight: 15 },
  });
  if (!transfer.ok) {
    console.error("[einstufungstest] ONE-Übergabe fehlgeschlagen, Test lief nur per Mail:", transfer.error, {
      idempotencyKey,
    });
  }

  return Response.json({ ok: true, leadId: transfer.ok ? transfer.leadId : undefined, transferredToOne: transfer.ok });
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return { firstName: "Unbekannt", lastName: "Unbekannt" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "-" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}
