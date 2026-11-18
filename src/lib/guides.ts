import type { Guide } from "@/content/ratgeber";
import { getGuides as getStaticGuides } from "@/content/ratgeber";
import { locales, type Locale } from "@/lib/i18n";
import { mapTeam, mediaSrc } from "@/lib/cms";

/**
 * Ratgeber = eingebaute Artikel (src/content/ratgeber) + Artikel aus dem CMS
 * (Sammlung "guides"). Ein CMS-Artikel mit demselben Slug ersetzt den
 * eingebauten. Eine Sprache gibt es nur, wenn Titel, Kurzantwort und Inhalt
 * dieser Sprache im CMS gefüllt sind — keine halb übersetzten Seiten.
 */
const CMS_URL = process.env.CMS_URL ?? "http://127.0.0.1:3020";
const REVALIDATE = 300;
const SUFFIX: Record<Locale, "De" | "En" | "Es"> = { de: "De", en: "En", es: "Es" };

type CmsGuide = Record<string, unknown> & {
  slug: string;
  publishedAt?: string | null;
  reviewedAt?: string | null;
  readingMinutes?: number | null;
  createdAt: string;
  updatedAt: string;
};

async function fetchCmsGuides(): Promise<CmsGuide[]> {
  try {
    const res = await fetch(`${CMS_URL}/api/guides?where[_status][equals]=published&limit=200&depth=2`, {
      next: { revalidate: REVALIDATE, tags: ["guides"] },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { docs?: CmsGuide[] };
    return data.docs ?? [];
  } catch {
    return [];
  }
}

function lexicalText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { text?: string; children?: unknown[]; root?: unknown };
  if (n.root) return lexicalText(n.root);
  return (n.text ?? "") + " " + (n.children ?? []).map(lexicalText).join(" ");
}

const day = (iso?: string | null) => (iso ? iso.slice(0, 10) : undefined);

function mapCmsGuide(doc: CmsGuide, locale: Locale, fallback?: Guide): Guide | null {
  const s = SUFFIX[locale];
  const title = doc[`title${s}`] as string | undefined;
  const summary = doc[`summary${s}`] as string | undefined;
  const content = doc[`content${s}`];
  if (!title || !summary || !content) return null;
  const words = (summary + " " + lexicalText(content)).split(/\s+/).filter(Boolean).length;
  const faq = ((doc[`faq${s}`] as { question?: string; answer?: string }[] | undefined) ?? [])
    .filter((f) => f.question && f.answer)
    .map((f) => ({ question: f.question as string, answer: f.answer as string }));
  return {
    slug: doc.slug,
    eyebrow: (doc[`eyebrow${s}`] as string) || fallback?.eyebrow || "",
    title,
    seoTitle: (doc[`seoTitle${s}`] as string) || `${title} | Interlexico`,
    description: (doc[`seoDescription${s}`] as string) || summary,
    published: day(doc.publishedAt) ?? fallback?.published ?? day(doc.createdAt)!,
    updated: day(doc.reviewedAt) ?? day(doc.updatedAt)!,
    readingMinutes: doc.readingMinutes || Math.max(1, Math.round(words / 200)),
    summary,
    sections: [],
    content,
    faq,
    related: fallback?.related ?? [],
    author: doc.author && typeof doc.author === "object" ? toAuthor(doc.author as never, locale) : undefined,
    image: doc.image && typeof doc.image === "object" ? mediaSrc(doc.image, "card") : undefined,
  };
}

function toAuthor(raw: Parameters<typeof mapTeam>[0], locale: Locale): Guide["author"] {
  const m = mapTeam(raw, locale);
  return { name: m.name, role: m.role, bio: m.bio, qualifications: m.qualifications, photo: m.photo, linkedin: m.linkedin };
}

/**
 * Entwurf eines Ratgebers für die Vorschau (Draft-Mode). Holt die neueste,
 * auch unveröffentlichte Fassung mit dem technischen API-Key der Website.
 */
export async function getDraftGuide(locale: Locale, slug: string): Promise<Guide | undefined> {
  const key = process.env.CMS_PREVIEW_API_KEY;
  if (!key) return undefined;
  try {
    const res = await fetch(`${CMS_URL}/api/guides?where[slug][equals]=${encodeURIComponent(slug)}&draft=true&limit=1&depth=2`, {
      headers: { Authorization: `users API-Key ${key}` },
      cache: "no-store",
    });
    if (!res.ok) return undefined;
    const doc = ((await res.json()) as { docs?: CmsGuide[] }).docs?.[0];
    const fallback = getStaticGuides(locale).find((g) => g.slug === slug);
    return doc ? (mapCmsGuide(doc, locale, fallback) ?? undefined) : undefined;
  } catch {
    return undefined;
  }
}

/** Alle Ratgeber einer Sprache, neueste (zuletzt geprüft) zuerst. */
export async function getAllGuides(locale: Locale): Promise<Guide[]> {
  const statics = getStaticGuides(locale);
  const cms = await fetchCmsGuides();
  const bySlug = new Map(statics.map((g) => [g.slug, g]));
  for (const doc of cms) {
    const mapped = mapCmsGuide(doc, locale, bySlug.get(doc.slug));
    if (mapped) bySlug.set(doc.slug, mapped);
  }
  return [...bySlug.values()].sort((a, b) => b.updated.localeCompare(a.updated));
}

export async function getAnyGuide(locale: Locale, slug: string): Promise<Guide | undefined> {
  return (await getAllGuides(locale)).find((g) => g.slug === slug);
}

/** Sprachen, in denen es den Ratgeber gibt (für hreflang/Sitemap). */
export async function guideLocales(slug: string): Promise<Locale[]> {
  const out: Locale[] = [];
  for (const l of locales) if (await getAnyGuide(l, slug)) out.push(l);
  return out;
}
