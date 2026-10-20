"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/track";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";

type T = Dictionary["voucher"];

export function CopyCode({ code, t }: { code: string; t: T["page"] }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(code).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => {});
      }}
      className="font-sans text-xs uppercase tracking-[0.12em] text-brand-text underline underline-offset-4 hover:text-paper"
    >
      {copied ? t.copied : t.copy}
    </button>
  );
}

/**
 * Newsletter-Angebot auf der Bestätigungsseite. Drei Zustände:
 *  - "requested": im Pop-up angehakt -> eigener Bestätigungs-Button (kein Nebeneffekt des Code-Klicks)
 *  - "none":      "Schon unseren Newsletter abonniert?" mit Häkchen + Button
 *  - "subscribed": nur Hinweis
 * Angemeldet wird nur per Klick, nie beim Seitenaufruf (Link-Scanner in Mailprogrammen).
 */
export function NewsletterBox({
  lang,
  token,
  initial,
  fromMail,
  t,
}: {
  lang: Locale;
  token: string;
  initial: "none" | "requested" | "subscribed";
  fromMail: boolean;
  t: T;
}) {
  const p = t.page;
  const [state, setState] = useState(initial);
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function subscribe() {
    if (busy) return;
    if (state === "none" && !checked) return;
    setBusy(true);
    setError(false);
    const source = state === "requested" ? "popup" : fromMail ? "code-mail" : "confirm-page";
    try {
      const res = await fetch("/api/voucher/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          source,
          // Wortlaut, dem zugestimmt wurde: beim Pop-up-Häkchen dessen Text, sonst der hier gezeigte
          consentText: state === "requested" ? t.newsletterConsent : p.nlAskConsent,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      track("voucher_newsletter", { source });
      setState("subscribed");
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  const box = "flex flex-col gap-3 border border-line bg-ink p-5 text-left";
  const heading = "font-display text-2xl leading-tight text-paper";

  if (state === "subscribed") {
    return (
      <div id="newsletter" className={box} aria-live="polite">
        <h2 className={heading}>{p.nlDoneTitle}</h2>
        <p className="font-sans text-sm text-paper-dim">{p.nlDoneText}</p>
      </div>
    );
  }

  return (
    <div id="newsletter" className={box}>
      <h2 className={heading}>{state === "requested" ? p.nlConfirmTitle : p.nlAskTitle}</h2>
      {state === "requested" ? (
        <p className="font-sans text-sm text-paper-dim">{p.nlConfirmText}</p>
      ) : (
        <label className="grid cursor-pointer grid-cols-[auto_1fr] gap-2.5 font-sans text-sm leading-relaxed text-paper-dim">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--color-brand-strong)]"
            checked={checked} onChange={(e) => setChecked(e.target.checked)} />
          <span>
            {p.nlAskConsent}{" "}
            <Link href={lh(lang, "/rechtliches/datenschutz")} className="text-brand-text underline underline-offset-2">
              {t.privacyLink}
            </Link>
          </span>
        </label>
      )}
      {error && <p role="alert" className="font-sans text-xs text-error">{p.nlError}</p>}
      <Button variant="secondary" onClick={subscribe} className="self-start">
        {state === "requested" ? p.nlConfirmButton : p.nlAskButton}
      </Button>
      {state === "requested" && <p className="font-sans text-xs text-paper-dim">{p.nlNote}</p>}
    </div>
  );
}
