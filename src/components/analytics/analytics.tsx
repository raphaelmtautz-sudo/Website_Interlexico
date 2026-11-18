"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/track";

/**
 * Cookielose Seitenaufruf-Erfassung (Privacy-First, kein Consent-Banner nötig).
 * Sendet nur einen anonymen Beacon (Pfad + Referrer-Domain), respektiert
 * Do-Not-Track und Global Privacy Control. Speichert nichts im Browser.
 */
function optedOut(): boolean {
  if (typeof navigator === "undefined") return true;
  const nav = navigator as Navigator & {
    doNotTrack?: string;
    globalPrivacyControl?: boolean;
  };
  const dnt =
    nav.doNotTrack ??
    (window as unknown as { doNotTrack?: string }).doNotTrack;
  return dnt === "1" || dnt === "yes" || nav.globalPrivacyControl === true;
}

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (optedOut()) return;
    // Nur die Referrer-Domain, nicht die volle URL (Datensparsamkeit).
    let referrer = "";
    try {
      referrer = document.referrer ? new URL(document.referrer).hostname : "";
    } catch {
      referrer = "";
    }
    const payload = JSON.stringify({ path: pathname, referrer });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/collect", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/collect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      /* Analytics dürfen die Seite niemals beeinträchtigen. */
    }
  }, [pathname]);

  // Klicks auf Telefon, E-Mail und WhatsApp zentral erfassen (ohne Nummer/Adresse).
  useEffect(() => {
    if (optedOut()) return;
    function onClick(e: MouseEvent) {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const event = href.startsWith("tel:")
        ? "phone_click"
        : href.startsWith("mailto:")
          ? "email_click"
          : /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)
            ? "whatsapp_click"
            : null;
      if (!event) return;
      const place = a.closest("footer") ? "footer" : a.closest("header") ? "header" : "seite";
      track(event, { place });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
