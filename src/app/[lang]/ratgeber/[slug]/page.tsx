import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { Section, Eyebrow } from "@/components/ui/section";
import { Accordion } from "@/components/ui/accordion";
import { Reveal } from "@/components/interactive/reveal";
import { PageCta } from "@/components/content/page-cta";
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { getGuide, getGuideLabels, getGuides } from "@/content/ratgeber";
import { getDictionary } from "@/dictionaries";
import { hasLocale, lh, locales } from "@/lib/i18n";

const dateTag = { de: "de-DE", en: "en-GB", es: "es-ES" } as const;

export function generateStaticParams() {
  return locales.flatMap((lang) => getGuides(lang).map((g) => ({ lang, slug: g.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const guide = getGuide(lang, slug);
  if (!guide) return {};
  return pageMetadata({ lang, path: `/ratgeber/${slug}`, title: guide.seoTitle, absoluteTitle: true, description: guide.description, type: "article" });
}

export default async function GuidePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const guide = getGuide(lang, slug);
  if (!guide) notFound();
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

      <Reveal as="section" id="faq" className="border-t border-line">
        <Section>
          <Eyebrow>{t.faq}</Eyebrow>
          <div className="mx-auto max-w-3xl">
            <Accordion items={guide.faq} />
          </div>
        </Section>
      </Reveal>

      <Reveal as="section" className="border-t border-line">
        <Section>
          <Eyebrow>{t.related}</Eyebrow>
          <ul className="space-y-3">
            {guide.related.map((r) => (
              <li key={r.path}>
                <Link href={lh(lang, r.path)} className="link-underline font-display text-2xl text-paper">{r.label}</Link>
              </li>
            ))}
          </ul>
        </Section>
      </Reveal>

      <PageCta title={dict.home.kontaktCtaTitle} text={t.ctaText} href={lh(lang, "/kontakt")} label={t.cta} />

      <ArticleJsonLd lang={lang} path={`/ratgeber/${slug}`} headline={guide.title} description={guide.description} published={guide.published} updated={guide.updated} author={t.author} />
      <FaqJsonLd items={guide.faq} />
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
