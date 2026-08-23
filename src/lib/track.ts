"use client";

/**
 * Client-Helfer für den bestehenden cookielosen First-Party-Analytics-Endpunkt
 * (`/api/collect`, siehe dort). Sendet ein anonymes Event-Beacon — kein Cookie,
 * keine IP-Speicherung, respektiert DNT/GPC serverseitig. `sendBeacon` läuft
 * auch dann noch durch, wenn ein Klick sofort eine Navigation auslöst.
 */
export function track(event: string, props?: Record<string, string>): void {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({
      path: window.location.pathname,
      referrer: document.referrer || "",
      event,
      props,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/collect", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/collect", { method: "POST", body, keepalive: true });
    }
  } catch {
    // Tracking darf nie eine Nutzerinteraktion blockieren oder werfen.
  }
}
