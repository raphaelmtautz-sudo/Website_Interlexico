import { CourseType } from "@/types/course";
import { getIndustries } from "@/content/industries";

export const businessEnglish: CourseType = {
  slug: "business-english",
  name: "Business English",
  shortName: "Business English",
  status: "aktiv",
  tagline: "Negotiate, present, and communicate with confidence — in English",
  heroTitle: "Business English for leaders and teams",
  heroSubtitle:
    "No off-the-shelf language course. Training built around your industry, your meetings, and your goals.",
  intro:
    "Interlexico brings specialists and executives across the DACH region to the language level that international negotiations, presentations, and client conversations demand. Individually tailored, with clear measurement of success for HR.",
  audience: [
    "Executives with international stakeholders",
    "Sales and customer service teams",
    "Specialist departments ahead of international assignments or M&A processes",
    "Companies with growing international business",
  ],
  benefits: [
    {
      title: "Individual level check",
      description:
        "Every training starts with a precise assessment of language level and needs — no guesswork on course level.",
    },
    {
      title: "Industry-specific content",
      description:
        "Vocabulary and case studies from your industry instead of generic textbook scenarios.",
    },
    {
      title: "Measurable progress",
      description:
        "Regular reporting for HR and leadership — learning progress becomes visible, not just a feeling.",
    },
    {
      title: "Flexible formats",
      description:
        "One-on-one, group, or full class training — matched to team size and budget.",
    },
  ],
  formats: [
    {
      slug: "einzelunterricht",
      kind: "einzel",
      name: "One-on-one training",
      description:
        "1:1 coaching with maximum flexibility for scheduling and pace — ideal for executives with tight calendars.",
      priceFrom: 89,
      priceUnit: "per session (60 min.)",
      duration: "from 10 sessions",
      capacity: "1 participant",
      highlights: [
        "Individual training plan",
        "Flexible scheduling",
        "Preparation for specific events (pitches, negotiations)",
      ],
    },
    {
      slug: "gruppentraining",
      kind: "gruppe",
      name: "Group training",
      description:
        "For teams with a similar language level and shared professional touchpoints.",
      priceFrom: 59,
      priceUnit: "per person / session (90 min.)",
      duration: "from 8 sessions",
      capacity: "max. 7 participants",
      highlights: [
        "Small groups (max. 7) — more speaking time per person",
        "Case studies from your shared daily work",
        "Fixed weekly slot",
      ],
    },
    {
      slug: "klassentraining",
      kind: "klasse",
      name: "Class training",
      description:
        "For entire departments or locations — a structured curriculum with unified reporting for HR.",
      priceFrom: 39,
      priceUnit: "per person / session (90 min.)",
      duration: "semester programme",
      capacity: "7–16 participants",
      highlights: [
        "Unified curriculum per level",
        "Central progress reporting",
        "Scalable across multiple locations",
      ],
    },
  ],
  industries: getIndustries("en"),
  testimonials: [
    {
      quote:
        "Our sales leaders now run international client conversations with noticeably more confidence. The reporting helped us justify the budget internally.",
      name: "anonymised",
      role: "Head of People & Culture",
      company: "mid-sized industrial company (name on request)",
    },
  ],
  seo: {
    title: "Business English Training for Companies | Interlexico",
    description:
      "Business English training for executives and teams across the DACH region. Tailored, industry-specific, with measurable progress.",
  },
};
