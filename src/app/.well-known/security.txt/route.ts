import { SITE } from "@/lib/site";

/** RFC 9116 — Kontakt für Sicherheitsmeldungen. Ablaufdatum rollt automatisch ein Jahr voraus. */
export function GET() {
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  const body = [
    `Contact: mailto:${SITE.email}`,
    `Expires: ${expires}`,
    "Preferred-Languages: de, en",
    `Canonical: ${SITE.url}/.well-known/security.txt`,
    `Policy: ${SITE.url}/de/rechtliches/impressum`,
    "",
  ].join("\n");
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" },
  });
}
