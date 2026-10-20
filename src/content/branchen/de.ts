import type { IndustryLabels, IndustryPage } from "./types";

export const labels: IndustryLabels = {
  hubEyebrow: "Business English nach Branche",
  hubTitle: "Business English für Ihre Branche",
  hubSeoTitle: "Business English nach Branche — Firmentraining | Interlexico",
  hubText:
    "Jede Branche hat ihre eigene Sprache. Interlexico trainiert Business English mit dem Fachvokabular und den Gesprächssituationen Ihres Arbeitsalltags — für Teams in Deutschland, Österreich und der Schweiz, online, vor Ort oder hybrid.",
  situations: "Typische Situationen im Training",
  topics: "Themen und Fachvokabular",
  formats: "Passende Formate",
  faq: "Häufige Fragen",
  cta: "Training für Ihr Team anfragen",
  ctaText: "Schildern Sie kurz Team, Ziele und Zeitrahmen — Sie erhalten in der Regel innerhalb eines Werktages ein unverbindliches Angebot.",
  more: "Weitere Branchen",
  course: "Zum Business-English-Kurs",
  daf: "Deutsch als Fremdsprache bieten wir branchenübergreifend für jede Rolle an.",
};

export const industries: IndustryPage[] = [
  {
    slug: "oeffentlicher-dienst",
    name: "Öffentlicher Dienst & Behörden",
    eyebrow: "Business English · Öffentlicher Dienst",
    title: "Englisch für Behörden und den öffentlichen Dienst",
    seoTitle: "Englisch für Behörden & öffentlichen Dienst | Interlexico",
    description:
      "Englischtraining für Behörden, Verwaltungen und öffentliche Einrichtungen: Bürgerkontakt, internationale Zusammenarbeit und Verwaltungssprache — online, vor Ort oder hybrid.",
    intro:
      "Ob Ausländerbehörde, Ministerium, Kommune oder Hochschulverwaltung: Mitarbeitende im öffentlichen Dienst sprechen immer öfter Englisch — mit Bürger:innen ohne Deutschkenntnisse, mit EU-Partnern und in internationalen Projekten. Interlexico trainiert genau diese Situationen, mit klarer, verständlicher Sprache statt Floskeln.",
    situations: [
      "Bürger:innen am Schalter, am Telefon und per E-Mail auf Englisch beraten",
      "Verfahren, Fristen und benötigte Unterlagen einfach und rechtssicher erklären",
      "An EU-Projekten, Partnerschaften und internationalen Arbeitsgruppen teilnehmen",
      "Delegationen empfangen und Fachgespräche führen",
      "Englische Schreiben, Bescheid-Erläuterungen und Protokolle verfassen",
    ],
    topics: [
      "Verwaltungs- und Verfahrensvokabular",
      "Plain English: komplexe Regeln einfach erklären",
      "Höfliche, deeskalierende Gesprächsführung",
      "Förder- und Projektsprache (EU-Programme)",
      "Interkulturelle Kommunikation im Bürgerkontakt",
    ],
    formats:
      "Für Teams mit Bürgerkontakt eignet sich Gruppentraining (max. 7 Personen) mit Rollenspielen aus dem eigenen Amt. Ganze Behörden oder Standorte arbeiten im Klassentraining mit einheitlichem Curriculum je Niveau und zentralem Reporting. Leitungsfunktionen mit internationalen Terminen trainieren im 1:1.",
    faq: [
      {
        question: "Ist das Training auf unsere Behörde zuschneidbar?",
        answer:
          "Ja. Nach einer Bedarfsanalyse arbeiten wir mit den Vorgängen, Formularen und Gesprächssituationen Ihrer Dienststelle — vom Bürgerkontakt bis zur internationalen Projektarbeit.",
      },
      {
        question: "Kann das Training während der Dienstzeit stattfinden?",
        answer:
          "Ja. Termine werden an Dienstpläne angepasst; das Training findet online, vor Ort in Ihrer Einrichtung oder hybrid statt.",
      },
      {
        question: "Wie wird der Lernerfolg für die Personalabteilung dokumentiert?",
        answer:
          "Jedes Training beginnt mit einer Einstufung nach GER. Über Interlexico ONE erhält die Personalstelle ein regelmäßiges Fortschritts-Reporting.",
      },
    ],
  },
  {
    slug: "vertrieb",
    name: "Vertrieb & Business Development",
    eyebrow: "Business English · Vertrieb",
    title: "Englisch für Vertrieb und Business Development",
    seoTitle: "Business English für Vertrieb & Sales-Teams | Interlexico",
    description:
      "Englischtraining für Vertriebs- und Business-Development-Teams: Pitches, Verhandlungen, Einwandbehandlung und Kundengespräche — individuell, mit messbarem Fortschritt.",
    intro:
      "Im internationalen Vertrieb entscheidet die Sprache mit über den Abschluss. Interlexico trainiert Vertriebs- und Business-Development-Teams für die Gespräche, in denen es darauf ankommt: vom ersten Call über die Präsentation bis zur Preisverhandlung.",
    situations: [
      "Kaltakquise und Erstgespräche per Telefon und Video",
      "Produkt- und Lösungspräsentationen vor internationalen Kund:innen",
      "Einwände souverän behandeln und Nutzen argumentieren",
      "Preis- und Vertragsverhandlungen führen",
      "Follow-up-E-Mails, Angebote und LinkedIn-Nachrichten schreiben",
    ],
    topics: [
      "Verkaufs- und Verhandlungssprache",
      "Storytelling und überzeugendes Präsentieren",
      "Fragetechniken und aktives Zuhören",
      "Small Talk und Beziehungsaufbau in verschiedenen Kulturen",
      "Angebots-, Vertrags- und Konditionsvokabular",
    ],
    formats:
      "Vertriebsteams profitieren vom Gruppentraining mit realen Pitches und Verhandlungs-Rollenspielen. Vor wichtigen Terminen bereitet 1:1-Training gezielt auf konkrete Präsentationen oder Verhandlungen vor.",
    faq: [
      {
        question: "Können wir echte Kundentermine vorbereiten?",
        answer:
          "Ja. Im Einzelunterricht bereiten wir konkrete Pitches, Präsentationen und Verhandlungen vor — mit Ihren Unterlagen und typischen Einwänden Ihrer Kund:innen.",
      },
      {
        question: "Für welches Niveau eignet sich das Vertriebstraining?",
        answer:
          "Für jedes Niveau. Teilnehmende werden zu Beginn nach GER eingestuft; Gruppen werden nach ähnlichem Sprachniveau zusammengestellt.",
      },
      {
        question: "Findet das Training online statt?",
        answer:
          "Online, vor Ort oder hybrid — passend zu Reisetätigkeit und Kalender Ihres Teams.",
      },
    ],
  },
  {
    slug: "engineering",
    name: "Engineering & technische Dienstleistungen",
    eyebrow: "Business English · Engineering",
    title: "Technisches Englisch für Engineering und technische Dienstleistungen",
    seoTitle: "Technisches Englisch für Ingenieur:innen & Technik | Interlexico",
    description:
      "Technisches Englisch für Ingenieur:innen, Projekt- und Servicetechniker:innen: Spezifikationen, Projektmeetings, Kundensupport und Dokumentation — praxisnah und branchenbezogen.",
    intro:
      "Ingenieur:innen und Techniker:innen arbeiten mit internationalen Kund:innen, Lieferanten und Kolleg:innen — in Projektmeetings, bei Inbetriebnahmen und im Service. Interlexico trainiert das technische Englisch, das dafür gebraucht wird: präzise, verständlich und sicher.",
    situations: [
      "Projektmeetings und Abstimmungen mit internationalen Partnern",
      "Technische Lösungen, Abläufe und Probleme erklären",
      "Kund:innen bei Inbetriebnahme, Wartung und Störungen unterstützen",
      "Lastenhefte, Spezifikationen und Berichte lesen und schreiben",
      "Änderungen, Verzögerungen und Risiken klar kommunizieren",
    ],
    topics: [
      "Technisches Fachvokabular Ihres Bereichs",
      "Prozesse, Maße, Toleranzen und Fehlerbilder beschreiben",
      "Projektmanagement-Englisch",
      "Sicherheits- und Qualitätskommunikation",
      "Technische Dokumentation und E-Mails",
    ],
    formats:
      "Projektteams lernen im Gruppentraining mit Fallbeispielen aus den eigenen Projekten. Für Servicetechniker:innen mit Auslandseinsätzen eignet sich 1:1-Training mit flexiblen Terminen; ganze Abteilungen oder Standorte trainieren im Klassentraining.",
    faq: [
      {
        question: "Arbeiten die Trainer:innen mit unserem Fachvokabular?",
        answer:
          "Ja. Zu Beginn klären wir in einer Bedarfsanalyse Produkte, Prozesse und typische Situationen; Vokabular und Fallbeispiele kommen aus Ihrem technischen Umfeld.",
      },
      {
        question: "Ist das Training mit Schicht- oder Projektplänen vereinbar?",
        answer:
          "Ja. Termine werden an Schicht- und Projektpläne angepasst, online, vor Ort oder hybrid.",
      },
      {
        question: "Können wir Mitarbeitende vor einem Auslandseinsatz vorbereiten?",
        answer:
          "Ja. Im Einzel- oder Gruppentraining bereiten wir gezielt auf Einsätze, Inbetriebnahmen und Kundentermine im Ausland vor.",
      },
    ],
  },
  {
    slug: "banken-finanzen",
    name: "Banken & Finanzdienstleistungen",
    eyebrow: "Business English · Finance",
    title: "Englisch für Banken und Finanzdienstleistungen",
    seoTitle: "Financial English für Banken & Finanzdienstleister | Interlexico",
    description:
      "Financial English für Banken, Versicherungen und Finanzdienstleister: Kundenberatung, Reporting, Compliance und Präsentationen — individuell eingestuft, mit messbarem Fortschritt.",
    intro:
      "In Banken und Finanzdienstleistern ist Englisch Arbeitssprache — in der Kundenberatung, im Reporting, im Risikomanagement und im Austausch mit internationalen Konzerneinheiten und Aufsichtsthemen. Interlexico trainiert das präzise Financial English, das diese Arbeit verlangt.",
    situations: [
      "Internationale Kund:innen zu Konten, Finanzierungen und Anlagen beraten",
      "Zahlen, Ergebnisse und Kennzahlen präsentieren",
      "In Meetings mit internationalen Konzerneinheiten mitdiskutieren",
      "Compliance-, Risiko- und Regulierungsthemen erklären",
      "Präzise E-Mails, Memos und Berichte schreiben",
    ],
    topics: [
      "Financial English: Bilanz, GuV, Kennzahlen",
      "Banking-, Kredit- und Anlagevokabular",
      "Compliance- und Regulierungssprache",
      "Zahlen und Trends sicher präsentieren",
      "Diplomatische Formulierungen in heiklen Gesprächen",
    ],
    formats:
      "Fachabteilungen trainieren im Gruppentraining mit Fallbeispielen aus dem eigenen Bereich. Führungskräfte und Spezialist:innen mit Präsentations- oder Verhandlungsterminen nutzen 1:1-Training; standortübergreifende Programme laufen im Klassentraining mit einheitlichem Reporting.",
    faq: [
      {
        question: "Deckt das Training Fachsprache wie Reporting und Compliance ab?",
        answer:
          "Ja. Inhalte richten sich nach Ihren Bereichen — etwa Kundenberatung, Reporting, Risiko oder Compliance — und werden in der Bedarfsanalyse festgelegt.",
      },
      {
        question: "Wie wird der Fortschritt nachgewiesen?",
        answer:
          "Mit Einstufung nach GER zu Beginn und regelmäßigem Fortschritts-Reporting über Interlexico ONE — nachvollziehbar für HR und Führungskräfte.",
      },
      {
        question: "Gibt es Training für einzelne Führungskräfte?",
        answer:
          "Ja. Im 1:1-Training mit Einheiten à 60 Minuten bereiten sich Führungskräfte gezielt auf Präsentationen, Gremien und Verhandlungen vor.",
      },
    ],
  },
  {
    slug: "it-software",
    name: "IT & Software",
    eyebrow: "Business English · IT",
    title: "Englisch für IT- und Softwareteams",
    seoTitle: "Business English für IT- & Softwareteams | Interlexico",
    description:
      "Englischtraining für Entwickler:innen, Product- und IT-Teams: Stand-ups, Code Reviews, Stakeholder-Kommunikation und Dokumentation — praxisnah für internationale Teams.",
    intro:
      "In IT- und Softwareteams ist Englisch oft Arbeitssprache: in Stand-ups, Tickets, Code Reviews und im Austausch mit Kund:innen und Stakeholdern. Interlexico trainiert Entwickler:innen, Product-Teams und IT-Abteilungen für klare, selbstbewusste Kommunikation — auch jenseits der Technik.",
    situations: [
      "Stand-ups, Plannings und Retrospektiven auf Englisch moderieren und mitgestalten",
      "Code Reviews, Tickets und Pull Requests klar formulieren",
      "Technische Themen für nicht-technische Stakeholder verständlich erklären",
      "Anforderungen mit Kund:innen klären und Erwartungen managen",
      "Incidents, Verzögerungen und Prioritäten kommunizieren",
    ],
    topics: [
      "Agile- und Projektvokabular",
      "Technisches Schreiben: Doku, Tickets, Release Notes",
      "Feedback geben und annehmen",
      "Präsentieren von Architektur- und Produktentscheidungen",
      "Kommunikation in verteilten, multikulturellen Teams",
    ],
    formats:
      "Entwicklungsteams lernen im Gruppentraining mit eigenen Tickets, Reviews und Meetings als Material. Tech Leads und Product Owner nutzen 1:1-Training für Stakeholder-Gespräche und Präsentationen; das Training läuft meist online.",
    faq: [
      {
        question: "Unsere Teams arbeiten remote — geht das Training online?",
        answer:
          "Ja. Das Training läuft online, vor Ort oder hybrid; für verteilte Teams ist Online-Training mit festen Wochenterminen üblich.",
      },
      {
        question: "Geht es nur um Fachvokabular?",
        answer:
          "Nein. Neben technischem Englisch trainieren wir vor allem die Kommunikation: Meetings, Feedback, Stakeholder-Gespräche und verständliches Schreiben.",
      },
      {
        question: "Können Teilnehmende unterschiedlicher Niveaus gemeinsam lernen?",
        answer:
          "Gruppen werden nach ähnlichem Sprachniveau zusammengestellt. Bei großen Unterschieden kombinieren wir Gruppen- und Einzeltraining.",
      },
    ],
  },
  {
    slug: "management-fuehrung",
    name: "Management & Führung",
    eyebrow: "Business English · Führung",
    title: "Business English für Führungskräfte und Management",
    seoTitle: "Business English für Führungskräfte & Management | Interlexico",
    description:
      "Business English Coaching für Führungskräfte: Verhandlungen, Präsentationen vor Vorstand und Kund:innen, Mitarbeiterführung und Krisenkommunikation — 1:1 und flexibel.",
    intro:
      "Führungskräfte führen internationale Teams, verhandeln mit Partnern und präsentieren vor Vorstand, Investor:innen und Kund:innen. Interlexico trainiert das Englisch, mit dem Führung überzeugt: klar, souverän und diplomatisch — meist im 1:1-Coaching mit freier Terminwahl.",
    situations: [
      "Verhandlungen mit internationalen Partnern führen",
      "Strategien und Ergebnisse vor Vorstand, Gremien und Kund:innen präsentieren",
      "Internationale Teams führen, Feedback geben und Mitarbeitergespräche führen",
      "Meetings und Workshops moderieren",
      "In Krisen und Veränderungsprozessen klar kommunizieren",
    ],
    topics: [
      "Verhandlungs- und Überzeugungssprache",
      "Executive Presentations und Storytelling",
      "Leadership-Kommunikation und Feedback",
      "Diplomatische Sprache und Eskalation",
      "Change- und Krisenkommunikation",
    ],
    formats:
      "Für Führungskräfte mit engem Kalender eignet sich 1:1-Coaching (Einheiten à 60 Minuten, ab 10 Einheiten) mit gezielter Vorbereitung auf konkrete Termine. Führungsteams können zusätzlich gemeinsam im Gruppentraining arbeiten.",
    faq: [
      {
        question: "Können wir das Training kurzfristig auf einen Termin ausrichten?",
        answer:
          "Ja. Im 1:1-Coaching bereiten wir gezielt auf konkrete Verhandlungen, Präsentationen oder Gremiensitzungen vor — mit Ihren eigenen Unterlagen.",
      },
      {
        question: "Wie flexibel sind die Termine?",
        answer:
          "Im Einzelunterricht wählen Sie Termine frei — online, vor Ort oder hybrid, passend zu Reisen und Kalender.",
      },
      {
        question: "Kann ein Führungsteam gemeinsam trainieren?",
        answer:
          "Ja. Im Gruppentraining (max. 7 Personen) arbeiten Führungsteams gemeinsam an Meetings, Präsentationen und Verhandlungen; einzelne Führungskräfte ergänzen das mit 1:1-Coaching.",
      },
    ],
  },
];
