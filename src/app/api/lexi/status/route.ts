/**
 * Ist Lexi erreichbar? Für den Statuspunkt am Chat-Icon (grün = online, rot = offline).
 * Fragt die Lexi-API in Interlexico ONE (mit Zugriffstoken) und merkt sich das Ergebnis 60 Sekunden,
 * damit nicht jeder Seitenaufruf ONE belastet. Ob die KI selbst antwortet, merkt das Widget
 * zusätzlich an fehlgeschlagenen Antworten.
 */
const LEXI_API_URL = process.env.LEXI_API_URL || "http://ix_admin_backend:4001/api/lexi/knowledge/chat";
const LEXI_API_TOKEN = process.env.LEXI_API_TOKEN || "";
const VERSION_URL = LEXI_API_URL.replace(/\/chat$/, "/version");
const TTL_MS = 60_000;

let cached: { online: boolean; at: number } | null = null;

export const dynamic = "force-dynamic";

export async function GET() {
  if (!cached || Date.now() - cached.at > TTL_MS) {
    let online = false;
    if (LEXI_API_TOKEN) {
      try {
        const r = await fetch(VERSION_URL, { headers: { authorization: `Bearer ${LEXI_API_TOKEN}` }, cache: "no-store", signal: AbortSignal.timeout(4000) });
        online = r.ok;
      } catch {
        online = false;
      }
    }
    cached = { online, at: Date.now() };
  }
  return Response.json({ online: cached.online }, { headers: { "cache-control": "no-store" } });
}
