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
import { getLocalPage, LOCAL_PATH } from "@/content/local";
import { getDictionary } from "@/dictionaries";
import { hasLocale, lh } from "@/lib/i18n";

/**
 * Regionalseite München & Oberbayern (Suchintention „Business Englisch München“,
 * „Firmensprachkurse München“). Keine Preise — Angebot nur auf Anfrage.
 */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const page = getLocalPage(lang);
  return pageMetadata({ lang, path: LOCAL_PATH, title: page.seoTitle, absoluteTitle: true, description: page.description });
}

export default async function MuenchenPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const page = getLocalPage(lang);
  const dict = getDictionary(lang);
  const contact = lh(lang, "/kontakt");

  return (
    <>
      <StickyMobileCta href={contact} label={dict.courseType.jetztAnfragen} finalCtaId="anfrage" />

      <Section id="start" className="pt-24 lg:pt-32">
        <div className="max-w-3xl animate-rise">
          <Eyebrow>{page.eyebrow}</Eyebrow>
          <h1 className="font-display text-5xl leading-[1.05] text-balance sm:text-6xl">{page.title}</h1>
          <p className="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-paper-dim">{page.intro}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href={contact} trackEvent="cta_click" trackProps={{ cta: "beratung", place: "muenchen-hero" }}>
              {dict.courseType.ctaBeratungAnfragen}
            </Button>
            <Button href={lh(lang, "/konfigurator")} variant="secondary" trackEvent="cta_click" trackProps={{ cta: "konfigurator", place: "muenchen-hero" }}>
              {page.secondaryCta}
            </Button>
          </div>
        </div>
      </Section>

      <Reveal as="section" className="border-t border-line">
        <Section>
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl text-paper mb-6 text-balance">{page.onsiteTitle}</h2>
              <p className="font-sans leading-relaxed text-paper-dim">{page.onsiteText}</p>
            </div>
            <div>
              <ul className="flex flex-wrap gap-2">
                {page.places.map((p) => (
                  <li key={p} className="border border-line px-4 py-2 font-sans text-sm text-paper-dim">{p}</li>
                ))}
              </ul>
              <p className="mt-6 font-sans text-sm leading-relaxed text-paper-dim">{page.placesNote}</p>
            </div>
          </div>
        </Section>
      </Reveal>

      <Reveal as="section" className="border-t border-line">
        <Section>
          <h2 className="mb-10 font-display text-4xl text-paper text-balance">{page.offerTitle}</h2>
          <div className="grid gap-px bg-line md:grid-cols-3">
            {page.offers.map((o) => (
              <div key={o.title} className="flex flex-col bg-ink-raised p-8">
                <h3 className="font-display text-2xl text-paper mb-3">{o.title}</h3>
                <p className="mb-6 flex-1 font-sans text-sm leading-relaxed text-paper-dim">{o.text}</p>
                <Link href={lh(lang, o.href)} className="link-underline font-sans text-sm uppercase tracking-[0.08em] text-brand-text">
                  {o.linkLabel}
                </Link>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      <Reveal as="section" className="border-t border-line bg-brand/5">
        <Section>
          <h2 className="mb-10 max-w-2xl font-display text-4xl text-paper text-balance">{page.whyTitle}</h2>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {page.why.map((w) => (
              <div key={w.title} className="border-t border-gold-dim pt-6">
                <h3 className="font-sans text-base uppercase tracking-[0.06em] text-paper mb-2">{w.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-paper-dim">{w.text}</p>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      <Reveal as="section" id="faq" className="border-t border-line">
        <Section>
          <h2 className="mb-8 font-display text-3xl text-paper text-balance">{page.faqTitle}</h2>
          <div className="mx-auto max-w-3xl">
            <Accordion items={page.faq} />
          </div>
        </Section>
      </Reveal>

      <PageCta title={page.ctaTitle} text={page.ctaText} href={contact} label={dict.common.angebotAnfordern} />

      <ServiceJsonLd
        lang={lang}
        path={LOCAL_PATH}
        name={page.title}
        description={page.description}
        serviceType="Corporate language training"
        areaServed={[
          { "@type": "City", name: "München" },
          { "@type": "AdministrativeArea", name: "Oberbayern" },
        ]}
      />
      <FaqJsonLd items={page.faq} />
      <BreadcrumbJsonLd
        items={[
          { name: dict.home.lanes.start, path: lh(lang) },
          { name: page.name, path: lh(lang, LOCAL_PATH) },
        ]}
      />
    </>
  );
}
