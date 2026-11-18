"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Field, fieldInputClasses, inputClasses } from "@/components/ui/form-field";
import { lh, type Locale } from "@/lib/i18n";
import { track } from "@/lib/track";
import { SITE } from "@/lib/site";
import type { Dictionary } from "@/dictionaries";
import type { ConfiguratorContent } from "@/content/configurator";
import type { ConfiguratorState, Plan } from "@/lib/configurator-plan";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Pop-up "Angebot anfordern" am Ende des Konfigurators: zeigt die Auswahl und
 * fragt nur die Angaben ab, die für ein Angebot nötig sind. Sendet an
 * /api/inquiry (→ ONE + Benachrichtigungs-Mail), wie das Kontaktformular.
 * Natives <dialog>: Fokusfalle, Escape und Hintergrundsperre kommen vom Browser.
 */
export function OfferDialog({
  open,
  onClose,
  lang,
  dict,
  c,
  state,
  plan,
  courseName,
  summaryLines,
  summaryText,
  fallbackHref,
}: {
  open: boolean;
  onClose: () => void;
  lang: Locale;
  dict: Pick<Dictionary, "contactForm">;
  c: ConfiguratorContent;
  state: ConfiguratorState;
  plan: Plan;
  courseName: string;
  summaryLines: [string, string][];
  summaryText: string;
  fallbackHref: string;
}) {
  const t = dict.contactForm;
  const ref = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", company: "", phone: "", city: "", start: "", notes: "", website: "" });
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [leadRef, setLeadRef] = useState<string | null>(null);
  const [key, setKey] = useState("");
  // Zusammenfassung auf großen Bildschirmen offen, auf dem Handy zugeklappt (spart Platz).
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      // Neue Anfrage-Sitzung → neuer Idempotenz-Schlüssel (Doppelklick-Schutz je Sitzung).
      // eslint-disable-next-line react-hooks/set-state-in-effect -- einmalig beim Öffnen.
      setKey(typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()));
      track("form_start", { form: "konfigurator-angebot" });
      setSummaryOpen(window.matchMedia("(min-width: 640px)").matches);
    }
    if (!open && d.open) d.close();
  }, [open]);

  const needsCity = state.delivery === "vorort" || state.delivery === "hybrid";
  const valid = {
    firstName: form.firstName.trim().length > 0,
    lastName: form.lastName.trim().length > 0,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()),
    company: form.company.trim().length > 0,
  };
  const allValid = Object.values(valid).every(Boolean);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!allValid || status === "sending") return;
    setStatus("sending");
    const extra = [
      needsCity && form.city.trim() ? `• ${c.offer.city}: ${form.city.trim()}` : "",
      form.notes.trim() ? `\n${c.offer.notes.replace(/\s*\(.*\)$/, "")}:\n${form.notes.trim()}` : "",
    ].filter(Boolean);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "konfigurator",
          topic: courseName,
          course: courseName,
          format: c.format.name(plan),
          niveau: /^[ABC][12]$/.test(state.level) ? state.level : "",
          participants: String(state.participants),
          preferredDate: form.start.trim(),
          name: `${form.firstName.trim()} ${form.lastName.trim()}`,
          email: form.email.trim(),
          company: form.company.trim(),
          phone: form.phone.trim(),
          contactPreference: form.phone.trim() ? "phone" : "email",
          message: [summaryText, ...extra].join("\n"),
          consent: true,
          language: lang,
          idempotencyKey: key,
          website: form.website, // Honeypot
        }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (res.ok && data.ok) {
        setLeadRef(typeof data.leadId === "string" ? data.leadId : null);
        setStatus("sent");
        track("configurator_lead", { format: plan.kind, units: String(plan.units) });
        track("form_submit", { form: "konfigurator-angebot", source: "konfigurator", transferredToOne: String(Boolean(data.transferredToOne)) });
      } else {
        setStatus("error");
        track("configurator_error", { stage: "anfrage", code: String(data?.error ?? res.status) });
      }
    } catch {
      setStatus("error");
      track("configurator_error", { stage: "anfrage", code: "network" });
    }
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // Klick auf den abgedunkelten Hintergrund schließt (nicht beim Senden).
        if (e.target === ref.current && status !== "sending") onClose();
      }}
      aria-labelledby="offer-dialog-title"
      className="m-auto max-h-[92dvh] w-[min(44rem,calc(100vw-1.5rem))] overflow-y-auto border border-line bg-ink p-0 text-paper backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold">{c.result.eyebrow}</p>
            <h3 id="offer-dialog-title" className="mt-2 font-display text-3xl leading-tight text-paper">
              {status === "sent" ? c.offer.successTitle : c.offer.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={c.offer.close}
            className="-mr-2 -mt-1 px-2 font-sans text-2xl leading-none text-paper-dim hover:text-paper"
          >
            ×
          </button>
        </div>

        {status === "sent" ? (
          <div className="mt-4">
            <p className="font-sans text-sm leading-relaxed text-paper-dim">{c.offer.successText}</p>
            {leadRef && (
              <p className="mt-4 font-sans text-xs uppercase tracking-[0.1em] text-paper-dim">
                {c.offer.reference}: <span className="text-paper">{leadRef.slice(0, 8).toUpperCase()}</span>
              </p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-8 inline-flex items-center justify-center border border-brand px-7 py-3 font-sans text-sm uppercase tracking-[0.08em] text-brand-text transition-colors hover:bg-brand hover:text-on-brand"
            >
              {c.offer.close}
            </button>
          </div>
        ) : (
          <>
            <p className="mt-3 font-sans text-sm leading-relaxed text-paper-dim">{c.offer.intro}</p>

            <details
              className="mt-5 border border-line bg-ink-raised p-4"
              open={summaryOpen}
              onToggle={(e) => setSummaryOpen((e.currentTarget as HTMLDetailsElement).open)}
            >
              <summary className="cursor-pointer font-sans text-xs uppercase tracking-[0.12em] text-gold">{c.offer.summaryTitle}</summary>
              <dl className="mt-3 space-y-1.5 font-sans text-sm text-paper-dim">
                {summaryLines.map(([term, value]) => (
                  <div key={term} className="flex justify-between gap-4">
                    <dt>{term}</dt>
                    <dd className="text-right text-paper">{value}</dd>
                  </div>
                ))}
              </dl>
            </details>

            <form onSubmit={submit} noValidate className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t.vorname} error={touched && !valid.firstName ? t.pflichtfeld : undefined}>
                  <input autoComplete="given-name" value={form.firstName} onChange={set("firstName")} className={fieldInputClasses(touched && !valid.firstName)} />
                </Field>
                <Field label={t.nachname} error={touched && !valid.lastName ? t.pflichtfeld : undefined}>
                  <input autoComplete="family-name" value={form.lastName} onChange={set("lastName")} className={fieldInputClasses(touched && !valid.lastName)} />
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t.email} error={touched && !valid.email ? t.emailUngueltig : undefined}>
                  <input type="email" autoComplete="email" value={form.email} onChange={set("email")} className={fieldInputClasses(touched && !valid.email)} />
                </Field>
                <Field label={c.offer.company} error={touched && !valid.company ? t.pflichtfeld : undefined}>
                  <input autoComplete="organization" value={form.company} onChange={set("company")} className={fieldInputClasses(touched && !valid.company)} />
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t.telefon}>
                  <input type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} className={inputClasses} />
                </Field>
                <Field label={t.wunschtermin}>
                  <input placeholder={t.wunschterminPlaceholder} value={form.start} onChange={set("start")} className={inputClasses} />
                </Field>
              </div>
              {needsCity && (
                <Field label={c.offer.city}>
                  <input autoComplete="address-level2" placeholder={c.offer.cityPlaceholder} value={form.city} onChange={set("city")} className={inputClasses} />
                </Field>
              )}
              <Field label={c.offer.notes}>
                <textarea rows={3} placeholder={c.offer.notesPlaceholder} value={form.notes} onChange={set("notes")} className={inputClasses} />
              </Field>
              {/* Honeypot: für Menschen unsichtbar */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form.website}
                onChange={set("website")}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <p className="font-sans text-xs leading-relaxed text-paper-dim">
                {t.dsgvoHinweis}{" "}
                <a href={lh(lang, "/rechtliches/datenschutz")} target="_blank" rel="noopener" className="link-underline text-brand-text">
                  {t.datenschutzLink}
                </a>
                .
              </p>

              {status === "error" && (
                <p role="alert" className="font-sans text-sm text-error">
                  {t.errorText}{" "}
                  <a href={`mailto:${SITE.inquiryEmail}`} className="underline">
                    {SITE.inquiryEmail}
                  </a>{" "}
                  {t.errorSuffix}
                </p>
              )}

              <div className="flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                <Link href={fallbackHref} className="font-sans text-xs uppercase tracking-[0.08em] text-paper-dim hover:text-paper">
                  {c.offer.fallback}
                </Link>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center justify-center border border-brand bg-brand px-7 py-3.5 font-sans text-sm uppercase tracking-[0.08em] text-on-brand transition-colors duration-300 hover:border-brand-strong hover:bg-brand-strong disabled:opacity-60"
                >
                  {status === "sending" ? t.wirdGesendet : c.offer.submit}
                </button>
              </div>
              <p className="text-right font-sans text-[11px] text-paper-dim">
                {c.result.ctaNote} · {t.antwortHinweis}
              </p>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
