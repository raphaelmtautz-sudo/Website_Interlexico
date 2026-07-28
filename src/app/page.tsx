import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { GoldRule } from "@/components/ui/divider";
import { Badge } from "@/components/ui/badge";
import { courseTypes } from "@/content/course-types";

const benefits = [
  {
    title: "Individuelle Einstufung",
    description:
      "Jedes Training beginnt mit einer präzisen Sprachstand- und Bedarfsanalyse.",
  },
  {
    title: "Fachbezogene Inhalte",
    description:
      "Vokabular und Fallbeispiele aus Ihrer Branche statt Lehrbuchszenarien.",
  },
  {
    title: "Messbarer Fortschritt",
    description:
      "Regelmäßiges Reporting für HR — Lernfortschritt wird sichtbar.",
  },
  {
    title: "Flexible Formate",
    description:
      "Einzelunterricht, Gruppen oder Klassen — passend zu Teamgröße und Budget.",
  },
];

const process = [
  { step: "01", title: "Beratung", description: "Gemeinsame Klärung von Zielen, Teamgröße und Budget." },
  { step: "02", title: "Einstufung", description: "Präzise Sprachstandsanalyse jeder teilnehmenden Person." },
  { step: "03", title: "Training", description: "Individuell abgestimmte Einheiten im gewählten Format." },
  { step: "04", title: "Reporting", description: "Regelmäßige Fortschrittsübersicht für HR und Führungskräfte." },
];

export default function Home() {
  return (
    <>
      <Section className="pt-24 lg:pt-36">
        <div className="max-w-3xl animate-fade-up">
          <Eyebrow>Business English Training für Unternehmen</Eyebrow>
          <h1 className="font-display text-balance text-5xl leading-[1.1] text-paper sm:text-6xl lg:text-7xl">
            Verhandlungssicheres Englisch für Ihre Führungskräfte und Teams
          </h1>
          <p className="mt-8 max-w-xl font-sans text-lg leading-relaxed text-paper-dim">
            Kein Sprachkurs von der Stange. Interlexico trainiert Fach- und
            Führungskräfte in der DACH-Region mit Inhalten aus ihrer eigenen
            Branche — individuell, messbar, ohne Umwege.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href="/kurse">Kurse entdecken</Button>
            <Button href="/kontakt" variant="secondary">
              Beratungsgespräch buchen
            </Button>
          </div>
        </div>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>Warum Interlexico</Eyebrow>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="border-t border-gold-dim pt-6">
              <h3 className="font-display text-2xl text-paper mb-3">{b.title}</h3>
              <p className="font-sans text-sm leading-relaxed text-paper-dim">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>Trainingsangebot</Eyebrow>
        <div className="mb-12 max-w-2xl">
          <h2 className="font-display text-4xl text-paper mb-4">
            Ein Grundgerüst, viele Trainings
          </h2>
          <p className="font-sans text-paper-dim leading-relaxed">
            Business English ist unser erstes Trainingsformat — weitere
            Sprach- und Kompetenztrainings folgen auf derselben Plattform.
          </p>
        </div>
        <div className="grid gap-px bg-line md:grid-cols-2">
          {courseTypes.map((course) => (
            <div key={course.slug} className="bg-ink p-8">
              <div className="mb-4 flex items-center justify-between">
                <Badge>
                  {course.status === "aktiv" ? "Verfügbar" : "Bald verfügbar"}
                </Badge>
              </div>
              <h3 className="font-display text-3xl text-paper mb-3">
                {course.name}
              </h3>
              <p className="font-sans text-sm leading-relaxed text-paper-dim mb-6">
                {course.tagline}
              </p>
              {course.status === "aktiv" ? (
                <Link
                  href={`/kurse/${course.slug}`}
                  className="link-underline font-sans text-sm uppercase tracking-[0.08em] text-gold"
                >
                  Details ansehen
                </Link>
              ) : (
                <span className="font-sans text-sm uppercase tracking-[0.08em] text-paper-dim">
                  In Vorbereitung
                </span>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>Ablauf</Eyebrow>
        <div className="grid gap-10 md:grid-cols-4">
          {process.map((p) => (
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

      <Section className="border-t border-line">
        <Container className="max-w-3xl text-center mx-auto">
          <GoldRule className="mx-auto mb-8" />
          <p className="font-display text-3xl italic leading-snug text-paper sm:text-4xl">
            „Unsere Vertriebsleiter führen internationale Kundengespräche
            heute spürbar souveräner.“
          </p>
          <p className="mt-6 font-sans text-sm uppercase tracking-[0.08em] text-paper-dim">
            Head of People &amp; Culture, mittelständisches Industrieunternehmen
          </p>
        </Container>
      </Section>

      <Section className="border-t border-line">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-4xl text-paper max-w-xl text-balance">
            Bereit, das Sprachniveau Ihres Teams anzuheben?
          </h2>
          <Button href="/kontakt">Beratungsgespräch buchen</Button>
        </Container>
      </Section>
    </>
  );
}
