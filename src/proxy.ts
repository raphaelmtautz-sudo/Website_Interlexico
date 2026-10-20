import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, hasLocale } from "@/lib/i18n";

const LOCALE_COOKIE = "il-locale";

function detectLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && hasLocale(cookieLocale)) return cookieLocale;

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    for (const part of acceptLanguage.split(",")) {
      const lang = part.trim().split(";")[0].split("-")[0].toLowerCase();
      if (hasLocale(lang)) return lang;
    }
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (pathnameHasLocale) return NextResponse.next();

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, { maxAge: 60 * 60 * 24 * 365, path: "/" });
  return response;
}

export const config = {
  matcher: [
    // Alles außer _next, statischen Assets und API-Routen (die bleiben sprachneutral).
    // 7137db0cfdcc73c1c6d4b491f56f58f9.txt = IndexNow-Schlüssel (muss im Wurzelverzeichnis liegen, siehe scripts/indexnow.mjs);
    // google…html / BingSiteAuth.xml = Bestätigungsdateien für Search Console / Bing Webmaster Tools.
    "/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|llms.txt|llms-full.txt|7137db0cfdcc73c1c6d4b491f56f58f9.txt|google[0-9a-f]+\\.html|BingSiteAuth.xml|\\.well-known|opengraph-image|icon|apple-icon|manifest.webmanifest).*)",
  ],
};
