import nodemailer from "nodemailer";

/**
 * Versand über die bestehende Mailcow-Instanz (SMTP). Ohne gesetzte
 * SMTP_HOST/SMTP_USER/SMTP_PASS wird nur geloggt (lokale Entwicklung /
 * Preview) statt ein leeres Postfach anzuschreiben oder den Build zu brechen.
 */
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM ?? SMTP_USER;

const transport =
  SMTP_HOST && SMTP_USER && SMTP_PASS
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      })
    : null;

export async function sendMail(opts: {
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
}) {
  if (!transport) {
    console.warn("[mailer] SMTP nicht konfiguriert — Mail wird nur geloggt.", {
      ...opts,
      attachments: opts.attachments?.map((a) => a.filename),
    });
    return { sent: false as const };
  }
  await transport.sendMail({
    from: SMTP_FROM,
    to: opts.to,
    replyTo: opts.replyTo,
    subject: opts.subject,
    text: opts.text,
    attachments: opts.attachments,
  });
  return { sent: true as const };
}
