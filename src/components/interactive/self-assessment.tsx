"use client";

import { useState } from "react";
import Link from "next/link";
import { getAssessment } from "@/content/einstufung";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";

type Lang = "englisch" | "deutsch";

export function SelfAssessment({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { assessmentQuestions, answerOptions, levelForScore } = getAssessment(lang);
  const t = dict.selfAssessment;
  const [assessLang, setAssessLang] = useState<Lang | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const total = assessmentQuestions.length;

  function choose(value: number) {
    const next = [...answers];
    next[step] = value;
    setAnswers(next);
    if (step < total - 1) setStep(step + 1);
    else setDone(true);
  }

  function restart() {
    setAssessLang(null);
    setStep(0);
    setAnswers([]);
    setDone(false);
  }

  // 1) Sprachwahl
  if (!assessLang) {
    return (
      <Frame>
        <p className="font-sans text-xs uppercase tracking-[0.12em] text-gold mb-4">
          {t.intro}
        </p>
        <h3 className="font-display text-3xl text-paper mb-6 text-balance">
          {t.langQuestion}
        </h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          {(["englisch", "deutsch"] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setAssessLang(l)}
              className="flex-1 border border-line px-6 py-4 text-left font-sans text-paper transition-colors hover:border-brand hover:text-brand"
            >
              {l === "englisch" ? t.englisch : t.deutsch}
            </button>
          ))}
        </div>
      </Frame>
    );
  }

  // 3) Ergebnis
  if (done) {
    const score = answers.reduce((a, b) => a + b, 0);
    const result = levelForScore(score);
    return (
      <Frame>
        <p className="font-sans text-xs uppercase tracking-[0.12em] text-gold mb-4">
          {t.resultPrefix} · {assessLang === "englisch" ? t.englisch : t.deutsch}
        </p>
        <div className="flex items-baseline gap-4 mb-4">
          <span className="font-display text-5xl text-brand">{result.level}</span>
          <span className="font-display text-2xl text-paper">{result.title}</span>
        </div>
        <p className="font-sans leading-relaxed text-paper-dim mb-8 max-w-lg">
          {result.description} {t.resultDisclaimer}
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href={lh(lang, "/kontakt")}
            className="inline-flex items-center justify-center border border-brand bg-brand px-7 py-3.5 font-sans text-sm uppercase tracking-[0.08em] text-on-brand transition-colors duration-300 hover:bg-brand-strong hover:border-brand-strong"
          >
            {t.ctaAnfragen}
          </Link>
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center justify-center border border-petrol px-7 py-3.5 font-sans text-sm uppercase tracking-[0.08em] text-petrol transition-colors hover:bg-petrol hover:text-ink"
          >
            {t.ctaRestart}
          </button>
        </div>
      </Frame>
    );
  }

  // 2) Fragen-Stepper
  const progress = (step + (answers[step] ? 1 : 0)) / total;
  const question = assessmentQuestions[step];
  return (
    <Frame>
      <div className="mb-6 flex items-center justify-between">
        <p className="font-sans text-xs uppercase tracking-[0.12em] text-gold">
          {t.frageLabel} {step + 1} / {total}
        </p>
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="font-sans text-xs uppercase tracking-[0.1em] text-paper-dim hover:text-brand"
          >
            {t.zurueck}
          </button>
        )}
      </div>
      <div className="mb-8 h-[2px] bg-line" aria-hidden="true">
        <div className="h-full origin-left bg-brand transition-transform duration-300" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <h3 className="font-display text-2xl text-paper mb-6 text-balance sm:text-3xl">
        {question.prompt}
      </h3>
      <div
        role="radiogroup"
        aria-label={question.prompt}
        className="grid gap-3 sm:grid-cols-2"
      >
        {answerOptions.map((opt) => {
          const selected = answers[step] === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => choose(opt.value)}
              className={`border px-4 py-3 text-left font-sans text-sm transition-colors ${
                selected
                  ? "border-brand text-brand"
                  : "border-line text-paper-dim hover:border-brand hover:text-paper"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </Frame>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-line bg-ink-raised p-8 sm:p-10">{children}</div>
  );
}
