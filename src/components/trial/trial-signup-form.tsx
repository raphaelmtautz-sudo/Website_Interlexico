"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, fieldInputClasses } from "@/components/ui/form-field";
import type { Dictionary } from "@/dictionaries";
import { track } from "@/lib/track";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "sending" | "error";

export function TrialSignupForm({ dict }: { dict: Dictionary }) {
  const t = dict.testen;
  const [form, setForm] = useState({ companyName: "", contactName: "", email: "", password: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function update<K extends keyof typeof form>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }
  function touch(key: string) {
    return () => setTouched((tt) => ({ ...tt, [key]: true }));
  }

  const companyValid = form.companyName.trim().length > 0;
  const nameValid = form.contactName.trim().length > 0;
  const emailValid = EMAIL_RE.test(form.email);
  const passwordValid = form.password.length >= 8;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ companyName: true, contactName: true, email: true, password: true });
    if (!companyValid || !nameValid || !emailValid || !passwordValid) return;
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/trial-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || t.errorText);
        setStatus("error");
        return;
      }
      track("form_submit", { form: "testen" });
      window.location.href = `https://interlexico.one/customer/login?token=${encodeURIComponent(data.token)}`;
    } catch {
      setError(t.errorNetworkText);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border border-line bg-ink-raised p-6 sm:p-8">
      <Field label={t.firmaLabel} valid={companyValid} error={touched.companyName && !companyValid ? t.pflichtfeld : undefined}>
        <input
          required
          aria-label={t.firmaLabel}
          placeholder={t.firmaLabel}
          value={form.companyName}
          onChange={update("companyName")}
          onBlur={touch("companyName")}
          className={fieldInputClasses(touched.companyName && !companyValid)}
        />
      </Field>
      <Field label={t.nameLabel} valid={nameValid} error={touched.contactName && !nameValid ? t.pflichtfeld : undefined}>
        <input
          required
          aria-label={t.nameLabel}
          placeholder={t.nameLabel}
          value={form.contactName}
          onChange={update("contactName")}
          onBlur={touch("contactName")}
          className={fieldInputClasses(touched.contactName && !nameValid)}
        />
      </Field>
      <Field label={t.emailLabel} valid={emailValid} error={touched.email && !emailValid ? t.emailUngueltig : undefined}>
        <input
          required
          type="email"
          aria-label={t.emailLabel}
          placeholder="name@company.com"
          value={form.email}
          onChange={update("email")}
          onBlur={touch("email")}
          className={fieldInputClasses(touched.email && !emailValid)}
        />
      </Field>
      <Field label={t.passwordLabel} valid={passwordValid} error={touched.password && !passwordValid ? t.passwordZuKurz : undefined}>
        <input
          required
          type="password"
          minLength={8}
          aria-label={t.passwordLabel}
          placeholder="••••••••"
          value={form.password}
          onChange={update("password")}
          onBlur={touch("password")}
          className={fieldInputClasses(touched.password && !passwordValid)}
        />
      </Field>

      {error && (
        <p role="alert" className="font-sans text-sm text-error">
          {error}
        </p>
      )}

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
          {status === "sending" ? t.wirdEingerichtet : t.submitLabel}
        </Button>
        <span className="font-sans text-xs text-paper-dim">{t.hinweis}</span>
      </div>
    </form>
  );
}
