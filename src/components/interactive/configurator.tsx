"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getCourseTypes } from "@/content/course-types";
import { getIndustries } from "@/content/industries";
import { industrySlugByName } from "@/content/branchen";
import { configuratorSummaryText, getConfiguratorContent } from "@/content/configurator";
import { OfferDialog } from "@/components/interactive/offer-dialog";
import { lh, type Locale } from "@/lib/i18n";
import { track } from "@/lib/track";
import { SITE } from "@/lib/site";
import type { Dictionary } from "@/dictionaries";
import {
  MAX_PARTICIPANTS,
  MAX_PER_GROUP,
  buildPlan,
  clampParticipants,
  toContactParams,
  type ConfiguratorState,
  type Goal,
} from "@/lib/configurator-plan";

const STORAGE_KEY = "il-configurator-v2";

type StepKey = "sprache" | "zielgruppe" | "teilnehmer" | "niveau" | "ziele" | "durchfuehrung" | "umfang";

interface Saved {
  state: ConfiguratorState;
  step: number;
  done: boolean;
}

/**
 * Trainings-Konfigurator als kurze Bedarfsanalyse: Sprache, Zielgruppe,
 * Teilnehmerzahl, Niveau, Schwerpunkte, Durchführung, Umfang. Am Ende steht
 * eine begründete Empfehlung (Format, Gruppen, Umfang, Beispiel-Trainingsplan)
 * ohne Preise; die Auswahl wird vollständig an das Kontaktformular übergeben.
 * Jeder Schritt ist optional, "Weiter" ist nie gesperrt.
 */
export function Configurator({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const c = getConfiguratorContent(lang);
  const activeCourses = useMemo(() => getCourseTypes(lang).filter((x) => x.status === "aktiv"), [lang]);
  const industries = useMemo(() => getIndustries(lang), [lang]);

  const initial: ConfiguratorState = useMemo(
    () => ({
      courseSlug: activeCourses[0]?.slug ?? "",
      audience: "",
      industry: "",
      participants: 1,
      level: "",
      goals: [],
      delivery: "",
      scope: "empfehlung",
    }),
    [activeCourses],
  );

  const [state, setState] = useState<ConfiguratorState>(initial);
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [resume, setResume] = useState<Saved | null>(null);
  const [offerOpen, setOfferOpen] = useState(false);
  const started = useRef(false);
  const moved = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const steps: StepKey[] = useMemo(
    () => [
      ...(activeCourses.length > 1 ? (["sprache"] as const) : []),
      "zielgruppe",
      "teilnehmer",
      "niveau",
      "ziele",
      "durchfuehrung",
      "umfang",
    ],
    [activeCourses.length],
  );
  const step = steps[Math.min(stepIndex, steps.length - 1)];

  const course = activeCourses.find((x) => x.slug === state.courseSlug) ?? activeCourses[0];
  const plan = useMemo(() => buildPlan(state), [state]);
  const n = clampParticipants(state.participants);
  const showIndustry = course?.slug === "business-english" && industries.length > 0;

  // Unfertige Konfiguration aus einer früheren Sitzung anbieten statt verwerfen.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Saved;
      if (!saved?.state || !activeCourses.some((x) => x.slug === saved.state.courseSlug)) return;
      const differs = JSON.stringify(saved.state) !== JSON.stringify(initial) || saved.step > 0;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- einmaliges Einlesen von localStorage beim Mount.
      if (differs) setResume(saved);
    } catch {
      // localStorage evtl. nicht verfügbar (Privatmodus) — ignorieren.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!started.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, step: stepIndex, done } satisfies Saved));
    } catch {
      // ignorieren
    }
  }, [state, stepIndex, done]);

  // Fokus auf die Schrittüberschrift, sobald der Nutzer navigiert hat (nicht beim
  // ersten Rendern — sonst springt die Startseite zum Konfigurator).
  useEffect(() => {
    if (!moved.current) return;
    headingRef.current?.focus({ preventScroll: true });
    const top = rootRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [stepIndex, done]);

  if (!course) return null;

  function markStarted() {
    if (started.current) return;
    started.current = true;
    track("configurator_start", { course: state.courseSlug });
  }

  function update(patch: Partial<ConfiguratorState>) {
    markStarted();
    setResume(null);
    setState((s) => ({ ...s, ...patch }));
  }

  function toggleGoal(g: Goal) {
    update({ goals: state.goals.includes(g) ? state.goals.filter((x) => x !== g) : [...state.goals, g] });
  }

  function go(to: number) {
    markStarted();
    moved.current = true;
    setResume(null);
    setStepIndex(Math.max(0, Math.min(steps.length - 1, to)));
  }

  function next() {
    track("configurator_step", { step });
    if (stepIndex >= steps.length - 1) finish();
    else go(stepIndex + 1);
  }

  function finish() {
    markStarted();
    moved.current = true;
    setResume(null);
    setDone(true);
    track("configurator_complete", {
      course: state.courseSlug,
      format: plan.kind,
      groups: String(plan.groups.length),
      units: String(plan.units),
      level: state.level || "offen",
    });
  }

  function restart() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignorieren
    }
    moved.current = true;
    setResume(null);
    setState(initial);
    setDone(false);
    setStepIndex(0);
  }

  function applyResume() {
    if (!resume) return;
    started.current = true;
    setState({ ...initial, ...resume.state });
    setStepIndex(Math.min(resume.step, steps.length - 1));
    setDone(resume.done);
    setResume(null);
  }

  // PDF über den Druckdialog des Browsers: Empfehlung in ein eigenes, helles
  // Fenster kopieren (gleiche Stylesheets) und dort drucken. Keine Preise,
  // keine Zusatzbibliothek. Blockiert der Browser das Fenster, wird die Seite gedruckt.
  function printResult() {
    const area = resultRef.current;
    if (!area) return;
    track("configurator_pdf", { format: plan.kind });
    const w = window.open("", "_blank");
    if (!w) {
      window.print();
      return;
    }
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((el) => el.outerHTML)
      .join("");
    w.document.write(
      `<!DOCTYPE html><html lang="${lang}" data-theme="light" class="${document.documentElement.className}"><head><meta charset="utf-8"><title>${c.pdf.docTitle}</title>${styles}</head><body class="${document.body.className.replace("grain", "")} il-print-doc">${area.outerHTML}</body></html>`,
    );
    w.document.close();
    const go = () => {
      w.focus();
      w.print();
    };
    if (w.document.readyState === "complete") setTimeout(go, 300);
    else w.addEventListener("load", () => setTimeout(go, 100));
  }

  const contactHref = `${lh(lang, "/kontakt")}?${toContactParams(state, plan).toString()}`;
  const optLabel = <T extends string>(opts: { value: T; label: string }[], v: string) =>
    opts.find((o) => o.value === v)?.label;
  const industrySlug = state.industry ? industrySlugByName(lang, state.industry) : undefined;

  const summaryRows: [string, string | undefined][] = [
    [c.summary.course, course.shortName],
    [c.summary.audience, optLabel(c.audiences, state.audience)],
    [c.summary.participants, `${n} ${c.participants.unit(n)}`],
    [c.summary.level, optLabel(c.levels, state.level)],
    [c.summary.goals, state.goals.length ? state.goals.map((g) => optLabel(c.goals, g)).join(", ") : undefined],
    [c.summary.delivery, optLabel(c.deliveries, state.delivery)],
    [c.summary.scope, state.scope === "empfehlung" ? undefined : optLabel(c.scopes, state.scope)],
  ];

  return (
    <div ref={rootRef} className="scroll-mt-28">
      {resume && (
        <div className="mb-4 flex flex-col gap-3 border border-gold-dim bg-gold/5 p-4 animate-fade-up sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-sm text-paper-dim">{c.resume.text}</p>
          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={applyResume}
              className="border border-brand px-4 py-2 font-sans text-xs uppercase tracking-[0.08em] text-brand-text transition-colors hover:bg-brand hover:text-on-brand"
            >
              {c.resume.continue}
            </button>
            <button
              type="button"
              onClick={restart}
              className="font-sans text-xs uppercase tracking-[0.08em] text-paper-dim hover:text-paper"
            >
              {c.resume.restart}
            </button>
          </div>
        </div>
      )}

      {!done ? (
        <div className="grid gap-px border border-line bg-line lg:grid-cols-5">
          {/* Schritte */}
          <div className="bg-ink p-6 sm:p-8 lg:col-span-3">
            <Progress current={stepIndex} steps={steps} label={c.progress(stepIndex + 1, steps.length)} onJump={go} titles={c.steps} />

            <h3
              ref={headingRef}
              tabIndex={-1}
              className="mt-8 font-display text-2xl leading-snug text-paper text-balance focus:outline-none sm:text-3xl"
            >
              {c.steps[step].title}
            </h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-paper-dim">{c.steps[step].hint}</p>

            <div className="mt-6 animate-fade-up" key={step}>
              {step === "sprache" && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {activeCourses.map((x) => (
                    <Choice
                      key={x.slug}
                      active={x.slug === course.slug}
                      onClick={() => update({ courseSlug: x.slug, industry: x.slug === "business-english" ? state.industry : "" })}
                      hint={c.courseHints[x.slug]}
                    >
                      {x.name}
                    </Choice>
                  ))}
                </div>
              )}

              {step === "zielgruppe" && (
                <div className="space-y-6">
                  <div className="grid gap-2">
                    {c.audiences.map((a) => (
                      <Choice
                        key={a.value}
                        active={state.audience === a.value}
                        onClick={() => update({ audience: state.audience === a.value ? "" : a.value })}
                        hint={a.hint}
                      >
                        {a.label}
                      </Choice>
                    ))}
                  </div>
                  {showIndustry && (
                    <div>
                      <p className="mb-3 font-sans text-xs uppercase tracking-[0.12em] text-gold">{c.industryLabel}</p>
                      <div className="flex flex-wrap gap-2">
                        {industries.map((i) => (
                          <Choice key={i} compact active={state.industry === i} onClick={() => update({ industry: state.industry === i ? "" : i })}>
                            {i}
                          </Choice>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === "teilnehmer" && (
                <div>
                  <div className="flex items-stretch">
                    <StepBtn label={c.participants.fewer} onClick={() => update({ participants: clampParticipants(n - 1) })}>
                      −
                    </StepBtn>
                    <input
                      type="number"
                      min={1}
                      max={MAX_PARTICIPANTS}
                      value={n}
                      onChange={(e) => update({ participants: clampParticipants(Number(e.target.value)) })}
                      aria-label={c.summary.participants}
                      className="il-range-num w-24 border-y border-line bg-transparent text-center font-display text-3xl text-paper focus:border-brand focus:outline-none"
                    />
                    <StepBtn label={c.participants.more} onClick={() => update({ participants: clampParticipants(n + 1) })}>
                      +
                    </StepBtn>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={MAX_PARTICIPANTS}
                    value={n}
                    onChange={(e) => update({ participants: clampParticipants(Number(e.target.value)) })}
                    aria-label={c.participants.slider}
                    className="il-range mt-4 w-full"
                  />
                  <GroupChips plan={plan} c={c} className="mt-6" />
                  <p className="mt-3 font-sans text-sm leading-relaxed text-paper-dim" aria-live="polite">
                    {c.format.name(plan)}: {c.format.why(plan, n)}
                  </p>
                </div>
              )}

              {step === "niveau" && (
                <div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {c.levels.map((l) => (
                      <Choice
                        key={l.value}
                        active={state.level === l.value}
                        onClick={() => update({ level: state.level === l.value ? "" : l.value })}
                        hint={l.hint}
                      >
                        {l.label}
                      </Choice>
                    ))}
                  </div>
                  <Link
                    href={lh(lang, "/einstufung")}
                    className="link-underline mt-5 inline-block font-sans text-sm uppercase tracking-[0.08em] text-brand-text"
                  >
                    {c.selfTest}
                  </Link>
                </div>
              )}

              {step === "ziele" && (
                <div>
                  <div className="flex flex-wrap gap-2">
                    {c.goals.map((g) => (
                      <Choice key={g.value} compact active={state.goals.includes(g.value)} onClick={() => toggleGoal(g.value)}>
                        {g.label}
                      </Choice>
                    ))}
                  </div>
                  <p className="mt-4 font-sans text-xs uppercase tracking-[0.1em] text-paper-dim" aria-live="polite">
                    {c.goalsHint(state.goals.length)}
                  </p>
                </div>
              )}

              {step === "durchfuehrung" && (
                <div className="grid gap-2 sm:grid-cols-3">
                  {c.deliveries.map((d) => (
                    <Choice
                      key={d.value}
                      active={state.delivery === d.value}
                      onClick={() => update({ delivery: state.delivery === d.value ? "" : d.value })}
                      hint={d.hint}
                    >
                      {d.label}
                    </Choice>
                  ))}
                </div>
              )}

              {step === "umfang" && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {c.scopes.map((s) => (
                    <Choice key={s.value} active={state.scope === s.value} onClick={() => update({ scope: s.value })} hint={s.hint}>
                      {s.label}
                    </Choice>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
              <button
                type="button"
                onClick={() => go(stepIndex - 1)}
                disabled={stepIndex === 0}
                className="font-sans text-sm uppercase tracking-[0.08em] text-paper-dim transition-colors hover:text-paper disabled:invisible"
              >
                ← {c.nav.back}
              </button>
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center justify-center border border-brand bg-brand px-7 py-3 font-sans text-sm uppercase tracking-[0.08em] text-on-brand transition-colors duration-300 hover:border-brand-strong hover:bg-brand-strong"
              >
                {stepIndex >= steps.length - 1 ? c.nav.showResult : `${c.nav.next} →`}
              </button>
            </div>
          </div>

          {/* Live-Zusammenfassung */}
          <aside className="flex flex-col gap-6 bg-ink-raised p-6 sm:p-8 lg:col-span-2">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold">{c.summary.title}</p>
              <dl className="mt-4 space-y-2 font-sans text-sm text-paper-dim">
                {summaryRows.map(([term, value]) => (
                  <div key={term} className="flex justify-between gap-4">
                    <dt>{term}</dt>
                    <dd className={`text-right ${value ? "text-paper" : "italic text-paper-dim/70"}`}>{value ?? c.summary.open}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="border-t border-line pt-5">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold">{c.summary.preview}</p>
              <p className="mt-2 font-display text-xl leading-snug text-paper">{c.format.name(plan)}</p>
              <p className="mt-1 font-sans text-sm text-paper-dim">{c.result.scopeValue(plan.units)}</p>
              <GroupChips plan={plan} c={c} className="mt-4" />
            </div>
            <button
              type="button"
              onClick={finish}
              className="mt-auto font-sans text-xs uppercase tracking-[0.08em] text-brand-text underline-offset-4 hover:underline"
            >
              {c.nav.showResult} →
            </button>
          </aside>
        </div>
      ) : (
        <div ref={resultRef} className="il-print-area border border-line bg-ink">
          {/* Nur in der PDF-/Druckfassung */}
          <div className="il-print-only border-b border-line p-6">
            <div className="flex items-baseline justify-between gap-6">
              <p className="font-display text-3xl text-brand-text">Interlexico</p>
              <p className="font-sans text-xs text-paper-dim">{c.pdf.created(new Date().toLocaleDateString(lang))}</p>
            </div>
            <p className="mt-1 font-sans text-xs uppercase tracking-[0.12em] text-gold">Language. Connected.</p>
            <p className="mt-6 font-sans text-xs uppercase tracking-[0.12em] text-gold">{c.pdf.selection}</p>
            <dl className="mt-2 grid grid-cols-2 gap-x-8 gap-y-1 font-sans text-sm text-paper-dim">
              {summaryRows
                .filter((r): r is [string, string] => Boolean(r[1]))
                .map(([term, value]) => (
                  <div key={term} className="flex justify-between gap-4">
                    <dt>{term}</dt>
                    <dd className="text-right text-paper">{value}</dd>
                  </div>
                ))}
            </dl>
          </div>
          {/* Kopf */}
          <div className="flex flex-col gap-6 border-b border-line p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold">{c.result.eyebrow}</p>
              <h3 ref={headingRef} tabIndex={-1} className="mt-3 font-display text-3xl leading-tight text-paper text-balance focus:outline-none sm:text-4xl">
                {c.result.title}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-paper-dim">{c.result.intro}</p>
            </div>
            <div className="il-no-print flex shrink-0 flex-wrap gap-5">
              <button
                type="button"
                onClick={printResult}
                className="font-sans text-xs uppercase tracking-[0.08em] text-brand-text hover:underline underline-offset-4"
              >
                {c.pdf.button}
              </button>
              <button
                type="button"
                onClick={() => {
                  moved.current = true;
                  setDone(false);
                }}
                className="font-sans text-xs uppercase tracking-[0.08em] text-brand-text hover:underline underline-offset-4"
              >
                {c.nav.edit}
              </button>
              <button type="button" onClick={restart} className="font-sans text-xs uppercase tracking-[0.08em] text-paper-dim hover:text-paper">
                {c.nav.restart}
              </button>
            </div>
          </div>

          <div className="grid gap-px bg-line lg:grid-cols-2">
            {/* Format, Umfang, Durchführung */}
            <div className="space-y-8 bg-ink p-6 sm:p-8">
              <ResultBlock title={c.result.formatTitle}>
                <p className="font-display text-2xl text-brand-text">{c.format.name(plan)}</p>
                <p className="mt-2 font-sans text-sm leading-relaxed text-paper-dim">{c.format.why(plan, n)}</p>
                <GroupChips plan={plan} c={c} className="mt-4" />
                {plan.splitByLevel && <Note>{c.format.splitByLevel}</Note>}
                {plan.suggestCoaching && <Note>{c.format.coaching}</Note>}
              </ResultBlock>

              <ResultBlock title={c.result.scopeTitle}>
                <p className="font-display text-2xl text-brand-text">{c.result.scopeValue(plan.units)}</p>
                <p className="mt-2 font-sans text-sm leading-relaxed text-paper-dim">{c.result.scopeReason[plan.unitsReason]}</p>
                <p className="mt-3 font-sans text-[11px] leading-relaxed text-paper-dim">{c.result.scopeNote}</p>
              </ResultBlock>

              <ResultBlock title={c.result.deliveryTitle}>
                <p className="font-sans text-sm leading-relaxed text-paper">{c.result.deliveryText[state.delivery]}</p>
              </ResultBlock>
            </div>

            {/* Trainingsplan */}
            <div className="bg-ink-raised p-6 sm:p-8">
              <ResultBlock title={c.result.planTitle}>
                <ol className="mt-2 space-y-5 border-l border-gold-dim pl-6">
                  <PlanItem title={c.result.planStart.title} items={c.result.planStart.items} />
                  {(state.goals.length
                    ? c.goals.filter((g) => state.goals.includes(g.value)).map((g) => g.module)
                    : [c.result.planGeneric]
                  ).map((m) => (
                    <PlanItem key={m.title} title={m.title} items={m.items} />
                  ))}
                  {state.industry && showIndustry && <PlanItem title={c.result.planIndustry(state.industry)} items={[]} />}
                  <PlanItem title={c.result.planEnd.title} items={c.result.planEnd.items} />
                </ol>
                <p className="mt-5 font-sans text-[11px] leading-relaxed text-paper-dim">{c.result.planNote}</p>
                {industrySlug && (
                  <Link
                    href={lh(lang, `/branchen/${industrySlug}`)}
                    className="il-no-print link-underline mt-4 inline-block font-sans text-xs uppercase tracking-[0.08em] text-brand-text"
                  >
                    {c.result.industryLink(state.industry)}
                  </Link>
                )}
                {(state.level === "unbekannt" || state.level === "") && (
                  <Link
                    href={lh(lang, "/einstufung")}
                    className="il-no-print link-underline mt-4 block font-sans text-xs uppercase tracking-[0.08em] text-brand-text"
                  >
                    {c.selfTest}
                  </Link>
                )}
              </ResultBlock>
            </div>
          </div>

          {/* Vorteile */}
          <div className="border-t border-line p-6 sm:p-8">
            <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold">{c.result.includedTitle}</p>
            <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {c.result.included.map((i) => (
                <li key={i.title} className="border-t border-gold-dim pt-4">
                  <p className="font-display text-lg text-paper">{i.title}</p>
                  <p className="mt-1 font-sans text-sm leading-relaxed text-paper-dim">{i.text}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Nächste Schritte + CTA */}
          <div className="grid gap-px border-t border-line bg-line lg:grid-cols-5">
            <div className="bg-ink p-6 sm:p-8 lg:col-span-3 il-print-full">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold">{c.result.nextTitle}</p>
              <ol className="mt-5 space-y-4">
                {c.result.next.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="font-display text-2xl leading-none text-gold" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-sans text-sm text-paper">{s.title}</p>
                      <p className="font-sans text-sm leading-relaxed text-paper-dim">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="il-no-print flex flex-col justify-center gap-4 bg-brand/5 p-6 sm:p-8 lg:col-span-2">
              <button
                type="button"
                onClick={() => {
                  track("cta_click", { cta: "angebot", place: "konfigurator" });
                  setOfferOpen(true);
                }}
                aria-haspopup="dialog"
                className="inline-flex w-full items-center justify-center border border-brand bg-brand px-7 py-3.5 text-center font-sans text-sm uppercase tracking-[0.08em] text-on-brand transition-colors duration-300 hover:border-brand-strong hover:bg-brand-strong"
              >
                {c.result.cta}
              </button>
              <p className="text-center font-sans text-[11px] text-paper-dim">
                {c.result.ctaNote} · {dict.contactForm.antwortHinweis}
              </p>
              <Link
                href={lh(lang, "/kontakt")}
                onClick={() => track("cta_click", { cta: "beratung", place: "konfigurator" })}
                className="text-center font-sans text-xs uppercase tracking-[0.08em] text-brand-text underline-offset-4 hover:underline"
              >
                {c.result.secondary}
              </Link>
            </div>
          </div>
          <div className="il-print-only border-t border-line p-6 font-sans text-xs leading-relaxed text-paper-dim">
            <p>{c.pdf.footer}</p>
            <p className="mt-2 text-paper">
              {SITE.url.replace("https://", "")} · {SITE.inquiryEmail}
            </p>
          </div>
        </div>
      )}

      <OfferDialog
        open={offerOpen}
        onClose={() => setOfferOpen(false)}
        lang={lang}
        dict={dict}
        c={c}
        state={state}
        plan={plan}
        courseName={course.name}
        summaryLines={[[c.result.formatTitle, c.format.name(plan)], [c.result.scopeTitle, c.result.scopeValue(plan.units)], ...summaryRows.filter((r): r is [string, string] => Boolean(r[1]) && r[0] !== c.summary.scope)]}
        summaryText={configuratorSummaryText(lang, state, plan, c.format.name(plan))}
        fallbackHref={contactHref}
      />
    </div>
  );
}

type C = ReturnType<typeof getConfiguratorContent>;

function Progress({
  current,
  steps,
  label,
  onJump,
  titles,
}: {
  current: number;
  steps: StepKey[];
  label: string;
  onJump: (i: number) => void;
  titles: C["steps"];
}) {
  return (
    <div>
      <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold">{label}</p>
      <ol className="mt-3 flex gap-1.5">
        {steps.map((s, i) => (
          <li key={s} className="flex-1">
            <button
              type="button"
              onClick={() => onJump(i)}
              aria-label={`${i + 1}. ${titles[s].title}`}
              aria-current={i === current ? "step" : undefined}
              className={`block h-1.5 w-full transition-colors ${i <= current ? "bg-brand" : "bg-line hover:bg-brand/40"}`}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}

function GroupChips({ plan, c, className = "" }: { plan: ReturnType<typeof buildPlan>; c: C; className?: string }) {
  if (plan.kind === "einzel") return null;
  return (
    <div className={className}>
      <p className="mb-2 font-sans text-[10px] uppercase tracking-[0.14em] text-paper-dim">
        {plan.groups.length} {plan.groups.length === 1 ? c.format.group : c.format.groups} · {c.format.perGroup(MAX_PER_GROUP)}
      </p>
      <div className="flex flex-wrap gap-2">
        {plan.groups.map((size, i) => (
          <span key={i} className="border border-brand/50 bg-brand/5 px-3 py-1.5 font-sans text-xs text-brand-text">
            {c.format.group} {i + 1} · {size}
          </span>
        ))}
      </div>
    </div>
  );
}

function ResultBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="mb-3 font-sans text-xs uppercase tracking-[0.12em] text-gold">{title}</p>
      {children}
    </section>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 border-l-2 border-gold pl-3 font-sans text-sm leading-relaxed text-paper-dim">{children}</p>;
}

function PlanItem({ title, items }: { title: string; items: string[] }) {
  return (
    <li className="relative">
      <span aria-hidden="true" className="absolute -left-[1.85rem] top-1.5 h-2 w-2 bg-gold" />
      <p className="font-sans text-sm text-paper">{title}</p>
      {items.length > 0 && (
        <ul className="mt-1 space-y-0.5">
          {items.map((i) => (
            <li key={i} className="font-sans text-sm leading-relaxed text-paper-dim">
              {i}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function StepBtn({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex w-12 items-center justify-center border border-line font-display text-2xl text-paper transition-colors hover:border-brand hover:text-brand-text"
    >
      {children}
    </button>
  );
}

function Choice({
  active,
  onClick,
  children,
  hint,
  compact = false,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  hint?: string;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border ${compact ? "px-3 py-2" : "px-4 py-3"} text-left font-sans text-sm transition-colors ${
        active ? "border-brand bg-brand/5 text-brand-text" : "border-line text-paper-dim hover:border-brand hover:text-paper"
      }`}
    >
      <span className="block">{children}</span>
      {hint && <span className="mt-0.5 block text-xs text-paper-dim">{hint}</span>}
    </button>
  );
}
