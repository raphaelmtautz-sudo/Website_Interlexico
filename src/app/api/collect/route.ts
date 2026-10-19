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
 * Persistenz: leitet an das selbstgehostete Umami (analytics.interlexico.one)
 * weiter — server-seitig, damit der Client weiterhin nur mit der eigenen
 * Domain spricht (kein Third-Party-Request im Browser) und DNT/GPC/Rate-Limit
 * hier zentral vor dem Weiterleiten greifen, statt dass Umami selbst clientseitig
 * eingebunden wird.
 */
const UMAMI_URL = process.env.UMAMI_URL || "https://analytics.interlexico.one";
const UMAMI_WEBSITE_ID = process.env.UMAMI_WEBSITE_ID || "";
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

  // Anonymes Aggregat — keine IP, keine Kennung, kein Fingerprint. Weiterleitung
  // an Umami ist best-effort: darf die Seite nie beeinträchtigen, daher kein await
  // auf das Ergebnis und Fehler werden verschluckt statt den Beacon fehlschlagen zu lassen.
  if (UMAMI_WEBSITE_ID) {
    const origin = request.headers.get("origin") || `https://${request.headers.get("host") || "interlexico.com"}`;
    // Ohne Weiterreichen der Besucher-IP wuerde Umami bei diesem Server-zu-Server-Aufruf
    // die interne Container-IP sehen -> alle Besucher landen als ein "Client". Die IP wird
    // bei Umami NICHT gespeichert, nur transient zur taeglich rotierenden Hash-Bildung
    // genutzt (Visitor-ID) und danach verworfen — bleibt "keine IP gespeichert" im Sinne
    // der Datenschutzerklaerung, wird hier nur korrekt durchgereicht statt verloren.
    const visitorIp = clientKey(request);
    fetch(`${UMAMI_URL}/api/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": request.headers.get("user-agent") || "",
        "X-Forwarded-For": visitorIp,
      },
      body: JSON.stringify({
        type: "event",
        payload: {
          website: UMAMI_WEBSITE_ID,
          url: path || "/",
          referrer: referrer ? `https://${referrer}` : "",
          hostname: new URL(origin).hostname,
          name: event !== "pageview" ? event : undefined,
          data: Object.keys(props).length ? props : undefined,
        },
      }),
    }).catch(() => { /* Analytics duerfen die Seite niemals beeintraechtigen */ });
  } else {
    console.info("[analytics]", JSON.stringify({ event, path, referrer, props }));
  }

  return new Response(null, { status: 204 });
}
