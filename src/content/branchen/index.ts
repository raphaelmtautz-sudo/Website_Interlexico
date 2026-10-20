import type { Locale } from "@/lib/i18n";
import type { IndustryLabels, IndustryPage } from "./types";
import * as de from "./de";
import * as en from "./en";
import * as es from "./es";

export type { IndustryLabels, IndustryPage };

const byLocale: Record<Locale, { labels: IndustryLabels; industries: IndustryPage[] }> = { de, en, es };

export function getIndustryPages(locale: Locale): IndustryPage[] {
  return byLocale[locale].industries;
}

export function getIndustryPage(locale: Locale, slug: string): IndustryPage | undefined {
  return byLocale[locale].industries.find((i) => i.slug === slug);
}

export function getIndustryLabels(locale: Locale): IndustryLabels {
  return byLocale[locale].labels;
}

/** Slug zur Branchenseite für einen Branchennamen (Chips auf Start-/Kursseite), sonst undefined. */
export function industrySlugByName(locale: Locale, name: string): string | undefined {
  const n = name.trim().toLowerCase();
  return byLocale[locale].industries.find((i) => i.name.toLowerCase() === n)?.slug;
}
