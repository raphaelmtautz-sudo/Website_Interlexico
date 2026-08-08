import type { Locale } from "@/lib/i18n";
import { industries as de } from "../industries.de";
import { industries as en } from "../industries.en";
import { industries as es } from "../industries.es";

const byLocale: Record<Locale, string[]> = { de, en, es };

export function getIndustries(locale: Locale): string[] {
  return byLocale[locale];
}
