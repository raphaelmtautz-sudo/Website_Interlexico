/**
 * Schlanker In-Memory-Rate-Limiter (Fixed Window) als Basis-Schutz gegen
 * Bots/Scraper und Missbrauch der öffentlichen API-Routen.
 * Hinweis: pro Prozess/Instanz — für horizontale Skalierung später durch einen
 * geteilten Store (z. B. Redis) ersetzen.
 */
type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();
const MAX_KEYS = 10_000;

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
): { ok: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();

  // Gelegentliches Aufräumen, damit die Map nicht unbegrenzt wächst.
  if (buckets.size > MAX_KEYS) {
    for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
  }

  const entry = buckets.get(key);
  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, remaining: opts.limit - 1, retryAfter: 0 };
  }

  entry.count += 1;
  if (entry.count > opts.limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true, remaining: opts.limit - entry.count, retryAfter: 0 };
}

/** Ermittelt eine Client-Kennung aus üblichen Proxy-Headern (Traefik). */
export function clientKey(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
