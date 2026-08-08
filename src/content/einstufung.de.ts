/** Inhalte für den Einstufungs-Selbsttest (Orientierung, kein zertifizierter Test). */

export interface AssessmentQuestion {
  prompt: string;
}

/** 5 Selbsteinschätzungs-Aussagen, je 1 (trifft nicht zu) – 4 (trifft voll zu). */
export const assessmentQuestions: AssessmentQuestion[] = [
  { prompt: "Ich verstehe Meetings und Telefonate ohne Mühe." },
  { prompt: "Ich schreibe E-Mails sicher und im richtigen Ton." },
  { prompt: "Ich präsentiere und diskutiere Fachthemen souverän." },
  { prompt: "Ich verhandle und argumentiere überzeugend." },
  { prompt: "Ich reagiere spontan und flüssig, auch bei Small Talk." },
];

export const answerOptions = [
  { label: "Trifft nicht zu", value: 1 },
  { label: "Teilweise", value: 2 },
  { label: "Überwiegend", value: 3 },
  { label: "Trifft voll zu", value: 4 },
] as const;

export interface LevelResult {
  level: string;
  title: string;
  description: string;
}

/** Ordnet die Punktsumme (5–20) einer GER-Orientierung zu. */
export function levelForScore(score: number): LevelResult {
  if (score <= 8)
    return {
      level: "A1–A2",
      title: "Grundlagen festigen",
      description:
        "Ein strukturiertes Training baut Sicherheit im Alltag und in einfachen beruflichen Situationen auf.",
    };
  if (score <= 13)
    return {
      level: "B1",
      title: "Sicherheit im Berufsalltag",
      description:
        "Sie kommen zurecht — mit gezieltem Training werden Meetings, E-Mails und Gespräche deutlich flüssiger.",
    };
  if (score <= 17)
    return {
      level: "B2",
      title: "Souverän mit Feinschliff",
      description:
        "Solide Basis. Wir arbeiten an Präzision, Ton und Fachvokabular für anspruchsvolle Situationen.",
    };
  return {
    level: "C1+",
    title: "Exzellenz & Nuancen",
    description:
      "Sehr gutes Niveau. Feinschliff bei Nuancen, Verhandlungen und branchenspezifischer Fachsprache.",
  };
}
