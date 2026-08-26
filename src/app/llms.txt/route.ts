import { SITE } from "@/lib/site";
import { getCourseTypes } from "@/lib/cms";
import { getDictionary } from "@/dictionaries";
import { lh, type Locale } from "@/lib/i18n";

/**
 * llms.txt (siehe llmstxt.org) — kuratierte Klartext-Übersicht der Website
 * für LLM-/AI-Crawler (ChatGPT, Perplexity, Claude u. a.), analog zu
 * robots.txt/sitemap.xml für klassische Suchmaschinen-Crawler.
 *
 * Sprachvarianten: /llms.txt (Deutsch, Primärsprache), /en/llms.txt,
 * /es/llms.txt (siehe src/app/en/llms.txt/route.ts, src/app/es/llms.txt/route.ts).
 * Das CMS pflegt aktuell nur Deutsch redaktionell vollständig (siehe
 * lib/cms.ts) — die EN/ES-Varianten nutzen die statisch übersetzten
 * Dictionary-Texte, keine CMS-Live-Daten.
 */
const SECTION_LABELS: Record<Locale, { kurse: string; unternehmen: string; kontakt: string }> = {
  de: { kurse: "Kurse", unternehmen: "Unternehmen", kontakt: "Kontakt" },
  en: { kurse: "Courses", unternehmen: "Company", kontakt: "Contact" },
  es: { kurse: "Cursos", unternehmen: "Empresa", kontakt: "Contacto" },
};

const LANG_NAMES: Record<Locale, string> = { de: "Deutsch", en: "English", es: "Español" };

export async function buildLlmsTxt(lang: Locale): Promise<string> {
  const dict = getDictionary(lang);
  const labels = SECTION_LABELS[lang];
  const courses = (await getCourseTypes(lang)).filter((c) => c.status === "aktiv");

  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${dict.meta.description}`,
    "",
    dict.home.heroSubtitle,
    "",
    `## ${labels.kurse}`,
    ...courses.map(
      (c) => `- [${c.name}](${SITE.url}${lh(lang, `/kurse/${c.slug}`)}): ${c.seo.description}`,
    ),
    "",
    `## ${labels.unternehmen}`,
    `- [${dict.nav.ueberUns}](${SITE.url}${lh(lang, "/ueber-uns")})`,
    `- [${dict.nav.interlexicoOne}](${SITE.url}${lh(lang, "/interlexico-one")})`,
    `- [${dict.nav.nachhaltigkeit}](${SITE.url}${lh(lang, "/nachhaltigkeit")})`,
    `- [${dict.nav.einstufung}](${SITE.url}${lh(lang, "/einstufung")})`,
    `- [${dict.nav.karriere}](${SITE.url}${lh(lang, "/karriere")})`,
    `- [${dict.nav.kontakt}](${SITE.url}${lh(lang, "/kontakt")}): ${dict.kontakt.text}`,
    "",
    `## ${labels.kontakt}`,
    `- E-Mail: ${SITE.email}`,
    `- ${labels.kontakt}: ${SITE.inquiryEmail}`,
    `- ${lang === "de" ? "Sprachen der Website" : lang === "en" ? "Website languages" : "Idiomas del sitio"}: ${(["de", "en", "es"] as Locale[]).map((l) => LANG_NAMES[l]).join(", ")}`,
    `- ${lang === "de" ? "Einsatzgebiet" : lang === "en" ? "Area served" : "Área de cobertura"}: ${SITE.areaServed.join(", ")}`,
    "",
    (["de", "en", "es"] as Locale[])
      .filter((l) => l !== lang)
      .map((l) => `${SITE.url}${l === "de" ? "" : `/${l}`}/llms.txt`)
      .join(" · "),
  ];

  return lines.join("\n") + "\n";
}

export async function GET() {
  return new Response(await buildLlmsTxt("de"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
