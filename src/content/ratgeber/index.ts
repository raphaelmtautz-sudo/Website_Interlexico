import type { Locale } from "@/lib/i18n";
import type { Guide, GuideLabels, GuideSection } from "./types";
import * as de from "./de";
import * as en from "./en";
import * as es from "./es";

export type { Guide, GuideLabels, GuideSection };

const byLocale: Record<Locale, { labels: GuideLabels; guides: Guide[] }> = { de, en, es };

export function getGuides(locale: Locale): Guide[] {
  return byLocale[locale].guides;
}

export function getGuide(locale: Locale, slug: string): Guide | undefined {
  return byLocale[locale].guides.find((g) => g.slug === slug);
}

export function getGuideLabels(locale: Locale): GuideLabels {
  return byLocale[locale].labels;
}
