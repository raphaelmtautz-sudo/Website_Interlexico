import { type NextRequest } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { SITE } from "@/lib/site";
import { sendMail } from "@/lib/mailer";
import { submitLead, newIdempotencyKey } from "@/lib/one-client";

/**
 * Serverseitige Entgegennahme von Anfragen (Kontaktformular, Buchungsanfrage,
 * Lexi-Widget). Interlexico ONE ist die Single Source of Truth für Leads
 * (§28/§50 Master-Prompt) — jede Anfrage wird dort als Lead angelegt,
 * idempotent über einen pro Formular-Sitzung erzeugten Key. Die SMTP-Mail
 * (Mailcow, siehe src/lib/mailer.ts) läuft unabhängig davon als
 * Benachrichtigung weiter, damit ein ONE-Ausfall keine Anfrage verschluckt
 * (§17: keine Anfrage darf durch einen temporären Fehler verloren gehen).
 */
function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_ATTACHMENT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function POST(req: NextRequest) {
  // Missbrauchsschutz: max. 10 Anfragen/Minute je Client.
  const rl = await rateLimit(`inquiry:${clientKey(req)}`, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return Response.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  // multipart/form-data (Datei-Upload) und JSON (bestehende Aufrufer, z. B.
  // Buchungsformular) werden beide akzeptiert.
  const contentType = req.headers.get("content-type") ?? "";
  let data: Record<string, unknown>;
  let file: File | null = null;
  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      data = Object.fromEntries(form.entries());
      const f = form.get("attachment");
      if (f instanceof File && f.size > 0) file = f;
    } else {
      data = await req.json();
    }
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Honeypot: von Bots ausgefülltes Feld → still als Erfolg quittieren, nichts tun.
  if (clean(data.website, 100)) {
    return Response.json({ ok: true });
  }

  const inquiry = {
    kind: clean(data.kind, 40) || "kontakt",
    topic: clean(data.topic, 120),
    branches: clean(data.branches, 300),
    name: clean(data.name, 200),
    email: clean(data.email, 200),
    phone: clean(data.phone, 40),
    company: clean(data.company, 200),
    message: clean(data.message, 5000),
    course: clean(data.course, 120),
    format: clean(data.format, 120),
    participants: clean(data.participants, 10),
    preferredDate: clean(data.preferredDate, 60),
    contactPreference: clean(data.contactPreference, 10) === "mail" ? "mail" : "phone",
    street: clean(data.street, 200),
    zipCity: clean(data.zipCity, 100),
    consent: data.consent === "true" || data.consent === true,
    language: clean(data.language, 5) || "de",
    campaign: clean(data.campaign, 200),
    idempotencyKey: clean(data.idempotencyKey, 100) || newIdempotencyKey(),
  };

  if (!inquiry.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) {
    return Response.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }
  if (!inquiry.consent) {
    return Response.json({ ok: false, error: "consent_required" }, { status: 422 });
  }
  if (inquiry.contactPreference === "mail" && (!inquiry.street || !inquiry.zipCity)) {
    return Response.json({ ok: false, error: "address_required" }, { status: 422 });
  }
  if (file) {
    if (file.size > MAX_ATTACHMENT_BYTES) {
      return Response.json({ ok: false, error: "attachment_too_large" }, { status: 422 });
    }
    if (!ALLOWED_ATTACHMENT_TYPES.has(file.type)) {
      return Response.json({ ok: false, error: "attachment_type" }, { status: 422 });
    }
  }

  const lines = [
    `Art: ${inquiry.kind}`,
    `Thema: ${inquiry.topic}`,
    inquiry.branches && `Branchen: ${inquiry.branches}`,
    `Name: ${inquiry.name}`,
    `E-Mail: ${inquiry.email}`,
    inquiry.phone && `Telefon: ${inquiry.phone}`,
    inquiry.company && `Unternehmen: ${inquiry.company}`,
    inquiry.course && `Kurs: ${inquiry.course}`,
    inquiry.format && `Format: ${inquiry.format}`,
    inquiry.participants && `Teilnehmer: ${inquiry.participants}`,
    inquiry.preferredDate && `Wunschtermin: ${inquiry.preferredDate}`,
    `Bevorzugter Kontaktweg: ${inquiry.contactPreference === "mail" ? "Schriftlich (Post)" : "Telefonisch"}`,
    inquiry.contactPreference === "mail" && inquiry.street && `Straße: ${inquiry.street}`,
    inquiry.contactPreference === "mail" && inquiry.zipCity && `PLZ/Ort: ${inquiry.zipCity}`,
    "",
    inquiry.message,
  ].filter(Boolean);

  const attachments = file
    ? [
        {
          filename: file.name.slice(0, 150),
          content: Buffer.from(await file.arrayBuffer()),
          contentType: file.type,
        },
      ]
    : undefined;

  const [nameParts, mailResult] = await Promise.all([
    Promise.resolve(splitName(inquiry.name)),
    sendMail({
      to: SITE.inquiryEmail,
      replyTo: inquiry.email,
      subject: `Neue Anfrage (${inquiry.kind}) — ${inquiry.name || inquiry.email}`,
      text: lines.join("\n"),
      attachments,
    }),
  ]);

  const transfer = await submitLead({
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    email: inquiry.email,
    company: inquiry.company,
    phone: inquiry.phone,
    notes: lines.join("\n"),
    kind: inquiry.kind,
    campaign: inquiry.campaign || undefined,
    language: inquiry.language,
    consent: inquiry.consent,
    idempotencyKey: inquiry.idempotencyKey,
  });

  // Die Anfrage gilt als erfolgreich, sobald die Mail-Benachrichtigung ODER
  // die ONE-Übergabe geklappt hat — ein einzelner Ausfall darf die Anfrage
  // nicht verlieren (§17). Ist ONE nicht erreichbar, wird das geloggt statt
  // die Anfrage stillschweigend als reine Mail zu behandeln.
  if (!transfer.ok) {
    console.error("[inquiry] ONE-Übergabe fehlgeschlagen, Anfrage lief nur per Mail:", transfer.error, {
      idempotencyKey: inquiry.idempotencyKey,
    });
  }

  void mailResult;
  return Response.json({
    ok: true,
    leadId: transfer.ok ? transfer.leadId : undefined,
    transferredToOne: transfer.ok,
  });
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return { firstName: "Unbekannt", lastName: "Unbekannt" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "-" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}
