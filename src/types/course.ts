export type CourseFormatKind = "einzel" | "gruppe" | "klasse";

export interface CourseFormat {
  slug: string;
  kind: CourseFormatKind;
  name: string;
  description: string;
  priceFrom: number;
  priceUnit: string;
  duration: string;
  capacity: string;
  highlights: string[];
}

export interface CourseTestimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

export interface CourseType {
  slug: string;
  name: string;
  shortName: string;
  status: "aktiv" | "bald-verfuegbar";
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  intro: string;
  audience: string[];
  benefits: { title: string; description: string }[];
  formats: CourseFormat[];
  testimonials: CourseTestimonial[];
  seo: {
    title: string;
    description: string;
  };
}

export interface Product {
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
}
