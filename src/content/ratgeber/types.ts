import type { FaqItem } from "@/content/faq";

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

/** Ratgeber-Artikel (/[lang]/ratgeber/[slug]) — statisch, versioniert, dreisprachig. */
export interface Guide {
  /** Sprachneutraler Slug, identisch in allen Sprachen. */
  slug: string;
  eyebrow: string;
  title: string;
  seoTitle: string;
  description: string;
  /** Erstveröffentlichung und letzte inhaltliche Prüfung (YYYY-MM-DD). */
  published: string;
  updated: string;
  readingMinutes: number;
  /** Kurzantwort ganz oben — die Passage, die Suchmaschinen und KI-Assistenten zitieren sollen. */
  summary: string;
  sections: GuideSection[];
  faq: FaqItem[];
  /** Weiterführende interne Links (sprachneutrale Pfade). */
  related: { label: string; path: string }[];
}

export interface GuideLabels {
  hubEyebrow: string;
  hubTitle: string;
  hubSeoTitle: string;
  hubText: string;
  summary: string;
  updated: string;
  minutes: string;
  faq: string;
  related: string;
  cta: string;
  ctaText: string;
  read: string;
  author: string;
}
