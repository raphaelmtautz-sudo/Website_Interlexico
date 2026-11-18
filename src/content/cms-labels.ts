import type { Locale } from "@/lib/i18n";

/** Beschriftungen für CMS-gestützte Bausteine (Team, Referenzen, Vorschau, Hinweisleiste). */
const L = {
  de: {
    preview: "Vorschau – dieser Stand ist noch nicht veröffentlicht.",
    previewExit: "Vorschau beenden",
    aboutAuthor: "Über die Autorin / den Autor",
    teamEyebrow: "Team",
    teamTitle: "Die Menschen hinter Ihrem Training",
    trainersTitle: "Ihre Trainer:innen",
    languages: "Unterrichtet",
    qualifications: "Qualifikationen",
    logosTitle: "Unternehmen, die mit uns trainieren",
    casesEyebrow: "Fallbeispiele",
    casesTitle: "So sieht Sprachtraining in der Praxis aus",
    situation: "Ausgangslage",
    solution: "Training",
    result: "Ergebnis",
    lang: { en: "Englisch", de: "Deutsch", es: "Spanisch", fr: "Französisch", it: "Italienisch" } as Record<string, string>,
  },
  en: {
    preview: "Preview – this version is not published yet.",
    previewExit: "Exit preview",
    aboutAuthor: "About the author",
    teamEyebrow: "Team",
    teamTitle: "The people behind your training",
    trainersTitle: "Your trainers",
    languages: "Teaches",
    qualifications: "Qualifications",
    logosTitle: "Companies that train with us",
    casesEyebrow: "Case studies",
    casesTitle: "What language training looks like in practice",
    situation: "Starting point",
    solution: "Training",
    result: "Result",
    lang: { en: "English", de: "German", es: "Spanish", fr: "French", it: "Italian" } as Record<string, string>,
  },
  es: {
    preview: "Vista previa – esta versión aún no está publicada.",
    previewExit: "Salir de la vista previa",
    aboutAuthor: "Sobre la autora / el autor",
    teamEyebrow: "Equipo",
    teamTitle: "Las personas detrás de su formación",
    trainersTitle: "Sus formadores",
    languages: "Imparte",
    qualifications: "Cualificaciones",
    logosTitle: "Empresas que se forman con nosotros",
    casesEyebrow: "Casos prácticos",
    casesTitle: "Así es la formación de idiomas en la práctica",
    situation: "Punto de partida",
    solution: "Formación",
    result: "Resultado",
    lang: { en: "Inglés", de: "Alemán", es: "Español", fr: "Francés", it: "Italiano" } as Record<string, string>,
  },
} satisfies Record<Locale, unknown>;

export function getCmsLabels(locale: Locale) {
  return L[locale];
}
