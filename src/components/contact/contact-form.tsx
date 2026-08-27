"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FileField, Checkbox, inputClasses, fieldInputClasses } from "@/components/ui/form-field";
import { getCourseTypes, getCourseType } from "@/content/course-types";
import { getIndustries } from "@/content/industries";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";
import { getContactFormText } from "@/lib/dynamic-strings";
import { track } from "@/lib/track";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_ATTACHMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

type Status = "idle" | "sending" | "sent" | "error";

/** Erzeugt einmal pro Formular-Sitzung einen Schlüssel, damit ein erneuter
 * Submit (Doppelklick, Netzwerk-Retry) auf interlexico.com nicht zwei Leads
 * in Interlexico ONE anlegt (§50 Master-Prompt). */
function makeIdempotencyKey(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

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
    phone: "",
    company: "",
    participants: "",
    preferredDate: "",
    topic: TOPICS[0],
    branches: [] as string[],
    message: "",
    consent: false,
    marketingConsent: false,
    niveau: "",
    format: "",
    website: "", // Honeypot
    contactPreference: "phone" as "phone" | "mail",
    street: "",
    zipCity: "",
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
  const [leadRef, setLeadRef] = useState<string | null>(null);
  const [idempotencyKey] = useState(makeIdempotencyKey);
  const [poppedTopic, setPoppedTopic] = useState<string | null>(null);
  const [poppedBranch, setPoppedBranch] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  // Zweistufig: erst nur Name/E-Mail (geringe Hemmschwelle), Unternehmen &
  // Nachricht folgen erst danach — reduziert die anfängliche Formularlänge.
  const [step, setStep] = useState<1 | 2>(1);
  // Zeigt Feldfehler erst, nachdem ein Feld verlassen wurde oder ein
  // Weiter/Absenden-Versuch fehlgeschlagen ist — nicht schon beim Tippen.
  type TouchKey = "firstName" | "lastName" | "email" | "street" | "zipCity" | "message";
  const [touched, setTouched] = useState<Partial<Record<TouchKey, boolean>>>({});

  function update<K extends keyof typeof form>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }
  function touch(key: TouchKey) {
    return () => setTouched((t) => ({ ...t, [key]: true }));
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
  function handleAttachment(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > MAX_ATTACHMENT_BYTES) {
      setAttachment(null);
      setAttachmentError(t.anhangZuGross);
      e.target.value = "";
      return;
    }
    if (f && !ALLOWED_ATTACHMENT_TYPES.includes(f.type)) {
      setAttachment(null);
      setAttachmentError(t.anhangTypFalsch);
      e.target.value = "";
      return;
    }
    setAttachmentError(null);
    setAttachment(f);
  }

  const firstNameValid = form.firstName.trim().length > 0;
  const lastNameValid = form.lastName.trim().length > 0;
  const emailValid = EMAIL_RE.test(form.email);
  const filledCount = [firstNameValid, lastNameValid, emailValid].filter(Boolean).length;
  const step1Valid = firstNameValid && lastNameValid && emailValid;
  const progress = filledCount / 3;
  const isMail = form.contactPreference === "mail";
  const streetValid = !isMail || form.street.trim().length > 0;
  const zipCityValid = !isMail || form.zipCity.trim().length > 0;
  const messageValid = form.message.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step !== 2) {
      setTouched({ firstName: true, lastName: true, email: true });
      if (step1Valid) {
        track("form_start", { form: "kontakt" });
        setStep(2);
      }
      return;
    }
    if (isMail && (!streetValid || !zipCityValid)) {
      setTouched((prev) => ({ ...prev, street: true, zipCity: true }));
      return;
    }
    if (!messageValid) {
      setTouched((prev) => ({ ...prev, message: true }));
      return;
    }
    // Keine Pflicht-Checkbox mehr für die Grundverarbeitung — die Anfrage
    // läuft auf Art. 6 Abs. 1 lit. b/f DSGVO, dafür reicht der Hinweistext
    // über dem Button (siehe unten). Serverseitig wurde die frühere
    // Pflichtprüfung entsprechend entfernt (apps/sales/backend/inquiries.ts).
    if (status === "sending") return;
    setStatus("sending");
    try {
      const body = new FormData();
      body.set("kind", "kontakt");
      body.set("topic", form.topic);
      body.set("branches", form.branches.join(", "));
      body.set("name", `${form.firstName} ${form.lastName}`.trim());
      body.set("email", form.email);
      body.set("phone", form.phone);
      body.set("company", form.company);
      body.set("participants", form.participants);
      body.set("preferredDate", form.preferredDate);
      body.set("message", form.message);
      body.set("consent", "true");
      body.set("niveau", form.niveau);
      body.set("format", form.format);
      body.set("website", form.website);
      body.set("contactPreference", form.contactPreference);
      body.set("language", lang);
      body.set("idempotencyKey", idempotencyKey);
      // Marketing-Einwilligung läuft NICHT über /api/inquiry — getrennter
      // Double-Opt-In-Flow, siehe handleSubmit weiter unten.
      if (isMail) {
        body.set("street", form.street);
        body.set("zipCity", form.zipCity);
      }
      if (attachment) body.set("attachment", attachment);

      const res = await fetch("/api/inquiry", { method: "POST", body });
      const data = await res.json().catch(() => ({ ok: false }));
      const ok = res.ok && data.ok;
      if (ok) {
        track("form_submit", { form: "kontakt", topic: form.topic, transferredToOne: String(Boolean(data.transferredToOne)) });
        setLeadRef(typeof data.leadId === "string" ? data.leadId : null);
        // Marketing-Opt-In läuft unabhängig von der Anfrage selbst (eigener
        // Double-Opt-In) — ein Fehlschlag hier darf die erfolgreiche Anfrage
        // nicht als "error" zeigen, daher fire-and-forget.
        if (form.marketingConsent) {
          fetch("/api/newsletter", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email: form.email, source: "kontaktformular" }),
          }).catch(() => {});
        }
      }
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
        {leadRef && (
          <p className="mx-auto mb-6 max-w-sm font-sans text-xs text-paper-dim">
            {lang === "de" ? "Referenz" : lang === "es" ? "Referencia" : "Reference"}:{" "}
            <span className="font-mono text-paper">{leadRef.slice(0, 8)}</span>
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setForm(initial);
            setAttachment(null);
            setAttachmentError(null);
            setTouched({});
            setStatus("idle");
            setLeadRef(null);
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

      {/* Schritt 1: Name & E-Mail sind Pflicht */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.vorname} valid={firstNameValid} error={touched.firstName && !firstNameValid ? t.pflichtfeld : undefined}>
          <input
            required
            aria-label={t.vorname}
            placeholder={t.vorname}
            value={form.firstName}
            onChange={update("firstName")}
            onBlur={touch("firstName")}
            className={fieldInputClasses(touched.firstName && !firstNameValid)}
          />
        </Field>
        <Field label={t.nachname} valid={lastNameValid} error={touched.lastName && !lastNameValid ? t.pflichtfeld : undefined}>
          <input
            required
            aria-label={t.nachname}
            placeholder={t.nachname}
            value={form.lastName}
            onChange={update("lastName")}
            onBlur={touch("lastName")}
            className={fieldInputClasses(touched.lastName && !lastNameValid)}
          />
        </Field>
      </div>
      <Field label={t.email} valid={emailValid} error={touched.email && !emailValid ? t.emailUngueltig : undefined}>
        <input
          required
          type="email"
          aria-label={t.email}
          placeholder="name@company.com"
          value={form.email}
          onChange={update("email")}
          onBlur={touch("email")}
          className={fieldInputClasses(touched.email && !emailValid)}
        />
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

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t.unternehmen}>
              <input aria-label={t.unternehmen} placeholder={t.unternehmen} value={form.company} onChange={update("company")} className={inputClasses} />
            </Field>
            <Field label={t.telefon}>
              <input type="tel" aria-label={t.telefon} placeholder={t.telefon} value={form.phone} onChange={update("phone")} className={inputClasses} />
            </Field>
          </div>

          <fieldset>
            <legend className="mb-3 font-sans text-[10px] uppercase tracking-[0.16em] text-gold">
              {t.kontaktwegLabel}
            </legend>
            <div role="radiogroup" aria-label={t.kontaktwegLabel} className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["phone", t.kontaktwegTelefonisch, t.kontaktwegTelefonischHinweis],
                  ["mail", t.kontaktwegSchriftlich, t.kontaktwegSchriftlichHinweis],
                ] as const
              ).map(([value, label, hint]) => {
                const active = form.contactPreference === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setForm((f) => ({ ...f, contactPreference: value }))}
                    className={`border px-4 py-2.5 text-left transition-colors ${
                      active ? "border-brand bg-brand/5" : "border-line hover:border-brand"
                    }`}
                  >
                    <span className="block font-sans text-sm text-paper">{label}</span>
                    <span className="block font-sans text-xs text-paper-dim">{hint}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {isMail && (
            <div className="animate-fade-up grid gap-5 sm:grid-cols-2">
              <Field label={t.strasseLabel} error={touched.street && !streetValid ? t.pflichtfeld : undefined}>
                <input
                  aria-label={t.strasseLabel}
                  placeholder={t.strasseLabel}
                  value={form.street}
                  onChange={update("street")}
                  onBlur={touch("street")}
                  className={fieldInputClasses(touched.street && !streetValid)}
                />
              </Field>
              <Field label={t.plzOrtLabel} error={touched.zipCity && !zipCityValid ? t.pflichtfeld : undefined}>
                <input
                  aria-label={t.plzOrtLabel}
                  placeholder={t.plzOrtLabel}
                  value={form.zipCity}
                  onChange={update("zipCity")}
                  onBlur={touch("zipCity")}
                  className={fieldInputClasses(touched.zipCity && !zipCityValid)}
                />
              </Field>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t.teilnehmerzahl}>
              <input
                type="number"
                min={1}
                inputMode="numeric"
                aria-label={t.teilnehmerzahl}
                placeholder={t.teilnehmerzahl}
                value={form.participants}
                onChange={update("participants")}
                className={inputClasses}
              />
            </Field>
            <Field label={t.wunschtermin}>
              <input
                aria-label={t.wunschtermin}
                placeholder={t.wunschterminPlaceholder}
                value={form.preferredDate}
                onChange={update("preferredDate")}
                className={inputClasses}
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t.niveauLabel}>
              <select
                aria-label={t.niveauLabel}
                value={form.niveau}
                onChange={(e) => setForm((f) => ({ ...f, niveau: e.target.value }))}
                className={inputClasses}
              >
                <option value="">{t.niveauUnbekannt}</option>
                {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </Field>
            <Field label={t.formatLabel}>
              <select
                aria-label={t.formatLabel}
                value={form.format}
                onChange={(e) => setForm((f) => ({ ...f, format: e.target.value }))}
                className={inputClasses}
              >
                <option value="">{t.formatEgal}</option>
                <option value="einzel">{t.formatEinzel}</option>
                <option value="gruppe">{t.formatGruppe}</option>
              </select>
            </Field>
          </div>

          <Field label={t.ihreNachricht} valid={messageValid} error={touched.message && !messageValid ? t.pflichtfeld : undefined}>
            <textarea
              required
              aria-label={t.ihreNachricht}
              rows={5}
              value={form.message}
              onChange={update("message")}
              onBlur={touch("message")}
              placeholder={t.nachrichtPlaceholder}
              className={fieldInputClasses(touched.message && !messageValid)}
            />
          </Field>

          <FileField
            label={t.anhangLabel}
            hint={t.anhangHinweis}
            file={attachment}
            onChange={handleAttachment}
            chooseLabel={t.dateiWaehlen}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          {attachmentError && (
            <p role="alert" className="-mt-4 font-sans text-xs text-error">
              {attachmentError}
            </p>
          )}

          {/* Kein Pflicht-Checkbox mehr für die Grundverarbeitung (Art. 6
              Abs. 1 lit. b/f DSGVO braucht keine ausdrückliche Einwilligung)
              — ein Hinweistext genügt. */}
          <p className="font-sans text-xs leading-relaxed text-paper-dim">
            {t.dsgvoHinweis}{" "}
            <a href={lh(lang, "/rechtliches/datenschutz")} className="link-underline text-brand">
              {t.datenschutzLink}
            </a>
            .
          </p>

          {/* Marketing-Opt-In: eigenständig, standardmäßig NICHT angehakt,
              nicht Voraussetzung für die Anfrage — löst einen separaten
              Double-Opt-In-Workflow aus (siehe /api/newsletter). */}
          <div className="space-y-2">
            <Checkbox
              checked={form.marketingConsent}
              onChange={(checked) => setForm((f) => ({ ...f, marketingConsent: checked }))}
            >
              {t.marketingLabel}
            </Checkbox>
            <p className="font-sans text-[11px] leading-relaxed text-paper-dim">{t.marketingWiderruf}</p>
          </div>

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
