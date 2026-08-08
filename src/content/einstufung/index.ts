import type { Locale } from "@/lib/i18n";
import type { AssessmentQuestion, LevelResult } from "../einstufung.de";
import * as de from "../einstufung.de";
import * as en from "../einstufung.en";
import * as es from "../einstufung.es";

export type { AssessmentQuestion, LevelResult };

interface AssessmentModule {
  assessmentQuestions: AssessmentQuestion[];
  answerOptions: readonly { label: string; value: number }[];
  levelForScore: (score: number) => LevelResult;
}

const byLocale: Record<Locale, AssessmentModule> = { de, en, es };

export function getAssessment(locale: Locale): AssessmentModule {
  return byLocale[locale];
}
