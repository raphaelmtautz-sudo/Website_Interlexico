import { type NextRequest } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";

/**
 * Lexi-Chat der Website: leitet die Frage an Interlexico ONE weiter (Admin-Backend, Lexi-API mit
 * Zugriffstoken; die KI läuft lokal auf dem eigenen Server) und reicht die Antwort als Stream
 * (NDJSON: meta / token / done / busy) an den Browser durch. Keine Quellenangabe, keine Preise.
 */
const LEXI_API_URL = process.env.LEXI_API_URL || "http://ix_admin_backend:4001/api/lexi/knowledge/chat";
const LEXI_API_TOKEN = process.env.LEXI_API_TOKEN || "";
const LANGS = new Set(["de", "en", "es"]);

export async function POST(req: NextRequest) {
  const ip = clientKey(req);
  const minute = await rateLimit(`lexi:${ip}`, { limit: 8, windowMs: 10 * 60_000 });
  const day = await rateLimit(`lexi-day:${ip}`, { limit: 40, windowMs: 24 * 3600_000 });
  if (!minute.ok || !day.ok) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(Math.max(minute.retryAfter, 60)) } });
  }
  if (!LEXI_API_TOKEN) return Response.json({ ok: false, error: "unavailable" }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  const question = typeof body.question === "string" ? body.question.trim().slice(0, 500) : "";
  const language = LANGS.has(body.language) ? body.language : "de";
  if (question.length < 2) return Response.json({ ok: false, error: "empty" }, { status: 422 });
  try {
    const r = await fetch(LEXI_API_URL, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${LEXI_API_TOKEN}`, "x-ix-client-ip": ip },
      body: JSON.stringify({ question, language }),
      signal: AbortSignal.timeout(120_000),
    });
    if (!r.ok || !r.body) return Response.json({ ok: false, error: "unavailable" }, { status: 502 });
    return new Response(r.body, { headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store", "x-accel-buffering": "no" } });
  } catch (e) {
    console.error("[lexi] ONE nicht erreichbar:", (e as Error).message);
    return Response.json({ ok: false, error: "unavailable" }, { status: 502 });
  }
}
