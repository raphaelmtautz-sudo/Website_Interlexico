"use client";

import { useState, type ReactNode } from "react";

/**
 * Kantiges, minimalistisches Accordion — passt zum bestehenden
 * "border statt Schatten"-Designsystem. Ersetzt flach gerenderte Listen
 * (z. B. FAQ), die bei vielen Einträgen zu einer Textwand werden.
 */
export function Accordion({ items }: { items: { question: string; answer: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-gold-dim border-t border-gold-dim">
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-6 text-left"
            >
              <span className="font-display text-2xl text-paper text-balance">{item.question}</span>
              <span aria-hidden="true" className="shrink-0 font-display text-2xl text-brand-text">
                {expanded ? "−" : "+"}
              </span>
            </button>
            {expanded && (
              <div className="animate-fade-up pb-6 font-sans text-sm leading-relaxed text-paper-dim">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
