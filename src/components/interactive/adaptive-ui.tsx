"use client";

import { useEffect } from "react";

/**
 * Adaptives UI: erkennt Suchverhalten (schnelles/gerichtetes Scrollen) und
 * dämpft dann automatisch dekorative Ablenkungen (setzt data-reading="on" am
 * <html>). Beim Innehalten wird der Zustand wieder aufgehoben. Rein per
 * DOM-Attribut + Timer (kein React-State). Respektiert "Bewegung reduzieren".
 */
export function AdaptiveUI() {
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const el = document.documentElement;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let engaged = false;
    let idle: number | undefined;

    function onScroll() {
      const now = performance.now();
      const y = window.scrollY;
      const dt = now - lastT || 16;
      const velocity = Math.abs(y - lastY) / dt; // px pro ms
      lastY = y;
      lastT = now;

      // > ~400 px/s = zügiges Scannen/Suchen → Ablenkungen dämpfen.
      if (velocity > 0.4 && !engaged) {
        engaged = true;
        el.setAttribute("data-reading", "on");
      }
      if (idle) window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        engaged = false;
        el.removeAttribute("data-reading");
      }, 1100);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idle) window.clearTimeout(idle);
      el.removeAttribute("data-reading");
    };
  }, []);

  return null;
}
