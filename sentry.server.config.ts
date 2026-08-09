import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  // Ohne DSN (lokal/Preview) meldet der SDK-eigene Guard nichts an Sentry.
});
