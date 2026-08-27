import { randomUUID } from "crypto";

/**
 * Übergabeschicht an Interlexico ONE (das operative CRM). interlexico.com
 * erfasst Leads nur — Interlexico ONE ist die Single Source of Truth für
 * Leads/Kunden/Buchungen (siehe KONZEPT.md). Diese Funktion darf niemals
 * werfen: ein Ausfall von ONE darf keine Anfrage verlieren, siehe Aufrufer
 * (die E-Mail-Benachrichtigung läuft unabhängig weiter).
 */

const ONE_API_URL = process.env.ONE_API_URL; // z. B. https://one.interlexico.com
const ONE_API_KEY = process.env.ONE_API_KEY; // Bearer-Key, Format "il_..."
const RETRY_DELAYS_MS = [300, 1000]; // Retry 1, Retry 2 — danach gilt der Versuch als fehlgeschlagen (Retry 3 = Aufrufer-seitig via Cron/erneutem Submit)

export type LeadPayload = {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone?: string;
  notes?: string;
  kind: string; // "kontakt" | "buchung" | "lexi" | ...
  campaign?: string;
  language: string;
  consent: boolean;
  /** Stabil pro Formular-Sitzung, verhindert doppelte Leads bei Retry/Doppelklick. */
  idempotencyKey: string;
  /** Optionales Qualifizierungssignal, z. B. ein abgeschlossener Einstufungstest (§44 Lead Scoring). */
  signal?: { type: string; value?: string; weight?: number };
};

export type LeadTransferResult =
  | { ok: true; leadId: string; idempotent: boolean }
  | { ok: false; error: string };

export function newIdempotencyKey(): string {
  return randomUUID();
}

export async function submitLead(payload: LeadPayload): Promise<LeadTransferResult> {
  if (!ONE_API_URL || !ONE_API_KEY) {
    return { ok: false, error: "one_not_configured" };
  }

  let lastError = "unknown_error";
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    if (attempt > 0) await sleep(RETRY_DELAYS_MS[attempt - 1]);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${ONE_API_URL.replace(/\/$/, "")}/api/v1/leads`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${ONE_API_KEY}`,
          "idempotency-key": payload.idempotencyKey,
        },
        body: JSON.stringify({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          company: payload.company || "",
          phone: payload.phone || "",
          notes: payload.notes || "",
          source: "interlexico.com",
          kind: payload.kind,
          campaign: payload.campaign,
          language: payload.language,
          consent: payload.consent,
          idempotencyKey: payload.idempotencyKey,
          signalType: payload.signal?.type,
          signalValue: payload.signal?.value,
          signalWeight: payload.signal?.weight,
        }),
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      if (res.ok) {
        const json = (await res.json().catch(() => null)) as { data?: { id?: string }; idempotent?: boolean } | null;
        const leadId = json?.data?.id;
        if (leadId) return { ok: true, leadId, idempotent: Boolean(json?.idempotent) };
        lastError = "no_lead_id_returned";
        continue; // keine gültige Antwort -> wie ein Fehlversuch behandeln
      }
      // 4xx (außer 429) sind nicht durch Retry lösbar (z. B. Validierungsfehler) -> sofort abbrechen.
      if (res.status >= 400 && res.status < 500 && res.status !== 429) {
        return { ok: false, error: `one_rejected_${res.status}` };
      }
      lastError = `one_status_${res.status}`;
    } catch {
      lastError = "one_unreachable";
    }
  }
  return { ok: false, error: lastError };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
