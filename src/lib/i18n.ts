export const locales = ["de", "en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

export const localeNames: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  es: "Español",
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Baut einen sprachpräfixierten Pfad, z. B. lh("en", "/kontakt") -> "/en/kontakt". */
export function lh(locale: Locale, path: string = ""): string {
  return `/${locale}${path}`;
}
