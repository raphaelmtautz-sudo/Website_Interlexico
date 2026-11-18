import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getCourseTypes } from "@/content/course-types";
import { getIndustryPages } from "@/content/branchen";
import { getGuides } from "@/content/ratgeber";
import { getPosts, getSiteSettings } from "@/lib/cms";
import { locales, lh, defaultLocale, type Locale } from "@/lib/i18n";

function alternates(path: string): Record<string, string> {
  const langs: Record<string, string> = {};
  for (const l of locales) langs[l] = `${SITE.url}${lh(l, path)}`;
  langs["x-default"] = `${SITE.url}${lh(defaultLocale, path)}`;
  return langs;
}

// Datum der letzten INHALTLICHEN Änderung je Seite (YYYY-MM-DD). Bei Text-
// änderungen hier mitpflegen. Früher stand überall die Deploy-Zeit — ein lastmod,
// das sich bei jedem Deploy für alle Seiten ändert, ignoriert Google komplett.
const CONTENT_UPDATED: Record<string, string> = {
  "": "2026-11-17",
  "/kurse": "2026-11-18",
  "/kurse/*": "2026-11-18",
  "/branchen": "2026-10-20",
  "/branchen/*": "2026-11-17",
  "/sprachtraining-muenchen": "2026-11-17",
  "/executive-language-coaching": "2026-11-18",
  "/interkulturelle-kommunikation": "2026-11-18",
  "/ratgeber": "2026-11-17",
  "/interlexico-one": "2026-11-18",
  "/einstufung": "2026-10-20",
  "/konfigurator": "2026-11-17",
  "/ueber-uns": "2026-11-18",
  "/nachhaltigkeit": "2026-10-20",
  "/karriere": "2026-11-18",
  "/kontakt": "2026-11-18",
  "/demo": "2026-10-20",
  "/rechtliches/impressum": "2026-11-18",
  "/rechtliches/datenschutz": "2026-10-20",
  "/rechtliches/agb": "2026-11-18",
};
const FALLBACK_UPDATED = "2026-10-20";
function updated(path: string): Date {
  const key = path in CONTENT_UPDATED ? path : `/${path.split("/")[1]}/*`;
  return new Date(`${CONTENT_UPDATED[key] ?? CONTENT_UPDATED[`/${path.split("/")[1]}`] ?? FALLBACK_UPDATED}T12:00:00Z`);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { blogEnabled } = await getSiteSettings();

  const staticPaths = [
    // Leerer Pfad statt "/" — lh(l, "/") würde "/de/" ergeben (Trailing
    // Slash), die Seite läuft aber unter "/de" (trailingSlash: false,
    // "/de/" 308-redirected auf "/de"). Sitemap-URLs dürfen nicht redirecten.
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/kurse", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/branchen", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/sprachtraining-muenchen", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/executive-language-coaching", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/interkulturelle-kommunikation", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/ratgeber", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/interlexico-one", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/einstufung", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/konfigurator", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/ueber-uns", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/nachhaltigkeit", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/karriere", priority: 0.5, changeFrequency: "monthly" as const },
    ...(blogEnabled ? [{ path: "/blog", priority: 0.5, changeFrequency: "weekly" as const }] : []),
    { path: "/kontakt", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/demo", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/rechtliches/impressum", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/rechtliches/datenschutz", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/rechtliches/agb", priority: 0.2, changeFrequency: "yearly" as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const l of locales) {
    for (const p of staticPaths) {
      entries.push({
        url: `${SITE.url}${lh(l, p.path)}`,
        lastModified: updated(p.path),
        changeFrequency: p.changeFrequency,
        priority: p.priority,
        alternates: { languages: alternates(p.path) },
      });
    }

    // Nur aktive Kurstypen (und ihre Formate) sind öffentlich indexierbar.
    for (const course of getCourseTypes(l as Locale)) {
      if (course.status !== "aktiv") continue;
      entries.push({
        url: `${SITE.url}${lh(l, `/kurse/${course.slug}`)}`,
        lastModified: updated(`/kurse/${course.slug}`),
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: alternates(`/kurse/${course.slug}`) },
      });
      for (const format of course.formats) {
        entries.push({
          url: `${SITE.url}${lh(l, `/kurse/${course.slug}/${format.slug}`)}`,
          lastModified: updated(`/kurse/${course.slug}/${format.slug}`),
          changeFrequency: "monthly",
          priority: 0.6,
          alternates: { languages: alternates(`/kurse/${course.slug}/${format.slug}`) },
        });
      }
    }

    for (const industry of getIndustryPages(l as Locale)) {
      entries.push({
        url: `${SITE.url}${lh(l, `/branchen/${industry.slug}`)}`,
        lastModified: updated(`/branchen/${industry.slug}`),
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: alternates(`/branchen/${industry.slug}`) },
      });
    }

    for (const guide of getGuides(l as Locale)) {
      entries.push({
        url: `${SITE.url}${lh(l, `/ratgeber/${guide.slug}`)}`,
        lastModified: new Date(`${guide.updated}T12:00:00Z`),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: alternates(`/ratgeber/${guide.slug}`) },
      });
    }

    if (blogEnabled) {
      const posts = await getPosts(l as Locale);
      for (const post of posts) {
        entries.push({
          url: `${SITE.url}${lh(l, `/blog/${post.slug}`)}`,
          lastModified: post.publishedAt ? new Date(post.publishedAt) : updated("/blog"),
          changeFrequency: "monthly",
          priority: 0.4,
          alternates: { languages: alternates(`/blog/${post.slug}`) },
        });
      }
    }
  }

  return entries;
}
