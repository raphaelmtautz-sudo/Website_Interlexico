import type { AssessmentQuestion, LevelResult } from "./einstufung.de";

export const assessmentQuestions: AssessmentQuestion[] = [
  { prompt: "Entiendo reuniones y llamadas telefónicas sin esfuerzo." },
  { prompt: "Escribo correos electrónicos con seguridad y en el tono adecuado." },
  { prompt: "Presento y debato temas especializados con soltura." },
  { prompt: "Negocio y argumento de forma convincente." },
  { prompt: "Reacciono de forma espontánea y fluida, incluso en conversaciones informales." },
];

export const answerOptions = [
  { label: "No, en absoluto", value: 1 },
  { label: "Parcialmente", value: 2 },
  { label: "Mayormente sí", value: 3 },
  { label: "Totalmente", value: 4 },
] as const;

export function levelForScore(score: number): LevelResult {
  if (score <= 8)
    return {
      level: "A1–A2",
      title: "Consolidar las bases",
      description:
        "Una formación estructurada genera seguridad en el día a día y en situaciones profesionales sencillas.",
    };
  if (score <= 13)
    return {
      level: "B1",
      title: "Seguridad en el día a día laboral",
      description:
        "Se defiende bien — con una formación específica, las reuniones, los correos y las conversaciones ganarán fluidez notablemente.",
    };
  if (score <= 17)
    return {
      level: "B2",
      title: "Con soltura, y afinando detalles",
      description:
        "Una base sólida. Trabajamos la precisión, el tono y el vocabulario especializado para situaciones exigentes.",
    };
  return {
    level: "C1+",
    title: "Excelencia y matices",
    description:
      "Un nivel muy bueno. Perfeccionamos matices, negociaciones y el lenguaje específico de su sector.",
  };
}
