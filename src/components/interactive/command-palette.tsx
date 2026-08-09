"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";

interface Item {
  label: string;
  href: string;
  hint?: string;
}

export function CommandPalette({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: Item[] = useMemo(() => {
    const t = dict.commandPalette.items;
    return [
      { label: t.start, href: lh(lang, "/"), hint: t.startHint },
      { label: t.kurse, href: lh(lang, "/kurse"), hint: t.kurseHint },
      { label: t.businessEnglish, href: lh(lang, "/kurse/business-english"), hint: t.businessEnglishHint },
      { label: t.daf, href: lh(lang, "/kurse/deutsch-als-fremdsprache"), hint: t.dafHint },
      { label: t.einstufung, href: lh(lang, "/einstufung"), hint: t.einstufungHint },
      { label: t.ueberUns, href: lh(lang, "/ueber-uns"), hint: t.ueberUnsHint },
      { label: t.interlexicoOne, href: lh(lang, "/interlexico-one"), hint: t.interlexicoOneHint },
      { label: t.nachhaltigkeit, href: lh(lang, "/nachhaltigkeit"), hint: t.nachhaltigkeitHint },
      { label: t.kontakt, href: lh(lang, "/kontakt"), hint: t.kontaktHint },
      { label: t.impressum, href: lh(lang, "/rechtliches/impressum") },
      { label: t.datenschutz, href: lh(lang, "/rechtliches/datenschutz") },
      { label: t.agb, href: lh(lang, "/rechtliches/agb") },
    ];
  }, [lang, dict]);

  const results = items.filter((it) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (it.label + " " + (it.hint ?? "")).toLowerCase().includes(q);
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
        setActive(0);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    function onOpen() {
      setOpen(true);
      setQuery("");
      setActive(0);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("il:command-open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("il:command-open", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function go(item: Item | undefined) {
    if (!item) return;
    setOpen(false);
    router.push(item.href);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/70 p-4 pt-[12vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={dict.commandPalette.ariaLabel}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl border border-line bg-ink-raised shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-line px-4">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(results.length - 1, a + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                go(results[active]);
              }
            }}
            placeholder={dict.commandPalette.placeholder}
            aria-label={dict.commandPalette.ariaLabel}
            className="w-full bg-transparent py-4 font-sans text-sm text-paper placeholder:text-paper-dim focus:outline-none"
          />
        </div>
        <ul role="listbox" aria-label={dict.commandPalette.ariaLabel} className="max-h-[50vh] overflow-y-auto py-2">
          {results.length === 0 && (
            <li className="px-4 py-3 font-sans text-sm text-paper-dim">{dict.commandPalette.noResults}</li>
          )}
          {results.map((it, i) => (
            <li key={it.href} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(it)}
                className={`flex w-full items-baseline justify-between gap-4 px-4 py-2.5 text-left font-sans text-sm transition-colors ${
                  i === active ? "bg-brand/10 text-brand" : "text-paper hover:bg-brand/5"
                }`}
              >
                <span>{it.label}</span>
                {it.hint && <span className="text-[11px] text-paper-dim">{it.hint}</span>}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4 border-t border-line px-4 py-2 font-sans text-[10px] uppercase tracking-[0.12em] text-paper-dim">
          <span>↑↓ {dict.commandPalette.selectHint}</span>
          <span>↵ {dict.commandPalette.openHint}</span>
          <span>Esc {dict.commandPalette.closeHint}</span>
        </div>
      </div>
    </div>
  );
}
