import type { ConfiguratorContent } from "./types";

export const configurator: ConfiguratorContent = {
  progress: (c, t) => `Step ${c} of ${t}`,
  steps: {
    sprache: { title: "Which language should your team train?", hint: "You can add further languages later." },
    zielgruppe: { title: "Who will take part?", hint: "This shapes the pace, the content and the right format." },
    teilnehmer: {
      title: "How many people will take part?",
      hint: "We train in small groups of no more than 7, so everyone gets enough speaking time.",
    },
    niveau: {
      title: "What is the current language level?",
      hint: "An estimate is fine. Every programme starts with an individual placement anyway.",
    },
    ziele: {
      title: "In which situations should your team become more confident?",
      hint: "Select as many as you like. This becomes your training plan.",
    },
    durchfuehrung: { title: "How would you like to train?", hint: "You can still change this later." },
    umfang: {
      title: "What scope do you have in mind?",
      hint: "Not sure? We will recommend a scope based on level and goals.",
    },
  },
  courseHints: {
    "business-english": "For meetings, negotiations and international collaboration",
    "deutsch-als-fremdsprache": "Helping international professionals settle in at work",
  },
  audiences: [
    { value: "fachkraefte", label: "Specialists & junior staff", hint: "Individual employees with a specific need" },
    { value: "team", label: "A team or department", hint: "Shared topics, shared day-to-day work" },
    { value: "fuehrung", label: "Managers & leadership", hint: "Negotiating, leading, representing" },
  ],
  industryLabel: "Industry (optional)",
  participants: {
    fewer: "one person fewer",
    more: "one person more",
    slider: "Number of participants slider",
    unit: (n) => (n === 1 ? "person" : "people"),
  },
  levels: [
    { value: "A1", label: "A1", hint: "Beginner" },
    { value: "A2", label: "A2", hint: "Elementary" },
    { value: "B1", label: "B1", hint: "Independent in everyday situations" },
    { value: "B2", label: "B2", hint: "Confident at work" },
    { value: "C1", label: "C1", hint: "Business fluent" },
    { value: "C2", label: "C2", hint: "Near-native" },
    { value: "gemischt", label: "Mixed levels in the team" },
    { value: "unbekannt", label: "Not sure yet" },
  ],
  selfTest: "Not sure about the level? Take the free self-assessment",
  goals: [
    {
      value: "meetings",
      label: "Meetings",
      module: {
        title: "Leading and contributing to meetings",
        items: ["Stating opinions clearly and asking follow-up questions", "Chairing, interrupting, summarising", "Agreeing decisions and next steps"],
      },
    },
    {
      value: "praesentation",
      label: "Presentations",
      module: {
        title: "Presenting persuasively",
        items: ["Structuring presentations clearly", "Explaining figures and results", "Handling questions from the audience"],
      },
    },
    {
      value: "verhandlung",
      label: "Negotiations",
      module: {
        title: "Negotiating with confidence",
        items: ["Stating positions and room for manoeuvre", "Disagreeing diplomatically", "Recording agreements precisely"],
      },
    },
    {
      value: "email",
      label: "Emails & writing",
      module: {
        title: "Writing professionally",
        items: ["Clear emails in the right tone", "Quotes, queries and reminders", "Avoiding typical mistakes"],
      },
    },
    {
      value: "telefon",
      label: "Phone & video calls",
      module: {
        title: "Phone and video calls",
        items: ["Opening, steering and closing calls", "Asking when you don't understand", "Arranging dates and handling tech issues"],
      },
    },
    {
      value: "kunden",
      label: "Customer contact",
      module: {
        title: "Looking after international customers",
        items: ["Finding out needs and advising", "Handling complaints calmly", "Building lasting relationships"],
      },
    },
    {
      value: "fachsprache",
      label: "Technical language",
      module: {
        title: "Language for your field",
        items: ["Vocabulary from your real documents", "Explaining technical topics simply", "Documentation and reports"],
      },
    },
    {
      value: "smalltalk",
      label: "Small talk & networking",
      module: {
        title: "Small talk and networking",
        items: ["Starting conversations easily", "Making contacts at trade fairs and events", "Navigating cultural differences"],
      },
    },
  ],
  goalsHint: (n) => (n === 0 ? "Nothing selected yet" : n === 1 ? "1 focus selected" : `${n} focus areas selected`),
  deliveries: [
    { value: "online", label: "Online", hint: "No travel, ideal for distributed teams" },
    { value: "vorort", label: "On-site at your company", hint: "Face-to-face exchange in the team" },
    { value: "hybrid", label: "Hybrid", hint: "Online and on-site combined" },
  ],
  scopes: [
    { value: "empfehlung", label: "Please recommend", hint: "Based on level and goals" },
    { value: "30", label: "approx. 30 lessons", hint: "Compact, for specific situations" },
    { value: "60", label: "approx. 60 lessons", hint: "Noticeably more confident over several months" },
    { value: "90", label: "approx. 90 lessons", hint: "Building and extending the foundations" },
  ],
  nav: { back: "Back", next: "Next", showResult: "Show recommendation", edit: "Change answers", restart: "Start again" },
  resume: { text: "You had already started a configuration.", continue: "Continue", restart: "Start again" },
  summary: {
    title: "Your selection",
    course: "Language",
    audience: "Audience",
    participants: "Participants",
    level: "Level",
    goals: "Focus areas",
    delivery: "Delivery",
    scope: "Scope",
    open: "not set yet",
    preview: "Preliminary recommendation",
  },
  format: {
    name: (p) =>
      p.kind === "einzel"
        ? "One-to-one training"
        : p.kind === "gruppe"
          ? "Group training · 1 group"
          : `Class training · ${p.groups.length} groups`,
    why: (p, n) =>
      p.kind === "einzel"
        ? "Fully tailored to one person: dates, pace and content follow your calendar and your upcoming meetings."
        : p.kind === "gruppe"
          ? `One group of ${n}. Small enough for everyone to speak regularly, large enough for lively role plays.`
          : `We split ${n} people into ${p.groups.length} groups of no more than 7. Everyone keeps enough speaking time, and HR gets consistent reporting.`,
    group: "Group",
    groups: "groups",
    perGroup: (max) => `max. ${max} per group`,
    coaching: "For a small circle of managers, one-to-one coaching is often worth considering too: even more flexible and focused on upcoming meetings.",
    splitByLevel: "With mixed levels, we form groups of the same level after placement. The number of groups may change as a result.",
  },
  result: {
    eyebrow: "Your personal recommendation",
    title: "What your language training could look like",
    intro: "Based on your answers, this is what we suggest. In the consultation we adapt everything to your exact needs.",
    formatTitle: "Recommended format",
    scopeTitle: "Recommended scope",
    scopeValue: (u) => `approx. ${u} lessons`,
    scopeReason: {
      basis: "At A1/A2 a longer programme pays off: solid foundations are what make work conversations genuinely confident.",
      aufbau: "At B1/B2 a mid-length programme brings noticeably more confidence in exactly the situations you selected.",
      feinschliff: "At C1/C2 it is about polish: targeted training for demanding situations rather than the basics.",
      offen: "Without a precise level we start by planning a mid-length programme. After the placement we adjust it for each group.",
      gewaehlt: "You chose this scope. After the placement we will tell you openly whether it fits your goals.",
    },
    scopeNote: "For orientation: Cambridge English estimates around 200 guided learning hours per CEFR level. Progress is fastest when training goes hand in hand with practice at work.",
    planTitle: "Sample training plan",
    planNote: "We create the exact plan after the needs analysis, using examples from your daily work.",
    planStart: {
      title: "Start: placement & needs analysis",
      items: ["Individual placement for every participant", "Agreeing learning goals with you and the team"],
    },
    planGeneric: {
      title: "Training built around your daily work",
      items: ["Typical situations from your job", "Vocabulary, pronunciation and speaking confidence"],
    },
    planIndustry: (i) => `Vocabulary and case studies from ${i}`,
    planEnd: {
      title: "Ongoing: making progress visible",
      items: ["Regular reporting for HR and managers", "Adjusting goals when needs change"],
    },
    deliveryTitle: "Delivery",
    deliveryText: {
      online: "Online training: no travel, ideal for distributed teams and busy calendars.",
      vorort: "On-site training at your company: face-to-face exchange in a familiar setting.",
      hybrid: "Hybrid: on-site sessions for team spirit, online sessions for flexibility.",
      "": "Online, on-site or hybrid: we will decide together in the consultation.",
    },
    includedTitle: "What you can rely on with Interlexico",
    included: [
      { title: "Individual placement", text: "Every programme starts with a language level and needs analysis." },
      { title: "Content from your industry", text: "Vocabulary and case studies from your daily work instead of textbook scenarios." },
      { title: "Small groups", text: "No more than 7 people per group, so everyone gets enough speaking time." },
      { title: "Measurable progress", text: "Regular reporting for HR, so the value can be shown internally." },
      { title: "Everything in one place", text: "Placement, scheduling and reporting run on our platform Interlexico ONE." },
      { title: "Training with impact", text: "Every lesson supports a social or environmental project of your choice." },
    ],
    nextTitle: "What happens next",
    next: [
      { title: "Send your enquiry", text: "Your selection is already filled in, you only add your name and email." },
      { title: "Personal proposal", text: "We usually get back to you within two business days with a concrete proposal." },
      { title: "Placement & start", text: "Once you confirm, we place the participants and start the training." },
    ],
    cta: "Request a no-obligation quote",
    ctaNote: "Free and without obligation",
    secondary: "I'd rather talk first",
    industryLink: (i) => `More on language training for ${i}`,
  },
  offer: {
    title: "Your no-obligation quote",
    intro: "Your selection has been added. We just need a few details to prepare a suitable quote for you.",
    summaryTitle: "Your configuration",
    company: "Company",
    city: "Training location (city, optional)",
    cityPlaceholder: "e.g. Munich",
    notes: "Special requirements (optional)",
    notesPlaceholder: "e.g. dates, shift patterns, specific occasions such as a trade fair…",
    submit: "Request quote",
    close: "Close",
    successTitle: "Thank you for your enquiry!",
    successText: "We will review your training needs and usually get back to you personally within two business days with a concrete quote. A confirmation is on its way to your inbox.",
    reference: "Your reference number",
    fallback: "Use the contact form instead",
  },
  pdf: {
    button: "Save as PDF",
    docTitle: "Interlexico – Your training recommendation",
    created: (d) => `Created on ${d}`,
    selection: "Your answers",
    footer: "Non-binding recommendation based on your answers, without prices. You receive your individual quote on request.",
  },
  prefill: {
    intro: "Enquiry from the training configurator:",
    audience: "Audience",
    industry: "Industry",
    participants: "Participants",
    level: "Level",
    goals: "Focus areas",
    delivery: "Delivery",
    scope: (u, rec) => `approx. ${u} lessons${rec ? " (recommended)" : ""}`,
  },
};
