import type { FaqItem } from "@/content/faq";

/** Branchen-Landingpage für Business English (/[lang]/branchen/[slug]). */
export interface IndustryPage {
  /** Sprachneutraler Slug, identisch in allen Sprachen. */
  slug: string;
  /** Kurzname wie auf Startseite und Kursseite (Chips). */
  name: string;
  eyebrow: string;
  title: string;
  seoTitle: string;
  description: string;
  intro: string;
  /** Typische Sprechsituationen, die das Training abdeckt. */
  situations: string[];
  /** Themen und Fachvokabular. */
  topics: string[];
  /** Empfehlung zu Formaten für diese Branche. */
  formats: string;
  faq: FaqItem[];
}

/** Gemeinsame Überschriften und Texte der Branchenseiten je Sprache. */
export interface IndustryLabels {
  hubTitle: string;
  hubSeoTitle: string;
  hubText: string;
  hubEyebrow: string;
  situations: string;
  topics: string;
  formats: string;
  faq: string;
  cta: string;
  ctaText: string;
  more: string;
  course: string;
  daf: string;
}
