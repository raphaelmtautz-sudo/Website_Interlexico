import { sendMail } from "@/lib/mailer";
import { reportIssue } from "@/lib/monitoring";
import { SITE } from "@/lib/site";

/**
 * Eingangsbestätigung an die anfragende Person (Kontaktformular, Konfigurator,
 * Lexi). Bewusst OHNE vom Absender eingegebene Inhalte (Name, Nachricht):
 * Sonst ließe sich das Formular missbrauchen, um beliebigen Text an fremde
 * Adressen zu schicken. Nur feste Texte + Referenznummer. Keine Werbung.
 */
const TEXT = {
  de: {
    subject: "Ihre Anfrage bei Interlexico ist eingegangen",
    body: (ref: string, phone: string) =>
      [
        "Guten Tag,",
        "",
        "vielen Dank für Ihre Anfrage. Sie ist bei uns eingegangen, und wir melden uns in der Regel innerhalb von zwei Werktagen mit einem konkreten Vorschlag.",
        "",
        "Sie müssen nichts weiter tun. Falls Sie Ergänzungen haben, antworten Sie einfach auf diese E-Mail.",
        "",
        `Ihre Referenz: ${ref}`,
        "",
        "Mit freundlichen Grüßen",
        "Ihr Interlexico-Team",
        "",
        "—",
        "Interlexico · Sprachakademie für Unternehmen",
        `${SITE.url} · ${phone}`,
        "Sie erhalten diese E-Mail, weil über interlexico.com eine Anfrage mit Ihrer Adresse gestellt wurde. Falls Sie das nicht waren, können Sie diese Nachricht ignorieren.",
      ].join("\n"),
  },
  en: {
    subject: "We have received your enquiry – Interlexico",
    body: (ref: string, phone: string) =>
      [
        "Hello,",
        "",
        "Thank you for your enquiry. We have received it and will usually get back to you within two working days with a concrete proposal.",
        "",
        "There is nothing else you need to do. If you would like to add anything, simply reply to this email.",
        "",
        `Your reference: ${ref}`,
        "",
        "Kind regards",
        "Your Interlexico team",
        "",
        "—",
        "Interlexico · Language academy for companies",
        `${SITE.url} · ${phone}`,
        "You are receiving this email because an enquiry was submitted on interlexico.com with your address. If this wasn't you, please ignore this message.",
      ].join("\n"),
  },
  es: {
    subject: "Hemos recibido su solicitud – Interlexico",
    body: (ref: string, phone: string) =>
      [
        "Buenos días:",
        "",
        "Gracias por su solicitud. La hemos recibido y normalmente le responderemos en un plazo de dos días laborables con una propuesta concreta.",
        "",
        "No tiene que hacer nada más. Si desea añadir algo, responda simplemente a este correo.",
        "",
        `Su referencia: ${ref}`,
        "",
        "Atentamente,",
        "El equipo de Interlexico",
        "",
        "—",
        "Interlexico · Academia de idiomas para empresas",
        `${SITE.url} · ${phone}`,
        "Recibe este correo porque se envió una solicitud en interlexico.com con su dirección. Si no fue usted, ignore este mensaje.",
      ].join("\n"),
  },
} as const;

export async function sendInquiryConfirmation(opts: { to: string; language: string; reference: string; phone: string }) {
  const t = TEXT[(opts.language in TEXT ? opts.language : "de") as keyof typeof TEXT];
  try {
    const res = await sendMail({
      to: opts.to,
      fromName: "Interlexico",
      replyTo: SITE.inquiryEmail,
      subject: t.subject,
      text: t.body(opts.reference.slice(0, 8).toUpperCase(), opts.phone),
    });
    return res.sent;
  } catch (err) {
    reportIssue("[inquiry] Eingangsbestätigung an Anfragende fehlgeschlagen", {
      area: "inquiry",
      reference: opts.reference,
      error: err instanceof Error ? err.message : String(err),
    });
    return false;
  }
}
