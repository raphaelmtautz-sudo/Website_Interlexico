import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
    // Nachversand nicht übertragener Anfragen an ONE (siehe src/lib/inquiry-outbox.ts).
    // Nur mit Redis (Produktion); läuft alle 5 Minuten, erster Lauf nach 1 Minute.
    if (process.env.REDIS_URL && process.env.NEXT_PHASE !== "phase-production-build") {
      const { processInquiryOutbox } = await import("./lib/inquiry-outbox");
      const run = () => processInquiryOutbox().catch((err) => console.error("[inquiry-outbox]", err));
      setTimeout(run, 60_000);
      setInterval(run, 5 * 60_000);
    }
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

// Meldet serverseitige Rendering-Fehler (App Router) an Sentry. Ohne DSN
// no-opt der SDK-eigene Guard in sentry.server.config.ts / sentry.edge.config.ts.
export const onRequestError = Sentry.captureRequestError;
