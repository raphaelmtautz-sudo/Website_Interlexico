import type { Locale } from "@/lib/i18n";
import type { FaqItem } from "@/content/faq";

/**
 * Kursspezifische FAQ je Kurstyp — sichtbar auf der Kurstyp-Seite, als
 * Schema.org FAQPage (JSON-LD) und in llms-full.txt. Zielt auf die Fragen, die
 * Personaler:innen Suchmaschinen und KI-Assistenten tatsächlich stellen
 * ("Was kostet …", "online oder vor Ort", "welches Niveau"). Nur Fakten, die
 * auch sonst auf der Website stehen — keine Preise (Angebote individuell).
 */
const byLocale: Record<Locale, Record<string, FaqItem[]>> = {
  de: {
    "business-english": [
      {
        question: "Was kostet ein Business-English-Training für Unternehmen?",
        answer:
          "Interlexico kalkuliert jedes Business-English-Training individuell nach Format, Umfang und Teamgröße. Nach einer kurzen Anfrage erhalten Sie in der Regel innerhalb eines Werktages ein unverbindliches Angebot.",
      },
      {
        question: "Welche Formate gibt es für Business English?",
        answer:
          "Einzelunterricht (1:1, Einheiten à 60 Minuten, ab 10 Einheiten), Gruppentraining (max. 7 Teilnehmende, Einheiten à 90 Minuten, ab 8 Einheiten) und Klassentraining für ganze Abteilungen oder Standorte (7–16 Teilnehmende, Semesterprogramm mit einheitlichem Curriculum).",
      },
      {
        question: "Findet das Business-English-Training online oder vor Ort statt?",
        answer:
          "Beides ist möglich: online, vor Ort in Ihrem Unternehmen oder hybrid. Interlexico trainiert Unternehmen in Deutschland, Österreich und der Schweiz.",
      },
      {
        question: "Für welches Sprachniveau eignet sich das Training?",
        answer:
          "Für jedes Niveau. Jedes Training beginnt mit einer Sprachstand- und Bedarfsanalyse; eine erste Orientierung nach GER (A1–C1) gibt der kostenlose Online-Einstufungstest auf interlexico.com.",
      },
      {
        question: "Für welche Branchen bietet Interlexico Business English an?",
        answer:
          "Schwerpunkte sind öffentlicher Dienst und Behörden, Vertrieb und Business Development, Engineering und technische Dienstleistungen, Banken und Finanzdienstleistungen, IT und Software sowie Management und Führung — jeweils mit Fachvokabular und Fallbeispielen aus der Branche.",
      },
      {
        question: "Wie sieht HR den Lernfortschritt?",
        answer:
          "Über Interlexico ONE: Einstufung, Terminplanung, Trainerzuordnung und ein regelmäßiges Fortschritts-Reporting laufen an einem Ort. So wird der Lernerfolg sichtbar und das Trainingsbudget intern begründbar.",
      },
      {
        question: "Wie startet ein Business-English-Training bei Interlexico?",
        answer:
          "In drei Schritten: Sie schildern Team, Ziele und Zeitrahmen in einer kurzen Anfrage, wir klären den Bedarf und stufen die Teilnehmenden ein, danach startet das maßgeschneiderte Training.",
      },
    ],
    "deutsch-als-fremdsprache": [
      {
        question: "Was kostet ein Deutschkurs für Mitarbeitende?",
        answer:
          "Interlexico kalkuliert jedes Deutsch-als-Fremdsprache-Training individuell nach Format, Umfang und Teamgröße. Nach einer kurzen Anfrage erhalten Sie in der Regel innerhalb eines Werktages ein unverbindliches Angebot.",
      },
      {
        question: "Welche Deutsch-Niveaus werden unterrichtet?",
        answer:
          "Die Niveaus A1 bis C1 nach dem Gemeinsamen Europäischen Referenzrahmen (GER). Im Klassentraining gibt es ein einheitliches Curriculum je Niveau; im Einzel- und Gruppentraining richtet sich der Lernplan nach Rolle und Zielen.",
      },
      {
        question: "Findet der Deutschkurs online oder vor Ort statt?",
        answer:
          "Online, vor Ort in Ihrem Unternehmen oder hybrid — passend zu Teamgröße und Schichtplan. Interlexico trainiert Unternehmen in Deutschland, Österreich und der Schweiz.",
      },
      {
        question: "Welche Formate gibt es für Deutsch als Fremdsprache?",
        answer:
          "Einzelunterricht (1:1, Umfang individuell), Gruppentraining (max. 7 Teilnehmende, ab 8 Einheiten) und Klassentraining für ganze Abteilungen oder Onboarding-Kohorten (7–16 Teilnehmende, Semesterprogramm).",
      },
      {
        question: "Für wen ist das Deutsch-Training gedacht?",
        answer:
          "Für internationale Fach- und Führungskräfte in deutschsprachigen Unternehmen, neu zugezogene Mitarbeitende im Onboarding und Teams mit gemischten Sprachhintergründen, die eine gemeinsame Arbeitssprache aufbauen. Das Angebot gilt branchenübergreifend für jede Rolle.",
      },
      {
        question: "Was lernen die Teilnehmenden konkret?",
        answer:
          "Die Situationen ihres Arbeitsalltags: Team-Meetings, E-Mails, Telefonate, Fachgespräche im eigenen Bereich und den Umgang mit Behörden und Kolleg:innen — statt Lehrbuchszenarien.",
      },
      {
        question: "Wie sieht HR den Lernfortschritt?",
        answer:
          "Über Interlexico ONE: Einstufung, klare Lernziele und ein regelmäßiges Fortschritts-Reporting machen den Fortschritt für HR und Führungskräfte sichtbar.",
      },
    ],
  },
  en: {
    "business-english": [
      {
        question: "How much does Business English training for companies cost?",
        answer:
          "Interlexico prices every Business English programme individually, based on format, scope and team size. After a short enquiry you usually receive a non-binding quote within one business day.",
      },
      {
        question: "Which Business English formats are available?",
        answer:
          "One-to-one training (60-minute sessions, from 10 sessions), group training (max. 7 participants, 90-minute sessions, from 8 sessions) and class training for whole departments or sites (7–16 participants, semester programme with a shared curriculum).",
      },
      {
        question: "Is the Business English training online or on-site?",
        answer:
          "Both: online, on-site at your company, or hybrid. Interlexico trains companies in Germany, Austria and Switzerland.",
      },
      {
        question: "Which language level is the training for?",
        answer:
          "Every level. Each programme starts with a level and needs assessment; the free online placement test on interlexico.com gives a first CEFR orientation (A1–C1).",
      },
      {
        question: "Which industries does Interlexico offer Business English for?",
        answer:
          "Core industries are public sector and government, sales and business development, engineering and technical services, banking and financial services, IT and software, and management and leadership — each with industry vocabulary and real case examples.",
      },
      {
        question: "How does HR see learning progress?",
        answer:
          "Through Interlexico ONE: placement, scheduling, trainer matching and regular progress reporting in one place, so results are visible and the training budget is easy to justify internally.",
      },
      {
        question: "How does Business English training with Interlexico start?",
        answer:
          "In three steps: you describe your team, goals and timeline in a short enquiry, we clarify your needs and assess participants, then your tailored training begins.",
      },
    ],
    "deutsch-als-fremdsprache": [
      {
        question: "How much does a German course for employees cost?",
        answer:
          "Interlexico prices every German as a Foreign Language programme individually, based on format, scope and team size. After a short enquiry you usually receive a non-binding quote within one business day.",
      },
      {
        question: "Which German levels are taught?",
        answer:
          "Levels A1 to C1 of the Common European Framework of Reference (CEFR). Class training follows a shared curriculum per level; one-to-one and group training follow a learning plan based on role and goals.",
      },
      {
        question: "Is the German course online or on-site?",
        answer:
          "Online, on-site at your company, or hybrid — to fit team size and shift patterns. Interlexico trains companies in Germany, Austria and Switzerland.",
      },
      {
        question: "Which formats are available for German as a Foreign Language?",
        answer:
          "One-to-one training (individual scope), group training (max. 7 participants, from 8 sessions) and class training for whole departments or onboarding cohorts (7–16 participants, semester programme).",
      },
      {
        question: "Who is the German training for?",
        answer:
          "International specialists and managers in German-speaking companies, newly relocated employees during onboarding, and teams with mixed language backgrounds building a shared working language. It is offered across all industries and roles.",
      },
      {
        question: "What exactly do participants learn?",
        answer:
          "The situations of their working day: team meetings, emails, phone calls, specialist conversations in their own field, and dealing with authorities and colleagues — instead of textbook scenarios.",
      },
      {
        question: "How does HR see learning progress?",
        answer:
          "Through Interlexico ONE: placement, clear learning goals and regular progress reporting make progress visible to HR and managers.",
      },
    ],
  },
  es: {
    "business-english": [
      {
        question: "¿Cuánto cuesta una formación de inglés de negocios para empresas?",
        answer:
          "Interlexico calcula cada formación de Business English de forma individual según formato, alcance y tamaño del equipo. Tras una breve solicitud, normalmente recibe una oferta sin compromiso en un día laborable.",
      },
      {
        question: "¿Qué formatos de Business English hay?",
        answer:
          "Clases individuales (sesiones de 60 minutos, a partir de 10 sesiones), formación en grupo (máx. 7 participantes, sesiones de 90 minutos, a partir de 8 sesiones) y formación de clase para departamentos o sedes enteras (7–16 participantes, programa semestral con currículo común).",
      },
      {
        question: "¿La formación de Business English es online o presencial?",
        answer:
          "Ambas opciones: online, presencial en su empresa o híbrida. Interlexico forma a empresas en Alemania, Austria y Suiza.",
      },
      {
        question: "¿Para qué nivel de idioma es la formación?",
        answer:
          "Para cualquier nivel. Cada formación empieza con un análisis de nivel y necesidades; la prueba de nivel online gratuita en interlexico.com ofrece una primera orientación según el MCER (A1–C1).",
      },
      {
        question: "¿Para qué sectores ofrece Interlexico Business English?",
        answer:
          "Los sectores principales son sector público y administración, ventas y desarrollo de negocio, ingeniería y servicios técnicos, banca y servicios financieros, TI y software, y dirección y liderazgo — siempre con vocabulario y casos reales del sector.",
      },
      {
        question: "¿Cómo ve RR. HH. el progreso?",
        answer:
          "A través de Interlexico ONE: nivelación, planificación, asignación de formadores y un informe de progreso periódico en un solo lugar, para que los resultados sean visibles y el presupuesto se justifique internamente.",
      },
      {
        question: "¿Cómo empieza una formación de Business English con Interlexico?",
        answer:
          "En tres pasos: describe su equipo, objetivos y plazos en una breve solicitud, aclaramos las necesidades y evaluamos a los participantes, y después empieza la formación a medida.",
      },
    ],
    "deutsch-als-fremdsprache": [
      {
        question: "¿Cuánto cuesta un curso de alemán para empleados?",
        answer:
          "Interlexico calcula cada formación de alemán como lengua extranjera de forma individual según formato, alcance y tamaño del equipo. Tras una breve solicitud, normalmente recibe una oferta sin compromiso en un día laborable.",
      },
      {
        question: "¿Qué niveles de alemán se enseñan?",
        answer:
          "Los niveles A1 a C1 del Marco Común Europeo de Referencia (MCER). La formación de clase sigue un currículo común por nivel; las clases individuales y en grupo siguen un plan según el puesto y los objetivos.",
      },
      {
        question: "¿El curso de alemán es online o presencial?",
        answer:
          "Online, presencial en su empresa o híbrido, según el tamaño del equipo y los turnos. Interlexico forma a empresas en Alemania, Austria y Suiza.",
      },
      {
        question: "¿Qué formatos hay para alemán como lengua extranjera?",
        answer:
          "Clases individuales (alcance individual), formación en grupo (máx. 7 participantes, a partir de 8 sesiones) y formación de clase para departamentos enteros o promociones de incorporación (7–16 participantes, programa semestral).",
      },
      {
        question: "¿Para quién es la formación de alemán?",
        answer:
          "Para especialistas y directivos internacionales en empresas germanoparlantes, empleados recién llegados en su incorporación y equipos con distintos idiomas que construyen una lengua de trabajo común. Se ofrece para todos los sectores y funciones.",
      },
      {
        question: "¿Qué aprenden exactamente los participantes?",
        answer:
          "Las situaciones de su día a día laboral: reuniones de equipo, correos, llamadas, conversaciones técnicas en su área y el trato con autoridades y compañeros, en lugar de escenarios de manual.",
      },
      {
        question: "¿Cómo ve RR. HH. el progreso?",
        answer:
          "A través de Interlexico ONE: nivelación, objetivos claros e informes de progreso periódicos hacen visible el avance para RR. HH. y los responsables.",
      },
    ],
  },
};

export function getCourseFaq(locale: Locale, courseSlug: string): FaqItem[] {
  return byLocale[locale][courseSlug] ?? [];
}
