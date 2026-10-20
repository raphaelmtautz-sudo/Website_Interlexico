/** Zentrale Site-Konstanten für Metadata, JSON-LD, sitemap & robots. */
export const SITE = {
  url: "https://interlexico.com",
  name: "Interlexico",
  legalName: "Interlexico UG (haftungsbeschränkt)",
  // Fallback für JSON-LD/llms, wenn das CMS beim Build nicht erreichbar ist
  // (statisch gebaute Seiten behielten sonst eine Organisation ohne Adresse).
  // Maßgeblich bleibt das CMS-Global "legal" — bei Umzug beides anpassen.
  address: { street: "Hauptstraße 37", zipCity: "82140 Olching", country: "DE" },
  description:
    "Corporate Language Training für Unternehmen in der DACH-Region: Business English und Deutsch als Fremdsprache, individuell eingestuft, mit messbarem Fortschritt und über Interlexico ONE organisiert.",
  locale: "de_DE",
  areaServed: ["DE", "AT", "CH"],
  sameAs: [] as string[], // Social-/Verzeichnis-Profile ergänzen, sobald vorhanden
  // Öffentliche Kontaktdaten (von der bestehenden Live-Seite interlexico.com).
  email: "info@interlexico.com",
  inquiryEmail: "contact@interlexico.com", // Anfragen aus Formularen/Buchung
  careerEmail: "career@interlexico.com", // Bewerbungen aus dem Karriere-Formular
  phone: "+49 8094 6689 803", // Fallback — maßgeblich ist das CMS-Global "legal"
  phoneMobile: "+49 1515 3646471",
  whatsapp: "+49 1515 3646471",
} as const;
