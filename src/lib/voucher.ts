import "server-only";

/**
 * Gutschein-Aktion (Pop-up, Bestätigungsseite). Die Daten liegen in
 * Interlexico ONE (apps/sales/backend, Route /api/public/voucher) — diese Website
 * reicht nur weiter. Intern über das gemeinsame Docker-Netz statt über die
 * öffentliche Domain: kein Umweg über Traefik, und das Backend-Rate-Limit
 * sieht ohnehin nur die Website als Absender (Pro-Besucher-Limit sitzt hier).
 */
export const VOUCHER_API_URL =
  process.env.ONE_VOUCHER_URL || "http://ix_sales_backend:4003/api/public/voucher";

export type VoucherTextKey = "eyebrow" | "eyebrowMobile" | "titleBefore" | "titleHighlight" | "lead" | "leadMobile" | "fine";

// Laufende Aktion fürs Pop-up, gepflegt im Marketing-Dashboard (Gutscheine).
// Texte kommen fertig (Platzhalter ersetzt) je Sprache. Ist ONE nicht
// erreichbar, bleibt das Pop-up aus: Anfordern würde dann ohnehin scheitern.
export type VoucherCampaign = {
  requestEndsAt: string;
  texts: Record<"de" | "en" | "es", Record<VoucherTextKey, string>>;
};

export async function getVoucherCampaign(): Promise<VoucherCampaign | null> {
  try {
    const res = await fetch(`${VOUCHER_API_URL}/campaign`, {
      next: { revalidate: 60, tags: ["voucher-campaign"] },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.active ? { requestEndsAt: data.requestEndsAt, texts: data.texts } : null;
  } catch {
    return null;
  }
}

export type VoucherConfirmResult =
  | {
      ok: true;
      name: string;
      code: string;
      expiresAt: string;
      minUnits: number;
      redeemed: boolean;
      newsletter: "none" | "requested" | "subscribed";
    }
  | { ok: false; reason: "invalid" | "expired" | "error" };

export async function confirmVoucher(token: string): Promise<VoucherConfirmResult> {
  if (!/^[a-f0-9]{48}$/.test(token)) return { ok: false, reason: "invalid" };
  try {
    const res = await fetch(`${VOUCHER_API_URL}/confirm`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 404) return { ok: false, reason: "invalid" };
    if (res.status === 410) return { ok: false, reason: "expired" };
    if (!res.ok) return { ok: false, reason: "error" };
    const data = await res.json();
    return { ok: true, ...data };
  } catch {
    return { ok: false, reason: "error" };
  }
}
