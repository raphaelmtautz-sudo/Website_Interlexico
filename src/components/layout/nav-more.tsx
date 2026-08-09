"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface NavItem {
  href: string;
  label: string;
}

/** Bündelt sekundäre Nav-Punkte in einem Dropdown, damit die Hauptnavigation nicht überläuft. */
export function NavMore({ label, items }: { label: string; items: NavItem[] }) {
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
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1.5 font-sans text-sm tracking-[0.06em] uppercase text-paper-dim transition-colors hover:text-paper"
      >
        {label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 z-50 mt-3 w-56 border border-line bg-ink-raised p-2 shadow-2xl"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 font-sans text-sm text-paper transition-colors hover:bg-gold/5 hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
