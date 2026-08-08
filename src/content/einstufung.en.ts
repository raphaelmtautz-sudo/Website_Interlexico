import type { AssessmentQuestion, LevelResult } from "./einstufung.de";

export const assessmentQuestions: AssessmentQuestion[] = [
  { prompt: "I understand meetings and phone calls without effort." },
  { prompt: "I write emails confidently and in the right tone." },
  { prompt: "I present and discuss specialist topics with confidence." },
  { prompt: "I negotiate and argue persuasively." },
  { prompt: "I respond spontaneously and fluently, even in small talk." },
];

export const answerOptions = [
  { label: "Not at all", value: 1 },
  { label: "Somewhat", value: 2 },
  { label: "Mostly", value: 3 },
  { label: "Completely", value: 4 },
] as const;

export function levelForScore(score: number): LevelResult {
  if (score <= 8)
    return {
      level: "A1–A2",
      title: "Building the basics",
      description:
        "A structured training builds confidence in everyday life and simple professional situations.",
    };
  if (score <= 13)
    return {
      level: "B1",
      title: "Confidence in daily work",
      description:
        "You're getting by — with targeted training, meetings, emails, and conversations become noticeably more fluent.",
    };
  if (score <= 17)
    return {
      level: "B2",
      title: "Confident, with fine-tuning",
      description:
        "A solid foundation. We work on precision, tone, and specialist vocabulary for demanding situations.",
    };
  return {
    level: "C1+",
    title: "Excellence & nuance",
    description:
      "A very strong level. Fine-tuning nuance, negotiations, and industry-specific language.",
  };
}
