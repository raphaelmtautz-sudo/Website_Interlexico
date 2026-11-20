import Link from "next/link";
import { lh, type Locale } from "@/lib/i18n";

/**
 * Hingucker „Mehr Mitarbeitende. Weniger Kosten pro Kopf.“ (Wunsch 20.11.2026) – ohne Preise,
 * nur das Verhältnis Gruppe vs. Einzeltraining (Angabe deckt sich mit dem Kosten-Ratgeber).
 * Steht unter der Kurzantwort im Kosten-Ratgeber und auf den Gruppentraining-Seiten.
 */
const T = {
  de: {
    title: "Mehr Mitarbeitende. Weniger Kosten pro Kopf.",
    sub: "40 Unterrichtseinheiten – bis zu 7 Teilnehmende",
    pct: "Bis zu 85 %",
    pctText: "geringere Kosten pro Teilnehmenden gegenüber Einzeltraining",
    text: "Je mehr Mitarbeitende gemeinsam lernen, desto wirtschaftlicher wird Ihr Firmensprachtraining.",
    ue: "Trainingsumfang", max: "Max. Teilnehmende", ueVal: "40 UE",
    link: "Zum Gruppentraining",
  },
  en: {
    title: "More employees. Lower cost per head.",
    sub: "40 lessons – up to 7 participants",
    pct: "Up to 85%",
    pctText: "lower cost per participant compared with one-to-one training",
    text: "The more employees learn together, the more cost-effective your corporate language training becomes.",
    ue: "Training scope", max: "Max. participants", ueVal: "40 lessons",
    link: "Go to group training",
  },
  es: {
    title: "Más empleados. Menos coste por persona.",
    sub: "40 sesiones – hasta 7 participantes",
    pct: "Hasta un 85 %",
    pctText: "menos coste por participante frente a la formación individual",
    text: "Cuantos más empleados aprenden juntos, más rentable resulta la formación de idiomas de su empresa.",
    ue: "Volumen de formación", max: "Máx. participantes", ueVal: "40 UE",
    link: "Ver formación en grupo",
  },
} as const;

export function GroupSavings({ lang, course, showLink = true }: { lang: Locale; course?: string; showLink?: boolean }) {
  const t = T[lang] ?? T.de;
  return (
    <aside className="mt-8 border border-gold/40 bg-ink-raised p-6 sm:p-8" aria-label={t.title}>
      <p className="font-display text-2xl text-paper sm:text-3xl">{t.title}</p>
      <p className="mt-1 font-sans text-sm text-paper-dim">{t.sub}</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-[1.4fr_1fr_1fr] sm:items-end">
        <div>
          <p className="font-display text-5xl leading-none text-gold">{t.pct}</p>
          <p className="mt-2 font-sans text-sm text-paper">{t.pctText}</p>
        </div>
        <div>
          <p className="font-display text-4xl leading-none text-paper">{t.ueVal}</p>
          <p className="mt-2 font-sans text-xs uppercase tracking-[0.16em] text-paper-dim">{t.ue}</p>
        </div>
        <div>
          <p className="font-display text-4xl leading-none text-paper">7</p>
          <p className="mt-2 font-sans text-xs uppercase tracking-[0.16em] text-paper-dim">{t.max}</p>
        </div>
      </div>
      <p className="mt-6 font-sans leading-relaxed text-paper-dim">{t.text}</p>
      {showLink ? (
        <Link href={lh(lang, `/kurse/${course ?? "business-english"}/gruppentraining`)} className="link-underline mt-4 inline-block font-sans text-sm text-paper">
          {t.link} →
        </Link>
      ) : null}
    </aside>
  );
}
