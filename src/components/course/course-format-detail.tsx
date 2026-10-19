import { CourseType, CourseFormat } from "@/types/course";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";

export function CourseFormatDetail({
  course,
  format,
  lang,
  dict,
}: {
  course: CourseType;
  format: CourseFormat;
  lang: Locale;
  dict: Dictionary;
}) {
  const t = dict.courseFormat;
  return (
    <Section className="pt-24 lg:pt-32">
      <Container className="max-w-3xl">
        <div className="animate-rise">
          <Eyebrow>
            {course.name} — {format.name}
          </Eyebrow>
          <h1 className="kinetic font-display text-5xl mb-6 text-balance sm:text-6xl">
            {format.name}
          </h1>
          <p className="font-sans text-lg leading-relaxed text-paper-dim mb-12">
            {format.description}
          </p>
        </div>

        <div className="grid gap-8 border-t border-line pt-8 sm:grid-cols-3 mb-12">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.18em] text-gold mb-2">
              {t.angebot}
            </p>
            <p className="font-display text-2xl text-paper">{dict.common.aufAnfrage}</p>
            <p className="font-sans text-xs text-paper-dim">
              {t.individuellKalkuliert}
            </p>
          </div>
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.18em] text-gold mb-2">
              {t.umfang}
            </p>
            <p className="font-display text-2xl text-paper">{format.duration}</p>
          </div>
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.18em] text-gold mb-2">
              {t.teilnehmer}
            </p>
            <p className="font-display text-2xl text-paper">{format.capacity}</p>
          </div>
        </div>

        <ul className="space-y-3 mb-12">
          {format.highlights.map((h) => (
            <li key={h} className="border-l border-gold pl-4 font-sans text-sm text-paper">
              {h}
            </li>
          ))}
        </ul>

        <Button href={`${lh(lang, "/kontakt")}?kurs=${course.slug}&format=${format.slug}`}>
          {t.formatAnfragen}
        </Button>
      </Container>
    </Section>
  );
}
