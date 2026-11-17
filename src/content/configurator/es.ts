import type { ConfiguratorContent } from "./types";

export const configurator: ConfiguratorContent = {
  progress: (c, t) => `Paso ${c} de ${t}`,
  steps: {
    sprache: { title: "¿Qué idioma quiere formar en su equipo?", hint: "Más adelante puede añadir otros idiomas." },
    zielgruppe: { title: "¿Quién va a participar?", hint: "De ello dependen el ritmo, los contenidos y el formato adecuado." },
    teilnehmer: {
      title: "¿Cuántas personas van a participar?",
      hint: "Formamos en grupos pequeños de 7 personas como máximo, para que todos tengan tiempo suficiente para hablar.",
    },
    niveau: {
      title: "¿Qué nivel de idioma tienen hoy?",
      hint: "Basta con una estimación. Toda formación empieza con una evaluación de nivel individual.",
    },
    ziele: {
      title: "¿En qué situaciones debe ganar seguridad su equipo?",
      hint: "Puede elegir varias. Con ello creamos su plan de formación.",
    },
    durchfuehrung: { title: "¿Cómo quiere realizar la formación?", hint: "Puede cambiarlo más adelante." },
    umfang: {
      title: "¿Qué volumen de formación tiene en mente?",
      hint: "¿No está seguro? Le recomendamos un volumen según el nivel y los objetivos.",
    },
  },
  courseHints: {
    "business-english": "Para reuniones, negociaciones y colaboración internacional",
    "deutsch-als-fremdsprache": "Para que los profesionales internacionales se integren en el trabajo",
  },
  audiences: [
    { value: "fachkraefte", label: "Profesionales y personal junior", hint: "Empleados con una necesidad concreta" },
    { value: "team", label: "Un equipo o departamento", hint: "Temas comunes, día a día compartido" },
    { value: "fuehrung", label: "Mandos y dirección", hint: "Negociar, liderar, representar" },
  ],
  industryLabel: "Sector (opcional)",
  participants: {
    fewer: "una persona menos",
    more: "una persona más",
    slider: "Número de participantes con el control deslizante",
    unit: (n) => (n === 1 ? "persona" : "personas"),
  },
  levels: [
    { value: "A1", label: "A1", hint: "Inicial" },
    { value: "A2", label: "A2", hint: "Básico" },
    { value: "B1", label: "B1", hint: "Autónomo en el día a día" },
    { value: "B2", label: "B2", hint: "Seguro en el trabajo" },
    { value: "C1", label: "C1", hint: "Dominio profesional" },
    { value: "C2", label: "C2", hint: "Casi nativo" },
    { value: "gemischt", label: "Niveles distintos en el equipo" },
    { value: "unbekannt", label: "Aún no lo sé" },
  ],
  selfTest: "¿No conoce el nivel? Haga la autoevaluación gratuita",
  goals: [
    {
      value: "meetings",
      label: "Reuniones",
      module: {
        title: "Dirigir reuniones y participar con soltura",
        items: ["Expresar opiniones con claridad y preguntar", "Moderar, interrumpir, resumir", "Acordar decisiones y próximos pasos"],
      },
    },
    {
      value: "praesentation",
      label: "Presentaciones",
      module: {
        title: "Presentar de forma convincente",
        items: ["Estructurar presentaciones con claridad", "Explicar cifras y resultados", "Responder con seguridad a las preguntas"],
      },
    },
    {
      value: "verhandlung",
      label: "Negociaciones",
      module: {
        title: "Negociar con seguridad",
        items: ["Formular posiciones y márgenes", "Discrepar con diplomacia", "Dejar los acuerdos por escrito con precisión"],
      },
    },
    {
      value: "email",
      label: "Correos y textos",
      module: {
        title: "Escribir de forma profesional",
        items: ["Correos claros y con el tono adecuado", "Ofertas, consultas y recordatorios", "Evitar errores típicos"],
      },
    },
    {
      value: "telefon",
      label: "Teléfono y videollamadas",
      module: {
        title: "Llamadas y videollamadas",
        items: ["Abrir, dirigir y cerrar conversaciones", "Preguntar cuando no se entiende algo", "Acordar citas y resolver problemas técnicos"],
      },
    },
    {
      value: "kunden",
      label: "Atención al cliente",
      module: {
        title: "Atender a clientes internacionales",
        items: ["Detectar necesidades y asesorar", "Gestionar reclamaciones con calma", "Crear y cuidar relaciones"],
      },
    },
    {
      value: "fachsprache",
      label: "Lenguaje técnico",
      module: {
        title: "El lenguaje de su ámbito profesional",
        items: ["Vocabulario de sus documentos reales", "Explicar temas técnicos de forma sencilla", "Documentación e informes"],
      },
    },
    {
      value: "smalltalk",
      label: "Small talk y networking",
      module: {
        title: "Small talk y networking",
        items: ["Iniciar conversaciones con naturalidad", "Hacer contactos en ferias y eventos", "Manejar las diferencias culturales"],
      },
    },
  ],
  goalsHint: (n) => (n === 0 ? "Nada seleccionado todavía" : n === 1 ? "1 área seleccionada" : `${n} áreas seleccionadas`),
  deliveries: [
    { value: "online", label: "Online", hint: "Sin desplazamientos, ideal para equipos repartidos" },
    { value: "vorort", label: "Presencial en su empresa", hint: "Intercambio cara a cara en el equipo" },
    { value: "hybrid", label: "Híbrido", hint: "Online y presencial combinados" },
  ],
  scopes: [
    { value: "empfehlung", label: "Recomiéndenme", hint: "Según nivel y objetivos" },
    { value: "30", label: "aprox. 30 sesiones", hint: "Compacto, para situaciones concretas" },
    { value: "60", label: "aprox. 60 sesiones", hint: "Más seguridad a lo largo de varios meses" },
    { value: "90", label: "aprox. 90 sesiones", hint: "Construir y ampliar la base" },
  ],
  nav: { back: "Atrás", next: "Siguiente", showResult: "Ver recomendación", edit: "Cambiar respuestas", restart: "Empezar de nuevo" },
  resume: { text: "Ya había empezado una configuración.", continue: "Continuar", restart: "Empezar de nuevo" },
  summary: {
    title: "Su selección",
    course: "Idioma",
    audience: "Destinatarios",
    participants: "Participantes",
    level: "Nivel",
    goals: "Áreas",
    delivery: "Modalidad",
    scope: "Volumen",
    open: "pendiente",
    preview: "Recomendación provisional",
  },
  format: {
    name: (p) =>
      p.kind === "einzel"
        ? "Clases individuales (1:1)"
        : p.kind === "gruppe"
          ? "Formación en grupo · 1 grupo"
          : `Formación por departamento · ${p.groups.length} grupos`,
    why: (p, n) =>
      p.kind === "einzel"
        ? "Totalmente adaptado a una persona: fechas, ritmo y contenidos se ajustan a su agenda y a sus próximas citas."
        : p.kind === "gruppe"
          ? `Un grupo de ${n} personas. Lo bastante pequeño para que todos hablen con regularidad y lo bastante grande para juegos de rol dinámicos.`
          : `Dividimos a ${n} personas en ${p.groups.length} grupos de 7 como máximo. Así todos tienen tiempo para hablar y RR. HH. recibe informes unificados.`,
    group: "Grupo",
    groups: "grupos",
    perGroup: (max) => `máx. ${max} por grupo`,
    coaching: "Para un grupo reducido de directivos, el coaching individual también suele ser una buena opción: aún más flexible y centrado en las próximas citas.",
    splitByLevel: "Con niveles distintos, tras la evaluación formamos grupos del mismo nivel. Por ello puede cambiar el número de grupos.",
  },
  result: {
    eyebrow: "Su recomendación personal",
    title: "Así podría ser su formación de idiomas",
    intro: "Según sus respuestas, le proponemos lo siguiente. En la consulta lo adaptamos todo a sus necesidades concretas.",
    formatTitle: "Formato recomendado",
    scopeTitle: "Volumen recomendado",
    scopeValue: (u) => `aprox. ${u} sesiones`,
    scopeReason: {
      basis: "En A1/A2 compensa un programa más largo: solo una base sólida da verdadera seguridad en las conversaciones de trabajo.",
      aufbau: "En B1/B2 un programa medio aporta mucha más seguridad justo en las situaciones que ha elegido.",
      feinschliff: "En C1/C2 se trata de pulir: formación específica para situaciones exigentes en lugar de lo básico.",
      offen: "Sin un nivel exacto, partimos de un volumen medio. Tras la evaluación lo ajustamos para cada grupo.",
      gewaehlt: "Ha elegido este volumen. Tras la evaluación le diremos con franqueza si encaja con sus objetivos.",
    },
    scopeNote: "Como referencia: Cambridge English calcula unas 200 horas de aprendizaje guiado por nivel del MCER. Se avanza más rápido combinando formación y práctica en el trabajo.",
    planTitle: "Plan de formación de ejemplo",
    planNote: "Elaboramos el plan exacto tras el análisis de necesidades, con ejemplos de su día a día.",
    planStart: {
      title: "Inicio: evaluación y análisis de necesidades",
      items: ["Evaluación de nivel individual de cada participante", "Definir los objetivos con usted y el equipo"],
    },
    planGeneric: {
      title: "Formación basada en su día a día",
      items: ["Situaciones típicas de su trabajo", "Vocabulario, pronunciación y seguridad al hablar"],
    },
    planIndustry: (i) => `Vocabulario y casos prácticos del sector ${i}`,
    planEnd: {
      title: "De forma continua: progreso visible",
      items: ["Informes periódicos para RR. HH. y mandos", "Ajustar objetivos si cambian las necesidades"],
    },
    deliveryTitle: "Modalidad",
    deliveryText: {
      online: "Formación online: sin desplazamientos, ideal para equipos repartidos y agendas llenas.",
      vorort: "Formación presencial en su empresa: intercambio cara a cara en un entorno conocido.",
      hybrid: "Híbrido: sesiones presenciales para cohesionar el equipo y online para ganar flexibilidad.",
      "": "Online, presencial o híbrido: lo decidimos juntos en la consulta.",
    },
    includedTitle: "Con Interlexico puede contar con esto",
    included: [
      { title: "Evaluación individual", text: "Toda formación empieza con un análisis de nivel y de necesidades." },
      { title: "Contenidos de su sector", text: "Vocabulario y casos de su día a día en lugar de escenarios de libro." },
      { title: "Grupos pequeños", text: "Máximo 7 personas por grupo, para que todos tengan tiempo para hablar." },
      { title: "Progreso medible", text: "Informes periódicos para RR. HH., para demostrar el valor internamente." },
      { title: "Todo en un mismo lugar", text: "Evaluación, citas e informes se gestionan en nuestra plataforma Interlexico ONE." },
      { title: "Formación con impacto", text: "Cada sesión apoya un proyecto social o medioambiental de su elección." },
    ],
    nextTitle: "Próximos pasos",
    next: [
      { title: "Enviar la solicitud", text: "Su selección ya está incluida, solo añade su nombre y correo electrónico." },
      { title: "Propuesta personal", text: "Normalmente le respondemos en dos días laborables con una propuesta concreta." },
      { title: "Evaluación e inicio", text: "Tras su confirmación evaluamos a los participantes y empezamos la formación." },
    ],
    cta: "Solicitar presupuesto sin compromiso",
    ctaNote: "Gratis y sin compromiso",
    secondary: "Prefiero hablar primero",
    industryLink: (i) => `Más sobre formación de idiomas para ${i}`,
  },
  offer: {
    title: "Su presupuesto sin compromiso",
    intro: "Su selección ya está incluida. Solo necesitamos algunos datos para elaborarle un presupuesto adecuado.",
    summaryTitle: "Su configuración",
    company: "Empresa",
    city: "Lugar de la formación (ciudad, opcional)",
    cityPlaceholder: "p. ej. Múnich",
    notes: "Requisitos especiales (opcional)",
    notesPlaceholder: "p. ej. fechas, turnos, ocasiones concretas como una feria…",
    submit: "Solicitar presupuesto",
    close: "Cerrar",
    successTitle: "¡Muchas gracias por su solicitud!",
    successText: "Revisamos sus necesidades de formación y normalmente le respondemos personalmente en dos días laborables con un presupuesto concreto.",
    reference: "Su número de referencia",
    fallback: "Usar el formulario de contacto",
  },
  pdf: {
    button: "Guardar como PDF",
    docTitle: "Interlexico – Su recomendación de formación",
    created: (d) => `Creado el ${d}`,
    selection: "Sus respuestas",
    footer: "Recomendación sin compromiso basada en sus respuestas, sin precios. Recibirá su presupuesto individual previa solicitud.",
  },
  prefill: {
    intro: "Solicitud desde el configurador de formación:",
    audience: "Destinatarios",
    industry: "Sector",
    participants: "Participantes",
    level: "Nivel",
    goals: "Áreas",
    delivery: "Modalidad",
    scope: (u, rec) => `aprox. ${u} sesiones${rec ? " (recomendado)" : ""}`,
  },
};
