import { CourseType } from "@/types/course";

export const deutschAlsFremdsprache: CourseType = {
  slug: "deutsch-als-fremdsprache",
  name: "German as a Foreign Language",
  shortName: "German",
  status: "aktiv",
  tagline: "Settling into the language of business",
  heroTitle: "German as a Foreign Language for international teams",
  heroSubtitle:
    "Helping international professionals settle quickly into German-speaking workplaces — professionally confident, culturally fluent, ready from day one.",
  intro:
    "Interlexico brings international employees to the German level their daily work demands: meetings, emails, specialist discussions, and dealing with authorities and colleagues. Individually tailored, practice-oriented, with clear measurement of success for HR.",
  audience: [
    "International specialists and executives at German-speaking companies",
    "Newly relocated employees during onboarding",
    "Teams with mixed language backgrounds building a shared working language",
    "Companies looking to integrate international talent for the long term",
  ],
  benefits: [
    {
      title: "Real work, not a textbook",
      description:
        "We train the situations that actually matter: team meetings, emails, calls, and specialist discussions in your area.",
    },
    {
      title: "Faster integration",
      description:
        "New international employees find their footing faster, both linguistically and culturally — at work and in everyday life.",
    },
    {
      title: "Measurable progress",
      description:
        "Level assessment, clear learning goals, and regular reporting make progress visible for HR and leadership.",
    },
    {
      title: "Flexible formats",
      description:
        "One-on-one, group, or class training — online, on-site, or hybrid, matched to team size and shift patterns.",
    },
  ],
  formats: [
    {
      slug: "einzelunterricht",
      kind: "einzel",
      name: "One-on-one training",
      description:
        "1:1 training with maximum flexibility — ideal for executives and specialists who need targeted German fast for specific tasks.",
      priceFrom: 0,
      priceUnit: "on request",
      duration: "individual",
      capacity: "1 participant",
      highlights: [
        "Individual learning plan tailored to role and goals",
        "Flexible scheduling, even with tight calendars",
        "Preparation for specific situations (meetings, authorities, specialist talks)",
      ],
    },
    {
      slug: "gruppentraining",
      kind: "gruppe",
      name: "Group training",
      description:
        "For teams with a similar language level and shared work topics — builds team spirit and a common working language.",
      priceFrom: 0,
      priceUnit: "on request",
      duration: "from 8 sessions",
      capacity: "max. 7 participants",
      highlights: [
        "Small groups (max. 7) — more speaking time per person",
        "Practical scenarios from your shared daily work",
        "Fixed weekly slot, online or on-site",
        "Building a shared team communication style",
      ],
    },
    {
      slug: "klassentraining",
      kind: "klasse",
      name: "Class training",
      description:
        "For entire departments or onboarding cohorts — a structured curriculum with unified reporting for HR.",
      priceFrom: 0,
      priceUnit: "on request",
      duration: "semester programme",
      capacity: "7–16 participants",
      highlights: [
        "Unified curriculum per level (A1–C1)",
        "Central progress reporting",
        "Scalable across multiple locations and shifts",
      ],
    },
  ],
  testimonials: [],
  seo: {
    title: "German as a Foreign Language for Companies | Interlexico",
    description:
      "German as a Foreign Language training for international specialists and executives across the DACH region. Practice-oriented, integration-focused, with measurable progress.",
  },
};
