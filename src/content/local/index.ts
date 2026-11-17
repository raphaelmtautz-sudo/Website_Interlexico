import type { Locale } from "@/lib/i18n";
import type { LocalPage } from "./types";
import { page as de } from "./de";
import { page as en } from "./en";
import { page as es } from "./es";

export type { LocalPage };

/** Pfad (sprachneutral) der Regionalseite München & Oberbayern. */
export const LOCAL_PATH = "/sprachtraining-muenchen";

const byLocale: Record<Locale, LocalPage> = { de, en, es };

export function getLocalPage(locale: Locale): LocalPage {
  return byLocale[locale];
}
