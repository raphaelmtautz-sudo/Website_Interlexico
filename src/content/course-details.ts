import type { Locale } from "@/lib/i18n";
import type { CourseFormatKind } from "@/types/course";
import type { FaqItem } from "@/content/faq";

/**
 * Ergänzende Inhalte für Kurstyp- und Formatseiten (SEO/GEO): ein knapper,
 * zitierfähiger Antwortabsatz, Eckdaten „auf einen Blick“, Lerninhalte und je
 * Format eigene Abschnitte + FAQ. Nur Fakten, die auch sonst auf der Website
 * stehen — keine Preise. {course} wird durch den Kursnamen ersetzt.
 */
type Fact = { label: string; value: string };
export type CourseDetail = {
  answer: string;
  facts: Fact[];
  learnTitle: string;
  learn: string[];
  guides: string[];
};
export type FormatDetail = {
  seoTitle: string;
  seoDescription: string;
  title: string;
  answer: string;
  bestFor: string[];
  process: { title: string; text: string }[];
  faq: FaqItem[];
};
export type DetailLabels = {
  glance: string;
  guides: string;
  bestFor: string;
  process: string;
  facts: string;
  place: string;
  placeValue: string;
  offer: string;
  offerValue: string;
  otherFormats: string;
  toCourse: string;
  configure: string;
  levelTest: string;
  local: string;
  faq: string;
};

const PLACE = {
  de: "Vor Ort in ganz Deutschland, Österreich und der Schweiz (nach Verfügbarkeit), online oder hybrid",
  en: "On-site anywhere in Germany, Austria and Switzerland (subject to availability), online or hybrid",
  es: "Presencial en toda Alemania, Austria y Suiza (según disponibilidad), online o híbrido",
};

const labels: Record<Locale, DetailLabels> = {
  de: {
    glance: "Auf einen Blick", guides: "Passende Ratgeber", bestFor: "Für wen das Format passt", process: "So läuft es ab",
    facts: "Was das Format bietet", place: "Ort", placeValue: PLACE.de, offer: "Angebot", offerValue: "individuell, auf Anfrage",
    otherFormats: "Weitere Formate", toCourse: "Zur Kursseite", configure: "Training konfigurieren", levelTest: "Sprachniveau testen",
    local: "Sprachtraining in München & Oberbayern", faq: "Häufige Fragen",
  },
  en: {
    glance: "At a glance", guides: "Related guides", bestFor: "Who this format suits", process: "How it works",
    facts: "What the format offers", place: "Location", placeValue: PLACE.en, offer: "Proposal", offerValue: "individual, on request",
    otherFormats: "Other formats", toCourse: "Back to the course", configure: "Configure your training", levelTest: "Test your level",
    local: "Language training in Munich & Upper Bavaria", faq: "Frequently asked questions",
  },
  es: {
    glance: "De un vistazo", guides: "Guías relacionadas", bestFor: "Para quién es este formato", process: "Cómo funciona",
    facts: "Qué ofrece el formato", place: "Lugar", placeValue: PLACE.es, offer: "Oferta", offerValue: "individual, bajo consulta",
    otherFormats: "Otros formatos", toCourse: "Volver al curso", configure: "Configurar su formación", levelTest: "Probar su nivel",
    local: "Formación de idiomas en Múnich y Alta Baviera", faq: "Preguntas frecuentes",
  },
};

const courses: Record<Locale, Record<string, CourseDetail>> = {
  de: {
    "business-english": {
      answer:
        "Business English bei Interlexico ist ein trainergeführtes Englischtraining für Unternehmen: Ihre Mitarbeitenden üben genau die Situationen, die ihr Job verlangt – Meetings, Verhandlungen, Präsentationen, E-Mails und Kundengespräche. Jede Person wird vorab eingestuft. Trainiert wird im Einzel-, Gruppen- oder Klassenformat, vor Ort oder online in ganz Deutschland, Österreich und der Schweiz.",
      facts: [
        { label: "Für wen", value: "Fach- und Führungskräfte und Teams mit internationalem Kontakt" },
        { label: "Niveau", value: "Alle Niveaus von A1 bis C2 (GER), mit Einstufung vor dem Start" },
        { label: "Formate", value: "Einzeltraining (1:1), Gruppen mit höchstens 7 Personen, Klassen mit 7–16 Personen" },
        { label: "Ort", value: PLACE.de },
        { label: "Fortschritt", value: "Berichte für HR im Kundenportal Interlexico ONE" },
        { label: "Angebot", value: "Individuell; Rückmeldung in der Regel innerhalb von zwei Werktagen" },
      ],
      learnTitle: "Was Ihr Team im Business English lernt",
      learn: [
        "Meetings leiten und sich sicher einbringen",
        "Verhandeln und auf Einwände reagieren",
        "Präsentieren und Fragen souverän beantworten",
        "E-Mails, Berichte und Angebote schreiben",
        "Telefonate und Videocalls führen",
        "Small Talk und Networking",
        "Kundengespräche und Reklamationen",
        "Fachvokabular Ihrer Branche",
      ],
      guides: ["business-english-im-unternehmen-einfuehren", "englisch-telefonate-videocalls", "ger-sprachniveaus-beruf", "kosten-sprachtraining-unternehmen"],
    },
    "deutsch-als-fremdsprache": {
      answer:
        "Deutsch als Fremdsprache bei Interlexico ist ein berufsbezogener Deutschkurs für internationale Mitarbeitende: Sie lernen das Deutsch, das sie im Team, am Telefon, in E-Mails und im Kundenkontakt brauchen. Jede Person wird eingestuft. Trainiert wird von A1 bis C2 im Einzel-, Gruppen- oder Klassenformat, vor Ort in ganz DACH oder online.",
      facts: [
        { label: "Für wen", value: "Internationale Fach- und Führungskräfte, neue Mitarbeitende im Onboarding" },
        { label: "Niveau", value: "A1 bis C2 (GER), mit Einstufung vor dem Start" },
        { label: "Formate", value: "Einzeltraining (1:1), Gruppen mit höchstens 7 Personen, Klassen mit 7–16 Personen" },
        { label: "Ort", value: PLACE.de },
        { label: "Fortschritt", value: "Berichte für HR im Kundenportal Interlexico ONE" },
        { label: "Angebot", value: "Individuell; Rückmeldung in der Regel innerhalb von zwei Werktagen" },
      ],
      learnTitle: "Was die Teilnehmenden im Deutschkurs lernen",
      learn: [
        "Sich vorstellen und im Team ankommen",
        "Besprechungen folgen und mitreden",
        "E-Mails und kurze Texte schreiben",
        "Telefonieren auf Deutsch",
        "Arbeitsanweisungen und Abläufe verstehen",
        "Fachwortschatz des eigenen Arbeitsbereichs",
        "Gespräche mit Kundinnen und Kunden",
        "Alltag in Deutschland: Behörden, Wohnung, Termine",
      ],
      guides: ["deutschkurs-internationale-fachkraefte", "ger-sprachniveaus-beruf", "kosten-sprachtraining-unternehmen", "sprachtraining-anbieter-auswaehlen"],
    },
  },
  en: {
    "business-english": {
      answer:
        "Business English at Interlexico is trainer-led English training for companies: your staff practise exactly the situations their job demands – meetings, negotiations, presentations, emails and client conversations. Everyone is assessed beforehand. Training takes place one-to-one, in groups or in classes, on-site or online across Germany, Austria and Switzerland.",
      facts: [
        { label: "Who it's for", value: "Professionals, managers and teams with international contacts" },
        { label: "Level", value: "All levels from A1 to C2 (CEFR), assessed before the start" },
        { label: "Formats", value: "One-to-one, groups of no more than 7, classes of 7–16" },
        { label: "Location", value: PLACE.en },
        { label: "Progress", value: "Reports for HR in the Interlexico ONE client portal" },
        { label: "Proposal", value: "Individual; we usually reply within two working days" },
      ],
      learnTitle: "What your team learns in Business English",
      learn: [
        "Chairing meetings and contributing confidently",
        "Negotiating and handling objections",
        "Presenting and answering questions",
        "Writing emails, reports and proposals",
        "Phone calls and video calls",
        "Small talk and networking",
        "Client conversations and complaints",
        "Vocabulary from your industry",
      ],
      guides: ["business-english-im-unternehmen-einfuehren", "englisch-telefonate-videocalls", "ger-sprachniveaus-beruf", "kosten-sprachtraining-unternehmen"],
    },
    "deutsch-als-fremdsprache": {
      answer:
        "German as a Foreign Language at Interlexico is a job-focused German course for international staff: participants learn the German they need in the team, on the phone, in emails and with clients. Everyone is assessed. Training runs from A1 to C2, one-to-one, in groups or in classes, on-site across the DACH region or online.",
      facts: [
        { label: "Who it's for", value: "International professionals and managers, new staff during onboarding" },
        { label: "Level", value: "A1 to C2 (CEFR), assessed before the start" },
        { label: "Formats", value: "One-to-one, groups of no more than 7, classes of 7–16" },
        { label: "Location", value: PLACE.en },
        { label: "Progress", value: "Reports for HR in the Interlexico ONE client portal" },
        { label: "Proposal", value: "Individual; we usually reply within two working days" },
      ],
      learnTitle: "What participants learn in the German course",
      learn: [
        "Introducing themselves and settling into the team",
        "Following meetings and joining in",
        "Writing emails and short texts",
        "Making phone calls in German",
        "Understanding instructions and processes",
        "Vocabulary for their own field",
        "Conversations with clients",
        "Everyday life in Germany: authorities, housing, appointments",
      ],
      guides: ["deutschkurs-internationale-fachkraefte", "ger-sprachniveaus-beruf", "kosten-sprachtraining-unternehmen", "sprachtraining-anbieter-auswaehlen"],
    },
  },
  es: {
    "business-english": {
      answer:
        "El Business English de Interlexico es una formación de inglés para empresas impartida por formadores: su plantilla practica exactamente las situaciones que exige su puesto – reuniones, negociaciones, presentaciones, correos y conversaciones con clientes. Cada persona es evaluada antes de empezar. La formación es individual, en grupo o en clase, presencial en toda la región DACH u online en toda la región DACH.",
      facts: [
        { label: "Para quién", value: "Profesionales, directivos y equipos con contacto internacional" },
        { label: "Nivel", value: "Todos los niveles de A1 a C2 (MCER), con evaluación previa" },
        { label: "Formatos", value: "Individual (1:1), grupos de máximo 7 personas, clases de 7 a 16 personas" },
        { label: "Lugar", value: PLACE.es },
        { label: "Progreso", value: "Informes para RR. HH. en el portal de clientes Interlexico ONE" },
        { label: "Oferta", value: "Individual; normalmente respondemos en dos días laborables" },
      ],
      learnTitle: "Lo que su equipo aprende en Business English",
      learn: [
        "Dirigir reuniones y participar con seguridad",
        "Negociar y responder a objeciones",
        "Presentar y responder preguntas",
        "Redactar correos, informes y ofertas",
        "Llamadas telefónicas y videollamadas",
        "Small talk y networking",
        "Conversaciones con clientes y reclamaciones",
        "Vocabulario de su sector",
      ],
      guides: ["business-english-im-unternehmen-einfuehren", "englisch-telefonate-videocalls", "ger-sprachniveaus-beruf", "kosten-sprachtraining-unternehmen"],
    },
    "deutsch-als-fremdsprache": {
      answer:
        "El alemán como lengua extranjera de Interlexico es un curso de alemán orientado al trabajo para la plantilla internacional: los participantes aprenden el alemán que necesitan en el equipo, al teléfono, en correos y con clientes. Cada persona es evaluada. La formación va de A1 a C2, individual, en grupo o en clase, presencial en toda la región DACH u online.",
      facts: [
        { label: "Para quién", value: "Profesionales y directivos internacionales, nuevas incorporaciones" },
        { label: "Nivel", value: "A1 a C2 (MCER), con evaluación previa" },
        { label: "Formatos", value: "Individual (1:1), grupos de máximo 7 personas, clases de 7 a 16 personas" },
        { label: "Lugar", value: PLACE.es },
        { label: "Progreso", value: "Informes para RR. HH. en el portal de clientes Interlexico ONE" },
        { label: "Oferta", value: "Individual; normalmente respondemos en dos días laborables" },
      ],
      learnTitle: "Lo que aprenden los participantes en el curso de alemán",
      learn: [
        "Presentarse e integrarse en el equipo",
        "Seguir reuniones y participar",
        "Redactar correos y textos breves",
        "Hablar por teléfono en alemán",
        "Entender instrucciones y procesos",
        "Vocabulario de su propio ámbito",
        "Conversaciones con clientes",
        "Vida cotidiana en Alemania: trámites, vivienda, citas",
      ],
      guides: ["deutschkurs-internationale-fachkraefte", "ger-sprachniveaus-beruf", "kosten-sprachtraining-unternehmen", "sprachtraining-anbieter-auswaehlen"],
    },
  },
};

const PLACE_ANSWER = {
  de: "Beides ist möglich: vor Ort in Ihrem Unternehmen überall in Deutschland, Österreich und der Schweiz (nach Verfügbarkeit), online oder im Wechsel.",
  en: "Both are possible: on-site at your company anywhere in Germany, Austria and Switzerland (subject to availability), online, or alternating.",
  es: "Ambas opciones: presencial en su empresa en cualquier lugar de Alemania, Austria y Suiza (según disponibilidad), online o alternando.",
};

const formats: Record<Locale, Record<CourseFormatKind, FormatDetail>> = {
  de: {
    einzel: {
      seoTitle: "{course} Einzeltraining (1:1) für Unternehmen | Interlexico",
      seoDescription: "{course} im Einzeltraining: 1:1, flexible Termine und gezielte Vorbereitung auf konkrete Anlässe – vor Ort bei München oder online.",
      title: "{course} im Einzeltraining",
      answer: "Im Einzeltraining arbeitet eine Person 1:1 mit einer festen Trainerin oder einem festen Trainer. Inhalte, Tempo und Termine richten sich ganz nach ihr – ideal, wenn der Kalender eng ist oder ein konkreter Anlass bevorsteht.",
      bestFor: [
        "Führungskräfte und Geschäftsführung mit engem Kalender",
        "Vorbereitung auf einen konkreten Anlass wie Präsentation, Verhandlung oder Konferenz",
        "Teilnehmende, deren Niveau oder Ziel in keine Gruppe passt",
        "Vertrauliche Themen, die nicht in eine Gruppe gehören",
      ],
      process: [
        { title: "Bedarfsgespräch & Einstufung", text: "Wir klären Ziel und Anlass und ermitteln das aktuelle Niveau." },
        { title: "Persönlicher Trainingsplan", text: "Die Einheiten werden auf die Situationen der Person zugeschnitten." },
        { title: "Training nach Kalender", text: "Termine werden individuell vereinbart – vor Ort, online oder im Wechsel." },
        { title: "Fortschritt für HR", text: "Der Lernfortschritt ist im Kundenportal Interlexico ONE sichtbar." },
      ],
      faq: [
        { question: "Wie flexibel sind die Termine im Einzeltraining?", answer: "Die Termine werden individuell vereinbart und an Kalender und Reisen der teilnehmenden Person angepasst." },
        { question: "Kann das Einzeltraining auf einen bestimmten Termin vorbereiten?", answer: "Ja. Die Einheiten lassen sich gezielt auf einen Anlass ausrichten, etwa eine Präsentation, eine Verhandlung oder eine Konferenz." },
        { question: "Findet das Einzeltraining online oder vor Ort statt?", answer: PLACE_ANSWER.de },
      ],
    },
    gruppe: {
      seoTitle: "{course} Gruppentraining für Teams (max. 7) | Interlexico",
      seoDescription: "{course} im Gruppentraining: kleine Gruppen mit höchstens 7 Personen auf ähnlichem Niveau, Fälle aus Ihrem Alltag – vor Ort bei München oder online.",
      title: "{course} im Gruppentraining",
      answer: "Im Gruppentraining lernen höchstens sieben Kolleginnen und Kollegen mit ähnlichem Sprachniveau gemeinsam. Die kleine Gruppe sorgt für viel Redezeit pro Person, und die Fallbeispiele kommen aus dem gemeinsamen Arbeitsalltag.",
      bestFor: [
        "Teams mit ähnlichem Niveau und gemeinsamen Themen",
        "Abteilungen, die mit denselben Kunden oder Partnern arbeiten",
        "Unternehmen, die mehrere Personen gleichzeitig fördern möchten",
        "Teilnehmende, die vom Austausch untereinander profitieren",
      ],
      process: [
        { title: "Einstufung aller Teilnehmenden", text: "Jede Person macht eine Sprachstandsanalyse." },
        { title: "Gruppen nach Niveau", text: "Wir bilden Gruppen mit ähnlichem Niveau und höchstens sieben Personen." },
        { title: "Fester Termin", text: "Die Gruppe trifft sich regelmäßig – vor Ort, online oder hybrid." },
        { title: "Fortschritt für HR", text: "Berichte zu allen Teilnehmenden im Kundenportal Interlexico ONE." },
      ],
      faq: [
        { question: "Wie werden die Gruppen eingeteilt?", answer: "Nach der Einstufung bilden wir Gruppen mit ähnlichem Niveau und höchstens sieben Personen. Liegen die Niveaus weit auseinander, schlagen wir mehrere Gruppen oder eine Kombination mit Einzeltraining vor." },
        { question: "Können Teilnehmende verschiedener Standorte gemeinsam lernen?", answer: "Ja. Online oder hybrid lassen sich Kolleginnen und Kollegen verschiedener Standorte in einer Gruppe zusammenführen." },
        { question: "Findet das Gruppentraining online oder vor Ort statt?", answer: PLACE_ANSWER.de },
      ],
    },
    klasse: {
      seoTitle: "{course} Klassentraining für Abteilungen | Interlexico",
      seoDescription: "{course} im Klassentraining für ganze Abteilungen und Standorte: 7–16 Teilnehmende, einheitliches Curriculum je Niveau und zentrales Reporting für HR.",
      title: "{course} im Klassentraining",
      answer: "Das Klassentraining ist für ganze Abteilungen oder Standorte gedacht: 7 bis 16 Teilnehmende lernen nach einem einheitlichen Curriculum je Niveau, und HR erhält ein zentrales Reporting über alle Klassen.",
      bestFor: [
        "Abteilungen und Standorte mit vielen Teilnehmenden",
        "Unternehmen, die ein einheitliches Sprachprogramm einführen",
        "Programme über mehrere Standorte hinweg",
        "HR-Abteilungen, die den Fortschritt zentral steuern wollen",
      ],
      process: [
        { title: "Bedarfsanalyse & Einstufung", text: "Wir klären Ziele und stufen alle Teilnehmenden ein." },
        { title: "Curriculum je Niveau", text: "Für jedes Niveau gibt es einen einheitlichen Lehrplan." },
        { title: "Semesterprogramm", text: "Feste Termine über das Semester – vor Ort, online oder hybrid." },
        { title: "Zentrales Reporting", text: "HR sieht den Fortschritt aller Klassen im Kundenportal Interlexico ONE." },
      ],
      faq: [
        { question: "Wie groß ist eine Klasse?", answer: "7 bis 16 Teilnehmende. Wer mehr Redezeit pro Person möchte, wählt das Gruppentraining mit höchstens sieben Personen." },
        { question: "Lässt sich das Klassentraining über mehrere Standorte ausrollen?", answer: "Ja. Das einheitliche Curriculum je Niveau und das zentrale Reporting in Interlexico ONE sind genau dafür gedacht." },
        { question: "Findet das Klassentraining online oder vor Ort statt?", answer: PLACE_ANSWER.de },
      ],
    },
  },
  en: {
    einzel: {
      seoTitle: "{course} One-to-One Training for Companies | Interlexico",
      seoDescription: "{course} one-to-one: a dedicated trainer, flexible scheduling and preparation for specific occasions – near Munich or online.",
      title: "{course} one-to-one training",
      answer: "In one-to-one training, one person works with a dedicated trainer. Content, pace and scheduling are entirely tailored to them – ideal for tight calendars or an upcoming occasion.",
      bestFor: [
        "Managers and executives with tight calendars",
        "Preparing for a specific occasion such as a presentation, negotiation or conference",
        "Participants whose level or goal doesn't fit a group",
        "Confidential topics that don't belong in a group",
      ],
      process: [
        { title: "Needs analysis & assessment", text: "We clarify goal and occasion and determine the current level." },
        { title: "Personal training plan", text: "Sessions are tailored to the person's real situations." },
        { title: "Training around the calendar", text: "Sessions are scheduled individually – on-site, online or alternating." },
        { title: "Progress for HR", text: "Learning progress is visible in the Interlexico ONE client portal." },
      ],
      faq: [
        { question: "How flexible is scheduling in {course} one-to-one training?", answer: "Sessions are scheduled individually and adapted to the participant's calendar and travel." },
        { question: "Can one-to-one training prepare for a specific date?", answer: "Yes. Sessions can be focused on an occasion such as a presentation, a negotiation or a conference." },
        { question: "Is one-to-one training online or on-site?", answer: PLACE_ANSWER.en },
      ],
    },
    gruppe: {
      seoTitle: "{course} Group Training for Teams (max. 7) | Interlexico",
      seoDescription: "{course} group training: small groups of no more than 7 people at a similar level, cases from your daily work – on-site near Munich or online.",
      title: "{course} group training",
      answer: "In group training, no more than seven colleagues at a similar level learn together. The small group means plenty of speaking time per person, and the case studies come from their shared working day.",
      bestFor: [
        "Teams at a similar level with shared topics",
        "Departments working with the same clients or partners",
        "Companies that want to develop several people at once",
        "Participants who benefit from learning together",
      ],
      process: [
        { title: "Assessment of all participants", text: "Everyone takes a language assessment." },
        { title: "Groups by level", text: "We form groups at a similar level with no more than seven people." },
        { title: "Regular sessions", text: "The group meets regularly – on-site, online or hybrid." },
        { title: "Progress for HR", text: "Reports on all participants in the Interlexico ONE client portal." },
      ],
      faq: [
        { question: "How are the groups formed?", answer: "After the assessment, we form groups at a similar level with no more than seven people. If levels differ widely, we suggest several groups or a combination with one-to-one training." },
        { question: "Can participants from different locations learn together?", answer: "Yes. Online or hybrid, colleagues from different locations can be brought together in one group." },
        { question: "Is group training online or on-site?", answer: PLACE_ANSWER.en },
      ],
    },
    klasse: {
      seoTitle: "{course} Class Training for Departments | Interlexico",
      seoDescription: "{course} class training for whole departments and locations: 7–16 participants, a uniform curriculum per level and central reporting for HR.",
      title: "{course} class training",
      answer: "Class training is designed for whole departments or locations: 7 to 16 participants learn with a uniform curriculum per level, and HR receives central reporting across all classes.",
      bestFor: [
        "Departments and locations with many participants",
        "Companies introducing a uniform language programme",
        "Programmes across several locations",
        "HR teams that want to steer progress centrally",
      ],
      process: [
        { title: "Needs analysis & assessment", text: "We clarify goals and assess all participants." },
        { title: "Curriculum per level", text: "Each level follows a uniform syllabus." },
        { title: "Semester programme", text: "Fixed sessions over the semester – on-site, online or hybrid." },
        { title: "Central reporting", text: "HR sees the progress of all classes in the Interlexico ONE client portal." },
      ],
      faq: [
        { question: "How large is a class?", answer: "7 to 16 participants. For more speaking time per person, choose group training with no more than seven people." },
        { question: "Can class training be rolled out across several locations?", answer: "Yes. The uniform curriculum per level and central reporting in Interlexico ONE are designed for exactly that." },
        { question: "Is class training online or on-site?", answer: PLACE_ANSWER.en },
      ],
    },
  },
  es: {
    einzel: {
      seoTitle: "{course}: formación individual (1:1) para empresas | Interlexico",
      seoDescription: "{course} en formación individual: formador fijo, horarios flexibles y preparación para ocasiones concretas – presencial en toda la región DACH u online.",
      title: "{course} en formación individual",
      answer: "En la formación individual, una persona trabaja 1:1 con un formador fijo. Contenidos, ritmo y horarios se adaptan por completo a ella – ideal con agendas apretadas o ante una ocasión concreta.",
      bestFor: [
        "Directivos y gerencia con agendas apretadas",
        "Preparación para una ocasión concreta: presentación, negociación o congreso",
        "Participantes cuyo nivel u objetivo no encaja en un grupo",
        "Temas confidenciales que no corresponden a un grupo",
      ],
      process: [
        { title: "Análisis y evaluación", text: "Aclaramos objetivo y ocasión y determinamos el nivel actual." },
        { title: "Plan personal", text: "Las sesiones se adaptan a las situaciones reales de la persona." },
        { title: "Formación según agenda", text: "Las fechas se acuerdan individualmente – presencial, online o alternando." },
        { title: "Progreso para RR. HH.", text: "El progreso se ve en el portal de clientes Interlexico ONE." },
      ],
      faq: [
        { question: "¿Qué flexibilidad de horarios tiene la formación individual de {course}?", answer: "Las fechas se acuerdan individualmente y se adaptan a la agenda y los viajes de la persona." },
        { question: "¿Puede la formación individual preparar para una fecha concreta?", answer: "Sí. Las sesiones pueden centrarse en una ocasión, como una presentación, una negociación o un congreso." },
        { question: "¿La formación individual es online o presencial?", answer: PLACE_ANSWER.es },
      ],
    },
    gruppe: {
      seoTitle: "{course}: formación en grupo para equipos (máx. 7) | Interlexico",
      seoDescription: "{course} en grupo: grupos pequeños de máximo 7 personas de nivel similar, casos de su día a día – presencial en toda la región DACH u online.",
      title: "{course} en formación en grupo",
      answer: "En la formación en grupo aprenden juntos como máximo siete compañeros de nivel similar. El grupo reducido garantiza mucho tiempo de habla por persona, y los casos proceden del trabajo diario compartido.",
      bestFor: [
        "Equipos de nivel similar con temas comunes",
        "Departamentos que trabajan con los mismos clientes o socios",
        "Empresas que quieren formar a varias personas a la vez",
        "Participantes que aprovechan el intercambio entre sí",
      ],
      process: [
        { title: "Evaluación de todos", text: "Cada persona realiza un análisis de nivel." },
        { title: "Grupos por nivel", text: "Formamos grupos de nivel similar con un máximo de siete personas." },
        { title: "Sesiones regulares", text: "El grupo se reúne con regularidad – presencial, online o híbrido." },
        { title: "Progreso para RR. HH.", text: "Informes de todos los participantes en el portal Interlexico ONE." },
      ],
      faq: [
        { question: "¿Cómo se forman los grupos?", answer: "Tras la evaluación formamos grupos de nivel similar con un máximo de siete personas. Si los niveles difieren mucho, proponemos varios grupos o combinarlo con formación individual." },
        { question: "¿Pueden aprender juntos participantes de distintas sedes?", answer: "Sí. Online o en modalidad híbrida se puede reunir en un grupo a compañeros de distintas sedes." },
        { question: "¿La formación en grupo es online o presencial?", answer: PLACE_ANSWER.es },
      ],
    },
    klasse: {
      seoTitle: "{course}: formación en clase para departamentos | Interlexico",
      seoDescription: "{course} en clase para departamentos y sedes completos: 7–16 participantes, plan de estudios uniforme por nivel e informes centrales para RR. HH.",
      title: "{course} en formación en clase",
      answer: "La formación en clase está pensada para departamentos o sedes completos: de 7 a 16 participantes aprenden con un plan de estudios uniforme por nivel, y RR. HH. recibe informes centrales de todas las clases.",
      bestFor: [
        "Departamentos y sedes con muchos participantes",
        "Empresas que implantan un programa de idiomas uniforme",
        "Programas en varias sedes",
        "RR. HH. que quiere dirigir el progreso de forma central",
      ],
      process: [
        { title: "Análisis y evaluación", text: "Aclaramos objetivos y evaluamos a todos los participantes." },
        { title: "Plan por nivel", text: "Cada nivel sigue un plan de estudios uniforme." },
        { title: "Programa semestral", text: "Sesiones fijas durante el semestre – presencial, online o híbrido." },
        { title: "Informes centrales", text: "RR. HH. ve el progreso de todas las clases en el portal Interlexico ONE." },
      ],
      faq: [
        { question: "¿De qué tamaño es una clase?", answer: "De 7 a 16 participantes. Para más tiempo de habla por persona, elija la formación en grupo con un máximo de siete personas." },
        { question: "¿Se puede implantar la formación en clase en varias sedes?", answer: "Sí. El plan uniforme por nivel y los informes centrales en Interlexico ONE están pensados precisamente para ello." },
        { question: "¿La formación en clase es online o presencial?", answer: PLACE_ANSWER.es },
      ],
    },
  },
};

const fill = (s: string, course: string) => s.replaceAll("{course}", course);

export function getDetailLabels(locale: Locale): DetailLabels {
  return labels[locale];
}

export function getCourseDetail(locale: Locale, slug: string): CourseDetail | undefined {
  return courses[locale][slug];
}

/** shortName nur für den Seitentitel (Längenlimit), sonst der volle Kursname. */
export function getFormatDetail(locale: Locale, kind: CourseFormatKind, courseName: string, shortName = courseName): FormatDetail {
  const f = formats[locale][kind];
  return {
    seoTitle: fill(f.seoTitle, shortName),
    seoDescription: fill(f.seoDescription, shortName),
    title: fill(f.title, courseName),
    answer: fill(f.answer, courseName),
    bestFor: f.bestFor,
    process: f.process,
    faq: f.faq.map((q) => ({ question: fill(q.question, courseName), answer: fill(q.answer, courseName) })),
  };
}
