"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { englishFullTest, levelForAnswers, type TestStep } from "@/content/einstufung-en-full";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";

type Phase = "test" | "lead" | "result";

export function FullEnglishTest({
  lang,
  dict,
  onCancel,
}: {
  lang: Locale;
  dict: Dictionary;
  onCancel: () => void;
}) {
  const t = dict.selfAssessment;
  const steps: TestStep[] = englishFullTest.steps;

  const [phase, setPhase] = useState<Phase>("test");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [sending, setSending] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [website, setWebsite] = useState(""); // honeypot
  const [idempotencyKey] = useState(() => {
    try {
      return crypto.randomUUID();
    } catch {
      return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
  });

  const current = steps[step];
  const canAdvance =
    current.kind === "choice"
      ? Boolean(answers[current.data.id])
      : current.kind === "writing"
        ? Boolean(answers[current.data.id]?.trim())
        : true;

  function next() {
    if (step < steps.length - 1) setStep(step + 1);
    else setPhase("lead");
  }

  async function submitLead() {
    setLeadError(null);
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLeadError(t.leadError);
      return;
    }
    setSending(true);
    const result = levelForAnswers(answers);
    const form = new FormData();
    form.set("website", website);
    form.set("name", name.trim());
    form.set("email", email.trim());
    form.set("phone", phone.trim());
    form.set("newsletter", String(newsletter));
    form.set("level", result.level);
    form.set("language", lang);
    form.set("idempotencyKey", idempotencyKey);
    form.set(
      "answers",
      JSON.stringify(
        steps.map((s) => ({
          id: s.data.id,
          skill: s.data.skill,
          question: s.kind === "choice" ? s.data.question : s.data.prompt,
          answer:
            s.kind === "recording"
              ? recordingBlob
                ? "[Audio-Aufnahme angehängt]"
                : ""
              : (answers[s.data.id] ?? ""),
        })),
      ),
    );
    if (recordingBlob) {
      form.set("recording", recordingBlob, "speaking.webm");
    }

    try {
      await fetch("/api/einstufungstest", { method: "POST", body: form });
    } catch {
      // Ergebnis trotzdem anzeigen — Versand ist best effort.
    }
    setSending(false);
    setPhase("result");
  }

  if (phase === "lead") {
    return (
      <Frame>
        <p className="font-sans text-xs uppercase tracking-[0.12em] text-gold mb-4">{t.intro}</p>
        <h3 className="font-display text-3xl text-paper mb-2 text-balance">{t.leadTitle}</h3>
        <p className="font-sans text-paper-dim mb-6">{t.leadText}</p>
        <div className="flex flex-col gap-4 max-w-md">
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder={t.leadName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-line bg-transparent px-4 py-3 font-sans text-paper placeholder:text-paper-dim focus:border-brand focus:outline-none"
          />
          <input
            type="email"
            placeholder={t.leadEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-line bg-transparent px-4 py-3 font-sans text-paper placeholder:text-paper-dim focus:border-brand focus:outline-none"
          />
          <input
            type="tel"
            placeholder={t.leadPhone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-line bg-transparent px-4 py-3 font-sans text-paper placeholder:text-paper-dim focus:border-brand focus:outline-none"
          />
          <label className="flex items-start gap-3 font-sans text-sm text-paper-dim">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
              className="mt-1"
            />
            {t.leadNewsletter}
          </label>
          {leadError && <p className="font-sans text-sm text-red-400">{leadError}</p>}
          <button
            type="button"
            disabled={sending}
            onClick={submitLead}
            className="inline-flex items-center justify-center border border-brand bg-brand px-7 py-3.5 font-sans text-sm uppercase tracking-[0.08em] text-on-brand transition-colors duration-300 hover:bg-brand-strong hover:border-brand-strong disabled:opacity-60"
          >
            {sending ? t.leadSending : t.leadSubmit}
          </button>
        </div>
      </Frame>
    );
  }

  if (phase === "result") {
    const result = levelForAnswers(answers);
    return (
      <Frame>
        <p className="font-sans text-xs uppercase tracking-[0.12em] text-gold mb-4">
          {t.resultPrefix} · {t.englisch}
        </p>
        <div className="flex items-baseline gap-4 mb-4">
          <span className="font-display text-5xl text-brand">{result.level}</span>
          <span className="font-display text-2xl text-paper">{result.title}</span>
        </div>
        <p className="font-sans leading-relaxed text-paper-dim mb-4 max-w-lg">
          {result.description} {t.resultDisclaimer}
        </p>
        <p className="font-sans text-sm leading-relaxed text-paper-dim mb-8 max-w-lg italic">
          {t.resultWritingNote}
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
            onClick={onCancel}
            className="inline-flex items-center justify-center border border-petrol px-7 py-3.5 font-sans text-sm uppercase tracking-[0.08em] text-petrol transition-colors hover:bg-petrol hover:text-ink"
          >
            {t.ctaRestart}
          </button>
        </div>
      </Frame>
    );
  }

  // phase === "test"
  const progress = (step + (canAdvance ? 1 : 0)) / steps.length;
  return (
    <Frame>
      <div className="mb-6 flex items-center justify-between">
        <p className="font-sans text-xs uppercase tracking-[0.12em] text-gold">
          {t.frageLabel} {step + 1} / {steps.length} · {current.data.level}
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
        <div
          className="h-full origin-left bg-brand transition-transform duration-300"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <StepBody
        step={current}
        value={answers[current.data.id]}
        onChange={(v) => setAnswers((a) => ({ ...a, [current.data.id]: v }))}
        recordingBlob={recordingBlob}
        onRecordingChange={setRecordingBlob}
        t={t}
      />

      <div className="mt-8">
        <button
          type="button"
          disabled={!canAdvance}
          onClick={next}
          className="inline-flex items-center justify-center border border-brand bg-brand px-7 py-3.5 font-sans text-sm uppercase tracking-[0.08em] text-on-brand transition-colors duration-300 hover:bg-brand-strong hover:border-brand-strong disabled:opacity-40"
        >
          {t.weiter}
        </button>
      </div>
    </Frame>
  );
}

function StepBody({
  step,
  value,
  onChange,
  recordingBlob,
  onRecordingChange,
  t,
}: {
  step: TestStep;
  value: string | undefined;
  onChange: (v: string) => void;
  recordingBlob: Blob | null;
  onRecordingChange: (b: Blob | null) => void;
  t: Dictionary["selfAssessment"];
}) {
  if (step.kind === "choice") {
    const q = step.data;
    return (
      <div>
        {q.context && (
          <p className="mb-4 border-l-2 border-line pl-4 font-sans text-sm italic text-paper-dim">
            {q.context}
          </p>
        )}
        {q.audioUrl && (
          <audio controls className="mb-4 w-full" src={q.audioUrl}>
            Your browser does not support audio playback.
          </audio>
        )}
        <h3 className="font-display text-2xl text-paper mb-6 text-balance sm:text-3xl">
          {q.question}
        </h3>
        <div role="radiogroup" aria-label={q.question} className="grid gap-3 sm:grid-cols-2">
          {q.options.map((opt) => {
            const selected = value === opt;
            return (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange(opt)}
                className={`border px-4 py-3 text-left font-sans text-sm transition-colors ${
                  selected
                    ? "border-brand text-brand"
                    : "border-line text-paper-dim hover:border-brand hover:text-paper"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (step.kind === "writing") {
    const task = step.data;
    return (
      <div>
        <h3 className="font-display text-2xl text-paper mb-6 text-balance sm:text-3xl">
          {task.prompt}
        </h3>
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={task.placeholder}
          rows={8}
          className="w-full border border-line bg-transparent px-4 py-3 font-sans text-paper placeholder:text-paper-dim focus:border-brand focus:outline-none"
        />
      </div>
    );
  }

  // recording
  const task = step.data;
  return (
    <div>
      <h3 className="font-display text-2xl text-paper mb-4 text-balance sm:text-3xl">
        {task.prompt}
      </h3>
      <p className="mb-6 font-sans text-sm leading-relaxed text-paper-dim">
        {t.recordConsent}
      </p>
      <AudioRecorder
        maxDurationSeconds={task.maxDurationSeconds}
        blob={recordingBlob}
        onChange={onRecordingChange}
        skipLabel={t.recordSkip}
        t={t}
      />
    </div>
  );
}

function AudioRecorder({
  maxDurationSeconds,
  blob,
  onChange,
  skipLabel,
  t,
}: {
  maxDurationSeconds: number;
  blob: Blob | null;
  onChange: (b: Blob | null) => void;
  skipLabel: string;
  t: Dictionary["selfAssessment"];
}) {
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const b = new Blob(chunksRef.current, { type: "audio/webm" });
        onChange(b);
        stream.getTracks().forEach((tr) => tr.stop());
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
      stopTimerRef.current = setTimeout(() => stop(), maxDurationSeconds * 1000);
    } catch {
      // Mikrofonzugriff verweigert oder nicht verfügbar.
    }
  }

  function stop() {
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    recorderRef.current?.stop();
    setRecording(false);
  }

  const audioUrl = blob ? URL.createObjectURL(blob) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        {!recording && (
          <button
            type="button"
            onClick={start}
            className="inline-flex w-fit items-center justify-center border border-petrol px-6 py-3 font-sans text-sm uppercase tracking-[0.08em] text-petrol transition-colors hover:bg-petrol hover:text-ink"
          >
            {blob ? t.recordAgain : t.recordStart}
          </button>
        )}
        {recording && (
          <button
            type="button"
            onClick={stop}
            className="inline-flex w-fit items-center justify-center border border-red-400 px-6 py-3 font-sans text-sm uppercase tracking-[0.08em] text-red-400 transition-colors hover:bg-red-400 hover:text-ink"
          >
            {t.recordStop}
          </button>
        )}
        {!recording && !blob && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex w-fit items-center justify-center font-sans text-sm uppercase tracking-[0.08em] text-paper-dim underline decoration-line underline-offset-4 hover:text-brand"
          >
            {skipLabel}
          </button>
        )}
      </div>
      {audioUrl && !recording && <audio controls src={audioUrl} className="w-full" />}
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="border border-line bg-ink-raised p-8 sm:p-10">{children}</div>;
}
