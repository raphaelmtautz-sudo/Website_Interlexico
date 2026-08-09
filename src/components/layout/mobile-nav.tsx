"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeControl } from "@/components/theme/theme-control";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";

interface NavItem {
  href: string;
  label: string;
}

const SWIPE_CLOSE_THRESHOLD = 80;

export function MobileNav({
  items,
  lang,
  dict,
  logoUrl,
  logoAlt,
}: {
  items: NavItem[];
  lang: Locale;
  dict: Dictionary;
  logoUrl?: string;
  logoAlt?: string;
}) {
  const [open, setOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);

  // Scroll sperren und Escape-Handling, solange das Menü offen ist
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }
  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    const dx = Math.max(0, touchDeltaX.current);
    if (panelRef.current) {
      panelRef.current.style.transform = `translateX(${dx}px)`;
      panelRef.current.style.transition = "none";
    }
  }
  function onTouchEnd() {
    if (panelRef.current) {
      panelRef.current.style.transition = "";
      panelRef.current.style.transform = "";
    }
    if (touchDeltaX.current > SWIPE_CLOSE_THRESHOLD) setOpen(false);
    touchStartX.current = null;
    touchDeltaX.current = 0;
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? dict.nav.menuClose : dict.nav.menuOpen}
        aria-expanded={open}
        className="relative flex h-10 w-10 flex-col items-center justify-center gap-[5px] text-paper hover:text-gold"
      >
        <span
          className={`block h-px w-6 bg-current transition-transform duration-300 ease-out ${
            open ? "translate-y-[6px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-px w-6 bg-current transition-opacity duration-200 ease-out ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`block h-px w-6 bg-current transition-transform duration-300 ease-out ${
            open ? "-translate-y-[6px] -rotate-45" : ""
          }`}
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="fixed inset-0 z-[60] flex flex-col bg-ink animate-fade-up"
        >
          <div className="flex h-20 items-center justify-between border-b border-line px-6">
            <Link href={lh(lang, "/")} onClick={() => setOpen(false)} aria-label="Interlexico">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- Logo kommt aus dem CMS (externe Domain).
                <img src={logoUrl} alt={logoAlt || "Interlexico"} className="h-8 w-auto" />
              ) : (
                <span className="font-display text-2xl tracking-wide text-brand-strong">Interlexico</span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={dict.nav.menuClose}
              className="font-sans text-xs uppercase tracking-[0.18em] text-paper-dim hover:text-gold"
            >
              {dict.nav.menuClose}
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-8 px-6 pt-12">
            {items.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${80 + i * 60}ms` }}
                className="animate-fade-up font-display text-4xl text-paper opacity-0 hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-between gap-4 border-t border-line p-6">
            <Button href={lh(lang, "/kontakt")} onClick={() => setOpen(false)}>
              {dict.nav.anfragen}
            </Button>
            <div className="flex items-center gap-4">
              <LanguageSwitcher lang={lang} ariaLabel={dict.nav.sprache} />
              <ThemeControl dict={dict} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
