import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "crypto";

/**
 * Entwurfs-Vorschau aus dem CMS („Vorschau“-Knopf bei Ratgebern): schaltet den
 * Next.js-Draft-Mode für diesen Browser ein und leitet auf den Artikel weiter.
 * Beenden über /api/preview/exit.
 */
const SECRET = process.env.PREVIEW_SECRET ?? "";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const given = url.searchParams.get("secret") ?? "";
  const path = url.searchParams.get("path") ?? "";
  const ok = SECRET && given.length === SECRET.length && timingSafeEqual(Buffer.from(given), Buffer.from(SECRET));
  if (!ok || !/^\/(de|en|es)\/ratgeber\/[a-z0-9-]+$/.test(path)) return new Response("Ungültige Vorschau", { status: 401 });
  (await draftMode()).enable();
  redirect(path);
}
