import type { ConfiguratorContent } from "./types";

export const configurator: ConfiguratorContent = {
  progress: (c, t) => `Schritt ${c} von ${t}`,
  steps: {
    sprache: { title: "Welche Sprache soll trainiert werden?", hint: "Sie können später weitere Sprachen ergänzen." },
    zielgruppe: {
      title: "Wer nimmt teil?",
      hint: "Davon hängen Tempo, Inhalte und das passende Format ab.",
    },
    teilnehmer: {
      title: "Wie viele Personen sollen teilnehmen?",
      hint: "Wir trainieren in kleinen Gruppen mit höchstens 7 Personen, damit alle genug Redezeit haben.",
    },
    niveau: {
      title: "Wie gut ist das Sprachniveau heute?",
      hint: "Eine Schätzung genügt. Jedes Training beginnt ohnehin mit einer individuellen Einstufung.",
    },
    ziele: {
      title: "In welchen Situationen soll Ihr Team sicherer werden?",
      hint: "Mehrfachauswahl möglich. Daraus entsteht Ihr Trainingsplan.",
    },
    durchfuehrung: {
      title: "Wie soll trainiert werden?",
      hint: "Sie können das Format auch später noch ändern.",
    },
    umfang: {
      title: "Welchen Umfang stellen Sie sich vor?",
      hint: "Unsicher? Dann empfehlen wir einen Umfang passend zu Niveau und Zielen.",
    },
  },
  courseHints: {
    "business-english": "Für Meetings, Verhandlungen und internationale Zusammenarbeit",
    "deutsch-als-fremdsprache": "Damit internationale Fachkräfte im Arbeitsalltag ankommen",
  },
  audiences: [
    { value: "fachkraefte", label: "Fach- und Nachwuchskräfte", hint: "Einzelne Mitarbeitende mit konkretem Bedarf" },
    { value: "team", label: "Ein Team oder eine Abteilung", hint: "Gemeinsame Themen, gemeinsamer Arbeitsalltag" },
    { value: "fuehrung", label: "Führungskräfte & Management", hint: "Verhandeln, führen, repräsentieren" },
  ],
  industryLabel: "Branche (optional)",
  participants: {
    fewer: "eine Person weniger",
    more: "eine Person mehr",
    slider: "Teilnehmerzahl per Regler",
    unit: (n) => (n === 1 ? "Person" : "Personen"),
  },
  levels: [
    { value: "A1", label: "A1", hint: "Einstieg" },
    { value: "A2", label: "A2", hint: "Grundlagen" },
    { value: "B1", label: "B1", hint: "Selbstständig im Alltag" },
    { value: "B2", label: "B2", hint: "Sicher im Beruf" },
    { value: "C1", label: "C1", hint: "Verhandlungssicher" },
    { value: "C2", label: "C2", hint: "Nahezu muttersprachlich" },
    { value: "gemischt", label: "Unterschiedlich im Team" },
    { value: "unbekannt", label: "Weiß ich noch nicht" },
  ],
  selfTest: "Niveau unklar? Zum kostenlosen Selbsttest",
  goals: [
    {
      value: "meetings",
      label: "Meetings",
      module: {
        title: "Meetings souverän führen und mitgestalten",
        items: ["Meinungen klar vertreten und nachfragen", "Moderieren, unterbrechen, zusammenfassen", "Entscheidungen und nächste Schritte festhalten"],
      },
    },
    {
      value: "praesentation",
      label: "Präsentationen",
      module: {
        title: "Überzeugend präsentieren",
        items: ["Präsentationen klar strukturieren", "Zahlen und Ergebnisse verständlich erklären", "Fragen aus dem Publikum sicher beantworten"],
      },
    },
    {
      value: "verhandlung",
      label: "Verhandlungen",
      module: {
        title: "Sicher verhandeln",
        items: ["Positionen und Spielräume formulieren", "Diplomatisch widersprechen", "Vereinbarungen präzise festhalten"],
      },
    },
    {
      value: "email",
      label: "E-Mails & Schriftverkehr",
      module: {
        title: "Professionell schreiben",
        items: ["E-Mails klar und im passenden Ton", "Angebote, Rückfragen und Erinnerungen", "Typische Fehler vermeiden"],
      },
    },
    {
      value: "telefon",
      label: "Telefon & Videocalls",
      module: {
        title: "Telefonate und Videocalls",
        items: ["Gespräche eröffnen, steuern und abschließen", "Nachfragen, wenn man etwas nicht versteht", "Technik- und Terminabsprachen"],
      },
    },
    {
      value: "kunden",
      label: "Kundenkontakt",
      module: {
        title: "Internationale Kundschaft betreuen",
        items: ["Bedarf erfragen und beraten", "Mit Beschwerden souverän umgehen", "Beziehungen aufbauen und pflegen"],
      },
    },
    {
      value: "fachsprache",
      label: "Fachsprache",
      module: {
        title: "Fachsprache aus Ihrem Arbeitsbereich",
        items: ["Fachvokabular aus Ihren echten Unterlagen", "Fachliche Sachverhalte einfach erklären", "Dokumentation und Berichte"],
      },
    },
    {
      value: "smalltalk",
      label: "Small Talk & Networking",
      module: {
        title: "Small Talk und Networking",
        items: ["Gespräche locker beginnen", "Auf Messen und Events Kontakte knüpfen", "Kulturelle Unterschiede souverän meistern"],
      },
    },
  ],
  goalsHint: (n) => (n === 0 ? "Noch nichts ausgewählt" : n === 1 ? "1 Schwerpunkt gewählt" : `${n} Schwerpunkte gewählt`),
  deliveries: [
    { value: "online", label: "Online", hint: "Spart Wege, ideal für verteilte Teams" },
    { value: "vorort", label: "Vor Ort im Unternehmen", hint: "Persönlicher Austausch im Team" },
    { value: "hybrid", label: "Hybrid", hint: "Online und vor Ort kombiniert" },
  ],
  scopes: [
    { value: "empfehlung", label: "Bitte empfehlen", hint: "Passend zu Niveau und Zielen" },
    { value: "30", label: "ca. 30 UE", hint: "Kompakt, für konkrete Situationen" },
    { value: "60", label: "ca. 60 UE", hint: "Spürbar sicherer über mehrere Monate" },
    { value: "90", label: "ca. 90 UE", hint: "Grundlagen auf- und ausbauen" },
  ],
  nav: { back: "Zurück", next: "Weiter", showResult: "Empfehlung anzeigen", edit: "Angaben ändern", restart: "Neu beginnen" },
  resume: { text: "Sie hatten bereits mit einer Konfiguration begonnen.", continue: "Weitermachen", restart: "Neu beginnen" },
  summary: {
    title: "Ihre Auswahl",
    course: "Sprache",
    audience: "Zielgruppe",
    participants: "Teilnehmende",
    level: "Niveau",
    goals: "Schwerpunkte",
    delivery: "Durchführung",
    scope: "Umfang",
    open: "noch offen",
    preview: "Vorläufige Empfehlung",
  },
  format: {
    name: (p) =>
      p.kind === "einzel"
        ? "Einzeltraining (1:1)"
        : p.kind === "gruppe"
          ? "Gruppentraining · 1 Gruppe"
          : `Klassentraining · ${p.groups.length} Gruppen`,
    why: (p, n) =>
      p.kind === "einzel"
        ? "Ganz auf eine Person zugeschnitten: Termine, Tempo und Inhalte richten sich nach Ihrem Kalender und Ihren Terminen."
        : p.kind === "gruppe"
          ? `Eine Gruppe mit ${n} Personen. Klein genug, damit alle regelmäßig sprechen, und groß genug für lebendige Rollenspiele.`
          : `${n} Personen teilen wir auf ${p.groups.length} Gruppen mit höchstens 7 Personen auf. So bleibt genug Redezeit für alle, und HR bekommt ein einheitliches Reporting.`,
    group: "Gruppe",
    groups: "Gruppen",
    perGroup: (max) => `max. ${max} pro Gruppe`,
    coaching: "Für Führungskräfte in kleiner Runde ist oft auch Einzelcoaching sinnvoll: noch flexibler und gezielt auf anstehende Termine vorbereitet.",
    splitByLevel: "Bei unterschiedlichen Niveaus teilen wir nach der Einstufung in niveaugleiche Gruppen ein. Dadurch kann sich die Zahl der Gruppen ändern.",
  },
  result: {
    eyebrow: "Ihre persönliche Empfehlung",
    title: "So könnte Ihr Sprachtraining aussehen",
    intro: "Auf Basis Ihrer Angaben schlagen wir Folgendes vor. Im Beratungsgespräch passen wir alles an Ihren genauen Bedarf an.",
    formatTitle: "Empfohlenes Format",
    scopeTitle: "Empfohlener Umfang",
    scopeValue: (u) => `ca. ${u} Unterrichtseinheiten`,
    scopeReason: {
      basis: "Auf A1/A2 lohnt sich ein längeres Programm: Erst solide Grundlagen machen Gespräche im Beruf wirklich sicher.",
      aufbau: "Auf B1/B2 bringt ein mittleres Programm spürbar mehr Sicherheit in genau den Situationen, die Sie gewählt haben.",
      feinschliff: "Auf C1/C2 geht es um Feinschliff: gezieltes Training für anspruchsvolle Situationen statt Grundlagen.",
      offen: "Ohne genaues Niveau planen wir zunächst mit einem mittleren Umfang. Nach der Einstufung passen wir ihn für jede Gruppe an.",
      gewaehlt: "Diesen Umfang haben Sie gewählt. Nach der Einstufung sagen wir Ihnen offen, ob er zu Ihren Zielen passt.",
    },
    scopeNote: "Orientierung: Cambridge English rechnet mit rund 200 angeleiteten Lernstunden pro GER-Stufe. Am schnellsten geht es mit Training und Praxis im Job.",
    planTitle: "Beispielhafter Trainingsplan",
    planNote: "Den genauen Plan erstellen wir nach der Bedarfsanalyse, mit Beispielen aus Ihrem Arbeitsalltag.",
    planStart: {
      title: "Start: Einstufung & Bedarfsanalyse",
      items: ["Individuelle Einstufung jeder teilnehmenden Person", "Lernziele mit Ihnen und dem Team festlegen"],
    },
    planGeneric: {
      title: "Training an Ihrem Arbeitsalltag",
      items: ["Typische Situationen aus Ihrem Job", "Wortschatz, Aussprache und Sicherheit im Sprechen"],
    },
    planIndustry: (i) => `Fachvokabular und Fallbeispiele aus der Branche ${i}`,
    planEnd: {
      title: "Laufend: Fortschritt sichtbar machen",
      items: ["Regelmäßiges Reporting für HR und Führungskräfte", "Ziele nachschärfen, wenn sich der Bedarf ändert"],
    },
    deliveryTitle: "Durchführung",
    deliveryText: {
      online: "Online-Training: keine Anfahrt, ideal für verteilte Teams und volle Kalender.",
      vorort: "Training vor Ort in Ihrem Unternehmen: persönlicher Austausch im vertrauten Umfeld.",
      hybrid: "Hybrid: Vor-Ort-Termine für den Teamzusammenhalt, Online-Termine für Flexibilität.",
      "": "Online, vor Ort oder hybrid: Das legen wir gemeinsam im Beratungsgespräch fest.",
    },
    includedTitle: "Darauf können Sie sich bei Interlexico verlassen",
    included: [
      { title: "Individuelle Einstufung", text: "Jedes Training beginnt mit einer Sprachstand- und Bedarfsanalyse." },
      { title: "Inhalte aus Ihrer Branche", text: "Fachvokabular und Fallbeispiele aus Ihrem Arbeitsalltag statt Lehrbuchszenarien." },
      { title: "Kleine Gruppen", text: "Höchstens 7 Personen pro Gruppe, damit alle genug Redezeit haben." },
      { title: "Messbarer Fortschritt", text: "Regelmäßiges Reporting für HR, damit der Nutzen intern belegbar ist." },
      { title: "Alles an einem Ort", text: "Einstufung, Termine und Reporting laufen über unsere Plattform Interlexico ONE." },
      { title: "Training mit Wirkung", text: "Jede Unterrichtseinheit unterstützt ein soziales oder ökologisches Projekt Ihrer Wahl." },
    ],
    nextTitle: "So geht es weiter",
    next: [
      { title: "Anfrage senden", text: "Ihre Auswahl ist schon eingetragen, Sie ergänzen nur noch Name und E-Mail." },
      { title: "Persönlicher Vorschlag", text: "In der Regel melden wir uns innerhalb von zwei Werktagen mit einem konkreten Vorschlag." },
      { title: "Einstufung & Start", text: "Nach Ihrer Zusage stufen wir die Teilnehmenden ein und starten mit dem Training." },
    ],
    cta: "Unverbindliches Angebot anfordern",
    ctaNote: "Kostenfrei und unverbindlich",
    secondary: "Lieber erst persönlich sprechen",
    industryLink: (i) => `Mehr zu Sprachtraining für ${i}`,
  },
  offer: {
    title: "Ihr unverbindliches Angebot",
    intro: "Ihre Auswahl ist übernommen. Wir brauchen nur noch ein paar Angaben, um Ihnen ein passendes Angebot zu erstellen.",
    summaryTitle: "Ihre Konfiguration",
    company: "Unternehmen",
    city: "Ort des Trainings (Stadt, optional)",
    cityPlaceholder: "z. B. München",
    notes: "Besondere Anforderungen (optional)",
    notesPlaceholder: "z. B. Termine, Schichtpläne, konkrete Anlässe wie eine Messe…",
    submit: "Angebot anfordern",
    close: "Schließen",
    successTitle: "Vielen Dank für Ihre Anfrage!",
    successText: "Wir prüfen Ihren Trainingsbedarf und melden uns in der Regel innerhalb von zwei Werktagen persönlich mit einem konkreten Angebot.",
    reference: "Ihre Vorgangsnummer",
    fallback: "Stattdessen das Kontaktformular nutzen",
  },
  pdf: {
    button: "Als PDF speichern",
    docTitle: "Interlexico – Ihre Trainingsempfehlung",
    created: (d) => `Erstellt am ${d}`,
    selection: "Ihre Angaben",
    footer: "Unverbindliche Empfehlung auf Basis Ihrer Angaben, ohne Preise. Ihr individuelles Angebot erhalten Sie auf Anfrage.",
  },
  prefill: {
    intro: "Anfrage aus dem Trainings-Konfigurator:",
    audience: "Zielgruppe",
    industry: "Branche",
    participants: "Teilnehmende",
    level: "Niveau",
    goals: "Schwerpunkte",
    delivery: "Durchführung",
    scope: (u, rec) => `ca. ${u} UE${rec ? " (Empfehlung)" : ""}`,
  },
};
