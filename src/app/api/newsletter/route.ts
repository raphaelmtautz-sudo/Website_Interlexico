import { type NextRequest } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";

const ONE_NEWSLETTER_URL =
  process.env.ONE_NEWSLETTER_URL || "https://interlexico.one/sales/api/public/newsletter";

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Marketing-Opt-In (Double-Opt-In). Getrennt von /api/inquiry — eine
 * Werbeeinwilligung nach § 7 Abs. 2 Nr. 3 UWG braucht einen eigenen,
 * nachweisbaren Bestätigungs-Workflow, unabhängig von der eigentlichen
 * Anfrage. Leitet an den bestehenden Endpunkt POST /api/public/newsletter
 * in apps/sales/backend weiter, der den Bestätigungslink verschickt.
 */
export async function POST(req: NextRequest) {
  const rl = await rateLimit(`newsletter:${clientKey(req)}`, { limit: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const email = clean(data.email, 200);
  const source = clean(data.source, 100) || "kontaktformular";
  const website = clean(data.website, 100); // Honeypot

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(ONE_NEWSLETTER_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, source, website }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));
    const json = await res.json().catch(() => ({}));
    return Response.json({ ok: res.ok && json.ok === true }, { status: res.ok ? 200 : 502 });
  } catch {
    return Response.json({ ok: false, error: "one_unreachable" }, { status: 502 });
  }
}
