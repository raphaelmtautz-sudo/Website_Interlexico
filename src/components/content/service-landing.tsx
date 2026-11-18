import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Reveal } from "@/components/interactive/reveal";
import { StickyMobileCta } from "@/components/interactive/sticky-mobile-cta";
import { PageCta } from "@/components/content/page-cta";
import { BreadcrumbJsonLd, FaqJsonLd, ServiceJsonLd } from "@/components/seo/json-ld";
import type { ServicePage } from "@/content/services";
import { getDetailLabels } from "@/content/course-details";
import type { Dictionary } from "@/dictionaries";
import { lh, type Locale } from "@/lib/i18n";

/** Leistungsseite (Executive Language Coaching, Interkulturelle Kommunikation). */
export function ServiceLanding({ page, lang, dict }: { page: ServicePage; lang: Locale; dict: Dictionary }) {
  const contact = lh(lang, "/kontakt");
  const path = `/${page.slug}`;
  const dl = getDetailLabels(lang);

  return (
    <>
      <StickyMobileCta href={contact} label={dict.courseType.jetztAnfragen} finalCtaId="anfrage" />

      <Section id="start" className="pt-24 lg:pt-32">
        <div className="max-w-3xl animate-rise">
          <Eyebrow>{page.eyebrow}</Eyebrow>
          <h1 className="font-display text-5xl leading-[1.05] text-balance sm:text-6xl">{page.title}</h1>
          <p className="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-paper-dim">{page.answer}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href={contact} trackEvent="cta_click" trackProps={{ cta: "beratung", place: page.slug }}>
              {dict.courseType.ctaBeratungAnfragen}
            </Button>
          </div>
        </div>
      </Section>

      <section className="border-t border-line">
        <Section>
          <h2 className="mb-8 font-display text-3xl text-paper">{dl.glance}</h2>
          <dl className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {page.facts.map((f) => (
              <div key={f.label} className="bg-ink-raised p-5">
                <dt className="font-sans text-xs uppercase tracking-[0.12em] text-gold mb-2">{f.label}</dt>
                <dd className="font-sans text-sm leading-relaxed text-paper">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </section>

      <Reveal as="section" className="border-t border-line">
        <Section>
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl text-paper mb-6 text-balance">{page.forWhomTitle}</h2>
              <ul className="space-y-3">
                {page.forWhom.map((s) => (
                  <li key={s} className="border-l border-gold pl-4 font-sans text-sm text-paper">{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-3xl text-paper mb-6 text-balance">{page.topicsTitle}</h2>
              <ul className="flex flex-wrap gap-2">
                {page.topics.map((s) => (
                  <li key={s} className="border border-line px-4 py-2 font-sans text-sm text-paper-dim">{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </Reveal>

      <Reveal as="section" className="border-t border-line bg-brand/5">
        <Section>
          <h2 className="mb-10 font-display text-3xl text-paper">{page.processTitle}</h2>
          <ol className="grid gap-10 md:grid-cols-4">
            {page.process.map((p, i) => (
              <li key={p.title}>
                <p className="font-display text-4xl text-gold mb-4">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-sans text-base uppercase tracking-[0.06em] text-paper mb-2">{p.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-paper-dim">{p.text}</p>
              </li>
            ))}
          </ol>
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

      <Reveal as="section" className="border-t border-line">
        <Section>
          <ul className="flex flex-wrap gap-2">
            {page.related.map((r) => (
              <li key={r.path}>
                <Link href={lh(lang, r.path)} className="block border border-line px-4 py-2 font-sans text-sm text-paper-dim transition-colors hover:border-brand hover:text-paper">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </Reveal>

      <PageCta title={page.ctaTitle} text={page.ctaText} href={contact} label={dict.common.angebotAnfordern} />

      <ServiceJsonLd lang={lang} path={path} name={page.title} description={page.description} serviceType={page.serviceType} />
      <FaqJsonLd items={page.faq} />
      <BreadcrumbJsonLd
        items={[
          { name: dict.home.lanes.start, path: lh(lang) },
          { name: page.name, path: lh(lang, path) },
        ]}
      />
    </>
  );
}
