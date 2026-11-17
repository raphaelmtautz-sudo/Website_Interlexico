import * as Sentry from "@sentry/nextjs";

/**
 * Meldet ein technisches Problem an GlitchTip (Sentry-kompatibel, selbst
 * gehostet, errors.interlexico.one) und ins Container-Log. Ohne SENTRY_DSN
 * (lokal/Preview) bleibt nur das Log.
 *
 * Datenschutz: `context` darf KEINE personenbezogenen Daten enthalten
 * (keine Namen, E-Mail-Adressen, Telefonnummern, Freitexte) — nur technische
 * Kennungen wie idempotencyKey, Art der Anfrage, Fehlercode.
 */
export function reportIssue(
  message: string,
  context: Record<string, string | number | boolean | undefined> = {},
  level: "error" | "warning" | "info" = "error",
): void {
  const log = level === "error" ? console.error : level === "warning" ? console.warn : console.info;
  log(message, context);
  try {
    Sentry.captureMessage(message, { level, extra: context, tags: { area: String(context.area ?? "website") } });
  } catch {
    /* Monitoring darf nie den eigentlichen Ablauf stören. */
  }
}
