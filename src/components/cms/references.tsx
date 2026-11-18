import type { ReferenceItem } from "@/lib/cms";
import { getCmsLabels } from "@/content/cms-labels";
import type { Locale } from "@/lib/i18n";

/** Logoleiste freigegebener Referenzkunden. Rendert nichts ohne Logos. */
export function LogoStrip({ items, lang }: { items: ReferenceItem[]; lang: Locale }) {
  const logos = items.filter((i) => i.logo.src);
  if (!logos.length) return null;
  const t = getCmsLabels(lang);
  return (
    <div>
      <p className="mb-6 text-center font-sans text-xs uppercase tracking-[0.2em] text-paper-dim">{t.logosTitle}</p>
      <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
        {logos.map((i) => (
          <li key={i.company}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={i.logo.src} alt={i.logo.alt || i.company} loading="lazy" className="h-10 w-auto max-w-[160px] object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Fallbeispiele (nur Einträge mit Titel und Ergebnis). */
export function CaseStudies({ items, lang }: { items: ReferenceItem[]; lang: Locale }) {
  const cases = items.filter((i) => i.caseStudy);
  if (!cases.length) return null;
  const t = getCmsLabels(lang);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {cases.map((i) => (
        <article key={i.company} className="border border-line bg-ink-raised p-8">
          <p className="mb-2 font-sans text-xs uppercase tracking-[0.16em] text-gold">{[i.company, i.industry].filter(Boolean).join(" · ")}</p>
          <h3 className="mb-5 font-display text-2xl text-paper text-balance">{i.caseStudy!.title}</h3>
          <dl className="space-y-4 font-sans text-sm leading-relaxed">
            {i.caseStudy!.situation ? (<div><dt className="text-xs uppercase tracking-[0.12em] text-paper">{t.situation}</dt><dd className="text-paper-dim">{i.caseStudy!.situation}</dd></div>) : null}
            {i.caseStudy!.solution ? (<div><dt className="text-xs uppercase tracking-[0.12em] text-paper">{t.solution}</dt><dd className="text-paper-dim">{i.caseStudy!.solution}</dd></div>) : null}
            <div><dt className="text-xs uppercase tracking-[0.12em] text-paper">{t.result}</dt><dd className="text-paper">{i.caseStudy!.result}</dd></div>
          </dl>
        </article>
      ))}
    </div>
  );
}
