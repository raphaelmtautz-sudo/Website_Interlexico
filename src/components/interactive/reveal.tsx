"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Blendet Inhalt beim Hereinscrollen sanft ein (Guided Scrolling).
 * Reduced-Motion-Nutzer sehen alles sofort (CSS-Fallback in globals.css).
 * Inhalt bleibt für Crawler stets im DOM.
 */
export function Reveal({
  children,
  as,
  className = "",
  delay = 0,
  id,
  variant = "up",
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  id?: string;
  variant?: "up" | "scale" | "left" | "right";
}) {
  const Tag = as ?? "div";
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal reveal-${variant} ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
