import * as Sentry from "@sentry/nextjs";

// Fehlerüberwachung über das selbst gehostete GlitchTip (errors.interlexico.one).
// Ohne SENTRY_DSN (lokal/Preview) meldet der SDK-eigene Guard nichts.
// Datenschutz: keine Performance-Daten, keine personenbezogenen Daten — Request-
// Header, Cookies, Query-Strings und Bodies werden vor dem Versand entfernt.
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0,
  sendDefaultPii: false,
  beforeSend(event) {
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers;
      delete event.request.data;
      delete event.request.query_string;
    }
    delete event.user;
    return event;
  },
});
