import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/ui/divider";
import { Reveal } from "@/components/interactive/reveal";
import { StickyMobileCta } from "@/components/interactive/sticky-mobile-cta";
import { ImpactCalculator } from "@/components/interactive/impact-calculator";
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
  const url = lh(lang, "/nachhaltigkeit");
  return {
    title: dict.nachhaltigkeit.metaTitle,
    description: dict.nachhaltigkeit.text,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: dict.nachhaltigkeit.metaTitle,
      description: dict.nachhaltigkeit.text,
      url,
    },
  };
}

export default async function NachhaltigkeitPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.nachhaltigkeit;

  return (
    <>
      <StickyMobileCta href={lh(lang, "/kontakt")} label={t.ctaTraining} finalCtaId="nachhaltigkeit-cta" />

      <Section id="start" className="bg-success/5 pt-24 lg:pt-32">
        <div className="max-w-3xl animate-fade-up">
          <Eyebrow tone="success">{t.eyebrow}</Eyebrow>
          <h1 className="kinetic font-display text-5xl leading-[1.05] text-balance sm:text-6xl lg:text-7xl">
            {t.title}
          </h1>
          <p className="mt-8 max-w-xl font-sans text-lg leading-relaxed text-paper-dim">
            {t.text}
          </p>
        </div>
      </Section>

      <Reveal as="section" variant="scale" className="border-t border-line bg-success/5">
        <Section>
          <Eyebrow tone="success">{t.soFunktioniertEyebrow}</Eyebrow>
          <div className="grid gap-16 lg:grid-cols-2">
            <div className="max-w-lg">
              <h2 className="font-display text-4xl text-paper text-balance mb-6">
                {t.soFunktioniertTitle}
              </h2>
              <p className="font-sans leading-relaxed text-paper-dim">
                {t.soFunktioniertText}
              </p>
            </div>
            <div className="grid gap-px bg-line">
              {t.projects.map((p) => (
                <div key={p.title} className="border-t-2 border-success bg-ink p-8">
                  <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-success mb-3">
                    {p.eyebrow}
                  </p>
                  <h3 className="font-display text-2xl text-paper mb-3">
                    {p.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-paper-dim">
                    {p.body}
                  </p>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline mt-4 inline-block font-sans text-xs uppercase tracking-[0.08em] text-success"
                  >
                    {p.linkLabel} ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </Reveal>

      <Reveal as="section" variant="scale" className="border-t border-line">
        <Section>
          <ImpactCalculator
            dict={t.calculator}
            nabuUrl={t.projects[1].url}
            dappUrl={t.projects[0].url}
          />
        </Section>
      </Reveal>

      <Reveal as="section" variant="left" className="border-t border-line">
        <Section>
          <Container className="max-w-3xl text-center mx-auto">
            <GoldRule tone="success" className="mx-auto mb-8" />
            <p className="font-display text-3xl italic leading-snug text-paper sm:text-4xl">
              {t.quote}
            </p>
          </Container>
        </Section>
      </Reveal>

      <Reveal as="section" id="nachhaltigkeit-cta" variant="scale" className="border-t border-line bg-success/5">
        <Section>
          <Container className="flex flex-col items-center gap-6 text-center">
            <h2 className="font-display text-4xl text-paper max-w-xl text-balance">
              {t.ctaTitle}
            </h2>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button href={lh(lang, "/kontakt")}>{t.ctaTraining}</Button>
              <Button href={lh(lang, "/kontakt")} variant="secondary">
                {t.ctaMehr}
              </Button>
            </div>
          </Container>
        </Section>
      </Reveal>
    </>
  );
}
