import { CourseType } from "@/types/course";

export const deutschAlsFremdsprache: CourseType = {
  slug: "deutsch-als-fremdsprache",
  name: "Alemán como lengua extranjera",
  shortName: "Alemán",
  status: "aktiv",
  tagline: "Integrarse en el idioma de la empresa",
  heroTitle: "Alemán como lengua extranjera para equipos internacionales",
  heroSubtitle:
    "Para que los profesionales internacionales se integren rápidamente en el entorno laboral de habla alemana — con seguridad profesional, soltura cultural y listos desde el primer día.",
  intro:
    "Interlexico lleva a los empleados internacionales al nivel de alemán que exige su día a día: reuniones, correos electrónicos, conversaciones especializadas y el trato con autoridades y compañeros. Adaptado individualmente, orientado a la práctica y con una medición clara del éxito para RR. HH.",
  audience: [
    "Especialistas y directivos internacionales en empresas de habla alemana",
    "Empleados recién llegados en proceso de incorporación",
    "Equipos con distintos idiomas de origen que construyen un idioma de trabajo común",
    "Empresas que quieren integrar talento internacional a largo plazo",
  ],
  benefits: [
    {
      title: "El día a día, no un libro de texto",
      description:
        "Entrenamos las situaciones que realmente importan: reuniones de equipo, correos electrónicos, llamadas y conversaciones especializadas de su área.",
    },
    {
      title: "Integración más rápida",
      description:
        "Los nuevos empleados internacionales se adaptan más rápido, tanto lingüística como culturalmente — en el trabajo y en el día a día.",
    },
    {
      title: "Progreso medible",
      description:
        "El test de nivel, los objetivos de aprendizaje claros y los informes periódicos hacen visible el progreso para RR. HH. y dirección.",
    },
    {
      title: "Formatos flexibles",
      description:
        "Clases individuales, en grupo o para departamentos enteros — en línea, presencial o híbrido, según el tamaño del equipo y los turnos.",
    },
  ],
  formats: [
    {
      slug: "einzelunterricht",
      kind: "einzel",
      name: "Clases individuales",
      description:
        "Formación 1:1 con máxima flexibilidad — ideal para directivos y especialistas que necesitan alemán rápido y específico para tareas concretas.",
      priceFrom: 0,
      priceUnit: "bajo consulta",
      duration: "individual",
      capacity: "1 participante",
      highlights: [
        "Plan de aprendizaje individual adaptado al puesto y los objetivos",
        "Horarios flexibles, incluso con agendas apretadas",
        "Preparación para situaciones concretas (reuniones, autoridades, conversaciones especializadas)",
      ],
    },
    {
      slug: "gruppentraining",
      kind: "gruppe",
      name: "Formación en grupo",
      description:
        "Para equipos con un nivel de idioma similar y temas de trabajo comunes — fomenta el espíritu de equipo y un idioma de trabajo compartido.",
      priceFrom: 0,
      priceUnit: "bajo consulta",
      duration: "desde 8 sesiones",
      capacity: "máx. 7 participantes",
      highlights: [
        "Grupos reducidos (máx. 7) — más tiempo de conversación por persona",
        "Escenarios prácticos del día a día laboral compartido",
        "Horario semanal fijo, en línea o presencial",
        "Construcción de una comunicación de equipo compartida",
      ],
    },
    {
      slug: "klassentraining",
      kind: "klasse",
      name: "Formación por departamento",
      description:
        "Para departamentos enteros o grupos de incorporación — un temario estructurado con informes unificados para RR. HH.",
      priceFrom: 0,
      priceUnit: "bajo consulta",
      duration: "programa semestral",
      capacity: "7–16 participantes",
      highlights: [
        "Temario unificado por nivel (A1–C1)",
        "Informes de progreso centralizados",
        "Escalable a varias sedes y turnos",
      ],
    },
  ],
  // Keine erfundenen Kundenstimmen — echte kommen über das CMS (course-types).
  testimonials: [],
  seo: {
    title: "Alemán como Lengua Extranjera para Empresas | Interlexico",
    description:
      "Formación en alemán como lengua extranjera para especialistas y directivos internacionales de la región DACH. Orientada a la práctica, con progreso medible.",
  },
};
