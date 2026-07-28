"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { courseTypes, getCourseType } from "@/content/course-types";
import { CourseFormat } from "@/types/course";
import { Button } from "@/components/ui/button";

const fieldClasses =
  "w-full border border-line bg-transparent px-4 py-3 font-sans text-sm text-paper placeholder:text-paper-dim focus:border-gold focus:outline-none";

type Step = "format" | "teilnehmer" | "kontakt";

export function BookingFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCourses = courseTypes.filter((c) => c.status === "aktiv");
  const initialCourseSlug = searchParams.get("kurs") ?? activeCourses[0]?.slug;
  const initialFormatSlug = searchParams.get("format");

  const [courseSlug, setCourseSlug] = useState(initialCourseSlug);
  const [formatSlug, setFormatSlug] = useState(initialFormatSlug ?? "");
  const [participants, setParticipants] = useState(1);
  const [step, setStep] = useState<Step>(formatSlug ? "teilnehmer" : "format");

  const course = getCourseType(courseSlug ?? "");
  const format: CourseFormat | undefined = useMemo(
    () => course?.formats.find((f) => f.slug === formatSlug),
    [course, formatSlug],
  );

  function goToCheckout(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      kurs: courseSlug ?? "",
      format: formatSlug,
      teilnehmer: String(participants),
    });
    router.push(`/checkout?${params.toString()}`);
  }

  return (
    <div className="space-y-10">
      <ol className="flex gap-6 font-sans text-xs uppercase tracking-[0.12em] text-paper-dim">
        <li className={step === "format" ? "text-gold" : ""}>1. Format</li>
        <li className={step === "teilnehmer" ? "text-gold" : ""}>2. Teilnehmer</li>
        <li className={step === "kontakt" ? "text-gold" : ""}>3. Kontakt</li>
      </ol>

      {step === "format" && (
        <div className="space-y-8">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.12em] text-gold mb-3">
              Kurstyp
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {activeCourses.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => {
                    setCourseSlug(c.slug);
                    setFormatSlug("");
                  }}
                  className={`border px-4 py-3 text-left font-sans text-sm ${
                    courseSlug === c.slug
                      ? "border-gold text-paper"
                      : "border-line text-paper-dim hover:border-gold-dim"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {course && (
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.12em] text-gold mb-3">
                Format
              </p>
              <div className="grid gap-3">
                {course.formats.map((f) => (
                  <button
                    key={f.slug}
                    onClick={() => setFormatSlug(f.slug)}
                    className={`flex items-center justify-between border px-4 py-3 text-left font-sans text-sm ${
                      formatSlug === f.slug
                        ? "border-gold text-paper"
                        : "border-line text-paper-dim hover:border-gold-dim"
                    }`}
                  >
                    <span>{f.name}</span>
                    <span className="text-gold">ab {f.priceFrom} €</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button
            type="button"
            onClick={() => formatSlug && setStep("teilnehmer")}
            className={!formatSlug ? "pointer-events-none opacity-40" : ""}
          >
            Weiter
          </Button>
        </div>
      )}

      {step === "teilnehmer" && format && (
        <div className="space-y-8">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.12em] text-gold mb-3">
              Anzahl Teilnehmer:innen ({format.capacity})
            </p>
            <input
              type="number"
              min={1}
              value={participants}
              onChange={(e) => setParticipants(Number(e.target.value))}
              className={`${fieldClasses} max-w-[10rem]`}
            />
          </div>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => setStep("format")}>
              Zurück
            </Button>
            <Button onClick={() => setStep("kontakt")}>Weiter</Button>
          </div>
        </div>
      )}

      {step === "kontakt" && format && (
        <form onSubmit={goToCheckout} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <input required placeholder="Vorname" className={fieldClasses} />
            <input required placeholder="Nachname" className={fieldClasses} />
          </div>
          <input required type="email" placeholder="E-Mail" className={fieldClasses} />
          <input placeholder="Unternehmen" className={fieldClasses} />
          <div className="flex gap-4">
            <Button type="button" variant="secondary" onClick={() => setStep("teilnehmer")}>
              Zurück
            </Button>
            <Button type="submit">Zur Kasse</Button>
          </div>
        </form>
      )}
    </div>
  );
}
