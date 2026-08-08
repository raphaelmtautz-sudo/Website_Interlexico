"use client";

import { useRef, type ReactNode } from "react";

/**
 * Leichtgewichtige 3D-Neigung per Zeiger (ohne WebGL). Ersetzt schwere
 * Bild-/Video-Elemente durch eine taktile Interaktion. Bei Maus: kontinuierliche
 * Neigung während des Hovers. Bei Touch (kein Hover-Tracking während Drag, da
 * das mit Scrollen kollidieren würde): einmalige Press-Neigung + leichtes
 * Einsinken beim Antippen, die beim Loslassen zurückfedert. Deaktiviert sich
 * bei "Bewegung reduzieren".
 */
export function TiltCard({
  children,
  className = "",
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function reducedMotion() {
    return (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    );
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || reducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
  }

  function reset() {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  }

  function onTouchPress(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "touch" || reducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) scale(0.97) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
  }

  function onTouchRelease(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "touch") return;
    reset();
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onPointerDown={onTouchPress}
      onPointerUp={onTouchRelease}
      onPointerCancel={onTouchRelease}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
