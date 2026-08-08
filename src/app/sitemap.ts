import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getCourseTypes } from "@/content/course-types";
import { locales, lh, defaultLocale, type Locale } from "@/lib/i18n";

function alternates(path: string): Record<string, string> {
  const langs: Record<string, string> = {};
  for (const l of locales) langs[l] = `${SITE.url}${lh(l, path)}`;
  langs["x-default"] = `${SITE.url}${lh(defaultLocale, path)}`;
  return langs;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/kurse", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/einstufung", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/ueber-uns", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/nachhaltigkeit", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/kontakt", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/rechtliches/impressum", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/rechtliches/datenschutz", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/rechtliches/agb", priority: 0.2, changeFrequency: "yearly" as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const l of locales) {
    for (const p of staticPaths) {
      entries.push({
        url: `${SITE.url}${lh(l, p.path)}`,
        lastModified: now,
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
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: alternates(`/kurse/${course.slug}`) },
      });
      for (const format of course.formats) {
        entries.push({
          url: `${SITE.url}${lh(l, `/kurse/${course.slug}/${format.slug}`)}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.6,
          alternates: { languages: alternates(`/kurse/${course.slug}/${format.slug}`) },
        });
      }
    }
  }

  return entries;
}
