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

/**
 * Nur die benötigten Teile des Wörterbuchs an Client-Komponenten geben — sonst
 * landet das komplette Wörterbuch (~37 KB) im HTML jeder Seite.
 */
export function pickDict<K extends keyof Dictionary>(dict: Dictionary, ...keys: K[]): Pick<Dictionary, K> {
  const out = {} as Pick<Dictionary, K>;
  for (const k of keys) out[k] = dict[k];
  return out;
}
