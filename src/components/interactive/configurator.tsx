"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getCourseTypes } from "@/content/course-types";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";
import { getConfiguratorText } from "@/lib/dynamic-strings";

const MAX_PER_GROUP = 7;
const MAX_PARTICIPANTS = 60;
const STORAGE_KEY = "il-configurator-state";

/** Leitet aus der Teilnehmerzahl Format und Gruppenaufteilung ab (max. 7/Gruppe). */
function planFor(participants: number, dict: Dictionary, lang: Locale) {
  const text = getConfiguratorText(lang);
  const n = Math.max(1, Math.min(MAX_PARTICIPANTS, participants));
  if (n === 1) {
    return {
      formatSlug: "einzelunterricht",
      formatName: dict.configurator.einzelunterricht,
      groups: [1],
      note: dict.configurator.einzelunterrichtNote,
    };
  }
  const groupCount = Math.ceil(n / MAX_PER_GROUP);
  const base = Math.floor(n / groupCount);
  const rem = n % groupCount;
  const groups = Array.from({ length: groupCount }, (_, i) => base + (i < rem ? 1 : 0));
  if (groupCount === 1) {
    return {
      formatSlug: "gruppentraining",
      formatName: text.einGruppe(),
      groups,
      note: text.einGruppeNote(n, MAX_PER_GROUP),
    };
  }
  return {
    formatSlug: "klassentraining",
    formatName: text.mehrGruppen(groupCount),
    groups,
    note: text.mehrGruppenNote(n, groupCount, MAX_PER_GROUP),
  };
}

/**
 * Teilnehmer-gesteuerter Konfigurator: Kurs & Ziel wählen, Teilnehmerzahl
 * einstellen — Format und Gruppenaufteilung (max. 7 pro Gruppe) werden
 * automatisch berechnet und live visualisiert.
 */
export function Configurator({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const GOALS = dict.configurator.goals;
  const activeCourses = useMemo(
    () => getCourseTypes(lang).filter((c) => c.status === "aktiv"),
    [lang],
  );
  const [courseSlug, setCourseSlug] = useState(activeCourses[0]?.slug ?? "");
  const course = activeCourses.find((c) => c.slug === courseSlug) ?? activeCourses[0];

  const [participants, setParticipants] = useState(1);
  const [goal, setGoal] = useState<(typeof GOALS)[number]["value"]>("verhandlung");
  const [resumeState, setResumeState] = useState<{
    courseSlug: string;
    participants: number;
    goal: string;
  } | null>(null);

  // Beim ersten Laden: unfertige Konfiguration aus einer früheren Sitzung
  // anbieten, statt sie stillschweigend zu verwerfen (Absprung-Rettung).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { courseSlug: string; participants: number; goal: string };
      const isMeaningfullyDifferent =
        saved.participants !== 1 || saved.goal !== "verhandlung" || saved.courseSlug !== (activeCourses[0]?.slug ?? "");
      if (isMeaningfullyDifferent && activeCourses.some((c) => c.slug === saved.courseSlug)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- einmaliges Einlesen von localStorage beim Mount, kein externer Sync-Loop.
        setResumeState(saved);
      }
    } catch {
      // localStorage evtl. nicht verfügbar (Privacy-/Inkognito-Modus) — ignorieren.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ courseSlug, participants, goal }));
    } catch {
      // ignorieren
    }
  }, [courseSlug, participants, goal]);

  const plan = useMemo(() => planFor(participants, dict, lang), [participants, dict, lang]);

  if (!course) return null;

  function applyResume() {
    if (!resumeState) return;
    setCourseSlug(resumeState.courseSlug);
    setParticipants(resumeState.participants);
    setGoal(resumeState.goal as (typeof GOALS)[number]["value"]);
    setResumeState(null);
  }

  function dismissResume() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignorieren
    }
    setResumeState(null);
  }

  const format = course.formats.find((f) => f.slug === plan.formatSlug) ?? course.formats[0];
  const goalCopy = GOALS.find((g) => g.value === goal)?.copy ?? "";

  // Echte Kostenspanne aus den vorhandenen Format-Preisen (content/course-types) —
  // kein erfundener Paketpreis. Einzelunterricht: der reale Preis pro Einheit.
  // Gruppe/Klasse: realer Preis pro Person × tatsächliche Teilnehmerzahl = realer
  // Gesamtpreis pro Einheit für die Gruppe, Rechenweg wird transparent gezeigt.
  const costEstimate =
    !format.priceFrom
      ? dict.configurator.preisAufAnfrage
      : format.kind === "einzel"
        ? `ab ${format.priceFrom} ${dict.configurator.proEinheit}`
        : `ab ${format.priceFrom * participants} ${dict.configurator.proEinheitGruppe} (${format.priceFrom} ${dict.configurator.proEinheitRechnung.replace("{n}", String(participants))})`;
  const bookingHref = `${lh(lang, "/kontakt")}?kurs=${course.slug}&format=${plan.formatSlug}&teilnehmer=${participants}`;

  function setCount(v: number) {
    setParticipants(Math.max(1, Math.min(MAX_PARTICIPANTS, Math.round(v || 1))));
  }

  return (
    <div>
      {resumeState && (
        <div className="mb-4 flex flex-col gap-3 border border-gold-dim bg-gold/5 p-4 animate-fade-up sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-sm text-paper-dim">{dict.configurator.resumeText}</p>
          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={applyResume}
              className="border border-brand px-4 py-2 font-sans text-xs uppercase tracking-[0.08em] text-brand transition-colors hover:bg-brand hover:text-on-brand"
            >
              {dict.configurator.resumeContinue}
            </button>
            <button
              type="button"
              onClick={dismissResume}
              className="font-sans text-xs uppercase tracking-[0.08em] text-paper-dim hover:text-paper"
            >
              {dict.configurator.resumeRestart}
            </button>
          </div>
        </div>
      )}
      <div className="grid gap-px border border-line bg-line lg:grid-cols-5">
      {/* Steuerung */}
      <div className="space-y-8 bg-ink p-8 lg:col-span-3">
        {activeCourses.length > 1 && (
          <Field label={dict.configurator.sprache}>
            <div className="grid gap-2 sm:grid-cols-2">
              {activeCourses.map((c) => (
                <Choice key={c.slug} active={c.slug === course.slug} onClick={() => setCourseSlug(c.slug)}>
                  {c.name}
                </Choice>
              ))}
            </div>
          </Field>
        )}

        <Field label={dict.configurator.teilnehmerzahl}>
          <div className="flex items-stretch">
            <StepBtn label={dict.configurator.weniger} onClick={() => setCount(participants - 1)}>
              −
            </StepBtn>
            <input
              type="number"
              min={1}
              max={MAX_PARTICIPANTS}
              value={participants}
              onChange={(e) => setCount(Number(e.target.value))}
              aria-label={dict.configurator.teilnehmerzahl}
              className="il-range-num w-24 border-y border-line bg-transparent text-center font-display text-3xl text-paper focus:border-brand focus:outline-none"
            />
            <StepBtn label={dict.configurator.mehr} onClick={() => setCount(participants + 1)}>
              +
            </StepBtn>
          </div>
          <input
            type="range"
            min={1}
            max={MAX_PARTICIPANTS}
            value={participants}
            onChange={(e) => setCount(Number(e.target.value))}
            aria-label={dict.configurator.perRegler}
            className="il-range mt-4 w-full"
          />
        </Field>

        <Field label={dict.configurator.ziel}>
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <Choice key={g.value} active={goal === g.value} onClick={() => setGoal(g.value)} compact>
                {g.label}
              </Choice>
            ))}
          </div>
        </Field>
      </div>

      {/* Live-Zusammenfassung */}
      <div className="flex flex-col justify-between gap-8 bg-ink-raised p-8 lg:col-span-2">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold">
            {dict.configurator.empfehlung}
          </p>
          <p className="mt-3 font-display text-2xl leading-snug text-paper">
            {plan.formatName}
          </p>
          <p className="mt-2 font-sans text-sm leading-relaxed text-paper-dim">
            {plan.note}
          </p>

          {/* Gruppen-Visualisierung */}
          {participants > 1 && (
            <div className="mt-6">
              <p className="mb-2 font-sans text-[10px] uppercase tracking-[0.14em] text-paper-dim">
                {plan.groups.length} {plan.groups.length === 1 ? dict.configurator.gruppe : dict.configurator.gruppen} · max. {MAX_PER_GROUP}/{dict.configurator.gruppe}
              </p>
              <div className="flex flex-wrap gap-2">
                {plan.groups.map((size, i) => (
                  <span
                    key={i}
                    className="border border-brand/50 bg-brand/5 px-3 py-1.5 font-sans text-xs text-brand"
                  >
                    {dict.configurator.gruppe} {i + 1} · {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          <dl className="mt-6 space-y-2 border-t border-line pt-4 font-sans text-sm text-paper-dim">
            <Row term={dict.configurator.kurs} value={course.shortName} />
            <Row term={dict.configurator.umfang} value={format.duration} />
            <Row term={dict.configurator.zielLabel} value={goalCopy} />
            <Row term={dict.configurator.kostenschaetzung} value={costEstimate} />
          </dl>
          <p className="mt-2 font-sans text-[11px] leading-relaxed text-paper-dim">
            {dict.configurator.kostenHinweis}
          </p>
        </div>

        <div>
          <div className="border-t border-line pt-4">
            <p className="font-display text-2xl text-brand">{dict.configurator.individuellesAngebot}</p>
            <p className="mt-1 font-sans text-sm text-paper-dim">
              {dict.configurator.individuellesAngebotText}
            </p>
          </div>
          <Link
            href={bookingHref}
            className="mt-6 inline-flex w-full items-center justify-center border border-brand bg-brand px-7 py-3.5 font-sans text-sm uppercase tracking-[0.08em] text-on-brand transition-colors duration-300 hover:bg-brand-strong hover:border-brand-strong"
          >
            {dict.configurator.unverbindlichAnfragen}
          </Link>
          <p className="mt-3 text-center font-sans text-[11px] text-paper-dim">
            {dict.configurator.kostenfrei} · {dict.contactForm.antwortHinweis}
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 font-sans text-xs uppercase tracking-[0.12em] text-gold">{label}</p>
      {children}
    </div>
  );
}

function StepBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex w-12 items-center justify-center border border-line font-display text-2xl text-paper transition-colors hover:border-brand hover:text-brand"
    >
      {children}
    </button>
  );
}

function Choice({
  active,
  onClick,
  children,
  compact = false,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border ${compact ? "px-3 py-2" : "px-4 py-3"} text-left font-sans text-sm transition-colors ${
        active
          ? "border-brand text-brand"
          : "border-line text-paper-dim hover:border-brand hover:text-paper"
      }`}
    >
      {children}
    </button>
  );
}

function Row({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt>{term}</dt>
      <dd className="text-right text-paper">{value}</dd>
    </div>
  );
}
