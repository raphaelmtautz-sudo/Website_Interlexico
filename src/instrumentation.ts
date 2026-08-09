import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

// Meldet serverseitige Rendering-Fehler (App Router) an Sentry. Ohne DSN
// no-opt der SDK-eigene Guard in sentry.server.config.ts / sentry.edge.config.ts.
export const onRequestError = Sentry.captureRequestError;
