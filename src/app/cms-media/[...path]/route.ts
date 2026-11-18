/**
 * Öffentliche Auslieferung von CMS-Bildern (Trainerfotos, Logos, Titelbilder).
 * Das CMS selbst liegt hinter dem SSO-Login; die Website holt die Datei intern
 * und liefert sie unter der eigenen Domain aus (passt zur CSP, cachebar).
 */
const CMS_URL = process.env.CMS_URL ?? "http://127.0.0.1:3020";
const SAFE = /^[A-Za-z0-9._-]+$/;
const TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  if (path.length !== 1 || !SAFE.test(path[0])) return new Response(null, { status: 404 });
  try {
    const res = await fetch(`${CMS_URL}/api/media/file/${encodeURIComponent(path[0])}`, { next: { revalidate: 3600 } });
    const type = res.headers.get("content-type")?.split(";")[0] ?? "";
    // Nur Rasterbilder ausliefern (das CMS lässt ohnehin nur diese hochladen).
    if (!res.ok || !TYPES.has(type)) return new Response(null, { status: 404 });
    return new Response(res.body, {
      headers: {
        "content-type": type,
        "cache-control": "public, max-age=86400, stale-while-revalidate=604800",
        "x-content-type-options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
