import { type NextRequest } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";

/**
 * Cookieloser, first-party Analytics-Endpunkt (Privacy by Design).
 *
 * - Setzt KEINE Cookies und speichert KEINE IP-Adresse oder personenbezogenen
 *   Merkmale → nach DSGVO/TTDSG ohne Einwilligung/Banner zulässig.
 * - Respektiert Do-Not-Track (DNT) und Global Privacy Control (Sec-GPC):
 *   signalisiert der Client ein Opt-out, wird nichts verarbeitet.
 *
 * Hinweis: Persistenz (Zählung/Aggregat) ist bewusst als Platzhalter (Log)
 * angelegt — an eine datenschutzfreundliche Ablage (z. B. eigene DB, Plausible)
 * anschließbar, ohne die Client-Integration zu ändern.
 */
export async function POST(request: NextRequest) {
  // Basis-Schutz gegen Missbrauch: max. 60 Beacons/Minute je Client.
  const rl = await rateLimit(`collect:${clientKey(request)}`, { limit: 60, windowMs: 60_000 });
  if (!rl.ok) {
    return new Response(null, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  }

  // Server-seitiges Opt-out-Signal respektieren.
  if (request.headers.get("DNT") === "1" || request.headers.get("Sec-GPC") === "1") {
    return new Response(null, { status: 204 });
  }

  let path = "";
  let referrer = "";
  let event = "pageview";
  const props: Record<string, string> = {};
  try {
    const body = await request.json();
    path = typeof body?.path === "string" ? body.path.slice(0, 512) : "";
    referrer = typeof body?.referrer === "string" ? body.referrer.slice(0, 512) : "";
    if (typeof body?.event === "string" && body.event.trim()) {
      event = body.event.slice(0, 80);
    }
    if (body?.props && typeof body.props === "object") {
      for (const [k, v] of Object.entries(body.props as Record<string, unknown>)) {
        if (typeof v === "string") props[String(k).slice(0, 40)] = v.slice(0, 200);
        if (Object.keys(props).length >= 10) break;
      }
    }
  } catch {
    return new Response(null, { status: 204 });
  }

  // Anonymes Aggregat — keine IP, keine Kennung, kein Fingerprint.
  console.info("[analytics]", JSON.stringify({ event, path, referrer, props }));

  return new Response(null, { status: 204 });
}
