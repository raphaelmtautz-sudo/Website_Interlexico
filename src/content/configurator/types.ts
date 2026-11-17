import type { Audience, Delivery, Goal, Level, Plan, Scope } from "@/lib/configurator-plan";

/**
 * Texte des Trainings-Konfigurators je Sprache. Enthält Funktionen (Platzhalter
 * wie Teilnehmerzahl) und wird deshalb direkt von der Client-Komponente
 * importiert, nicht als Prop über die RSC-Grenze gereicht.
 *
 * Inhaltliche Regel: nur Aussagen, die Interlexico auch an anderer Stelle der
 * Website macht — keine Preise, keine erfundenen Zahlen oder Zusagen.
 */
export interface ConfiguratorContent {
  progress: (current: number, total: number) => string;
  steps: {
    sprache: StepText;
    zielgruppe: StepText;
    teilnehmer: StepText;
    niveau: StepText;
    ziele: StepText;
    durchfuehrung: StepText;
    umfang: StepText;
  };
  courseHints: Record<string, string>;
  audiences: Option<Audience>[];
  industryLabel: string;
  participants: { fewer: string; more: string; slider: string; unit: (n: number) => string };
  levels: Option<Level>[];
  selfTest: string;
  goals: (Option<Goal> & { module: { title: string; items: string[] } })[];
  goalsHint: (count: number) => string;
  deliveries: Option<Delivery>[];
  scopes: Option<Scope>[];
  nav: { back: string; next: string; showResult: string; edit: string; restart: string };
  resume: { text: string; continue: string; restart: string };
  summary: {
    title: string;
    course: string;
    audience: string;
    participants: string;
    level: string;
    goals: string;
    delivery: string;
    scope: string;
    open: string;
    preview: string;
  };
  format: {
    name: (plan: Plan) => string;
    why: (plan: Plan, n: number) => string;
    group: string;
    groups: string;
    perGroup: (max: number) => string;
    coaching: string;
    splitByLevel: string;
  };
  result: {
    eyebrow: string;
    title: string;
    intro: string;
    formatTitle: string;
    scopeTitle: string;
    scopeValue: (units: number) => string;
    scopeReason: Record<Plan["unitsReason"], string>;
    scopeNote: string;
    planTitle: string;
    planNote: string;
    planStart: { title: string; items: string[] };
    planGeneric: { title: string; items: string[] };
    planIndustry: (industry: string) => string;
    planEnd: { title: string; items: string[] };
    deliveryTitle: string;
    deliveryText: Record<Delivery | "", string>;
    includedTitle: string;
    included: { title: string; text: string }[];
    nextTitle: string;
    next: { title: string; text: string }[];
    cta: string;
    ctaNote: string;
    secondary: string;
    industryLink: (industry: string) => string;
  };
  /** Pop-up "Angebot anfordern" (Kontaktfelder kommen aus dict.contactForm). */
  offer: {
    title: string;
    intro: string;
    summaryTitle: string;
    company: string;
    city: string;
    cityPlaceholder: string;
    notes: string;
    notesPlaceholder: string;
    submit: string;
    close: string;
    successTitle: string;
    successText: string;
    reference: string;
    fallback: string;
  };
  /** Druck-/PDF-Fassung der Empfehlung (über den Druckdialog des Browsers). */
  pdf: { button: string; docTitle: string; created: (date: string) => string; selection: string; footer: string };
  /** Text, der im Kontaktformular als Nachricht vorausgefüllt wird. */
  prefill: {
    intro: string;
    audience: string;
    industry: string;
    participants: string;
    level: string;
    goals: string;
    delivery: string;
    scope: (units: number, recommended: boolean) => string;
  };
}

export interface StepText {
  title: string;
  hint: string;
}

export interface Option<T extends string> {
  value: T;
  label: string;
  hint?: string;
}
