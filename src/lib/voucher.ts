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

export type VoucherConfirmResult =
  | {
      ok: true;
      name: string;
      code: string;
      expiresAt: string;
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
