import type { ReactNode } from "react";
import { Section, Eyebrow } from "@/components/ui/section";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";

/** Wiederverwendbare Bausteine für Rechtsseiten — konsistente Typografie. */

export function LegalDoc({
  title,
  intro,
  children,
  eyebrow,
  lang,
  dict,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
  eyebrow: string;
  lang: Locale;
  dict: Dictionary;
}) {
  return (
    <Section className="pt-24 lg:pt-32">
      <div className="max-w-3xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="font-display text-4xl text-paper mb-6 sm:text-5xl">{title}</h1>
        <LegalReviewNotice dict={dict} />
        {lang !== "de" && (
          <p className="mb-6 font-sans text-xs italic leading-relaxed text-paper-dim">
            {dict.legal.germanBindingNotice}
          </p>
        )}
        {intro && (
          <p className="mb-10 font-sans leading-relaxed text-paper-dim">{intro}</p>
        )}
        <div className="space-y-10">{children}</div>
      </div>
    </Section>
  );
}

/** Deutlicher Hinweis: Entwurf, vor Livegang juristisch prüfen. */
export function LegalReviewNotice({ dict }: { dict: Dictionary }) {
  return (
    <div className="mb-10 border border-gold-dim bg-gold/5 p-5">
      <p className="font-sans text-xs uppercase tracking-[0.12em] text-gold mb-2">
        {dict.legal.draftNoticeTitle}
      </p>
      <p className="font-sans text-sm leading-relaxed text-paper-dim">
        {dict.legal.draftNoticeText}
      </p>
    </div>
  );
}

export function LegalH2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-2xl text-paper border-t border-line pt-8">
      {children}
    </h2>
  );
}

export function LegalP({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans text-sm leading-relaxed text-paper-dim">{children}</p>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 font-sans text-sm leading-relaxed text-paper-dim marker:text-gold">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/** Hebt Platzhalter im Fließtext optisch hervor. */
export function PH({ children }: { children: ReactNode }) {
  return <span className="text-paper">[{children}]</span>;
}

/**
 * Zeigt einen Wert aus dem CMS an, oder — falls (noch) nicht gepflegt — den
 * `<PH>`-Platzhalter mit Beschreibung, was dort einzutragen ist.
 */
export function Val({ value, placeholder }: { value?: string | null; placeholder: ReactNode }) {
  return value ? <span className="text-paper">{value}</span> : <PH>{placeholder}</PH>;
}
