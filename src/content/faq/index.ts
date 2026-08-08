import type { Locale } from "@/lib/i18n";
import type { FaqItem } from "../faq.de";
import { faq as de } from "../faq.de";
import { faq as en } from "../faq.en";
import { faq as es } from "../faq.es";

export type { FaqItem };

const byLocale: Record<Locale, FaqItem[]> = { de, en, es };

/** Statische FAQ-Inhalte je Sprache (Fallback, falls das CMS nicht erreichbar ist). */
export function getStaticFaq(locale: Locale): FaqItem[] {
  return byLocale[locale];
}
