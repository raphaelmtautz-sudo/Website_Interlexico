import type { IndustryLabels, IndustryPage } from "./types";

export const labels: IndustryLabels = {
  hubEyebrow: "Business English por sector",
  hubTitle: "Business English para su sector",
  hubSeoTitle: "Business English por sector — formación para empresas | Interlexico",
  hubText:
    "Cada sector tiene su propio lenguaje. Interlexico forma en Business English con el vocabulario y las situaciones de su día a día — para equipos en Alemania, Austria y Suiza, online, presencial o híbrido.",
  situations: "Situaciones típicas de la formación",
  topics: "Temas y vocabulario",
  formats: "Formatos adecuados",
  faq: "Preguntas frecuentes",
  cta: "Solicitar formación para su equipo",
  ctaText: "Describa brevemente su equipo, objetivos y plazos: normalmente recibe una oferta sin compromiso en un día laborable.",
  more: "Otros sectores",
  course: "Ir al curso de Business English",
  daf: "El alemán como lengua extranjera se ofrece para todos los sectores y funciones.",
};

export const industries: IndustryPage[] = [
  {
    slug: "oeffentlicher-dienst",
    name: "Administración pública y organismos oficiales",
    eyebrow: "Business English · Sector público",
    title: "Inglés para la administración pública",
    seoTitle: "Inglés para la administración pública | Interlexico",
    description:
      "Formación de inglés para administraciones e instituciones públicas: atención a la ciudadanía, cooperación internacional y lenguaje administrativo — online, presencial o híbrida.",
    intro:
      "Oficinas de extranjería, ministerios, ayuntamientos o administraciones universitarias: el personal público habla inglés cada vez más — con ciudadanos que no hablan alemán, con socios de la UE y en proyectos internacionales. Interlexico entrena exactamente esas situaciones, con un lenguaje claro y sencillo.",
    situations: [
      "Atender a la ciudadanía en inglés en ventanilla, por teléfono y por correo",
      "Explicar procedimientos, plazos y documentos de forma sencilla y precisa",
      "Participar en proyectos europeos, alianzas y grupos de trabajo internacionales",
      "Recibir delegaciones y mantener reuniones técnicas",
      "Redactar cartas, explicaciones de resoluciones y actas en inglés",
    ],
    topics: [
      "Vocabulario administrativo y de procedimientos",
      "Plain English: explicar normas complejas con sencillez",
      "Conversación cortés y desescalada",
      "Lenguaje de proyectos y financiación (programas de la UE)",
      "Comunicación intercultural con la ciudadanía",
    ],
    formats:
      "Los equipos con atención al público aprovechan la formación en grupo (máx. 7 personas) con juegos de rol de su propia oficina. Organismos o sedes completas se forman en clase con un currículo común por nivel e informes centralizados. Los cargos directivos con citas internacionales entrenan en clases individuales.",
    faq: [
      {
        question: "¿Se puede adaptar la formación a nuestro organismo?",
        answer:
          "Sí. Tras un análisis de necesidades trabajamos con los trámites, formularios y conversaciones de su organismo, desde la atención al público hasta los proyectos internacionales.",
      },
      {
        question: "¿Puede la formación realizarse en horario laboral?",
        answer: "Sí. Las sesiones se adaptan a los turnos y se imparten online, presencialmente o en formato híbrido.",
      },
      {
        question: "¿Cómo se documenta el progreso para RR. HH.?",
        answer:
          "Cada formación empieza con una evaluación de nivel según el MCER. A través de Interlexico ONE, RR. HH. recibe informes de progreso periódicos.",
      },
    ],
  },
  {
    slug: "vertrieb",
    name: "Ventas y desarrollo de negocio",
    eyebrow: "Business English · Ventas",
    title: "Inglés para ventas y desarrollo de negocio",
    seoTitle: "Business English para equipos de ventas | Interlexico",
    description:
      "Formación de inglés para equipos de ventas y desarrollo de negocio: presentaciones, negociaciones, objeciones y conversaciones con clientes — a medida y con progreso medible.",
    intro:
      "En las ventas internacionales, el idioma influye en el cierre. Interlexico prepara a los equipos de ventas y desarrollo de negocio para las conversaciones decisivas: desde la primera llamada y la presentación hasta la negociación del precio.",
    situations: [
      "Llamadas en frío y primeras reuniones por teléfono y vídeo",
      "Presentaciones de producto y soluciones a clientes internacionales",
      "Responder a objeciones con seguridad y argumentar el valor",
      "Negociar precios y contratos",
      "Redactar correos de seguimiento, ofertas y mensajes de LinkedIn",
    ],
    topics: [
      "Lenguaje de ventas y negociación",
      "Storytelling y presentaciones persuasivas",
      "Técnicas de preguntas y escucha activa",
      "Small talk y relaciones en distintas culturas",
      "Vocabulario de ofertas, contratos y condiciones",
    ],
    formats:
      "Los equipos de ventas aprovechan la formación en grupo con presentaciones reales y juegos de rol de negociación. Antes de citas importantes, las clases individuales preparan presentaciones o negociaciones concretas.",
    faq: [
      {
        question: "¿Podemos preparar reuniones reales con clientes?",
        answer:
          "Sí. En las clases individuales preparamos presentaciones y negociaciones concretas, con sus materiales y las objeciones típicas de sus clientes.",
      },
      {
        question: "¿Para qué nivel es la formación de ventas?",
        answer: "Para cualquier nivel. Los participantes se evalúan según el MCER al inicio; los grupos se forman por nivel similar.",
      },
      {
        question: "¿La formación es online?",
        answer: "Online, presencial o híbrida, según los viajes y la agenda de su equipo.",
      },
    ],
  },
  {
    slug: "engineering",
    name: "Ingeniería y servicios técnicos",
    eyebrow: "Business English · Ingeniería",
    title: "Inglés técnico para ingeniería y servicios técnicos",
    seoTitle: "Inglés técnico para ingenieros y equipos técnicos | Interlexico",
    description:
      "Inglés técnico para ingenieros y técnicos de proyecto y servicio: especificaciones, reuniones de proyecto, soporte al cliente y documentación — práctico y adaptado al sector.",
    intro:
      "Ingenieros y técnicos trabajan con clientes, proveedores y compañeros internacionales: en reuniones de proyecto, puestas en marcha y servicio técnico. Interlexico entrena el inglés técnico que esto exige: preciso, claro y seguro.",
    situations: [
      "Reuniones de proyecto y coordinación con socios internacionales",
      "Explicar soluciones técnicas, procesos y problemas",
      "Asistir a clientes en puestas en marcha, mantenimiento y averías",
      "Leer y redactar especificaciones, pliegos e informes",
      "Comunicar cambios, retrasos y riesgos con claridad",
    ],
    topics: [
      "Vocabulario técnico de su área",
      "Describir procesos, medidas, tolerancias y fallos",
      "Inglés para gestión de proyectos",
      "Comunicación de seguridad y calidad",
      "Documentación técnica y correos",
    ],
    formats:
      "Los equipos de proyecto aprenden en grupo con casos de sus propios proyectos. Las clases individuales con horarios flexibles son ideales para técnicos con misiones en el extranjero; departamentos o sedes completas se forman en clase.",
    faq: [
      {
        question: "¿Los formadores trabajan con nuestro vocabulario técnico?",
        answer:
          "Sí. En el análisis de necesidades aclaramos productos, procesos y situaciones típicas; el vocabulario y los casos proceden de su entorno técnico.",
      },
      {
        question: "¿La formación es compatible con turnos o proyectos?",
        answer: "Sí. Las sesiones se adaptan a turnos y proyectos, online, presencial o híbrido.",
      },
      {
        question: "¿Podemos preparar a empleados para una misión en el extranjero?",
        answer:
          "Sí. En clases individuales o en grupo preparamos misiones, puestas en marcha y reuniones con clientes en el extranjero.",
      },
    ],
  },
  {
    slug: "banken-finanzen",
    name: "Banca y servicios financieros",
    eyebrow: "Business English · Finanzas",
    title: "Inglés para banca y servicios financieros",
    seoTitle: "Inglés financiero para banca y finanzas | Interlexico",
    description:
      "Inglés financiero para bancos, aseguradoras y proveedores de servicios financieros: asesoramiento, reporting, compliance y presentaciones — con evaluación individual y progreso medible.",
    intro:
      "En banca y servicios financieros, el inglés es lengua de trabajo: en el asesoramiento, el reporting, la gestión de riesgos y el contacto con entidades internacionales del grupo. Interlexico entrena el inglés financiero preciso que exige este trabajo.",
    situations: [
      "Asesorar a clientes internacionales sobre cuentas, financiación e inversiones",
      "Presentar cifras, resultados e indicadores",
      "Participar en reuniones con entidades internacionales del grupo",
      "Explicar temas de compliance, riesgo y regulación",
      "Redactar correos, memorandos e informes precisos",
    ],
    topics: [
      "Inglés financiero: balance, cuenta de resultados, indicadores",
      "Vocabulario de banca, crédito e inversión",
      "Lenguaje de compliance y regulación",
      "Presentar cifras y tendencias con seguridad",
      "Formulaciones diplomáticas en conversaciones delicadas",
    ],
    formats:
      "Los departamentos especializados se forman en grupo con casos de su propia área. Directivos y especialistas con presentaciones o negociaciones usan clases individuales; los programas multisede se imparten como formación de clase con informes uniformes.",
    faq: [
      {
        question: "¿La formación cubre lenguaje especializado como reporting y compliance?",
        answer:
          "Sí. Los contenidos se basan en sus áreas, como asesoramiento, reporting, riesgos o compliance, y se definen en el análisis de necesidades.",
      },
      {
        question: "¿Cómo se demuestra el progreso?",
        answer:
          "Con una evaluación de nivel según el MCER al inicio e informes de progreso periódicos en Interlexico ONE, transparentes para RR. HH. y responsables.",
      },
      {
        question: "¿Hay formación para directivos individuales?",
        answer:
          "Sí. Las clases individuales de 60 minutos preparan a los directivos para presentaciones, comités y negociaciones.",
      },
    ],
  },
  {
    slug: "it-software",
    name: "TI y software",
    eyebrow: "Business English · TI",
    title: "Inglés para equipos de TI y software",
    seoTitle: "Business English para equipos de TI y software | Interlexico",
    description:
      "Formación de inglés para desarrolladores, equipos de producto y TI: dailies, code reviews, comunicación con stakeholders y documentación — práctica para equipos internacionales.",
    intro:
      "En los equipos de TI y software, el inglés suele ser la lengua de trabajo: en dailies, tickets, code reviews y conversaciones con clientes y stakeholders. Interlexico forma a desarrolladores, equipos de producto y departamentos de TI para comunicarse con claridad y seguridad, más allá de la tecnología.",
    situations: [
      "Moderar y participar en dailies, plannings y retrospectivas en inglés",
      "Redactar code reviews, tickets y pull requests claros",
      "Explicar temas técnicos a stakeholders no técnicos",
      "Aclarar requisitos con clientes y gestionar expectativas",
      "Comunicar incidencias, retrasos y prioridades",
    ],
    topics: [
      "Vocabulario ágil y de proyectos",
      "Redacción técnica: documentación, tickets, release notes",
      "Dar y recibir feedback",
      "Presentar decisiones de arquitectura y producto",
      "Comunicación en equipos distribuidos y multiculturales",
    ],
    formats:
      "Los equipos de desarrollo aprenden en grupo usando sus propios tickets, revisiones y reuniones como material. Tech leads y product owners usan clases individuales para conversaciones con stakeholders y presentaciones; la formación suele ser online.",
    faq: [
      {
        question: "Nuestros equipos trabajan en remoto, ¿la formación puede ser online?",
        answer:
          "Sí. La formación es online, presencial o híbrida; para equipos distribuidos es habitual la formación online con sesiones semanales fijas.",
      },
      {
        question: "¿Se trata solo de vocabulario técnico?",
        answer:
          "No. Además del inglés técnico entrenamos sobre todo la comunicación: reuniones, feedback, conversaciones con stakeholders y redacción clara.",
      },
      {
        question: "¿Pueden aprender juntos participantes de distintos niveles?",
        answer:
          "Los grupos se forman por nivel similar. Si las diferencias son grandes, combinamos formación en grupo e individual.",
      },
    ],
  },
  {
    slug: "management-fuehrung",
    name: "Gestión y liderazgo",
    eyebrow: "Business English · Liderazgo",
    title: "Business English para directivos y liderazgo",
    seoTitle: "Business English para directivos y ejecutivos | Interlexico",
    description:
      "Coaching de Business English para directivos: negociaciones, presentaciones ante consejos y clientes, liderazgo de equipos y comunicación de crisis — individual y flexible.",
    intro:
      "Los directivos lideran equipos internacionales, negocian con socios y presentan ante consejos, inversores y clientes. Interlexico entrena el inglés que hace convincente el liderazgo: claro, seguro y diplomático, normalmente en coaching individual con horarios flexibles.",
    situations: [
      "Negociar con socios internacionales",
      "Presentar estrategia y resultados ante consejos, comités y clientes",
      "Liderar equipos internacionales, dar feedback y mantener entrevistas",
      "Moderar reuniones y talleres",
      "Comunicar con claridad en crisis y procesos de cambio",
    ],
    topics: [
      "Lenguaje de negociación y persuasión",
      "Presentaciones ejecutivas y storytelling",
      "Comunicación de liderazgo y feedback",
      "Lenguaje diplomático y escalado",
      "Comunicación de cambio y de crisis",
    ],
    formats:
      "Para directivos con agendas apretadas, el coaching individual (sesiones de 60 minutos, a partir de 10 sesiones) prepara citas concretas. Los equipos directivos pueden trabajar además juntos en formación en grupo.",
    faq: [
      {
        question: "¿Podemos centrar la formación en una cita próxima?",
        answer:
          "Sí. El coaching individual prepara negociaciones, presentaciones o reuniones de consejo concretas, con sus propios materiales.",
      },
      {
        question: "¿Qué flexibilidad tienen los horarios?",
        answer: "En las clases individuales elige las sesiones libremente: online, presencial o híbrido, según viajes y agenda.",
      },
      {
        question: "¿Puede un equipo directivo formarse junto?",
        answer:
          "Sí. En la formación en grupo (máx. 7 personas) los equipos directivos trabajan juntos reuniones, presentaciones y negociaciones; los directivos individuales lo complementan con coaching individual.",
      },
    ],
  },
];
