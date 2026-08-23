import { type NextRequest } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { SITE } from "@/lib/site";
import { sendMail } from "@/lib/mailer";

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Serverseitige Entgegennahme des Englisch-Einstufungstests. Reading/Grammar,
 * Listening und die Speaking-Situationsfrage werden im Client automatisch
 * ausgewertet; Writing-Antwort und Speaking-Aufnahme können nur ein
 * Interlexico-Trainer beurteilen, daher gehen alle Antworten per Mail an das
 * Team (analog zu /api/inquiry).
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

  await sendMail({
    to: SITE.inquiryEmail,
    replyTo: email,
    subject: `Einstufungstest Englisch — ${name}`,
    text: lines.join("\n"),
    attachments,
  });

  return Response.json({ ok: true });
}
