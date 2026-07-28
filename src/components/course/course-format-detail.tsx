import { CourseType, CourseFormat } from "@/types/course";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function CourseFormatDetail({
  course,
  format,
}: {
  course: CourseType;
  format: CourseFormat;
}) {
  return (
    <Section className="pt-24 lg:pt-32">
      <Container className="max-w-3xl">
        <Eyebrow>
          {course.name} — {format.name}
        </Eyebrow>
        <h1 className="font-display text-5xl text-paper mb-6 text-balance">
          {format.name}
        </h1>
        <p className="font-sans text-lg leading-relaxed text-paper-dim mb-12">
          {format.description}
        </p>

        <div className="grid gap-8 border-t border-line pt-8 sm:grid-cols-3 mb-12">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.18em] text-gold mb-2">
              Preis
            </p>
            <p className="font-display text-2xl text-paper">
              ab {format.priceFrom} €
            </p>
            <p className="font-sans text-xs text-paper-dim">{format.priceUnit}</p>
          </div>
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.18em] text-gold mb-2">
              Umfang
            </p>
            <p className="font-display text-2xl text-paper">{format.duration}</p>
          </div>
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.18em] text-gold mb-2">
              Teilnehmer:innen
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

        <Button href={`/buchen?kurs=${course.slug}&format=${format.slug}`}>
          Dieses Format buchen
        </Button>
      </Container>
    </Section>
  );
}
