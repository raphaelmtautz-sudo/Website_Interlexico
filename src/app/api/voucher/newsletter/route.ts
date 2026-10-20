import { type NextRequest } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { VOUCHER_API_URL } from "@/lib/voucher";

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Newsletter-Anmeldung von der Gutschein-Bestätigungsseite. Nur per
 * ausdrücklichem Klick (nie beim Seitenaufruf); der Token beweist, dass die
 * Person Zugriff auf das Postfach hat. IP, Zeitpunkt und Wortlaut werden in
 * ONE als Einwilligungsnachweis gespeichert.
 */
export async function POST(req: NextRequest) {
  const ip = clientKey(req);
  const rl = await rateLimit(`voucher-nl:${ip}`, { limit: 10, windowMs: 10 * 60_000 });
  if (!rl.ok) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const source = clean(data.source, 20);
  if (!["popup", "confirm-page", "code-mail"].includes(source)) {
    return Response.json({ ok: false, error: "invalid_input" }, { status: 422 });
  }

  try {
    const res = await fetch(`${VOUCHER_API_URL}/newsletter`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-ix-client-ip": ip },
      body: JSON.stringify({
        token: clean(data.token, 64),
        source,
        consentText: clean(data.consentText, 1000),
        ip: ip !== "unknown" ? ip : undefined,
      }),
      signal: AbortSignal.timeout(8000),
    });
    return Response.json({ ok: res.ok }, { status: res.ok ? 200 : 502 });
  } catch {
    return Response.json({ ok: false, error: "one_unreachable" }, { status: 502 });
  }
}
