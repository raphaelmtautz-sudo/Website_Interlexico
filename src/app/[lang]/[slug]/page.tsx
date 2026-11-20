import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound, redirect, permanentRedirect } from "next/navigation";
import { Section } from "@/components/ui/section";
import { getPage, getRedirect } from "@/lib/cms";
import { renderLexical } from "@/lib/lexical-render";
import { lh, hasLocale } from "@/lib/i18n";

// Freie CMS-Landingpages (siehe "pages"-Collection in interlexico-cms).
// Liegt bewusst auf dieser Ebene: Next.js gibt fest programmierten Routen
// wie /[lang]/kurse oder /[lang]/kontakt immer Vorrang vor diesem
// Catch-all-Segment, ein CMS-Slug kann also keine bestehende Seite überschreiben.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const page = await getPage(slug, lang);
  if (!page) return {};
  const title = page.seoTitle || page.title;
  return pageMetadata({ lang, path: `/${slug}`, title, description: page.seoDescription, image: page.ogImageUrl });
}

export default async function CmsPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const page = await getPage(slug, lang);
  if (!page) {
    const found = await getRedirect(`/${slug}`);
    if (found) {
      // Relative Ziele ohne Sprachpräfix in der aktuellen Sprache auflösen
      // ("/kurse" -> "/de/kurse"), sonst entstünde ein zweiter Redirect über den Proxy.
      const to =
        found.to.startsWith("/") && !/^\/(de|en|es)(\/|$)/.test(found.to)
          ? lh(lang, found.to === "/" ? "" : found.to)
          : found.to;
      (found.permanent ? permanentRedirect : redirect)(to);
    }
    notFound();
  }

  return (
    <Section className="pt-24 lg:pt-32">
      <h1 className="kinetic font-display text-5xl mb-8 text-balance sm:text-6xl">{page.title}</h1>
      <div className="max-w-3xl space-y-6">{renderLexical(page.content, { lang })}</div>
    </Section>
  );
}
