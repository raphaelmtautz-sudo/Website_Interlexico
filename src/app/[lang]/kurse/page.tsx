import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/interactive/reveal";
import { TiltCard } from "@/components/interactive/tilt-card";
import { getCourseTypes } from "@/content/course-types";
import { getDictionary } from "@/dictionaries";
import { hasLocale, lh } from "@/lib/i18n";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return {
    title: getDictionary(lang).kurse.title,
    alternates: { canonical: lh(lang, "/kurse") },
  };
}

export default async function KursePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const courseTypes = getCourseTypes(lang);

  return (
    <Section className="pt-24 lg:pt-32">
      <div className="animate-fade-up">
        <Eyebrow>{dict.kurse.eyebrow}</Eyebrow>
        <h1 className="kinetic font-display text-5xl mb-16 text-balance sm:text-6xl lg:text-7xl">
          {dict.kurse.title}
        </h1>
      </div>
      <div className="grid gap-px bg-line md:grid-cols-2">
        {courseTypes.map((course, i) => (
          <Reveal key={course.slug} delay={i * 80} variant={i % 2 === 0 ? "left" : "right"}>
            <TiltCard max={3} className="h-full bg-ink p-10">
              <Badge>
                {course.status === "aktiv" ? dict.kurse.verfuegbar : dict.kurse.baldVerfuegbar}
              </Badge>
              <h2 className="font-display text-4xl text-paper mt-5 mb-3">
                {course.name}
              </h2>
              <p className="font-sans text-sm leading-relaxed text-paper-dim mb-8">
                {course.tagline}
              </p>
              {course.status === "aktiv" ? (
                <Link
                  href={lh(lang, `/kurse/${course.slug}`)}
                  className="link-underline font-sans text-sm uppercase tracking-[0.08em] text-gold"
                >
                  {dict.kurse.detailsAnsehen}
                </Link>
              ) : (
                <span className="font-sans text-sm uppercase tracking-[0.08em] text-paper-dim">
                  {dict.kurse.inVorbereitung}
                </span>
              )}
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
