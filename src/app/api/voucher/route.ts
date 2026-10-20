import { type NextRequest } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { VOUCHER_API_URL } from "@/lib/voucher";

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Gutschein anfordern (Pop-up). Leitet an Interlexico ONE weiter, das die
 * Bestätigungsmail verschickt; den Code gibt es erst nach Klick auf den Link.
 * Die Besucher-IP geht nur mit, wenn das Newsletter-Häkchen gesetzt ist — als
 * Teil des Einwilligungsnachweises (Datenschutzerklärung, Abschnitt 6b).
 */
export async function POST(req: NextRequest) {
  const ip = clientKey(req);
  const rl = await rateLimit(`voucher:${ip}`, { limit: 5, windowMs: 10 * 60_000 });
  if (!rl.ok) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const name = clean(data.name, 120);
  const email = clean(data.email, 200);
  const newsletter = data.newsletter === true;
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || data.privacyAck !== true) {
    return Response.json({ ok: false, error: "invalid_input" }, { status: 422 });
  }

  try {
    const res = await fetch(VOUCHER_API_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-ix-client-ip": ip },
      body: JSON.stringify({
        name,
        email,
        privacyAck: true,
        newsletter,
        newsletterConsentText: newsletter ? clean(data.newsletterConsentText, 1000) : undefined,
        locale: clean(data.locale, 5),
        ip: newsletter && ip !== "unknown" ? ip : undefined,
        website: clean(data.website, 100), // Honeypot
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (res.status === 410) return Response.json({ ok: false, error: "campaign_ended" }, { status: 410 });
    return Response.json({ ok: res.ok }, { status: res.ok ? 200 : 502 });
  } catch {
    return Response.json({ ok: false, error: "one_unreachable" }, { status: 502 });
  }
}
