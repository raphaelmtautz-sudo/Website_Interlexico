import { CourseType } from "@/types/course";
import { getIndustries } from "@/content/industries";

export const businessEnglish: CourseType = {
  slug: "business-english",
  name: "Business English",
  shortName: "Business English",
  status: "aktiv",
  tagline: "Sicher verhandeln, präsentieren und kommunizieren — auf Englisch",
  heroTitle: "Business English für Führungskräfte und Teams",
  heroSubtitle:
    "Kein Sprachkurs von der Stange. Trainings, die sich an Ihrer Branche, Ihren Meetings und Ihren Zielen orientieren.",
  intro:
    "Interlexico bringt Fach- und Führungskräfte in der DACH-Region auf das sprachliche Niveau, das internationale Verhandlungen, Präsentationen und Kundengespräche verlangen. Individuell abgestimmt, mit klarer Erfolgsmessung fürs HR.",
  audience: [
    "Führungskräfte mit internationalen Stakeholdern",
    "Vertriebs- und Kundenserviceteams",
    "Fachabteilungen vor Auslandseinsätzen oder M&A-Prozessen",
    "Unternehmen mit wachsendem internationalen Geschäft",
  ],
  benefits: [
    {
      title: "Individuelle Einstufung",
      description:
        "Jedes Training beginnt mit einer präzisen Sprachstand- und Bedarfsanalyse — kein Rätselraten beim Kurslevel.",
    },
    {
      title: "Fachbezogene Inhalte",
      description:
        "Vokabular und Fallbeispiele aus Ihrer Branche statt generischer Lehrbuchszenarien.",
    },
    {
      title: "Messbarer Fortschritt",
      description:
        "Regelmäßiges Reporting für HR und Führungskräfte — Lernfortschritt wird sichtbar, nicht nur gefühlt.",
    },
    {
      title: "Flexible Formate",
      description:
        "Einzelunterricht, Gruppen oder ganze Klassen — passend zu Teamgröße und Budget.",
    },
  ],
  formats: [
    {
      slug: "einzelunterricht",
      kind: "einzel",
      name: "Einzelunterricht",
      description:
        "1:1-Coaching mit maximaler Flexibilität für Terminplanung und Lerntempo — ideal für Führungskräfte mit engem Kalender.",
      priceFrom: 89,
      priceUnit: "pro Einheit (60 Min.)",
      duration: "ab 10 Einheiten",
      capacity: "1 Teilnehmer:in",
      highlights: [
        "Individueller Trainingsplan",
        "Freie Terminwahl",
        "Vorbereitung auf konkrete Termine (Pitches, Verhandlungen)",
      ],
    },
    {
      slug: "gruppentraining",
      kind: "gruppe",
      name: "Gruppentraining",
      description:
        "Für Teams mit ähnlichem Sprachniveau und gemeinsamen fachlichen Berührungspunkten.",
      priceFrom: 59,
      priceUnit: "pro Person / Einheit (90 Min.)",
      duration: "ab 8 Einheiten",
      capacity: "max. 7 Teilnehmer:innen",
      highlights: [
        "Kleine Gruppen (max. 7) — mehr Redezeit pro Person",
        "Fallstudien aus dem gemeinsamen Arbeitsalltag",
        "Fester Wochentermin",
      ],
    },
    {
      slug: "klassentraining",
      kind: "klasse",
      name: "Klassentraining",
      description:
        "Für ganze Abteilungen oder Standorte — strukturiertes Curriculum mit einheitlichem Reporting fürs HR.",
      priceFrom: 39,
      priceUnit: "pro Person / Einheit (90 Min.)",
      duration: "Semesterprogramm",
      capacity: "7–16 Teilnehmer:innen",
      highlights: [
        "Einheitliches Curriculum je Level",
        "Zentrales Fortschritts-Reporting",
        "Skalierbar über mehrere Standorte",
      ],
    },
  ],
  industries: getIndustries("de"),
  // Keine erfundenen Kundenstimmen — echte kommen über das CMS (course-types).
  testimonials: [],
  seo: {
    title: "Business English Training für Unternehmen | Interlexico",
    description:
      "Business English Training für Führungskräfte und Teams in der DACH-Region. Individuell, fachbezogen, mit messbarem Fortschritt.",
  },
};
