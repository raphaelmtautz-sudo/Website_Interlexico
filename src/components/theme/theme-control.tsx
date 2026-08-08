"use client";

import { useEffect, useRef, useState } from "react";
import { ThemePref, useTheme } from "@/components/theme/theme-provider";
import type { Dictionary } from "@/dictionaries";

const CONTRAST_KEY = "il-contrast";
const CONTRAST_MIN = 0; // zusätzlicher Kontrast in Prozent
const CONTRAST_MAX = 35;

function readContrast(): number {
  if (typeof window === "undefined") return 0;
  const v = Number(localStorage.getItem(CONTRAST_KEY));
  return Number.isFinite(v) && v >= 0 ? Math.min(CONTRAST_MAX, v) : 0;
}

const FOCUS_KEY = "il-focus";
function readFocus(): boolean {
  return typeof window !== "undefined" && localStorage.getItem(FOCUS_KEY) === "on";
}

export function ThemeControl({ className = "", dict }: { className?: string; dict: Dictionary }) {
  const { pref, setPref } = useTheme();
  const [open, setOpen] = useState(false);
  const OPTIONS: { value: ThemePref; label: string; hint: string }[] = [
    { value: "auto", ...dict.theme.auto },
    { value: "light", ...dict.theme.light },
    { value: "dark", ...dict.theme.dark },
    { value: "contrast", ...dict.theme.contrast },
  ];
  // Lazy-Init: der Slider ist erst nach dem Öffnen im DOM → keine Hydration-Kollision.
  const [contrast, setContrastState] = useState<number>(readContrast);
  const [focus, setFocusState] = useState<boolean>(readFocus);
  const ref = useRef<HTMLDivElement>(null);

  function toggleFocus() {
    const nextVal = !focus;
    setFocusState(nextVal);
    document.documentElement.setAttribute("data-focus", nextVal ? "on" : "off");
    try {
      localStorage.setItem(FOCUS_KEY, nextVal ? "on" : "off");
    } catch {
      /* optional */
    }
  }

  function setContrast(v: number) {
    const clamped = Math.min(CONTRAST_MAX, Math.max(CONTRAST_MIN, v));
    setContrastState(clamped);
    document.documentElement.style.setProperty("--contrast", `${clamped}%`);
    try {
      localStorage.setItem(CONTRAST_KEY, String(clamped));
    } catch {
      /* Speicherung optional */
    }
  }

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={dict.theme.ariaLabel}
        className="flex h-10 w-10 items-center justify-center border border-line text-paper-dim transition-colors hover:border-gold hover:text-gold"
      >
        {/* Kontrast-Symbol (halb gefüllter Kreis) */}
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={dict.theme.menuLabel}
          className="absolute right-0 z-50 mt-2 w-60 border border-line bg-ink-raised p-2 shadow-2xl"
        >
          <p className="px-3 pb-2 pt-1 font-sans text-[10px] uppercase tracking-[0.16em] text-gold">
            {dict.theme.heading}
          </p>
          {OPTIONS.map((opt) => {
            const active = pref === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setPref(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-baseline justify-between gap-3 px-3 py-2.5 text-left font-sans text-sm transition-colors ${
                  active ? "bg-gold/10 text-gold" : "text-paper hover:bg-gold/5 hover:text-gold"
                }`}
              >
                <span>{opt.label}</span>
                <span className="font-sans text-[11px] text-paper-dim">{opt.hint}</span>
              </button>
            );
          })}

          <div className="mt-2 border-t border-line px-3 pb-2 pt-3">
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="il-contrast-range"
                className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold"
              >
                {dict.theme.contrastLabel}
              </label>
              <span className="font-sans text-[11px] text-paper-dim">
                +{Math.round(contrast)}%
              </span>
            </div>
            <input
              id="il-contrast-range"
              type="range"
              min={CONTRAST_MIN}
              max={CONTRAST_MAX}
              step={1}
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              aria-label={dict.theme.contrastAria}
              className="il-range w-full"
            />
          </div>

          <div className="mt-2 border-t border-line px-3 pb-1 pt-3">
            <button
              type="button"
              role="switch"
              aria-checked={focus}
              onClick={toggleFocus}
              className="flex w-full items-center justify-between gap-3 py-1 text-left font-sans text-sm text-paper"
            >
              <span>
                {dict.theme.focusMode}
                <span className="block font-sans text-[11px] text-paper-dim">
                  {dict.theme.focusModeHint}
                </span>
              </span>
              <span
                aria-hidden="true"
                className={`relative h-5 w-9 shrink-0 border transition-colors ${
                  focus ? "border-brand bg-brand/20" : "border-line"
                }`}
              >
                <span
                  className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-all ${
                    focus ? "left-[18px] bg-brand" : "left-[2px] bg-paper-dim"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
