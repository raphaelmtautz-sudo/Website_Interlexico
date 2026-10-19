import { type NextRequest } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";

/**
 * Server-zu-Server-Proxy zum customer-backend (POST /api/auth/signup) —
 * gleiches Muster wie /api/career/apply → quality-backend: intern über das
 * ix-public Docker-Netz erreichbar, kein CORS auf der Zielroute nötig.
 */
const CUSTOMER_SIGNUP_URL = process.env.CUSTOMER_SIGNUP_INTERNAL_URL ?? "http://ix_customer_backend:4009/api/auth/signup";

export async function POST(req: NextRequest) {
  const rl = await rateLimit(`trial-signup:${clientKey(req)}`, { limit: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  }

  let body: unknown;
  try { body = await req.json(); } catch { return Response.json({ ok: false, error: "bad_request" }, { status: 400 }); }

  try {
    const res = await fetch(CUSTOMER_SIGNUP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ error: "Server nicht erreichbar — bitte später erneut versuchen." }, { status: 502 });
  }
}
