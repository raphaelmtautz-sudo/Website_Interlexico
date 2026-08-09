"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n";
import { FlagIcon } from "@/components/layout/flag-icons";

const LOCALE_COOKIE = "il-locale";

/** Wechselt die Sprache unter Beibehaltung des aktuellen Pfads (nur das Präfix ändert sich). */
export function LanguageSwitcher({
  lang,
  className = "",
  ariaLabel = "Sprache wählen",
}: {
  lang: Locale;
  className?: string;
  ariaLabel?: string;
}) {
  const pathname = usePathname() ?? `/${lang}`;
  const rest = pathname.replace(/^\/(de|en|es)/, "") || "";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        aria-label={`${lang} — ${ariaLabel}`}
        className="flex h-10 items-center gap-1.5 border border-line px-2.5 text-paper-dim transition-colors hover:border-gold hover:text-gold"
      >
        <FlagIcon locale={lang} />
        <span className="font-sans text-xs uppercase tracking-[0.08em]">{lang}</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={ariaLabel}
          className="absolute right-0 z-50 mt-2 w-44 border border-line bg-ink-raised p-2 shadow-2xl"
        >
          {locales.map((l) => {
            const active = l === lang;
            return (
              <Link
                key={l}
                href={`/${l}${rest}`}
                hrefLang={l}
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  document.cookie = `${LOCALE_COOKIE}=${l};max-age=${60 * 60 * 24 * 365};path=/`;
                  setOpen(false);
                }}
                className={`flex items-center gap-2.5 px-3 py-2.5 font-sans text-sm transition-colors ${
                  active ? "bg-gold/10 text-gold" : "text-paper hover:bg-gold/5 hover:text-gold"
                }`}
              >
                <FlagIcon locale={l} />
                {localeNames[l]}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
