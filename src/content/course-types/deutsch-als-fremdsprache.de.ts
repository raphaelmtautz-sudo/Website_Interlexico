import { CourseType } from "@/types/course";

export const deutschAlsFremdsprache: CourseType = {
  slug: "deutsch-als-fremdsprache",
  name: "Deutsch als Fremdsprache",
  shortName: "Deutsch",
  status: "aktiv",
  tagline: "Ankommen in der Unternehmenssprache",
  heroTitle: "Deutsch als Fremdsprache für internationale Teams",
  heroSubtitle:
    "Damit internationale Fachkräfte im deutschsprachigen Arbeitsumfeld schnell ankommen — fachlich sicher, kulturell souverän, sofort einsatzbereit.",
  intro:
    "Interlexico bringt internationale Mitarbeitende auf das Deutschniveau, das ihr Arbeitsalltag verlangt: Meetings, E-Mails, Fachgespräche und der Umgang mit Behörden und Kolleg:innen. Individuell abgestimmt, praxisnah und mit klarer Erfolgsmessung fürs HR.",
  audience: [
    "Internationale Fach- und Führungskräfte in deutschsprachigen Unternehmen",
    "Neu zugezogene Mitarbeitende im Onboarding",
    "Teams mit gemischten Sprachhintergründen, die eine gemeinsame Arbeitssprache aufbauen",
    "Unternehmen, die internationale Talente langfristig integrieren wollen",
  ],
  benefits: [
    {
      title: "Arbeitsalltag statt Lehrbuch",
      description:
        "Wir trainieren die Situationen, die wirklich zählen: Team-Meetings, E-Mails, Telefonate und Fachgespräche im jeweiligen Bereich.",
    },
    {
      title: "Schnelle Integration",
      description:
        "Neue internationale Mitarbeitende finden sich sprachlich und kulturell schneller zurecht — im Job wie im Alltag.",
    },
    {
      title: "Messbarer Fortschritt",
      description:
        "Einstufung, klare Lernziele und regelmäßiges Reporting machen den Fortschritt für HR und Führungskräfte sichtbar.",
    },
    {
      title: "Flexible Formate",
      description:
        "Einzelunterricht, Gruppen oder ganze Klassen — online, vor Ort oder hybrid, passend zu Teamgröße und Schichtplan.",
    },
  ],
  formats: [
    {
      slug: "einzelunterricht",
      kind: "einzel",
      name: "Einzelunterricht",
      description:
        "1:1-Training mit maximaler Flexibilität — ideal für Führungskräfte und Spezialist:innen, die schnell und gezielt Deutsch für konkrete Aufgaben brauchen.",
      priceFrom: 0,
      priceUnit: "auf Anfrage",
      duration: "individuell",
      capacity: "1 Teilnehmer:in",
      highlights: [
        "Individueller Lernplan auf Rolle und Ziele zugeschnitten",
        "Freie Terminwahl, auch bei engem Kalender",
        "Vorbereitung auf konkrete Situationen (Meetings, Behörden, Fachgespräche)",
      ],
    },
    {
      slug: "gruppentraining",
      kind: "gruppe",
      name: "Gruppentraining",
      description:
        "Für Teams mit ähnlichem Sprachniveau und gemeinsamen Arbeitsthemen — fördert Teamgeist und eine gemeinsame Arbeitssprache.",
      priceFrom: 0,
      priceUnit: "auf Anfrage",
      duration: "ab 8 Einheiten",
      capacity: "max. 7 Teilnehmer:innen",
      highlights: [
        "Kleine Gruppen (max. 7) — mehr Redezeit pro Person",
        "Praxisszenarien aus dem gemeinsamen Arbeitsalltag",
        "Fester Wochentermin, online oder vor Ort",
        "Aufbau einer gemeinsamen Team-Kommunikation",
      ],
    },
    {
      slug: "klassentraining",
      kind: "klasse",
      name: "Klassentraining",
      description:
        "Für ganze Abteilungen oder Onboarding-Kohorten — strukturiertes Curriculum mit einheitlichem Reporting fürs HR.",
      priceFrom: 0,
      priceUnit: "auf Anfrage",
      duration: "Semesterprogramm",
      capacity: "7–16 Teilnehmer:innen",
      highlights: [
        "Einheitliches Curriculum je Niveau (A1–C1)",
        "Zentrales Fortschritts-Reporting",
        "Skalierbar über mehrere Standorte und Schichten",
      ],
    },
  ],
  testimonials: [],
  seo: {
    title: "Deutsch als Fremdsprache für Unternehmen | Interlexico",
    description:
      "Deutsch-als-Fremdsprache-Training für internationale Fach- und Führungskräfte in der DACH-Region. Praxisnah, integrationsstark, mit messbarem Fortschritt.",
  },
};
