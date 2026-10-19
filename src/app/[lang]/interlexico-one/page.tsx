import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/ui/divider";
import { Reveal } from "@/components/interactive/reveal";
import { StickyMobileCta } from "@/components/interactive/sticky-mobile-cta";
import { getDictionary } from "@/dictionaries";
import { hasLocale, lh } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.nav.interlexicoOne,
    description: dict.interlexicoOne.intro,
    alternates: { canonical: lh(lang, "/interlexico-one") },
  };
}

export default async function InterlexicoOnePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.interlexicoOne;

  return (
    <>
      <StickyMobileCta href={lh(lang, "/demo")} label={dict.common.beratungsgespraechBuchen} finalCtaId="interlexico-one-cta" />

      <Section id="start" className="pt-24 lg:pt-32">
        <div className="max-w-2xl animate-fade-up">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="kinetic font-display text-5xl mb-6 text-balance sm:text-6xl lg:text-7xl">
            {t.title}
          </h1>
          <p className="font-sans text-lg leading-relaxed text-paper-dim">{t.intro}</p>
        </div>
      </Section>

      <Reveal as="section" variant="left" className="border-t border-line">
        <Section>
          <Container className="grid gap-12 px-0 md:grid-cols-2">
            <div>
              <Eyebrow>{t.problemEyebrow}</Eyebrow>
              <h2 className="font-display text-4xl text-paper text-balance">{t.problemTitle}</h2>
            </div>
            <p className="font-sans text-paper-dim leading-relaxed self-center">{t.problemText}</p>
          </Container>
        </Section>
      </Reveal>

      <Reveal as="section" variant="scale" className="border-t border-line">
        <Section>
          <Eyebrow>{t.capabilitiesEyebrow}</Eyebrow>
          <div className="mb-12 max-w-2xl">
            <h2 className="font-display text-4xl text-paper text-balance">{t.capabilitiesTitle}</h2>
          </div>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {t.capabilities.map((c) => (
              <div key={c.title} className="border-t border-gold-dim pt-6">
                <h3 className="font-display text-2xl text-paper mb-3">{c.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-paper-dim">{c.description}</p>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      <Reveal as="section" className="border-t border-line">
        <Section>
          <Container className="grid gap-12 px-0 md:grid-cols-2">
            <div>
              <Eyebrow>{t.whyEyebrow}</Eyebrow>
              <h2 className="font-display text-4xl text-paper text-balance">{t.whyTitle}</h2>
            </div>
            <p className="font-sans text-paper-dim leading-relaxed self-center">{t.whyText}</p>
          </Container>
        </Section>
      </Reveal>

      <Reveal as="section" id="interlexico-one-cta" variant="scale" className="border-t border-line bg-brand/5">
        <Section>
          <Container className="flex flex-col items-center gap-6 text-center">
            <GoldRule className="mb-2" />
            <h2 className="font-display text-4xl text-paper max-w-xl text-balance">{t.ctaTitle}</h2>
            <p className="font-sans text-paper-dim max-w-xl">{t.ctaText}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button href={lh(lang, "/demo")}>{t.ctaButton}</Button>
              <Button href={lh(lang, "/kurse")} variant="secondary">
                {dict.nav.kurse}
              </Button>
            </div>
          </Container>
        </Section>
      </Reveal>
    </>
  );
}
