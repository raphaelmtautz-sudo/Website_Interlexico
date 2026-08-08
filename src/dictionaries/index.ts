import "server-only";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "./de";
import { de } from "./de";
import { en } from "./en";
import { es } from "./es";

const dictionaries: Record<Locale, Dictionary> = { de, en, es };

export type { Dictionary };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
