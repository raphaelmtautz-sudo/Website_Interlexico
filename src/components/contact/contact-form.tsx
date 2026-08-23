"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, inputClasses } from "@/components/ui/form-field";
import { getCourseTypes, getCourseType } from "@/content/course-types";
import { getIndustries } from "@/content/industries";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";
import { getContactFormText } from "@/lib/dynamic-strings";
import { track } from "@/lib/track";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.contactForm;
  const industries = getIndustries(lang);
  const BRANCH_TOPIC = getCourseType(lang, "business-english")?.name ?? "Business English";
  const TOPICS = [
    t.beratungsgespraech,
    ...getCourseTypes(lang).filter((c) => c.status === "aktiv").map((c) => c.name),
    t.sonstiges,
  ];
  const initial = {
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    participants: "",
    topic: TOPICS[0],
    branches: [] as string[],
    message: "",
    consent: false,
    website: "", // Honeypot
  };

  const params = useSearchParams();
  // Vorbefüllung aus Konfigurator/Kurs-Links (kurs, teilnehmer).
  const [form, setForm] = useState(() => {
    const kurs = params.get("kurs") ?? "";
    const teilnehmer = params.get("teilnehmer") ?? "";
    const course = kurs ? getCourseType(lang, kurs) : undefined;
    const topic = course && TOPICS.includes(course.name) ? course.name : initial.topic;
    const parts: string[] = [];
    const dynamicText = getContactFormText(lang);
    if (course) parts.push(dynamicText.interesseCourse(course.name));
    return { ...initial, topic, participants: teilnehmer, message: parts.join(" ") };
  });
  const [status, setStatus] = useState<Status>("idle");
  const [poppedTopic, setPoppedTopic] = useState<string | null>(null);
  const [poppedBranch, setPoppedBranch] = useState<string | null>(null);
  const [consentError, setConsentError] = useState(false);
  // Zweistufig: erst nur Name/E-Mail (geringe Hemmschwelle), Unternehmen &
  // Nachricht folgen erst danach — reduziert die anfängliche Formularlänge.
  const [step, setStep] = useState<1 | 2>(1);

  function update<K extends keyof typeof form>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }
  function setTopic(topic: string) {
    setForm((f) => ({ ...f, topic, branches: topic === BRANCH_TOPIC ? f.branches : [] }));
    setPoppedTopic(topic);
  }
  function toggleBranch(b: string) {
    setForm((f) => ({
      ...f,
      branches: f.branches.includes(b)
        ? f.branches.filter((x) => x !== b)
        : [...f.branches, b],
    }));
    setPoppedBranch(b);
  }

  const firstNameValid = form.firstName.trim().length > 0;
  const lastNameValid = form.lastName.trim().length > 0;
  const emailValid = EMAIL_RE.test(form.email);
  const filledCount = [firstNameValid, lastNameValid, emailValid].filter(Boolean).length;
  const progress = filledCount / 3;
  const step1Valid = firstNameValid && lastNameValid && emailValid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step !== 2) {
      if (step1Valid) {
        track("form_start", { form: "kontakt" });
        setStep(2);
      }
      return;
    }
    if (!form.consent) {
      setConsentError(true);
      return;
    }
    if (status === "sending") return;
    setStatus("sending");
    try {
      const body = new FormData();
      body.set("kind", "kontakt");
      body.set("topic", form.topic);
      body.set("branches", form.branches.join(", "));
      body.set("name", `${form.firstName} ${form.lastName}`.trim());
      body.set("email", form.email);
      body.set("company", form.company);
      body.set("participants", form.participants);
      body.set("message", form.message);
      body.set("consent", "true");
      body.set("website", form.website);

      const res = await fetch("/api/inquiry", { method: "POST", body });
      const data = await res.json().catch(() => ({ ok: false }));
      const ok = res.ok && data.ok;
      if (ok) track("form_submit", { form: "kontakt", topic: form.topic });
      setStatus(ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-brand bg-brand/5 p-10 text-center animate-fade-up">
        <div className="animate-ring-pop mx-auto mb-6 flex h-14 w-14 items-center justify-center border border-brand text-brand">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path className="il-check-path" d="M5 12.5l4 4 10-10" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <p className="font-display text-3xl text-paper mb-2">{t.successTitle}</p>
        <p className="mx-auto max-w-sm font-sans text-sm leading-relaxed text-paper-dim mb-6">
          {t.successText}
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(initial);
            setConsentError(false);
            setStatus("idle");
            setStep(1);
          }}
          className="font-sans text-xs uppercase tracking-[0.1em] text-brand hover:underline"
        >
          {t.neueAnfrage}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7 border border-line bg-ink-raised p-6 sm:p-8">
      {/* Fortschritt */}
      <div aria-hidden="true" className="-mx-6 -mt-6 h-[3px] bg-line sm:-mx-8 sm:-mt-8">
        <div
          className="h-full bg-brand transition-[width] duration-500 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Schritt-Anzeige 1/2 */}
      <div aria-hidden="true" className="flex items-center gap-2">
        <span
          className={`flex h-[26px] w-[26px] items-center justify-center rounded-full border font-sans text-xs transition-colors duration-200 ${
            step === 1
              ? "border-brand bg-brand text-on-brand"
              : "border-brand text-brand"
          }`}
        >
          1
        </span>
        <span className="h-px max-w-[60px] flex-1 bg-line" />
        <span
          className={`flex h-[26px] w-[26px] items-center justify-center rounded-full border font-sans text-xs transition-colors duration-200 ${
            step === 2
              ? "border-brand bg-brand text-on-brand"
              : "border-line text-paper-dim"
          }`}
        >
          2
        </span>
      </div>

      {/* Interesse */}
      <fieldset>
        <legend className="mb-3 font-sans text-[10px] uppercase tracking-[0.16em] text-gold">
          {t.ihrInteresse}
        </legend>
        <div role="radiogroup" aria-label={t.ihrInteresse} className="flex flex-wrap gap-2">
          {TOPICS.map((topic) => {
            const active = form.topic === topic;
            return (
              <button
                key={topic}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTopic(topic)}
                onAnimationEnd={() => setPoppedTopic((p) => (p === topic ? null : p))}
                className={`border px-4 py-2 font-sans text-sm transition-colors ${
                  poppedTopic === topic ? "animate-chip-pop" : ""
                } ${
                  active
                    ? "border-brand bg-brand text-on-brand"
                    : "border-line text-paper-dim hover:border-brand hover:text-paper"
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Branchen — nur bei Business English */}
      {form.topic === BRANCH_TOPIC && (
        <fieldset className="animate-fade-up">
          <legend className="mb-3 font-sans text-[10px] uppercase tracking-[0.16em] text-gold">
            {t.brancheLabel}
          </legend>
          <div className="flex flex-wrap gap-2">
            {industries.map((b) => {
              const active = form.branches.includes(b);
              return (
                <button
                  key={b}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleBranch(b)}
                  onAnimationEnd={() => setPoppedBranch((p) => (p === b ? null : p))}
                  className={`border px-3 py-1.5 font-sans text-xs transition-colors ${
                    poppedBranch === b ? "animate-chip-pop" : ""
                  } ${
                    active
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-line text-paper-dim hover:border-brand hover:text-paper"
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Schritt 1: nur Name & E-Mail — niedrige Hemmschwelle für den Einstieg */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.vorname} valid={firstNameValid}>
          <input required aria-label={t.vorname} placeholder={t.vorname} value={form.firstName} onChange={update("firstName")} className={inputClasses} />
        </Field>
        <Field label={t.nachname} valid={lastNameValid}>
          <input required aria-label={t.nachname} placeholder={t.nachname} value={form.lastName} onChange={update("lastName")} className={inputClasses} />
        </Field>
      </div>
      <Field label={t.email} valid={emailValid}>
        <input required type="email" aria-label={t.email} placeholder="name@company.com" value={form.email} onChange={update("email")} className={inputClasses} />
      </Field>

      {step === 1 && (
        <Button
          type="button"
          onClick={() => {
            if (!step1Valid) return;
            track("form_start", { form: "kontakt" });
            setStep(2);
          }}
          className={`w-full sm:w-auto ${step1Valid ? "" : "pointer-events-none opacity-50"}`}
        >
          {t.weiter}
        </Button>
      )}

      {/* Schritt 2: Unternehmen, Nachricht, Absenden */}
      {step === 2 && (
        <div className="animate-fade-up space-y-7">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="font-sans text-xs uppercase tracking-[0.1em] text-paper-dim hover:text-brand"
          >
            ← {t.zurueck}
          </button>

          <Field label={t.unternehmen}>
            <input aria-label={t.unternehmen} placeholder={t.unternehmen} value={form.company} onChange={update("company")} className={inputClasses} />
          </Field>

          <Field label={t.ihreNachricht}>
            <textarea
              aria-label={t.ihreNachricht}
              rows={5}
              value={form.message}
              onChange={update("message")}
              placeholder={t.nachrichtPlaceholder}
              className={inputClasses}
            />
          </Field>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              required
              checked={form.consent}
              onChange={(e) => {
                setForm((f) => ({ ...f, consent: e.target.checked }));
                if (e.target.checked) setConsentError(false);
              }}
              className="mt-0.5 h-4 w-4 shrink-0 border border-line bg-ink accent-brand"
            />
            <span className="font-sans text-xs leading-relaxed text-paper-dim">
              {t.dsgvoPre}{" "}
              <a href={lh(lang, "/rechtliches/datenschutz")} className="link-underline text-brand">
                {t.datenschutzLink}
              </a>{" "}
              {t.dsgvoPost}
            </span>
          </label>
          {consentError && (
            <p role="alert" className="-mt-4 font-sans text-xs text-error">
              {t.dsgvoRequired}
            </p>
          )}

          {/* Honeypot */}
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={update("website")}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              type="submit"
              className={`w-full sm:w-auto ${status === "sending" ? "pointer-events-none opacity-80" : ""}`}
            >
              {status === "sending" && (
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
              {status === "sending" ? t.wirdGesendet : t.unverbindlichAnfragen}
            </Button>
            <span className="font-sans text-xs text-paper-dim">
              {t.kostenlosHinweis} {t.antwortHinweis}
            </span>
          </div>

          {status === "error" && (
            <p role="alert" className="font-sans text-sm text-error">
              {t.errorText}{" "}
              <a href="mailto:contact@interlexico.com" className="link-underline text-brand">
                contact@interlexico.com
              </a>
              {t.errorSuffix}
            </p>
          )}
        </div>
      )}
    </form>
  );
}
