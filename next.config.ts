import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

/**
 * Content-Security-Policy für eine statische Marketing-Site.
 * - 'unsafe-inline' bei script/style ist nötig für das No-Flash-Theme-Script,
 *   JSON-LD-Datenblöcke, inline-Style-Attribute (Scroll-Progress/Tilt) und die
 *   Style-Injektion. Nonce-basiertes CSP würde statisches Rendering deaktivieren.
 * - img-src erlaubt data: (Grain-Noise-SVG als Data-URI) sowie das Payload-CMS
 *   (cms.interlexico.one), von wo der Browser das Logo/Media direkt lädt.
 * - connect-src 'self' genügt (cookielose First-Party-Analytics, keine Dritt-Hosts).
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://cms.interlexico.one",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  // Hinweis: KEIN 'upgrade-insecure-requests' — würde same-origin-Assets auf
  // https zwingen und damit reine HTTP-Deployments/Previews (Port 3100) brechen.
  // HTTPS wird in Produktion über Reverse-Proxy (Traefik) + HSTS erzwungen.
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=(self), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cms.interlexico.one" }],
  },
  // Root-Layout liegt unter dem dynamischen [lang]-Segment — echte unbekannte
  // URLs (kein notFound()-Aufruf, sondern gar keine passende Route) werden
  // daher nicht vom [lang]/not-found.tsx abgefangen, sondern brauchen die
  // eigenständige global-not-found.tsx (siehe node_modules/next/dist/docs).
  experimental: {
    globalNotFound: true,
  },
  // Browser und Crawler fragen /favicon.ico fest an — auf das generierte Icon umleiten statt 404.
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon" }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

// Sentry ist vorbereitet, aber ohne SENTRY_DSN/NEXT_PUBLIC_SENTRY_DSN inaktiv
// (siehe src/instrumentation.ts, src/instrumentation-client.ts). Sobald ein
// echter DSN gesetzt wird: connect-src oben um den Sentry-Ingest-Host
// erweitern (oder Sentry-Tunneling nutzen), sonst blockt die CSP die Reports.
export default withSentryConfig(nextConfig, {
  silent: true,
  telemetry: false,
});
