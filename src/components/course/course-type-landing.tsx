import Link from "next/link";
import { CourseType } from "@/types/course";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/ui/divider";
import { ScrollProgress } from "@/components/interactive/scroll-progress";
import { StoryLaneNav } from "@/components/interactive/story-lane-nav";
import { Reveal } from "@/components/interactive/reveal";
import { StickyMobileCta } from "@/components/interactive/sticky-mobile-cta";
import { TestimonialCarousel } from "@/components/interactive/testimonial-carousel";
import { Accordion } from "@/components/ui/accordion";
import type { FaqItem } from "@/content/faq";
import { industrySlugByName } from "@/content/branchen";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";

export function CourseTypeLanding({
  course,
  lang,
  dict,
  faq = [],
}: {
  course: CourseType;
  lang: Locale;
  dict: Dictionary;
  faq?: FaqItem[];
}) {
  const t = dict.courseType;
  const lanes = [
    { id: "start", label: t.lanes.start },
    { id: "fuer-wen", label: t.lanes.fuerWen },
    { id: "formate", label: t.lanes.formate },
    ...(course.industries && course.industries.length > 0
      ? [{ id: "branchen", label: t.lanes.branchen }]
      : []),
    ...(course.testimonials.length > 0
      ? [{ id: "stimmen", label: t.lanes.stimmen }]
      : []),
    ...(faq.length > 0 ? [{ id: "faq", label: t.lanes.faq }] : []),
    { id: "anfrage", label: t.lanes.anfrage },
  ];

  return (
    <>
      <ScrollProgress />
      <StoryLaneNav lanes={lanes} />
      <StickyMobileCta
        href={`${lh(lang, "/kontakt")}?kurs=${course.slug}`}
        label={t.jetztAnfragen}
        finalCtaId="anfrage"
      />

      <Section id="start" className="pt-24 lg:pt-32">
        <div className="max-w-3xl animate-rise">
          <Eyebrow>{course.tagline}</Eyebrow>
          <h1 className="kinetic font-display text-balance text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            {course.heroTitle}
          </h1>
          <p className="mt-8 max-w-xl font-sans text-lg leading-relaxed text-paper-dim">
            {course.heroSubtitle}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href={`${lh(lang, "/kontakt")}?kurs=${course.slug}`}>{t.ctaBeratungAnfragen}</Button>
            <Button href={`${lh(lang, "/kontakt")}?kurs=${course.slug}`} variant="secondary">
              {t.ctaBeratungsgespraech}
            </Button>
          </div>
        </div>
      </Section>

      <Reveal as="section" id="fuer-wen" className="border-t border-line">
        <Section>
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <Eyebrow>{t.fuerWenEyebrow}</Eyebrow>
              <p className="font-sans leading-relaxed text-paper-dim mb-6">
                {course.intro}
              </p>
              <ul className="space-y-3">
                {course.audience.map((a) => (
                  <li
                    key={a}
                    className="border-l border-gold pl-4 font-sans text-sm text-paper"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Eyebrow>{t.ihrVorteilEyebrow}</Eyebrow>
              <div className="space-y-8">
                {course.benefits.map((b) => (
                  <div key={b.title}>
                    <h2 className="font-display text-2xl text-paper mb-2">
                      {b.title}
                    </h2>
                    <p className="font-sans text-sm leading-relaxed text-paper-dim">
                      {b.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </Reveal>

      <Reveal as="section" id="formate" variant="scale" className="border-t border-line">
        <Section>
          <Eyebrow>{t.formateEyebrow}</Eyebrow>
          <h2 className="font-display text-4xl text-paper mb-12">
            {t.formateTitle}
          </h2>
          <div className="grid gap-px bg-line md:grid-cols-3">
            {course.formats.map((format) => (
              <div key={format.slug} className="bg-ink p-8 flex flex-col">
                <h3 className="font-display text-2xl text-paper mb-2">
                  {format.name}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-paper-dim mb-6 flex-1">
                  {format.description}
                </p>
                <p className="font-display text-2xl text-gold mb-6">{dict.common.aufAnfrage}</p>
                <Link
                  href={lh(lang, `/kurse/${course.slug}/${format.slug}`)}
                  className="link-underline font-sans text-sm uppercase tracking-[0.08em] text-gold"
                >
                  {t.formatAnsehen}
                </Link>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      {course.industries && course.industries.length > 0 && (
        <Reveal as="section" id="branchen" variant="left" className="border-t border-line">
          <Section>
            <Eyebrow>{t.branchenEyebrow}</Eyebrow>
            <div className="grid gap-8 md:grid-cols-3">
              <h2 className="font-display text-3xl text-paper text-balance">
                {t.branchenTitle}
              </h2>
              <ul className="flex flex-wrap gap-2 md:col-span-2">
                {course.industries.map((i) => {
                  const slug = course.slug === "business-english" ? industrySlugByName(lang, i) : undefined;
                  const cls = "block border border-line px-4 py-2 font-sans text-sm text-paper-dim transition-colors hover:border-brand hover:text-paper";
                  return (
                    <li key={i}>
                      {slug ? <Link href={lh(lang, `/branchen/${slug}`)} className={cls}>{i}</Link> : <span className={cls}>{i}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Section>
        </Reveal>
      )}

      {course.testimonials.length > 0 && (
        <Reveal as="section" id="stimmen" variant="right" className="border-t border-line">
          <Section>
            <GoldRule className="mx-auto mb-10" />
            <TestimonialCarousel
              testimonials={course.testimonials.map((t) => ({ quote: t.quote, role: `${t.role}, ${t.company}` }))}
            />
          </Section>
        </Reveal>
      )}

      {faq.length > 0 && (
        <Reveal as="section" id="faq" className="border-t border-line">
          <Section>
            <Eyebrow>{dict.home.faqEyebrow}</Eyebrow>
            <div className="mx-auto max-w-3xl">
              <Accordion items={faq} />
            </div>
          </Section>
        </Reveal>
      )}

      <Reveal as="section" id="anfrage" className="border-t border-line bg-brand/5">
        <Section>
          <Container className="flex flex-col items-center gap-6 text-center">
            <h2 className="font-display text-4xl text-paper max-w-xl text-balance">
              {t.starten} {course.name}
            </h2>
            <Button href={`${lh(lang, "/kontakt")}?kurs=${course.slug}`}>{t.jetztAnfragen}</Button>
          </Container>
        </Section>
      </Reveal>
    </>
  );
}
