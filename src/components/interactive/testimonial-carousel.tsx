"use client";

import { useEffect, useRef, useState } from "react";

interface Testimonial {
  quote: string;
  role: string;
}

const HOLD_MS = 5000;

/**
 * Zeigt immer nur ein Testimonial; hält kurz, dann schiebt sich das nächste
 * von rechts rein (voriges nach links raus). Pausiert bei Hover/Fokus und
 * respektiert prefers-reduced-motion (kein Auto-Wechsel, nur manuelle Dots).
 */
export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, []);

  useEffect(() => {
    if (paused || reducedMotion.current || testimonials.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, HOLD_MS);
    return () => clearInterval(id);
  }, [paused, testimonials.length]);

  return (
    <div
      className="mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {testimonials.map((t, i) => (
            <figure key={t.role} aria-hidden={i !== index} className="w-full shrink-0 px-1 text-center">
              <blockquote className="font-display text-3xl italic leading-snug text-paper sm:text-4xl">
                „{t.quote}“
              </blockquote>
              <figcaption className="mt-6 font-sans text-sm uppercase tracking-[0.08em] text-paper-dim">
                {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {testimonials.length > 1 && (
        <div role="tablist" aria-label="Stimmen" className="mt-8 flex justify-center gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.role}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Stimme ${i + 1} von ${testimonials.length}`}
              onClick={() => setIndex(i)}
              className="flex h-6 w-6 items-center justify-center"
            >
              <span
                aria-hidden="true"
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-gold" : "w-1.5 bg-paper-dim/40 hover:bg-paper-dim"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
