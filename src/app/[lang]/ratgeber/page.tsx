import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { Section, Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/interactive/reveal";
import { PageCta } from "@/components/content/page-cta";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getGuideLabels, getGuides } from "@/content/ratgeber";
import { getDictionary } from "@/dictionaries";
import { hasLocale, lh } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getGuideLabels(lang);
  return pageMetadata({ lang, path: "/ratgeber", title: t.hubSeoTitle, absoluteTitle: true, description: t.hubText });
}

export default async function RatgeberPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = getGuideLabels(lang);
  const guides = getGuides(lang);

  return (
    <>
      <Section id="start" className="pt-24 lg:pt-32">
        <div className="max-w-3xl animate-rise">
          <Eyebrow>{t.hubEyebrow}</Eyebrow>
          <h1 className="kinetic font-display text-5xl leading-[1.05] text-balance sm:text-6xl lg:text-7xl">{t.hubTitle}</h1>
          <p className="mt-8 max-w-xl font-sans text-lg leading-relaxed text-paper-dim">{t.hubText}</p>
        </div>
      </Section>

      <Reveal as="section" className="border-t border-line">
        <Section>
          <div className="grid gap-px bg-line md:grid-cols-2">
            {guides.map((g) => (
              <Link key={g.slug} href={lh(lang, `/ratgeber/${g.slug}`)} className="flex flex-col bg-ink p-8 transition-colors hover:bg-ink-raised">
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-gold mb-3">{g.eyebrow}</p>
                <h2 className="font-display text-2xl text-paper mb-3 text-balance">{g.title}</h2>
                <p className="flex-1 font-sans text-sm leading-relaxed text-paper-dim mb-6">{g.description}</p>
                <span className="link-underline self-start font-sans text-sm uppercase tracking-[0.08em] text-gold">
                  {t.read} · {g.readingMinutes} {t.minutes}
                </span>
              </Link>
            ))}
          </div>
        </Section>
      </Reveal>

      <PageCta title={dict.home.kontaktCtaTitle} text={t.ctaText} href={lh(lang, "/kontakt")} label={t.cta} />
      <BreadcrumbJsonLd
        items={[
          { name: dict.home.lanes.start, path: lh(lang) },
          { name: t.hubEyebrow, path: lh(lang, "/ratgeber") },
        ]}
      />
    </>
  );
}
