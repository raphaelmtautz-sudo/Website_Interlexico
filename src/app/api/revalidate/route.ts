import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "crypto";

/**
 * Wird vom CMS nach dem Speichern aufgerufen (Hooks in interlexico-cms,
 * lib/revalidate.ts) und erneuert die betroffenen Inhalte sofort statt nach
 * bis zu 5 Minuten. Nur mit gemeinsamem Geheimnis (REVALIDATE_SECRET).
 */
const SECRET = process.env.REVALIDATE_SECRET ?? "";
const ALLOWED = /^(guides|faq|testimonials|jobs|team|references|announcement|redirects|legal|legal-extras|contact|site-settings|course-types|industries|placement-test-questions|posts|page-[a-z0-9-]+|post-[a-z0-9-]+)$/;

function validSecret(given: string | null): boolean {
  if (!SECRET || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(SECRET);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  if (!validSecret(req.headers.get("x-revalidate-secret"))) return new Response(null, { status: 401 });
  let tags: string[] = [];
  try {
    const body = (await req.json()) as { tags?: unknown };
    tags = Array.isArray(body.tags) ? body.tags.filter((t): t is string => typeof t === "string" && ALLOWED.test(t)) : [];
  } catch {
    return new Response(null, { status: 400 });
  }
  // { expire: 0 }: der nächste Aufruf bekommt sofort den neuen Inhalt.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: tags });
}
