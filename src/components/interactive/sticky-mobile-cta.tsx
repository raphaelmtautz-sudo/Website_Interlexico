"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Mobiler Conversions-Balken: erscheint erst, wenn der Hero-Bereich verlassen
 * wurde, und verschwindet wieder, sobald die finale CTA-Sektion der Seite
 * selbst sichtbar ist (kein doppeltes Angebot). Beobachtet zwei Anker-IDs,
 * die pro Seite unterschiedlich heißen können.
 */
export function StickyMobileCta({
  href,
  label,
  heroId = "start",
  finalCtaId = "kontakt-cta",
}: {
  href: string;
  label: string;
  heroId?: string;
  finalCtaId?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    const finalCta = document.getElementById(finalCtaId);
    if (!hero || typeof IntersectionObserver === "undefined") return;

    let heroVisible = true;
    let finalVisible = false;
    const update = () => setShow(!heroVisible && !finalVisible);

    const heroObs = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0 },
    );
    heroObs.observe(hero);

    let finalObs: IntersectionObserver | undefined;
    if (finalCta) {
      finalObs = new IntersectionObserver(
        ([entry]) => {
          finalVisible = entry.isIntersecting;
          update();
        },
        { threshold: 0 },
      );
      finalObs.observe(finalCta);
    }

    return () => {
      heroObs.disconnect();
      finalObs?.disconnect();
    };
  }, [heroId, finalCtaId]);

  return (
    <div
      data-distraction
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-line bg-ink/90 p-3 backdrop-blur-xl backdrop-saturate-150 transition-transform duration-300 ease-out lg:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <Button href={href} className="w-full justify-center" tabIndex={show ? 0 : -1}>
        {label}
      </Button>
    </div>
  );
}
