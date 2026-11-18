/**
 * Profilbild von Lexi für das Website-Widget. Hochgeladen wird es in Interlexico ONE
 * (Admin → Lexi Wissen → Lexi-Einstellungen); hier nur durchgereicht und 10 Minuten zwischengespeichert.
 * Kein Bild hinterlegt → 404 (das Widget zeigt dann ein „L“).
 */
const AVATAR_URL = (process.env.LEXI_API_URL || "http://ix_admin_backend:4001/api/lexi/knowledge/chat").replace(/\/knowledge\/chat$/, "/avatar");

export const revalidate = 600;

export async function GET() {
  try {
    const r = await fetch(AVATAR_URL, { next: { revalidate: 600 }, signal: AbortSignal.timeout(5000) });
    if (!r.ok) return new Response(null, { status: 404, headers: { "cache-control": "public, max-age=300" } });
    return new Response(await r.arrayBuffer(), {
      headers: { "content-type": r.headers.get("content-type") || "image/webp", "cache-control": "public, max-age=600, stale-while-revalidate=86400" },
    });
  } catch {
    return new Response(null, { status: 404, headers: { "cache-control": "public, max-age=60" } });
  }
}
