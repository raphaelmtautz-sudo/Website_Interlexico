import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { courseTypes } from "@/content/course-types";

export const metadata = {
  title: "Kursübersicht | Interlexico",
  description: "Alle Trainingsangebote von Interlexico im Überblick.",
};

export default function KursePage() {
  return (
    <Section className="pt-24 lg:pt-32">
      <Eyebrow>Trainingsangebot</Eyebrow>
      <h1 className="font-display text-5xl text-paper mb-16 text-balance">
        Kursübersicht
      </h1>
      <div className="grid gap-px bg-line md:grid-cols-2">
        {courseTypes.map((course) => (
          <div key={course.slug} className="bg-ink p-10">
            <Badge>
              {course.status === "aktiv" ? "Verfügbar" : "Bald verfügbar"}
            </Badge>
            <h2 className="font-display text-4xl text-paper mt-5 mb-3">
              {course.name}
            </h2>
            <p className="font-sans text-sm leading-relaxed text-paper-dim mb-8">
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
  );
}
