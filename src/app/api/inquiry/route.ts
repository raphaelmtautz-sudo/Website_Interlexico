import { type NextRequest } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { SITE } from "@/lib/site";
import { sendMail } from "@/lib/mailer";

/**
 * Serverseitige Entgegennahme von Anfragen (Kontaktformular & Buchungsanfrage).
 * Verschickt NICHT über das Mailprogramm des Nutzers, sondern leitet die
 * Anfrage per SMTP (Mailcow, siehe src/lib/mailer.ts) an SITE.inquiryEmail
 * weiter. Ohne konfiguriertes SMTP wird nur geloggt, siehe mailer.ts.
 */
function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: NextRequest) {
  // Missbrauchsschutz: max. 10 Anfragen/Minute je Client.
  const rl = rateLimit(`inquiry:${clientKey(req)}`, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return Response.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
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
    company: clean(data.company, 200),
    message: clean(data.message, 5000),
    course: clean(data.course, 120),
    format: clean(data.format, 120),
    participants: clean(data.participants, 10),
  };

  if (!inquiry.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) {
    return Response.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }

  const lines = [
    `Art: ${inquiry.kind}`,
    `Thema: ${inquiry.topic}`,
    inquiry.branches && `Branchen: ${inquiry.branches}`,
    `Name: ${inquiry.name}`,
    `E-Mail: ${inquiry.email}`,
    inquiry.company && `Unternehmen: ${inquiry.company}`,
    inquiry.course && `Kurs: ${inquiry.course}`,
    inquiry.format && `Format: ${inquiry.format}`,
    inquiry.participants && `Teilnehmer: ${inquiry.participants}`,
    "",
    inquiry.message,
  ].filter(Boolean);

  await sendMail({
    to: SITE.inquiryEmail,
    replyTo: inquiry.email,
    subject: `Neue Anfrage (${inquiry.kind}) — ${inquiry.name || inquiry.email}`,
    text: lines.join("\n"),
  });

  return Response.json({ ok: true });
}
