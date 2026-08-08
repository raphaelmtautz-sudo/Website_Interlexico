import { CourseType } from "@/types/course";
import type { Locale } from "@/lib/i18n";

import { businessEnglish as businessEnglishDe } from "./business-english.de";
import { businessEnglish as businessEnglishEn } from "./business-english.en";
import { businessEnglish as businessEnglishEs } from "./business-english.es";
import { deutschAlsFremdsprache as dafDe } from "./deutsch-als-fremdsprache.de";
import { deutschAlsFremdsprache as dafEn } from "./deutsch-als-fremdsprache.en";
import { deutschAlsFremdsprache as dafEs } from "./deutsch-als-fremdsprache.es";

const byLocale: Record<Locale, CourseType[]> = {
  de: [businessEnglishDe, dafDe],
  en: [businessEnglishEn, dafEn],
  es: [businessEnglishEs, dafEs],
};

/** Kanonische Kurstyp-Slugs (identisch über alle Sprachen, nur der Inhalt ist übersetzt). */
export function getCourseTypes(locale: Locale): CourseType[] {
  return byLocale[locale];
}

export function getCourseType(locale: Locale, slug: string): CourseType | undefined {
  return byLocale[locale].find((c) => c.slug === slug);
}

export function getCourseFormat(locale: Locale, courseSlug: string, formatSlug: string) {
  const course = getCourseType(locale, courseSlug);
  const format = course?.formats.find((f) => f.slug === formatSlug);
  return course && format ? { course, format } : undefined;
}
