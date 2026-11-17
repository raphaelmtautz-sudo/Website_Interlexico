import type { FaqItem } from "@/content/faq";

/** Regionale Landingpage (München & Oberbayern). Keine Preise — Angebote nur auf Anfrage. */
export type LocalPage = {
  slug: string;
  /** Kurzname für Footer, Breadcrumb, llms.txt */
  name: string;
  seoTitle: string;
  description: string;
  eyebrow: string;
  title: string;
  intro: string;
  onsiteTitle: string;
  onsiteText: string;
  /** Orte, an denen vor Ort trainiert wird (weitere nach Absprache) */
  places: string[];
  placesNote: string;
  offerTitle: string;
  offers: { title: string; text: string; href: string; linkLabel: string }[];
  whyTitle: string;
  why: { title: string; text: string }[];
  faqTitle: string;
  faq: FaqItem[];
  ctaTitle: string;
  ctaText: string;
  secondaryCta: string;
};
