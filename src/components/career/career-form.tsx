"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FileField, Checkbox, inputClasses } from "@/components/ui/form-field";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";
import { track } from "@/lib/track";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

type Status = "idle" | "sending" | "sent" | "error";

export function CareerForm({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.karriere;
  const params = useSearchParams();

  const [form, setForm] = useState(() => {
    const wanted = params.get("position");
    const position = wanted && t.positions.includes(wanted) ? wanted : t.positions[0];
    return {
      position,
      name: "",
      email: "",
      phone: "",
      message: "",
      consent: false,
      website: "", // Honeypot
    };
  });
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  function update<K extends "name" | "email" | "phone" | "message">(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function handleFile(setter: (f: File | null) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0] ?? null;
      if (f && f.size > MAX_FILE_BYTES) {
        setter(null);
        setFileError(t.anhangZuGross);
        e.target.value = "";
        return;
      }
      if (f && !ALLOWED_FILE_TYPES.includes(f.type)) {
        setter(null);
        setFileError(t.anhangTypFalsch);
        e.target.value = "";
        return;
      }
      setFileError(null);
      setter(f);
    };
  }

  const nameValid = form.name.trim().length > 0;
  const emailValid = EMAIL_RE.test(form.email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!resume) {
      setError(t.lebenslaufErforderlich);
      return;
    }
    if (!form.consent) {
      setError(t.dsgvoRequired);
      return;
    }
    if (status === "sending") return;
    setStatus("sending");
    try {
      const body = new FormData();
      body.set("position", form.position);
      body.set("name", form.name);
      body.set("email", form.email);
      body.set("phone", form.phone);
      body.set("message", form.message);
      body.set("consent", "true");
      body.set("website", form.website);
      body.set("resume", resume);
      if (coverLetter) body.set("coverLetter", coverLetter);

      const res = await fetch("/api/career/apply", { method: "POST", body });
      const data = await res.json().catch(() => ({ ok: false }));
      const ok = res.ok && data.ok;
      if (ok) track("form_submit", { form: "karriere", position: form.position });
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
        <p className="mx-auto max-w-sm font-sans text-sm leading-relaxed text-paper-dim mb-2">
          {t.successText}
        </p>
        <p className="mx-auto max-w-sm font-sans text-xs leading-relaxed text-paper-dim mb-6">
          {t.unterlagenHinweisPost}
        </p>
        <button
          type="button"
          onClick={() => {
            setForm((f) => ({ ...f, name: "", email: "", phone: "", message: "", consent: false }));
            setResume(null);
            setCoverLetter(null);
            setFileError(null);
            setError(null);
            setStatus("idle");
          }}
          className="font-sans text-xs uppercase tracking-[0.1em] text-brand hover:underline"
        >
          {t.neueBewerbung}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7 border border-line bg-ink-raised p-6 sm:p-8">
      <h2 className="font-display text-2xl text-paper">{t.formTitle}</h2>

      <Field label={t.positionLabel}>
        <select
          aria-label={t.positionLabel}
          value={form.position}
          onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
          className={inputClasses}
        >
          {t.positions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.vorname} valid={nameValid}>
          <input required aria-label={t.vorname} placeholder={t.vorname} value={form.name} onChange={update("name")} className={inputClasses} />
        </Field>
        <Field label={t.email} valid={emailValid}>
          <input required type="email" aria-label={t.email} placeholder="name@email.com" value={form.email} onChange={update("email")} className={inputClasses} />
        </Field>
      </div>

      <Field label={t.telefon}>
        <input type="tel" aria-label={t.telefon} placeholder={t.telefon} value={form.phone} onChange={update("phone")} className={inputClasses} />
      </Field>

      <Field label={t.nachricht}>
        <textarea
          aria-label={t.nachricht}
          rows={5}
          value={form.message}
          onChange={update("message")}
          placeholder={t.nachrichtPlaceholder}
          className={inputClasses}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <FileField label={t.lebenslaufLabel} file={resume} onChange={handleFile(setResume)} chooseLabel={t.dateiWaehlen} accept=".pdf,.doc,.docx" />
        <FileField label={t.anschreibenLabel} file={coverLetter} onChange={handleFile(setCoverLetter)} chooseLabel={t.dateiWaehlen} accept=".pdf,.doc,.docx" />
      </div>
      <p className="-mt-4 font-sans text-[11px] text-paper-dim">{t.dateiHinweis}</p>
      {fileError && (
        <p role="alert" className="-mt-4 font-sans text-[11px] text-error">
          {fileError}
        </p>
      )}

      <Checkbox required checked={form.consent} onChange={(checked) => setForm((f) => ({ ...f, consent: checked }))}>
        {dict.contactForm.dsgvoPre}{" "}
        <a href={lh(lang, "/rechtliches/datenschutz")} className="link-underline text-brand">
          {dict.contactForm.datenschutzLink}
        </a>{" "}
        {dict.contactForm.dsgvoPost}
      </Checkbox>

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

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
        {status === "sending" ? t.wirdGesendet : t.absenden}
      </Button>

      {error && (
        <p role="alert" className="font-sans text-sm text-error">
          {error}
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="font-sans text-sm text-error">
          {t.errorText}{" "}
          <a href="mailto:career@interlexico.com" className="link-underline text-brand">
            career@interlexico.com
          </a>
          {t.errorSuffix}
        </p>
      )}
    </form>
  );
}
