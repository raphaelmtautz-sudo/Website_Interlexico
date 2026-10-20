import { CourseType } from "@/types/course";
import { getIndustries } from "@/content/industries";

export const businessEnglish: CourseType = {
  slug: "business-english",
  name: "Inglés de negocios",
  shortName: "Inglés de negocios",
  status: "aktiv",
  tagline: "Negocie, presente y comunique con seguridad — en inglés",
  heroTitle: "Inglés de negocios para directivos y equipos",
  heroSubtitle:
    "Nada de cursos de idiomas estándar. Formación diseñada según su sector, sus reuniones y sus objetivos.",
  intro:
    "Interlexico lleva a especialistas y directivos de la región DACH al nivel de idioma que exigen las negociaciones internacionales, las presentaciones y las conversaciones con clientes. Adaptado individualmente, con una medición clara del éxito para RR. HH.",
  audience: [
    "Directivos con partes interesadas internacionales",
    "Equipos de ventas y atención al cliente",
    "Departamentos especializados antes de asignaciones internacionales o procesos de fusión y adquisición",
    "Empresas con un negocio internacional en crecimiento",
  ],
  benefits: [
    {
      title: "Test de nivel individual",
      description:
        "Cada formación comienza con un análisis preciso del nivel de idioma y de las necesidades — sin conjeturas sobre el nivel del curso.",
    },
    {
      title: "Contenidos especializados",
      description:
        "Vocabulario y casos prácticos de su sector en lugar de escenarios genéricos de libro de texto.",
    },
    {
      title: "Progreso medible",
      description:
        "Informes periódicos para RR. HH. y dirección — el progreso del aprendizaje se hace visible, no solo se percibe.",
    },
    {
      title: "Formatos flexibles",
      description:
        "Clases individuales, en grupo o para departamentos enteros — según el tamaño del equipo y el presupuesto.",
    },
  ],
  formats: [
    {
      slug: "einzelunterricht",
      kind: "einzel",
      name: "Clases individuales",
      description:
        "Coaching 1:1 con máxima flexibilidad de horario y ritmo — ideal para directivos con agendas apretadas.",
      priceFrom: 89,
      priceUnit: "por sesión (60 min.)",
      duration: "desde 10 sesiones",
      capacity: "1 participante",
      highlights: [
        "Plan de formación individual",
        "Horarios flexibles",
        "Preparación para eventos concretos (presentaciones, negociaciones)",
      ],
    },
    {
      slug: "gruppentraining",
      kind: "gruppe",
      name: "Formación en grupo",
      description:
        "Para equipos con un nivel de idioma similar y puntos de contacto profesionales comunes.",
      priceFrom: 59,
      priceUnit: "por persona / sesión (90 min.)",
      duration: "desde 8 sesiones",
      capacity: "máx. 7 participantes",
      highlights: [
        "Grupos reducidos (máx. 7) — más tiempo de conversación por persona",
        "Casos prácticos del día a día laboral compartido",
        "Horario semanal fijo",
      ],
    },
    {
      slug: "klassentraining",
      kind: "klasse",
      name: "Formación por departamento",
      description:
        "Para departamentos o sedes completas — un temario estructurado con informes unificados para RR. HH.",
      priceFrom: 39,
      priceUnit: "por persona / sesión (90 min.)",
      duration: "programa semestral",
      capacity: "7–16 participantes",
      highlights: [
        "Temario unificado por nivel",
        "Informes de progreso centralizados",
        "Escalable a varias sedes",
      ],
    },
  ],
  industries: getIndustries("es"),
  // Keine erfundenen Kundenstimmen — echte kommen über das CMS (course-types).
  testimonials: [],
  seo: {
    title: "Formación en Inglés de Negocios para Empresas | Interlexico",
    description:
      "Formación en inglés de negocios para directivos y equipos de la región DACH. Individual, especializada, con progreso medible.",
  },
};
