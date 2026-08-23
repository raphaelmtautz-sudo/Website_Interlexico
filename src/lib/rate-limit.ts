import Redis from "ioredis";

/**
 * Rate-Limiter (Fixed Window) als Basis-Schutz gegen Bots/Scraper und
 * Missbrauch der öffentlichen API-Routen.
 *
 * Nutzt den geteilten Redis-Store (ix_shared_cache, siehe /opt/ix/deploy/
 * shared.docker-compose.yml — gleiches Muster wie marketing-backend & Co.)
 * für ein über mehrere Instanzen konsistentes Limit. Ohne gesetzten
 * REDIS_URL (z. B. lokale Entwicklung ohne Docker-Netz) fällt der Limiter
 * automatisch auf einen In-Memory-Zähler pro Prozess zurück — funktioniert
 * dann weiterhin, ist aber bei mehreren Instanzen umgehbar.
 */
const REDIS_URL = process.env.REDIS_URL;

const redis = REDIS_URL
  ? new Redis(REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null, // kein endloses Reconnect-Spamming, Fallback übernimmt
    })
  : null;

let redisAvailable = Boolean(redis);
redis?.on("error", () => {
  redisAvailable = false;
});
redis?.connect().catch(() => {
  redisAvailable = false;
});

type Entry = { count: number; resetAt: number };
const memoryBuckets = new Map<string, Entry>();
const MAX_KEYS = 10_000;

function rateLimitMemory(
  key: string,
  opts: { limit: number; windowMs: number },
): { ok: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();

  if (memoryBuckets.size > MAX_KEYS) {
    for (const [k, v] of memoryBuckets) if (now > v.resetAt) memoryBuckets.delete(k);
  }

  const entry = memoryBuckets.get(key);
  if (!entry || now > entry.resetAt) {
    memoryBuckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, remaining: opts.limit - 1, retryAfter: 0 };
  }

  entry.count += 1;
  if (entry.count > opts.limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true, remaining: opts.limit - entry.count, retryAfter: 0 };
}

export async function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
): Promise<{ ok: boolean; remaining: number; retryAfter: number }> {
  if (!redis || !redisAvailable) return rateLimitMemory(key, opts);

  try {
    const redisKey = `ratelimit:${key}`;
    const count = await redis.incr(redisKey);
    if (count === 1) {
      await redis.pexpire(redisKey, opts.windowMs);
    }
    if (count > opts.limit) {
      const ttlMs = await redis.pttl(redisKey);
      return { ok: false, remaining: 0, retryAfter: Math.ceil(Math.max(ttlMs, 0) / 1000) };
    }
    return { ok: true, remaining: opts.limit - count, retryAfter: 0 };
  } catch {
    // Redis kurzzeitig nicht erreichbar — lieber laxeres In-Memory-Limit
    // als Formulare/APIs komplett zu blockieren.
    return rateLimitMemory(key, opts);
  }
}

/** Ermittelt eine Client-Kennung aus üblichen Proxy-Headern (Traefik). */
export function clientKey(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
