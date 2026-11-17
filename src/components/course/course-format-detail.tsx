import Link from "next/link";
import { CourseFormat, CourseType } from "@/types/course";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Reveal } from "@/components/interactive/reveal";
import { StickyMobileCta } from "@/components/interactive/sticky-mobile-cta";
import { getDetailLabels, type FormatDetail } from "@/content/course-details";
import { LOCAL_PATH } from "@/content/local";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";

export function CourseFormatDetail({
  course,
  format,
  detail,
  lang,
  dict,
}: {
  course: CourseType;
  format: CourseFormat;
  detail: FormatDetail;
  lang: Locale;
  dict: Dictionary;
}) {
  const t = dict.courseFormat;
  const dl = getDetailLabels(lang);
  const contact = `${lh(lang, "/kontakt")}?kurs=${course.slug}&format=${format.slug}`;
  const others = course.formats.filter((f) => f.slug !== format.slug);
  const facts = [
    { label: t.angebot, value: dl.offerValue },
    { label: t.umfang, value: format.duration },
    { label: t.teilnehmer, value: format.capacity },
    { label: dl.place, value: dl.placeValue },
  ];

  return (
    <>
      <StickyMobileCta href={contact} label={t.formatAnfragen} finalCtaId="anfrage" />

      <Section id="start" className="pt-24 lg:pt-32">
        <Container className="max-w-3xl">
          <div className="animate-rise">
            <Eyebrow>
              <Link href={lh(lang, `/kurse/${course.slug}`)} className="link-underline">{course.name}</Link> — {format.name}
            </Eyebrow>
            <h1 className="font-display text-5xl mb-6 text-balance sm:text-6xl">{detail.title}</h1>
            {/* Antwortabsatz: was das Format ist, für wen — zitierfähig für Suche und KI. */}
            <p className="font-sans text-lg leading-relaxed text-paper-dim mb-6">{detail.answer}</p>
            <p className="font-sans leading-relaxed text-paper-dim mb-10">{format.description}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button href={contact} trackEvent="cta_click" trackProps={{ cta: "format", place: `${course.slug}-${format.slug}` }}>
                {t.formatAnfragen}
              </Button>
              <Button href={lh(lang, "/konfigurator")} variant="secondary">{dl.configure}</Button>
            </div>
          </div>

          <dl className="mt-14 grid gap-px bg-line sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.label} className="bg-ink-raised p-5">
                <dt className="font-sans text-xs uppercase tracking-[0.12em] text-gold mb-2">{f.label}</dt>
                <dd className="font-sans text-sm leading-relaxed text-paper">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Reveal as="section" className="border-t border-line">
        <Section>
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl text-paper mb-6 text-balance">{dl.bestFor}</h2>
              <ul className="space-y-3">
                {detail.bestFor.map((b) => (
                  <li key={b} className="border-l border-gold pl-4 font-sans text-sm text-paper">{b}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-3xl text-paper mb-6 text-balance">{dl.facts}</h2>
              <ul className="space-y-3">
                {format.highlights.map((h) => (
                  <li key={h} className="border-l border-gold pl-4 font-sans text-sm text-paper">{h}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </Reveal>

      <Reveal as="section" className="border-t border-line bg-brand/5">
        <Section>
          <h2 className="mb-10 font-display text-3xl text-paper">{dl.process}</h2>
          <ol className="grid gap-10 md:grid-cols-4">
            {detail.process.map((p, i) => (
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
          <h2 className="mb-8 font-display text-3xl text-paper">{dl.faq}</h2>
          <div className="mx-auto max-w-3xl">
            <Accordion items={detail.faq} />
          </div>
        </Section>
      </Reveal>

      <Reveal as="section" className="border-t border-line">
        <Section>
          <h2 className="mb-6 font-sans text-xs uppercase tracking-[0.18em] text-gold">{dl.otherFormats}</h2>
          <ul className="flex flex-wrap gap-2">
            {others.map((f) => (
              <li key={f.slug}>
                <Link
                  href={lh(lang, `/kurse/${course.slug}/${f.slug}`)}
                  className="block border border-line px-4 py-2 font-sans text-sm text-paper-dim transition-colors hover:border-brand hover:text-paper"
                >
                  {course.name} — {f.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href={lh(lang, `/kurse/${course.slug}`)} className="block border border-line px-4 py-2 font-sans text-sm text-paper-dim transition-colors hover:border-brand hover:text-paper">
                {dl.toCourse}: {course.name}
              </Link>
            </li>
            <li>
              <Link href={lh(lang, LOCAL_PATH)} className="block border border-line px-4 py-2 font-sans text-sm text-paper-dim transition-colors hover:border-brand hover:text-paper">
                {dl.local}
              </Link>
            </li>
          </ul>
        </Section>
      </Reveal>

      <Reveal as="section" id="anfrage" className="border-t border-line bg-brand/5">
        <Section>
          <Container className="flex flex-col items-center gap-6 text-center">
            <h2 className="font-display text-4xl text-paper max-w-xl text-balance">{detail.title}</h2>
            <Button href={contact}>{t.formatAnfragen}</Button>
          </Container>
        </Section>
      </Reveal>
    </>
  );
}
