import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { Section, Eyebrow } from "@/components/ui/section";
import { Accordion } from "@/components/ui/accordion";
import { Reveal } from "@/components/interactive/reveal";
import { PageCta } from "@/components/content/page-cta";
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { getGuideLabels } from "@/content/ratgeber";
import { getAllGuides, getAnyGuide, guideLocales } from "@/lib/guides";
import { renderLexical } from "@/lib/lexical-render";
import { getDictionary } from "@/dictionaries";
import { hasLocale, lh, locales } from "@/lib/i18n";

const dateTag = { de: "de-DE", en: "en-GB", es: "es-ES" } as const;

export async function generateStaticParams() {
  const all = await Promise.all(locales.map(async (lang) => (await getAllGuides(lang)).map((g) => ({ lang, slug: g.slug }))));
  return all.flat();
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const guide = await getAnyGuide(lang, slug);
  if (!guide) return {};
  return pageMetadata({
    lang,
    path: `/ratgeber/${slug}`,
    title: guide.seoTitle,
    absoluteTitle: true,
    description: guide.description,
    type: "article",
    languages: await guideLocales(slug),
  });
}

export default async function GuidePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const guide = await getAnyGuide(lang, slug);
  if (!guide) notFound();
  const others = (await getAllGuides(lang)).filter((g) => g.slug !== slug).slice(0, 3);
  const related = guide.related.length
    ? guide.related
    : others.map((g) => ({ label: g.title, path: `/ratgeber/${g.slug}` }));
  const dict = getDictionary(lang);
  const t = getGuideLabels(lang);
  const updated = new Date(`${guide.updated}T12:00:00Z`).toLocaleDateString(dateTag[lang], { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <Section id="start" className="pt-24 lg:pt-32">
        <article className="mx-auto max-w-3xl">
          <Eyebrow>{guide.eyebrow}</Eyebrow>
          <h1 className="kinetic font-display text-4xl leading-[1.08] text-balance sm:text-5xl lg:text-6xl">{guide.title}</h1>
          <p className="mt-6 font-sans text-sm text-paper-dim">
            {t.author} · {t.updated} <time dateTime={guide.updated}>{updated}</time> · {guide.readingMinutes} {t.minutes}
          </p>

          {/* Kurzantwort zuerst: die Passage, die Suchmaschinen und KI-Assistenten als Antwort übernehmen. */}
          <div className="mt-10 border-l-2 border-gold bg-ink-raised p-6">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-gold mb-2">{t.summary}</p>
            <p className="font-sans leading-relaxed text-paper">{guide.summary}</p>
          </div>

          {/* Artikel aus dem CMS: Rich Text in derselben Typografie wie die eingebauten Ratgeber. */}
          {guide.content ? (
            <div className="mt-12 space-y-5 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-3xl [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-2xl [&_ul]:list-none [&_ul]:space-y-3 [&_ol]:space-y-3 [&_li]:border-l [&_li]:border-gold [&_li]:pl-4 [&_li]:text-sm [&_li]:text-paper">
              {renderLexical(guide.content)}
            </div>
          ) : null}

          <div className="mt-12 space-y-12">
            {guide.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="font-display text-3xl text-paper mb-4 text-balance">{s.heading}</h2>
                <div className="space-y-4 font-sans leading-relaxed text-paper-dim">
                  {s.paragraphs.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
                </div>
                {s.list && (
                  <ul className="mt-5 space-y-3">
                    {s.list.map((li) => (
                      <li key={li} className="border-l border-gold pl-4 font-sans text-sm leading-relaxed text-paper">{li}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </article>
      </Section>

      {guide.faq.length > 0 && (
        <Reveal as="section" id="faq" className="border-t border-line">
          <Section>
            <Eyebrow>{t.faq}</Eyebrow>
            <div className="mx-auto max-w-3xl">
              <Accordion items={guide.faq} />
            </div>
          </Section>
        </Reveal>
      )}

      <Reveal as="section" className="border-t border-line">
        <Section>
          <Eyebrow>{t.related}</Eyebrow>
          <ul className="space-y-3">
            {related.map((r) => (
              <li key={r.path}>
                <Link href={lh(lang, r.path)} className="link-underline font-display text-2xl text-paper">{r.label}</Link>
              </li>
            ))}
          </ul>
        </Section>
      </Reveal>

      <PageCta title={dict.home.kontaktCtaTitle} text={t.ctaText} href={lh(lang, "/kontakt")} label={t.cta} />

      <ArticleJsonLd lang={lang} path={`/ratgeber/${slug}`} headline={guide.title} description={guide.description} published={guide.published} updated={guide.updated} author={t.author} />
      {guide.faq.length > 0 && <FaqJsonLd items={guide.faq} />}
      <BreadcrumbJsonLd
        items={[
          { name: dict.home.lanes.start, path: lh(lang) },
          { name: t.hubEyebrow, path: lh(lang, "/ratgeber") },
          { name: guide.title, path: lh(lang, `/ratgeber/${slug}`) },
        ]}
      />
    </>
  );
}
