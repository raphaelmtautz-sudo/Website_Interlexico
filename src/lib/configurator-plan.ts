/**
 * Empfehlungslogik des Trainings-Konfigurators (reine Funktionen, ohne Texte).
 *
 * Bewusst KEINE Preise: Interlexico kalkuliert jedes Training individuell
 * (Entscheidung des Betreibers). Der Konfigurator liefert eine fachliche
 * Empfehlung — Format, Gruppen, Umfang, Trainingsschwerpunkte — und übergibt
 * die Auswahl an die Anfrage.
 */

export const MAX_PER_GROUP = 7;
export const MAX_PARTICIPANTS = 60;

export const AUDIENCES = ["fachkraefte", "team", "fuehrung"] as const;
export type Audience = (typeof AUDIENCES)[number];

export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2", "gemischt", "unbekannt"] as const;
export type Level = (typeof LEVELS)[number];

export const GOALS = [
  "meetings",
  "praesentation",
  "verhandlung",
  "email",
  "telefon",
  "kunden",
  "fachsprache",
  "smalltalk",
] as const;
export type Goal = (typeof GOALS)[number];

export const DELIVERIES = ["online", "vorort", "hybrid"] as const;
export type Delivery = (typeof DELIVERIES)[number];

export const SCOPES = ["empfehlung", "30", "60", "90"] as const;
export type Scope = (typeof SCOPES)[number];

export type FormatKind = "einzel" | "gruppe" | "klasse";

export interface ConfiguratorState {
  courseSlug: string;
  audience: Audience | "";
  industry: string;
  participants: number;
  level: Level | "";
  goals: Goal[];
  delivery: Delivery | "";
  scope: Scope;
}

export interface Plan {
  kind: FormatKind;
  /** Teilnehmende je Gruppe (bei Einzel: [1]). */
  groups: number[];
  /** Führungskräfte in kleiner Runde: Einzelcoaching als Alternative nennen. */
  suggestCoaching: boolean;
  /** Gemischte Niveaus: nach Einstufung in niveaugleiche Gruppen aufteilen. */
  splitByLevel: boolean;
  /** Empfohlener Umfang in Unterrichtseinheiten. */
  units: 30 | 60 | 90;
  /** true = vom Konfigurator empfohlen, false = vom Kunden gewählt. */
  unitsRecommended: boolean;
  /** Grund für den empfohlenen Umfang (Schlüssel für den Text). */
  unitsReason: "basis" | "aufbau" | "feinschliff" | "offen" | "gewaehlt";
}

export function clampParticipants(v: number): number {
  return Math.max(1, Math.min(MAX_PARTICIPANTS, Math.round(Number.isFinite(v) ? v : 1)));
}

export function splitGroups(participants: number): number[] {
  const n = clampParticipants(participants);
  if (n === 1) return [1];
  const count = Math.ceil(n / MAX_PER_GROUP);
  const base = Math.floor(n / count);
  const rem = n % count;
  return Array.from({ length: count }, (_, i) => base + (i < rem ? 1 : 0));
}

function recommendUnits(level: Level | "", goals: Goal[]): { units: 30 | 60 | 90; reason: Plan["unitsReason"] } {
  // Orientierung, keine Zusage: final entscheidet die Einstufung. Grundlagen
  // brauchen mehr Zeit (Cambridge: ~200 angeleitete Lernstunden je GER-Stufe),
  // auf hohem Niveau geht es um Feinschliff für konkrete Situationen.
  let units: 30 | 60 | 90;
  let reason: Plan["unitsReason"];
  if (level === "A1" || level === "A2") {
    units = 90;
    reason = "basis";
  } else if (level === "C1" || level === "C2") {
    units = 30;
    reason = "feinschliff";
  } else if (level === "B1" || level === "B2") {
    units = 60;
    reason = "aufbau";
  } else {
    // gemischt / unbekannt / keine Angabe: mittlerer Umfang, nach Einstufung anpassen
    units = 60;
    reason = "offen";
  }
  // Viele Schwerpunkte gleichzeitig brauchen mehr Zeit.
  if (goals.length >= 5 && units < 90) units = units === 30 ? 60 : 90;
  return { units, reason };
}

export function buildPlan(s: ConfiguratorState): Plan {
  const n = clampParticipants(s.participants);
  const groups = splitGroups(n);
  const kind: FormatKind = n === 1 ? "einzel" : groups.length === 1 ? "gruppe" : "klasse";
  const rec = recommendUnits(s.level, s.goals);
  const chosen = s.scope !== "empfehlung";
  return {
    kind,
    groups,
    suggestCoaching: s.audience === "fuehrung" && n > 1 && n <= 3,
    splitByLevel: s.level === "gemischt" && n > 1,
    units: chosen ? (Number(s.scope) as 30 | 60 | 90) : rec.units,
    unitsRecommended: !chosen,
    unitsReason: chosen ? "gewaehlt" : rec.reason,
  };
}

/** Format-Slug der Kursseiten (content/course-types) zum Plan. */
export function formatSlugFor(kind: FormatKind): string {
  return kind === "einzel" ? "einzelunterricht" : kind === "gruppe" ? "gruppentraining" : "klassentraining";
}

/** Query-Parameter für die Übergabe an /kontakt (keine personenbezogenen Daten). */
export function toContactParams(s: ConfiguratorState, plan: Plan): URLSearchParams {
  const p = new URLSearchParams();
  p.set("quelle", "konfigurator");
  p.set("kurs", s.courseSlug);
  p.set("teilnehmer", String(clampParticipants(s.participants)));
  p.set("format", plan.kind === "einzel" ? "einzel" : "gruppe");
  if (s.audience) p.set("zg", s.audience);
  if (s.industry) p.set("branche", s.industry);
  if (s.level) p.set("niveau", s.level);
  if (s.goals.length) p.set("ziele", s.goals.join(","));
  if (s.delivery) p.set("ort", s.delivery);
  p.set("ue", String(plan.units));
  if (plan.unitsRecommended) p.set("umfang", "empfehlung");
  return p;
}

/** Liest die Übergabe-Parameter defensiv wieder ein (Kontaktformular). */
export function fromContactParams(get: (k: string) => string | null): Partial<ConfiguratorState> | null {
  if (get("quelle") !== "konfigurator") return null;
  const pick = <T extends string>(v: string | null, allowed: readonly T[]): T | "" =>
    v && (allowed as readonly string[]).includes(v) ? (v as T) : "";
  const goals = (get("ziele") ?? "")
    .split(",")
    .filter((g): g is Goal => (GOALS as readonly string[]).includes(g));
  const ue = get("ue");
  return {
    courseSlug: get("kurs") ?? "",
    participants: clampParticipants(Number(get("teilnehmer") ?? "1")),
    audience: pick(get("zg"), AUDIENCES),
    industry: (get("branche") ?? "").slice(0, 80),
    level: pick(get("niveau"), LEVELS),
    goals,
    delivery: pick(get("ort"), DELIVERIES),
    scope: get("umfang") === "empfehlung" ? "empfehlung" : ue === "30" || ue === "60" || ue === "90" ? ue : "empfehlung",
  };
}
