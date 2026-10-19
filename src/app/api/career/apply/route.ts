import { type NextRequest } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { SITE } from "@/lib/site";
import { sendMail } from "@/lib/mailer";

/**
 * Serverseitige Entgegennahme von Bewerbungen (Karriere-Formular).
 *
 * Primärpfad: direkter Server-zu-Server-Call an den öffentlichen Endpoint des
 * Recruiting-Trichters (POST /api/public/trainer-applications, intern über
 * das ix-public Docker-Netz erreichbar) — legt die Bewerbung sofort im
 * Trichter (NEW → SCREENING → …) an, statt auf den 5-Minuten-IMAP-Poller von
 * career@interlexico.com zu warten.
 *
 * Läuft seit der trainer-mgmt-App-Archivierung (2026-09-02) im quality-
 * Backend (identischer Code, siehe dessen routes/trainer-management.ts) —
 * der alte Hostname "ix_trainer_mgmt_backend" existiert nicht mehr, zeigte
 * hier aber weiter drauf und lief seither IMMER auf den SMTP-Fallback
 * (stiller Fehlschlag, Bewerbungen kamen trotzdem an, nur 5 Min. verzögert
 * statt sofort im Trichter). Auf den echten laufenden Dienst korrigiert.
 *
 * Fallback: schlägt der direkte Call fehl (Backend down, Netzwerkproblem),
 * verschickt diese Route wie bisher per SMTP an SITE.careerEmail — die
 * Bewerbung geht dann über den IMAP-Poller mit Verzögerung trotzdem ein,
 * nichts geht verloren. Diese Website selbst bleibt bewusst zustandslos,
 * siehe /api/inquiry — keine eigene DB-Persistenz.
 */
const TRAINER_MGMT_APPLICATIONS_URL =
  process.env.TRAINER_MGMT_INTERNAL_URL ?? "http://ix_quality_backend:4006/api/public/trainer-applications";
function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10 MB pro Datei
const ALLOWED_ATTACHMENT_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function validateFile(file: File): string | null {
  if (file.size > MAX_ATTACHMENT_BYTES) return "attachment_too_large";
  if (!ALLOWED_ATTACHMENT_TYPES.has(file.type)) return "attachment_type";
  return null;
}

async function toAttachment(file: File) {
  return {
    filename: file.name.slice(0, 150),
    content: Buffer.from(await file.arrayBuffer()),
    contentType: file.type,
  };
}

async function submitToTrainerMgmt(application: {
  name: string;
  email: string;
  position: string;
  message: string;
}, resume: File): Promise<boolean> {
  try {
    const cvBuffer = Buffer.from(await resume.arrayBuffer());
    const res = await fetch(TRAINER_MGMT_APPLICATIONS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: application.email,
        name: application.name,
        position: application.position,
        message: application.message,
        cv: {
          filename: resume.name.slice(0, 150),
          mimetype: resume.type,
          data: cvBuffer.toString("base64"),
        },
      }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const rl = await rateLimit(`career:${clientKey(req)}`, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return Response.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Honeypot
  if (clean(form.get("website"), 100)) {
    return Response.json({ ok: true });
  }

  const application = {
    name: clean(form.get("name"), 200),
    email: clean(form.get("email"), 200),
    phone: clean(form.get("phone"), 40),
    position: clean(form.get("position"), 120),
    message: clean(form.get("message"), 5000),
    consent: form.get("consent") === "true",
  };

  if (!application.name || !application.position) {
    return Response.json({ ok: false, error: "missing_fields" }, { status: 422 });
  }
  if (!application.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email)) {
    return Response.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }
  if (!application.consent) {
    return Response.json({ ok: false, error: "consent_required" }, { status: 422 });
  }

  const resume = form.get("resume");
  if (!(resume instanceof File) || resume.size === 0) {
    return Response.json({ ok: false, error: "resume_required" }, { status: 422 });
  }
  const coverLetter = form.get("coverLetter");
  const files = [resume, ...(coverLetter instanceof File && coverLetter.size > 0 ? [coverLetter] : [])];
  for (const f of files) {
    const err = validateFile(f);
    if (err) return Response.json({ ok: false, error: err }, { status: 422 });
  }

  const hasCoverLetter = coverLetter instanceof File && coverLetter.size > 0;

  // Primärpfad: direkt im trainer-mgmt-Recruiting-Trichter anlegen (nur den
  // Lebenslauf — der öffentliche Endpoint kennt nur ein `cv`-Feld).
  const submitted = await submitToTrainerMgmt(application, resume);

  // Anschreiben wird von /api/public/trainer-applications nicht entgegen-
  // genommen — falls vorhanden, zusätzlich per Mail nachreichen, damit es
  // nicht verloren geht. Bestätigungsmail an die bewerbende Person nur, wenn
  // der direkte Pfad NICHT schon gegriffen hat (sonst kommt sie doppelt,
  // trainer-mgmt verschickt bei Erfolg selbst eine).
  if (!submitted || hasCoverLetter) {
    const attachments = await Promise.all(files.map(toAttachment));
    const lines = [
      `Position: ${application.position}`,
      `Name: ${application.name}`,
      `E-Mail: ${application.email}`,
      application.phone && `Telefon: ${application.phone}`,
      submitted && "(Bereits automatisch im trainer-mgmt-Recruiting-Trichter angelegt — diese Mail enthält nur das Anschreiben zur Ergänzung.)",
      "",
      application.message,
    ].filter(Boolean);

    await sendMail({
      to: SITE.careerEmail,
      replyTo: application.email,
      subject: `${submitted ? "[Anschreiben] " : ""}Neue Bewerbung — ${application.position} — ${application.name}`,
      text: lines.join("\n"),
      attachments: submitted ? attachments.filter((a) => a.filename !== resume.name.slice(0, 150)) : attachments,
    });
  }

  if (!submitted) {
    await sendMail({
      to: application.email,
      subject: `Ihre Bewerbung bei Interlexico — ${application.position}`,
      text: `Hallo ${application.name},\n\nvielen Dank für Ihre Bewerbung als „${application.position}" bei Interlexico. Wir haben Ihre Unterlagen erhalten und melden uns in Kürze bei Ihnen.\n\nViele Grüße\nInterlexico`,
    });
  }

  return Response.json({ ok: true });
}
