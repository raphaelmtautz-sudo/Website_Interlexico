import type { Locale } from "@/lib/i18n";
import type { FaqItem } from "@/content/faq";
import { services as de } from "./de";
import { services as en } from "./en";
import { services as es } from "./es";

/**
 * Leistungsseiten außerhalb der Kurstypen (Executive Language Coaching,
 * Interkulturelle Kommunikation). Inhalte nur nach Angaben des Betreibers —
 * keine Preise, keine erfundenen Details (Dauer, Länder, Zertifikate).
 */
export type ServicePage = {
  slug: string;
  name: string;
  seoTitle: string;
  description: string;
  eyebrow: string;
  title: string;
  answer: string;
  facts: { label: string; value: string }[];
  forWhomTitle: string;
  forWhom: string[];
  topicsTitle: string;
  topics: string[];
  processTitle: string;
  process: { title: string; text: string }[];
  faqTitle: string;
  faq: FaqItem[];
  ctaTitle: string;
  ctaText: string;
  serviceType: string;
  related: { label: string; path: string }[];
};

export const SERVICE_SLUGS = ["executive-language-coaching", "interkulturelle-kommunikation"] as const;
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

const byLocale: Record<Locale, Record<ServiceSlug, ServicePage>> = { de, en, es };

export function getService(locale: Locale, slug: ServiceSlug): ServicePage {
  return byLocale[locale][slug];
}
