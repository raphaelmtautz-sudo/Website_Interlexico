import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Reveal } from "@/components/interactive/reveal";
import { StickyMobileCta } from "@/components/interactive/sticky-mobile-cta";
import { PageCta } from "@/components/content/page-cta";
import { BreadcrumbJsonLd, FaqJsonLd, ServiceJsonLd } from "@/components/seo/json-ld";
import { getIndustryLabels, getIndustryPage, getIndustryPages } from "@/content/branchen";
import { getDictionary } from "@/dictionaries";
import { hasLocale, lh, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((lang) => getIndustryPages(lang).map((i) => ({ lang, slug: i.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const page = getIndustryPage(lang, slug);
  if (!page) return {};
  return pageMetadata({ lang, path: `/branchen/${slug}`, title: page.seoTitle, absoluteTitle: true, description: page.description });
}

export default async function BranchePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const page = getIndustryPage(lang, slug);
  if (!page) notFound();
  const dict = getDictionary(lang);
  const t = getIndustryLabels(lang);
  const others = getIndustryPages(lang).filter((i) => i.slug !== slug);
  const contact = `${lh(lang, "/kontakt")}?kurs=business-english`;

  return (
    <>
      <StickyMobileCta href={contact} label={dict.courseType.jetztAnfragen} finalCtaId="anfrage" />

      <Section id="start" className="pt-24 lg:pt-32">
        <div className="max-w-3xl animate-rise">
          <Eyebrow>{page.eyebrow}</Eyebrow>
          <h1 className="kinetic font-display text-5xl leading-[1.05] text-balance sm:text-6xl">{page.title}</h1>
          <p className="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-paper-dim">{page.intro}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href={contact}>{dict.courseType.ctaBeratungAnfragen}</Button>
            <Button href={lh(lang, "/kurse/business-english")} variant="secondary">{t.course}</Button>
          </div>
        </div>
      </Section>

      <Reveal as="section" className="border-t border-line">
        <Section>
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl text-paper mb-6 text-balance">{t.situations}</h2>
              <ul className="space-y-3">
                {page.situations.map((s) => (
                  <li key={s} className="border-l border-gold pl-4 font-sans text-sm text-paper">{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-3xl text-paper mb-6 text-balance">{t.topics}</h2>
              <ul className="flex flex-wrap gap-2">
                {page.topics.map((s) => (
                  <li key={s} className="border border-line px-4 py-2 font-sans text-sm text-paper-dim">{s}</li>
                ))}
              </ul>
              <h2 className="mt-12 font-display text-3xl text-paper mb-4 text-balance">{t.formats}</h2>
              <p className="font-sans text-sm leading-relaxed text-paper-dim">{page.formats}</p>
            </div>
          </div>
        </Section>
      </Reveal>

      <Reveal as="section" id="faq" className="border-t border-line">
        <Section>
          <Eyebrow>{t.faq}</Eyebrow>
          <div className="mx-auto max-w-3xl">
            <Accordion items={page.faq} />
          </div>
        </Section>
      </Reveal>

      <Reveal as="section" className="border-t border-line">
        <Section>
          <Eyebrow>{t.more}</Eyebrow>
          <ul className="flex flex-wrap gap-2">
            {others.map((i) => (
              <li key={i.slug}>
                <Link href={lh(lang, `/branchen/${i.slug}`)} className="block border border-line px-4 py-2 font-sans text-sm text-paper-dim transition-colors hover:border-brand hover:text-paper">
                  {i.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </Reveal>

      <PageCta title={t.cta} text={t.ctaText} href={contact} label={dict.common.angebotAnfordern} />

      <ServiceJsonLd lang={lang} path={`/branchen/${slug}`} name={page.title} description={page.description} serviceType="Business English training" />
      <FaqJsonLd items={page.faq} />
      <BreadcrumbJsonLd
        items={[
          { name: dict.home.lanes.start, path: lh(lang) },
          { name: t.hubEyebrow, path: lh(lang, "/branchen") },
          { name: page.name, path: lh(lang, `/branchen/${slug}`) },
        ]}
      />
    </>
  );
}
