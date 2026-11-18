"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Checkbox, inputClasses } from "@/components/ui/form-field";
import { lh, type Locale } from "@/lib/i18n";
import { track } from "@/lib/track";
import type { PlacementText } from "@/content/placement";

type TestLang = "en" | "de";
type Mode = "QUICK" | "FULL";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Start des Einstufungstests: Sprache + Kurz-/Volltest wählen. Der Test läuft in
 * Interlexico ONE; die Website legt ihn nur an (/api/einstufungstest) und leitet weiter.
 */
export function PlacementStart({ lang, t }: { lang: Locale; t: PlacementText }) {
  const [testLang, setTestLang] = useState<TestLang>("en");
  const [form, setForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [c, setC] = useState({ name: "", email: "", companyName: "", phone: "", privacy: false, website: "" });

  async function start(mode: Mode) {
    setError(null);
    if (mode === "FULL" && (c.name.trim().length < 2 || !EMAIL_RE.test(c.email.trim()) || c.companyName.trim().length < 2 || !c.privacy)) {
      setError(t.errRequired);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/einstufungstest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode, language: testLang, uiLanguage: lang, ...(mode === "FULL" ? c : { website: c.website }) }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.link) {
        track("form_submit", { form: "einstufung", variant: mode === "QUICK" ? "kurztest" : "volltest", topic: testLang });
        window.location.href = d.link;
        return;
      }
      setError(res.status === 429 ? t.errRate : res.status === 422 ? t.errRequired : t.errGeneric);
    } catch {
      setError(t.errGeneric);
    }
    setBusy(false);
  }

  const card = "flex flex-col border border-line bg-ink-raised p-6 sm:p-8";

  if (form) {
    return (
      <div className="space-y-6 border border-line bg-ink-raised p-6 sm:p-8">
        <div>
          <p className="mb-2 font-sans text-xs uppercase tracking-[0.12em] text-gold">{t.full.name} · {t.langs[testLang]}</p>
          <h2 className="font-display text-3xl text-paper">{t.formTitle}</h2>
          <p className="mt-2 font-sans text-sm text-paper-dim">{t.formText}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t.name} valid={c.name.trim().length > 1}>
            <input autoComplete="name" aria-label={t.name} value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} className={inputClasses} />
          </Field>
          <Field label={t.email} valid={EMAIL_RE.test(c.email.trim())}>
            <input type="email" autoComplete="email" aria-label={t.email} placeholder="name@firma.de" value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} className={inputClasses} />
          </Field>
          <Field label={t.company} valid={c.companyName.trim().length > 1}>
            <input autoComplete="organization" aria-label={t.company} value={c.companyName} onChange={(e) => setC({ ...c, companyName: e.target.value })} className={inputClasses} />
          </Field>
          <Field label={t.phone}>
            <input type="tel" autoComplete="tel" aria-label={t.phone} value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} className={inputClasses} />
          </Field>
        </div>
        <Checkbox checked={c.privacy} onChange={(v) => setC({ ...c, privacy: v })}>
          {t.privacyPre}{" "}
          <a href={lh(lang, "/rechtliches/datenschutz")} className="link-underline text-brand-text">{t.privacyLink}</a>.
        </Checkbox>
        <input type="text" name="website" value={c.website} onChange={(e) => setC({ ...c, website: e.target.value })} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
        {error && <p role="alert" className="font-sans text-sm text-error">{error}</p>}
        <div className="flex flex-wrap items-center gap-4">
          <Button type="button" onClick={() => start("FULL")} className={busy ? "pointer-events-none opacity-80" : ""}>
            {busy ? t.starting : t.full.cta}
          </Button>
          <button type="button" onClick={() => { setForm(false); setError(null); }} className="font-sans text-xs uppercase tracking-[0.1em] text-paper-dim hover:text-brand-text">
            {t.back}
          </button>
        </div>
        <p className="font-sans text-[11px] text-paper-dim">{t.hint}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.16em] text-gold">{t.langLabel}</p>
        <div className="flex gap-3" role="radiogroup" aria-label={t.langLabel}>
          {(["en", "de"] as TestLang[]).map((l) => (
            <button key={l} type="button" role="radio" aria-checked={testLang === l} onClick={() => setTestLang(l)}
              className={`border px-6 py-3 font-sans text-sm transition-colors ${testLang === l ? "border-brand text-brand-text bg-brand/5" : "border-line text-paper hover:border-brand"}`}>
              {t.langs[l]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {([["QUICK", t.quick], ["FULL", t.full]] as const).map(([mode, m]) => (
          <div key={mode} className={card}>
            <p className="font-sans text-xs uppercase tracking-[0.12em] text-gold">{m.duration}</p>
            <h2 className="mt-2 font-display text-3xl text-paper">{m.name}</h2>
            <ul className="mt-5 flex-1 space-y-2 font-sans text-sm text-paper-dim">
              {m.points.map((p) => (
                <li key={p} className="flex gap-2"><span aria-hidden="true" className="text-brand-text">—</span>{p}</li>
              ))}
            </ul>
            <p className="mt-5 font-sans text-xs text-paper-dim">{m.note}</p>
            <Button type="button" className={`mt-6 w-full sm:w-auto ${busy ? "pointer-events-none opacity-80" : ""}`}
              onClick={() => (mode === "QUICK" ? start("QUICK") : (setForm(true), setError(null)))}>
              {busy && mode === "QUICK" ? t.starting : m.cta}
            </Button>
          </div>
        ))}
      </div>
      {error && <p role="alert" className="font-sans text-sm text-error">{error}</p>}
      <p className="font-sans text-[11px] text-paper-dim">{t.hint}</p>
    </div>
  );
}
