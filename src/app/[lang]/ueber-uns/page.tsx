import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
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
  return pageMetadata({ lang, path: "/ueber-uns", title: dict.nav.ueberUns, description: dict.ueberUns.intro });
}

export default async function UeberUnsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.ueberUns;

  return (
    <>
      <StickyMobileCta href={lh(lang, "/kontakt")} label={dict.common.beratungsgespraechBuchen} finalCtaId="ueber-uns-cta" />

      <Section id="start" className="pt-24 lg:pt-32">
        <div className="max-w-2xl animate-rise">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="kinetic font-display text-5xl mb-6 text-balance sm:text-6xl lg:text-7xl">
            {t.title}
          </h1>
          <p className="font-sans text-lg leading-relaxed text-paper-dim">
            {t.intro}
          </p>
        </div>
      </Section>

      <Reveal as="section" className="border-t border-line">
        <Section>
          <Eyebrow>{t.haltungEyebrow}</Eyebrow>
          <Container className="grid gap-12 px-0 md:grid-cols-3">
            {t.values.map((v) => (
              <div key={v.title} className="border-t border-gold-dim pt-6">
                <h2 className="font-display text-2xl text-paper mb-3">{v.title}</h2>
                <p className="font-sans text-sm leading-relaxed text-paper-dim">
                  {v.description}
                </p>
              </div>
            ))}
          </Container>
        </Section>
      </Reveal>

      <Reveal as="section" variant="scale" className="border-t border-line">
        <Section>
          <Eyebrow>{t.ansatzEyebrow}</Eyebrow>
          <div className="mb-12 max-w-2xl">
            <h2 className="font-display text-4xl text-paper text-balance">
              {t.ansatzTitle}
            </h2>
          </div>
          <div className="grid gap-10 md:grid-cols-4">
            {t.approach.map((a) => (
              <div key={a.step}>
                <p className="font-display text-4xl text-gold mb-4">{a.step}</p>
                <h3 className="font-sans text-base uppercase tracking-[0.06em] text-paper mb-2">
                  {a.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-paper-dim">
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      <Reveal as="section" variant="left" className="border-t border-line">
        <Section>
          <Container className="grid gap-12 px-0 md:grid-cols-2">
            <div>
              <Eyebrow>{t.fuerWenEyebrow}</Eyebrow>
              <h2 className="font-display text-4xl text-paper text-balance">
                {t.fuerWenTitle}
              </h2>
            </div>
            <ul className="space-y-4">
              {t.audience.map((a) => (
                <li key={a} className="flex items-start gap-4 border-t border-line pt-4">
                  <span aria-hidden="true" className="mt-1 h-2 w-2 shrink-0 bg-gold" />
                  <span className="font-sans text-paper-dim">{a}</span>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      </Reveal>

      <Reveal as="section" id="ueber-uns-cta" variant="scale" className="border-t border-line bg-brand/5">
        <Section>
          <Container className="flex flex-col items-center gap-6 text-center">
            <GoldRule className="mb-2" />
            <h2 className="font-display text-4xl text-paper max-w-xl text-balance">
              {t.ctaTitle}
            </h2>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button href={lh(lang, "/kontakt")}>{dict.common.beratungsgespraechBuchen}</Button>
              <Button href={lh(lang, "/kurse")} variant="secondary">
                {t.ctaKurse}
              </Button>
            </div>
          </Container>
        </Section>
      </Reveal>
    </>
  );
}
