import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/ui/divider";
import { StoryLaneNav } from "@/components/interactive/story-lane-nav";
import { Reveal } from "@/components/interactive/reveal";
import { Configurator } from "@/components/interactive/configurator";
import { StickyMobileCta } from "@/components/interactive/sticky-mobile-cta";
import { TestimonialCarousel } from "@/components/interactive/testimonial-carousel";
import { ImpactCalculator } from "@/components/interactive/impact-calculator";
import { FaqJsonLd } from "@/components/seo/json-ld";
import { Accordion } from "@/components/ui/accordion";
import { getFaq, getTestimonials, getIndustries } from "@/lib/cms";
import { getDictionary } from "@/dictionaries";
import { industrySlugByName } from "@/content/branchen";
import { hasLocale, lh } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const [faq, cmsTestimonials, industries] = await Promise.all([
    getFaq(lang),
    getTestimonials(),
    getIndustries(lang),
  ]);

  // Nur echte, freigegebene Kundenstimmen aus dem CMS. Ohne sie entfällt der
  // Abschnitt: erfundene Beispielzitate wirken auf Besucher echt (UWG-Risiko,
  // schwächt Vertrauenssignale für Google). Die Beispiele bleiben im Dictionary.
  const testimonials = cmsTestimonials.map((t) => ({
    quote: t.quote,
    role: [t.personName, [t.personRole, t.companyName].filter(Boolean).join(", ")]
      .filter(Boolean)
      .join(" — "),
  }));

  const offering = dict.home.offering.map((o) => ({
    ...o,
    href:
      o.courseName === dict.home.offering[0].courseName
        ? lh(lang, "/kurse/business-english")
        : lh(lang, "/kurse/deutsch-als-fremdsprache"),
    industries: o.allBranches ? [] : industries,
  }));

  const lanes = [
    { id: "start", label: dict.home.lanes.start },
    { id: "warum", label: dict.home.lanes.warum },
    { id: "konfigurator", label: dict.home.lanes.konfigurator },
    { id: "angebot", label: dict.home.lanes.angebot },
    { id: "ablauf", label: dict.home.lanes.ablauf },
    ...(testimonials.length ? [{ id: "stimmen", label: dict.home.lanes.stimmen }] : []),
    { id: "nachhaltigkeit", label: dict.home.lanes.nachhaltigkeit },
    { id: "faq", label: dict.home.lanes.faq },
    { id: "kontakt-cta", label: dict.home.lanes.kontakt },
  ];

  return (
    <>
      <StoryLaneNav lanes={lanes} />
      <StickyMobileCta href={lh(lang, "/kontakt")} label={dict.common.beratungsgespraechBuchen} />

      <Section id="start" className="pt-24 lg:pt-36">
        <div className="max-w-4xl animate-rise">
          <Eyebrow>{dict.home.eyebrow}</Eyebrow>
          <h1 className="font-display text-balance text-5xl leading-[1.05] sm:text-6xl lg:text-[5.25rem]">
            {dict.home.heroTitleBefore}
            <span className="kinetic">{dict.home.heroTitleKinetic}</span>
            {dict.home.heroTitleAfter}
          </h1>
          <p className="mt-8 max-w-xl font-sans text-lg leading-relaxed text-paper-dim">
            {dict.home.heroSubtitle}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href="#konfigurator" trackEvent="cta_click" trackProps={{ cta: "konfigurator", place: "hero" }}>
              {dict.home.ctaConfigure}
            </Button>
            <Button
              href={lh(lang, "/kontakt")}
              variant="secondary"
              trackEvent="cta_click"
              trackProps={{ cta: "beratung", place: "hero" }}
            >
              {dict.common.beratungsgespraechBuchen}
            </Button>
          </div>
          <Link
            href={lh(lang, "/einstufung")}
            className="link-underline mt-6 inline-block font-sans text-sm uppercase tracking-[0.08em] text-gold"
          >
            {dict.home.konfiguratorSelfTest}
          </Link>

          {/* Kompakte Vertrauens-Zeile: ehrliche, bereits belegte Signale statt Kundenlogos. */}
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6 font-sans text-xs uppercase tracking-[0.1em] text-paper-dim">
            {dict.home.benefits.slice(0, 3).map((b) => (
              <li key={b.title} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-gold" />
                {b.title}
              </li>
            ))}
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-gold" />
              {dict.contactForm.antwortHinweis}
            </li>
          </ul>
        </div>
      </Section>

      <Reveal as="section" id="warum" className="border-t border-line">
        <Section>
          <Eyebrow>{dict.home.warumEyebrow}</Eyebrow>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {dict.home.benefits.map((b) => (
              <div key={b.title} className="border-t border-gold-dim pt-6">
                <h2 className="font-display text-2xl text-paper mb-3">{b.title}</h2>
                <p className="font-sans text-sm leading-relaxed text-paper-dim">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      <Reveal as="section" id="konfigurator" variant="scale" className="border-t border-line bg-brand/5">
        <Section>
          <Eyebrow>{dict.home.konfiguratorEyebrow}</Eyebrow>
          <div className="mb-12 max-w-2xl">
            <h2 className="font-display text-4xl text-paper mb-4 text-balance">
              {dict.home.konfiguratorTitle}
            </h2>
            <p className="font-sans text-paper-dim leading-relaxed">
              {dict.home.konfiguratorText}
            </p>
            <Link
              href={lh(lang, "/einstufung")}
              className="link-underline mt-4 inline-block font-sans text-sm uppercase tracking-[0.08em] text-brand-text"
            >
              {dict.home.konfiguratorSelfTest}
            </Link>
          </div>
          <Configurator lang={lang} dict={dict} />
        </Section>
      </Reveal>

      <Reveal as="section" id="angebot" className="border-t border-line">
        <Section>
          <Eyebrow>{dict.home.angebotEyebrow}</Eyebrow>
          <div className="mb-12 max-w-2xl">
            <h2 className="font-display text-4xl text-paper mb-4">
              {dict.home.angebotTitle}
            </h2>
            <p className="font-sans text-paper-dim leading-relaxed">
              {dict.home.angebotText}
            </p>
          </div>
          <div className="grid gap-px bg-line md:grid-cols-2">
            {offering.map((group) => (
              <div key={group.lang} className="flex flex-col bg-ink-raised p-8">
                <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold mb-3">
                  {group.lang}
                </p>
                <p className="font-sans text-sm leading-relaxed text-paper-dim mb-8">
                  {group.intro}
                </p>

                <p className="font-sans text-xs uppercase tracking-[0.12em] text-paper mb-3">
                  {dict.home.kurseLabel}
                </p>
                <ul className="mb-8 space-y-2">
                  <li>
                    <Link
                      href={group.href}
                      className="link-underline font-display text-2xl text-paper hover:text-brand-text"
                    >
                      {group.courseName}
                    </Link>
                  </li>
                </ul>

                <p className="font-sans text-xs uppercase tracking-[0.12em] text-paper mb-3">
                  {dict.home.branchenLabel}
                </p>
                {group.allBranches ? (
                  <p className="font-sans text-sm text-paper-dim">
                    <span className="text-paper">{dict.home.allBranchesText}</span> —{" "}
                    {dict.home.allBranchesSuffix}
                  </p>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {group.industries.map((i) => {
                      const slug = industrySlugByName(lang, i);
                      const cls = "block border border-line px-3 py-1.5 font-sans text-xs text-paper-dim transition-colors hover:border-brand hover:text-paper";
                      return (
                        <li key={i}>
                          {slug ? <Link href={lh(lang, `/branchen/${slug}`)} className={cls}>{i}</Link> : <span className={cls}>{i}</span>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      <Reveal as="section" id="ablauf" variant="left" className="border-t border-line">
        <Section>
          <Eyebrow>{dict.home.ablaufEyebrow}</Eyebrow>
          <div className="grid gap-10 md:grid-cols-4">
            {dict.home.process.map((p) => (
              <div key={p.step}>
                <p className="font-display text-4xl text-gold mb-4">{p.step}</p>
                <h3 className="font-sans text-base uppercase tracking-[0.06em] text-paper mb-2">
                  {p.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-paper-dim">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      {testimonials.length > 0 && (
        <Reveal as="section" id="stimmen" variant="scale" className="border-t border-line">
          <Section>
            <GoldRule className="mx-auto mb-10" />
            <TestimonialCarousel testimonials={testimonials} />
          </Section>
        </Reveal>
      )}

      <Reveal as="section" id="nachhaltigkeit" variant="right" className="border-t border-line bg-success/5">
        <Section>
          <Eyebrow tone="success">{dict.home.nachhaltigkeitEyebrow}</Eyebrow>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
            <h2 className="font-display text-4xl text-paper text-balance sm:text-5xl">
              {dict.home.nachhaltigkeitTitle}
            </h2>
            <div>
              <p className="font-sans leading-relaxed text-paper-dim mb-6">
                {dict.home.nachhaltigkeitText}
              </p>
              <Link
                href={lh(lang, "/nachhaltigkeit")}
                className="link-underline font-sans text-sm uppercase tracking-[0.08em] text-success"
              >
                {dict.home.nachhaltigkeitLink}
              </Link>
            </div>
          </div>
          <div className="mt-12">
            <ImpactCalculator
              dict={dict.nachhaltigkeit.calculator}
              nabuUrl={dict.nachhaltigkeit.projects[1].url}
              dappUrl={dict.nachhaltigkeit.projects[0].url}
            />
          </div>
        </Section>
      </Reveal>

      <Reveal as="section" id="faq" className="border-t border-line">
        <Section>
          <Eyebrow>{dict.home.faqEyebrow}</Eyebrow>
          <div className="mx-auto max-w-3xl">
            <Accordion items={faq} />
          </div>
        </Section>
        {/* JSON-LD enthält weiterhin alle Fragen/Antworten unabhängig vom
            Accordion-Zustand — für Crawler unsichtbar per DOM, für Schema.org
            vollständig. */}
        <FaqJsonLd items={faq} />
      </Reveal>

      <Reveal as="section" id="kontakt-cta" className="border-t border-line bg-brand/5">
        <Section>
          <Container className="flex flex-col items-center gap-6 text-center">
            <h2 className="font-display text-4xl text-paper max-w-xl text-balance">
              {dict.home.kontaktCtaTitle}
            </h2>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                href={lh(lang, "/kontakt")}
                trackEvent="cta_click"
                trackProps={{ cta: "angebot", place: "kontakt-cta" }}
              >
                {dict.common.angebotAnfordern}
              </Button>
              <Button
                href={lh(lang, "/kontakt")}
                variant="secondary"
                trackEvent="cta_click"
                trackProps={{ cta: "beratung", place: "kontakt-cta" }}
              >
                {dict.common.beratungsgespraechBuchen}
              </Button>
            </div>
          </Container>
        </Section>
      </Reveal>
    </>
  );
}
