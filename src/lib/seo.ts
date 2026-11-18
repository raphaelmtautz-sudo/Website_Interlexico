import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { locales, lh, defaultLocale, type Locale } from "@/lib/i18n";

export const ogLocale: Record<Locale, string> = { de: "de_DE", en: "en_US", es: "es_ES" };

/** hreflang-Cluster für einen sprachneutralen Pfad (z. B. "/kontakt"). */
export function languageAlternates(path: string = "", only?: readonly Locale[]): Record<string, string> {
  const langs: Record<string, string> = {};
  const avail = only ?? locales;
  for (const l of avail) langs[l] = lh(l, path);
  // x-default nur, wenn es die Standardsprache gibt, sonst die erste vorhandene.
  langs["x-default"] = lh(avail.includes(defaultLocale) ? defaultLocale : avail[0], path);
  return langs;
}

/** Kürzt auf Snippet-Länge (~160 Zeichen) an einer Wortgrenze. */
function snippet(text: string | undefined, max = 158): string | undefined {
  if (!text) return text;
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—–-]\s*$/, "")}…`;
}

/**
 * Vollständige Seiten-Metadaten. Next.js merged `alternates`/`openGraph`/
 * `twitter` NICHT mit dem Layout, sondern ersetzt sie komplett — setzt eine
 * Seite nur `alternates.canonical`, fehlen die hreflang-Links; setzt sie
 * `openGraph`, fehlen og:image/og:locale/siteName. Deshalb baut jede Seite
 * ihre Metadaten über diesen Helper statt einzelne Felder zu setzen.
 *
 * `path` ist sprachneutral ("/kontakt"), das Sprachpräfix kommt von `lang`.
 */
export function pageMetadata({
  lang,
  path,
  title,
  absoluteTitle = false,
  description,
  type = "website",
  image,
  languages,
}: {
  lang: Locale;
  path: string;
  title: string;
  /** true = Titel enthält die Marke schon, Template " | Interlexico" nicht anhängen. */
  absoluteTitle?: boolean;
  description?: string;
  type?: "website" | "article";
  /** Eigenes OG-Bild (z. B. aus dem CMS), sonst das generierte Standardbild. */
  image?: string;
  /** Nur diese Sprachen existieren (z. B. CMS-Ratgeber ohne Übersetzung). */
  languages?: readonly Locale[];
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE.name}`;
  const url = lh(lang, path);
  const images = [image ?? { url: lh(lang, "/opengraph-image"), width: 1200, height: 630, type: "image/png" }];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: snippet(description),
    alternates: { canonical: url, languages: languageAlternates(path, languages) },
    openGraph: {
      type,
      siteName: SITE.name,
      locale: ogLocale[lang],
      alternateLocale: (languages ?? locales).filter((l) => l !== lang).map((l) => ogLocale[l]),
      title: fullTitle,
      description: snippet(description, 200),
      url,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: snippet(description, 200),
      images,
    },
  };
}
