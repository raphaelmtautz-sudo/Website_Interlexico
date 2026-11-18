import { type NextRequest } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";

/**
 * Start des Einstufungstests von interlexico.com/einstufung. Der Test selbst läuft in
 * Interlexico ONE (Fragen, Auswertung, Prüfung durch Trainer:innen, Ergebnis-Mail, Lead) —
 * hier wird nur ein Test angelegt und der Link zur ONE-Testseite zurückgegeben.
 *  - Kurztest (QUICK): ohne Kontaktdaten; die fragt ONE vor dem Ergebnis ab.
 *  - Volltest (FULL): Kontaktdaten vorab, damit das geprüfte Ergebnis zugestellt werden kann.
 * Aufruf intern über das Docker-Netz; die Besucher-IP geht für das Rate-Limit in ONE mit.
 */
const ONE_PLACEMENT_URL =
  process.env.ONE_PLACEMENT_URL || "http://ix_sales_backend:4003/api/public/placement/start";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: NextRequest) {
  const ip = clientKey(req);
  const rl = await rateLimit(`einstufungstest:${ip}`, { limit: 10, windowMs: 60 * 60_000 });
  if (!rl.ok) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  }
  const body = await req.json().catch(() => ({}));
  if (clean(body.website, 100)) return Response.json({ ok: true, link: null }); // Honeypot

  const mode = body.mode === "FULL" ? "FULL" : "QUICK";
  const language = body.language === "de" ? "de" : "en";
  const uiLanguage = ["de", "en", "es"].includes(body.uiLanguage) ? body.uiLanguage : "de";
  const payload: Record<string, unknown> = { mode, language, uiLanguage };
  if (mode === "FULL") {
    payload.name = clean(body.name, 200);
    payload.email = clean(body.email, 200);
    payload.companyName = clean(body.companyName, 200);
    payload.phone = clean(body.phone, 60);
    payload.privacy = body.privacy === true;
  }

  try {
    const r = await fetch(ONE_PLACEMENT_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-ix-client-ip": ip },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.link) {
      return Response.json({ ok: false, error: d.error || "start_failed", field: d.field }, { status: r.status === 400 ? 422 : 502 });
    }
    return Response.json({ ok: true, link: d.link });
  } catch (e) {
    console.error("[einstufungstest] ONE nicht erreichbar:", (e as Error).message);
    return Response.json({ ok: false, error: "unavailable" }, { status: 502 });
  }
}
