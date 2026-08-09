import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  // Session Replay bewusst aus — DSGVO-Abwägung erfolgt separat, sobald ein
  // echter DSN gesetzt wird (siehe README/Deploy-Doku für Rollout-Schritte).
});

// Von Sentry gefordert, damit App-Router-Navigationen (client-seitige
// Routenwechsel) als Performance-Transaktionen erfasst werden.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
