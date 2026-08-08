/** Zentrale Site-Konstanten für Metadata, JSON-LD, sitemap & robots. */
export const SITE = {
  url: "https://interlexico.com",
  name: "Interlexico",
  legalName: "Interlexico",
  description:
    "Sprachakademie für Unternehmen in der DACH-Region: Business English und Deutsch als Fremdsprache. Individuell, messbar, ohne Umwege.",
  locale: "de_DE",
  areaServed: ["DE", "AT", "CH"],
  sameAs: [] as string[], // Social-/Verzeichnis-Profile ergänzen, sobald vorhanden
  // Öffentliche Kontaktdaten (von der bestehenden Live-Seite interlexico.com).
  email: "info@interlexico.com",
  inquiryEmail: "contact@interlexico.com", // Anfragen aus Formularen/Buchung
  phone: "+49 8142 4624046",
  phoneMobile: "+49 1515 3646471",
} as const;
