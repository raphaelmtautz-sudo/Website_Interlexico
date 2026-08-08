import type { Locale } from "@/lib/i18n";

/**
 * Text-Templates mit Parametern (z. B. Teilnehmerzahl). Bewusst NICHT Teil
 * des Dictionary-Objekts: Funktionen können nicht von Server- an
 * Client-Components als Prop übergeben werden (RSC-Serialisierungsgrenze).
 * Client-Components importieren diese Helfer daher direkt.
 */
interface ConfiguratorText {
  einGruppe: () => string;
  einGruppeNote: (n: number, max: number) => string;
  mehrGruppen: (count: number) => string;
  mehrGruppenNote: (n: number, count: number, max: number) => string;
}

const configuratorText: Record<Locale, ConfiguratorText> = {
  de: {
    einGruppe: () => `Gruppentraining · 1 Gruppe`,
    einGruppeNote: (n, max) => `Eine Gruppe mit ${n} Personen (max. ${max} pro Gruppe).`,
    mehrGruppen: (count) => `Klassentraining · ${count} Gruppen`,
    mehrGruppenNote: (n, count, max) => `${n} Personen werden auf ${count} Gruppen à max. ${max} aufgeteilt.`,
  },
  en: {
    einGruppe: () => `Group training · 1 group`,
    einGruppeNote: (n, max) => `One group of ${n} people (max. ${max} per group).`,
    mehrGruppen: (count) => `Class training · ${count} groups`,
    mehrGruppenNote: (n, count, max) => `${n} people will be split into ${count} groups of up to ${max}.`,
  },
  es: {
    einGruppe: () => `Formación en grupo · 1 grupo`,
    einGruppeNote: (n, max) => `Un grupo de ${n} personas (máx. ${max} por grupo).`,
    mehrGruppen: (count) => `Formación por departamento · ${count} grupos`,
    mehrGruppenNote: (n, count, max) => `${n} personas se dividirán en ${count} grupos de hasta ${max}.`,
  },
};

export function getConfiguratorText(locale: Locale): ConfiguratorText {
  return configuratorText[locale];
}

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
