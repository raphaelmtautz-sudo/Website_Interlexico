import Link from "next/link";
import { CourseType } from "@/types/course";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/ui/divider";

export function CourseTypeLanding({ course }: { course: CourseType }) {
  return (
    <>
      <Section className="pt-24 lg:pt-32">
        <div className="max-w-3xl">
          <Eyebrow>{course.tagline}</Eyebrow>
          <h1 className="font-display text-balance text-5xl leading-[1.1] text-paper sm:text-6xl">
            {course.heroTitle}
          </h1>
          <p className="mt-8 max-w-xl font-sans text-lg leading-relaxed text-paper-dim">
            {course.heroSubtitle}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href="/buchen">Kurs buchen</Button>
            <Button href="/kontakt" variant="secondary">
              Beratungsgespräch
            </Button>
          </div>
        </div>
      </Section>

      <Section className="border-t border-line">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <Eyebrow>Für wen</Eyebrow>
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
            <Eyebrow>Ihr Vorteil</Eyebrow>
            <div className="space-y-8">
              {course.benefits.map((b) => (
                <div key={b.title}>
                  <h3 className="font-display text-2xl text-paper mb-2">
                    {b.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-paper-dim">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>Formate</Eyebrow>
        <h2 className="font-display text-4xl text-paper mb-12">
          Wählen Sie das passende Format
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
              <p className="font-display text-3xl text-gold mb-1">
                ab {format.priceFrom} €
              </p>
              <p className="font-sans text-xs text-paper-dim mb-6">
                {format.priceUnit}
              </p>
              <Link
                href={`/kurse/${course.slug}/${format.slug}`}
                className="link-underline font-sans text-sm uppercase tracking-[0.08em] text-gold"
              >
                Format ansehen
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {course.testimonials.length > 0 && (
        <Section className="border-t border-line">
          <Container className="max-w-3xl text-center mx-auto">
            <GoldRule className="mx-auto mb-8" />
            {course.testimonials.map((t) => (
              <div key={t.name}>
                <p className="font-display text-3xl italic leading-snug text-paper sm:text-4xl">
                  „{t.quote}“
                </p>
                <p className="mt-6 font-sans text-sm uppercase tracking-[0.08em] text-paper-dim">
                  {t.role}, {t.company}
                </p>
              </div>
            ))}
          </Container>
        </Section>
      )}

      <Section className="border-t border-line">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-4xl text-paper max-w-xl text-balance">
            Starten Sie mit {course.name}
          </h2>
          <Button href="/buchen">Jetzt buchen</Button>
        </Container>
      </Section>
    </>
  );
}
