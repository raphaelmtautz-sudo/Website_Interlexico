"use client";

import { useEffect, useState } from "react";

interface Lane {
  id: string;
  label: string;
}

/**
 * Fixierte "Story-Lane"-Navigation (Punkte rechts). Zeigt den aktiven
 * Abschnitt via IntersectionObserver und erlaubt gezielte Sprünge.
 * Nur auf großen Screens; rein zusätzliche Orientierung (aria-hidden für SR,
 * da die Abschnitte selbst über normale Überschriften erreichbar sind).
 */
export function StoryLaneNav({ lanes }: { lanes: Lane[] }) {
  const [active, setActive] = useState(lanes[0]?.id ?? "");

  useEffect(() => {
    const sections = lanes
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [lanes]);

  return (
    <>
      <nav
        data-distraction
        aria-label="Abschnitts-Navigation"
        className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
      >
        <ul className="flex flex-col gap-4">
          {lanes.map((lane) => {
            const isActive = active === lane.id;
            return (
              <li key={lane.id}>
                <a
                  href={`#${lane.id}`}
                  className="group flex items-center justify-end gap-3"
                >
                  <span
                    className={`font-sans text-[10px] uppercase tracking-[0.16em] transition-opacity ${
                      isActive
                        ? "text-gold opacity-100"
                        : "text-paper-dim opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {lane.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 border transition-colors ${
                      isActive
                        ? "border-gold bg-gold"
                        : "border-paper-dim bg-transparent group-hover:border-gold"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile Pendant: schmaler Punktstrich unter dem Header statt Punktleiste
          am Rand — reine Fortschritts-/Wegweiser-Andeutung, keine Labels. */}
      <nav
        data-distraction
        aria-label="Abschnitts-Navigation"
        className="fixed inset-x-0 top-20 z-30 flex justify-center gap-1.5 py-2 lg:hidden"
      >
        {lanes.map((lane) => {
          const isActive = active === lane.id;
          return (
            <a
              key={lane.id}
              href={`#${lane.id}`}
              aria-label={lane.label}
              aria-current={isActive ? "true" : undefined}
              className="flex h-6 w-6 items-center justify-center"
            >
              <span
                aria-hidden="true"
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isActive ? "w-6 bg-gold" : "w-1.5 bg-paper-dim/40"
                }`}
              />
            </a>
          );
        })}
      </nav>
    </>
  );
}
