import type { Locale } from "@/lib/i18n";

/**
 * Text-Templates mit Parametern. Bewusst NICHT Teil des Dictionary-Objekts:
 * Funktionen können nicht von Server- an Client-Components als Prop übergeben
 * werden (RSC-Serialisierungsgrenze). Client-Components importieren diese
 * Helfer daher direkt. (Konfigurator-Texte: siehe content/configurator.)
 */
interface ContactFormText {
  interesseCourse: (name: string) => string;
  teilnehmerCa: (n: string) => string;
}

const contactFormText: Record<Locale, ContactFormText> = {
  de: {
    interesseCourse: (name) => `Interesse: ${name}.`,
    teilnehmerCa: (n) => `Ca. ${n} Teilnehmer:innen.`,
  },
  en: {
    interesseCourse: (name) => `Interested in: ${name}.`,
    teilnehmerCa: (n) => `Approx. ${n} participants.`,
  },
  es: {
    interesseCourse: (name) => `Interés: ${name}.`,
    teilnehmerCa: (n) => `Aprox. ${n} participantes.`,
  },
};

export function getContactFormText(locale: Locale): ContactFormText {
  return contactFormText[locale];
}
