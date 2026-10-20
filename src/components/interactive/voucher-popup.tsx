"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, inputClasses } from "@/components/ui/form-field";
import { track } from "@/lib/track";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";
import type { VoucherTextKey } from "@/lib/voucher";

// Feste Texte aus dem Wörterbuch + Aktionstexte (Angebot, Fristen) aus ONE.
type T = Dictionary["voucher"] & Record<VoucherTextKey, string>;

// Gutschein-Aktion (Schalter, Fristen, Angebot und Texte im Marketing-Dashboard
// unter "Gutscheine", geladen über /api/voucher/campaign). Desktop: Exit-Intent
// (Maus verlässt das Fenster nach oben). Handy: kleines Kärtchen von unten nach
// Interesse statt Vollbild-Overlay (Google wertet frühe Vollbild-Overlays auf
// Mobilgeräten ab). Pro Besucher einmal; nach "Nein danke" 14 Tage Ruhe, nach
// dem Absenden nie wieder.
const STORAGE_KEY = "il-voucher";
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;
const DESKTOP_ARM_MS = 10_000;
const MOBILE_DELAY_MS = 30_000;
const MOBILE_SCROLL_RATIO = 0.4;
// Seiten, auf denen das Pop-up stören würde (Formulare, Rechtliches, die eigene Bestätigungsseite)
const EXCLUDED = ["/kontakt", "/einstufung", "/demo", "/testen", "/karriere", "/rechtliches", "/gutschein"];

type Variant = "modal" | "sheet";
type Phase = "form" | "sending" | "done";

function readState(): { submitted?: boolean; until?: number } {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}
function writeState(v: { submitted?: boolean; until?: number }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
  } catch {
    // Privater Modus o. ä.: dann erscheint das Pop-up evtl. erneut, mehr passiert nicht.
  }
}

export function VoucherPopup({ lang, t: dict }: { lang: Locale; t: Dictionary["voucher"] }) {
  const pathname = usePathname() || "";
  const [variant, setVariant] = useState<Variant | null>(null);
  const [campaign, setCampaign] = useState<{ requestEndsAt: number; texts: Record<VoucherTextKey, string> } | null>(null);
  const formTouched = useRef(false);

  const excluded = EXCLUDED.some((p) => pathname.startsWith(lh(lang, p)));

  const show = useCallback((v: Variant) => {
    if (document.documentElement.getAttribute("data-focus") === "on") return;
    if (formTouched.current) return;
    const s = readState();
    if (s.submitted || (s.until && s.until > Date.now())) return;
    // Schon beim Anzeigen sperren: wer die Seite einfach verlässt, sieht es 14 Tage nicht wieder.
    writeState({ until: Date.now() + SNOOZE_MS });
    setVariant(v);
    track("voucher_shown", { variant: v });
  }, []);

  // Aktion erst laden, wenn das Pop-up für diesen Besucher überhaupt in Frage kommt.
  useEffect(() => {
    const s = readState();
    if (s.submitted || (s.until && s.until > Date.now())) return;
    let cancelled = false;
    fetch(`/api/voucher/campaign?lang=${lang}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.active) setCampaign({ requestEndsAt: Date.parse(d.requestEndsAt), texts: d.texts });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [lang]);

  useEffect(() => {
    if (!campaign || excluded || Date.now() > campaign.requestEndsAt || variant) return;
    const s = readState();
    if (s.submitted || (s.until && s.until > Date.now())) return;

    // Wer gerade ein anderes Formular ausfüllt, wird nicht unterbrochen.
    const onInput = (e: Event) => {
      if ((e.target as HTMLElement)?.closest?.("form:not([data-voucher])")) formTouched.current = true;
    };
    document.addEventListener("input", onInput, true);

    const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
    const cleanups: (() => void)[] = [() => document.removeEventListener("input", onInput, true)];

    if (desktop) {
      const armedAt = Date.now() + DESKTOP_ARM_MS;
      const onOut = (e: MouseEvent) => {
        if (!e.relatedTarget && e.clientY <= 0 && Date.now() >= armedAt) show("modal");
      };
      document.addEventListener("mouseout", onOut);
      cleanups.push(() => document.removeEventListener("mouseout", onOut));
    } else {
      const timer = window.setTimeout(() => show("sheet"), MOBILE_DELAY_MS);
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (max > 0 && window.scrollY / max >= MOBILE_SCROLL_RATIO) show("sheet");
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.clearTimeout(timer), () => window.removeEventListener("scroll", onScroll));
    }
    return () => cleanups.forEach((c) => c());
  }, [campaign, excluded, variant, show]);

  // Auf ausgeschlossenen Seiten (auch nach clientseitigem Seitenwechsel dorthin) nie anzeigen
  if (!variant || excluded || !campaign) return null;
  return createPortal(
    <VoucherDialog lang={lang} t={{ ...dict, ...campaign.texts }} variant={variant} onClose={(reason) => {
      if (reason === "dismiss") track("voucher_dismissed", { variant });
      setVariant(null);
    }} />,
    document.body,
  );
}

function VoucherDialog({
  lang,
  t,
  variant,
  onClose,
}: {
  lang: Locale;
  t: T;
  variant: Variant;
  onClose: (reason: "dismiss" | "done") => void;
}) {
  const id = useId();
  const [expanded, setExpanded] = useState(variant === "modal");
  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", privacy: false, newsletter: false, website: "" });
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const modal = variant === "modal";
  const close = useCallback(() => onClose(phase === "done" ? "done" : "dismiss"), [onClose, phase]);

  // Modal: Fokus hinein, Tab-Falle, Esc, Seite dahinter sperren, Fokus danach zurück.
  // Sheet: blendet die feste "Anfragen"-Leiste und den Chat aus, solange es offen ist.
  useEffect(() => {
    const root = document.documentElement;
    if (!modal) {
      root.setAttribute("data-voucher-sheet", "");
      return () => root.removeAttribute("data-voucher-sheet");
    }
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>("a[href], button, input:not([tabindex='-1'])");
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previous?.focus?.();
    };
  }, [modal, close]);

  useEffect(() => {
    if (!modal && expanded) firstFieldRef.current?.focus();
  }, [modal, expanded]);

  const valid = form.name.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) && form.privacy;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (phase === "sending") return;
    if (!valid) { setError(t.error); return; }
    setError(null);
    setPhase("sending");
    try {
      const res = await fetch("/api/voucher", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          privacyAck: true,
          newsletter: form.newsletter,
          newsletterConsentText: form.newsletter ? t.newsletterConsent : undefined,
          locale: lang,
          website: form.website,
        }),
      });
      if (res.status === 410) { setError(t.errorEnded); setPhase("form"); return; }
      if (!res.ok) throw new Error(String(res.status));
      writeState({ submitted: true });
      track("voucher_submitted", { variant, newsletter: form.newsletter ? "yes" : "no" });
      setPhase("done");
    } catch {
      setError(t.errorSend);
      setPhase("form");
    }
  }

  const title = (
    <h2 id={`${id}-title`} className={`font-display leading-tight text-paper text-balance ${modal ? "text-3xl" : "pr-8 text-2xl"}`}>
      {t.titleBefore} <span className="text-brand-text">{t.titleHighlight}</span>
    </h2>
  );

  const closeButton = (
    <button
      type="button"
      onClick={close}
      aria-label={t.close}
      className="absolute right-3 top-3 grid h-9 w-9 place-items-center text-paper-dim transition-colors hover:text-paper"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  );

  const fields = (
    <form data-voucher onSubmit={submit} noValidate className="flex flex-col gap-3">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px]"
        value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
      <Field label={t.nameLabel}>
        <input ref={firstFieldRef} type="text" autoComplete="name" required className={inputClasses}
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </Field>
      <Field label={t.emailLabel}>
        <input type="email" autoComplete="email" required placeholder={t.emailPlaceholder} className={inputClasses}
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </Field>
      <label className="grid cursor-pointer grid-cols-[auto_1fr] gap-2.5 font-sans text-xs leading-relaxed text-paper-dim">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-[var(--color-brand-strong)]"
          checked={form.privacy} onChange={(e) => setForm({ ...form, privacy: e.target.checked })} />
        <span>
          {t.privacyBefore}{" "}
          <Link href={lh(lang, "/rechtliches/datenschutz")} target="_blank" className="text-brand-text underline underline-offset-2">
            {t.privacyLink}
          </Link>
          {t.privacyAfter.startsWith(".") ? "" : " "}
          {t.privacyAfter} *
        </span>
      </label>
      <label className="grid cursor-pointer grid-cols-[auto_1fr] gap-2.5 font-sans text-xs leading-relaxed text-paper-dim">
        <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--color-brand-strong)]"
          checked={form.newsletter} onChange={(e) => setForm({ ...form, newsletter: e.target.checked })} />
        <span><strong className="font-medium text-paper">{t.optional}</strong> {t.newsletterConsent}</span>
      </label>
      {error && <p role="alert" className="font-sans text-xs text-error">{error}</p>}
      <Button type="submit" className="w-full">{phase === "sending" ? t.sending : t.submit}</Button>
      {modal && (
        <button type="button" onClick={close} className="self-center font-sans text-sm text-paper-dim underline underline-offset-4 hover:text-paper">
          {t.noThanks}
        </button>
      )}
    </form>
  );

  const done = (
    <div className="flex flex-col gap-3" aria-live="polite">
      <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">{t.doneEyebrow}</span>
      <h2 id={`${id}-title`} className={`font-display leading-tight text-paper text-balance ${modal ? "text-3xl" : "pr-8 text-2xl"}`}>{t.doneTitle}</h2>
      <p className="font-sans text-sm text-paper-dim">
        {t.doneText.split("{email}")[0]}
        <strong className="font-medium text-paper">{form.email.trim()}</strong>
        {t.doneText.split("{email}")[1]}
      </p>
      {modal && <Button onClick={close} className="w-full">{t.doneButton}</Button>}
    </div>
  );

  if (modal) {
    return (
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[3px]"
        onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-title`}
          className="animate-rise relative flex max-h-[calc(100dvh-2rem)] w-full max-w-[460px] flex-col gap-4 overflow-y-auto border border-line border-t-[3px] border-t-brand bg-ink-raised px-8 pb-6 pt-8 shadow-[0_24px_60px_rgba(6,35,58,0.25)]"
        >
          {closeButton}
          {phase === "done" ? done : (
            <>
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">{t.eyebrow}</span>
              {title}
              <p className="font-sans text-sm text-paper-dim">{t.lead}</p>
              {fields}
              <p className="border-t border-line pt-3 font-sans text-[11px] text-paper-dim">{t.fine}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-labelledby={`${id}-title`}
      className="animate-rise fixed inset-x-2.5 bottom-2.5 z-[70] flex max-h-[85dvh] flex-col gap-2.5 overflow-y-auto border border-line border-t-[3px] border-t-brand bg-ink-raised px-[18px] pb-4 pt-5 shadow-[0_-10px_40px_rgba(6,35,58,0.2)]"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      {closeButton}
      {phase === "done" ? done : (
        <>
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">{t.eyebrowMobile}</span>
          {title}
          <p className="font-sans text-[13px] text-paper-dim">{t.leadMobile}</p>
          {expanded ? fields : (
            <Button onClick={() => setExpanded(true)} className="w-full">{t.openForm}</Button>
          )}
        </>
      )}
    </div>
  );
}
