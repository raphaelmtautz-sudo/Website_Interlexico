import type { IndustryLabels, IndustryPage } from "./types";

export const labels: IndustryLabels = {
  hubEyebrow: "Business English by industry",
  hubTitle: "Business English for your industry",
  hubSeoTitle: "Business English by Industry — Corporate Training | Interlexico",
  hubText:
    "Every industry has its own language. Interlexico trains Business English with the vocabulary and conversations of your working day — for teams in Germany, Austria and Switzerland, online, on-site or hybrid.",
  situations: "Typical situations in the training",
  topics: "Topics and vocabulary",
  formats: "Suitable formats",
  faq: "Frequently asked questions",
  cta: "Request training for your team",
  ctaText: "Briefly describe your team, goals and timeline — you usually receive a non-binding quote within one business day.",
  more: "Other industries",
  course: "Go to the Business English course",
  daf: "German as a Foreign Language is offered across all industries and roles.",
};

export const industries: IndustryPage[] = [
  {
    slug: "oeffentlicher-dienst",
    name: "Public sector & government",
    eyebrow: "Business English · Public sector",
    title: "English for public authorities and the public sector",
    seoTitle: "English Training for Public Authorities | Interlexico",
    description:
      "English training for public authorities, administrations and public institutions: citizen contact, international cooperation and administrative language — online, on-site or hybrid.",
    intro:
      "Whether immigration office, ministry, municipality or university administration: public-sector employees increasingly speak English — with citizens who do not speak German, with EU partners and in international projects. Interlexico trains exactly these situations, with clear, plain language instead of jargon.",
    situations: [
      "Advising citizens in English at the counter, on the phone and by email",
      "Explaining procedures, deadlines and required documents simply and accurately",
      "Taking part in EU projects, partnerships and international working groups",
      "Hosting delegations and holding specialist meetings",
      "Writing English letters, explanations of decisions and minutes",
    ],
    topics: [
      "Administrative and procedural vocabulary",
      "Plain English: explaining complex rules simply",
      "Polite, de-escalating conversation techniques",
      "Funding and project language (EU programmes)",
      "Intercultural communication with citizens",
    ],
    formats:
      "Teams with citizen contact benefit from group training (max. 7 people) with role plays from their own office. Whole authorities or sites train in class training with a shared curriculum per level and central reporting. Senior staff with international appointments train one-to-one.",
    faq: [
      {
        question: "Can the training be tailored to our authority?",
        answer:
          "Yes. After a needs analysis we work with the procedures, forms and conversations of your office — from citizen contact to international project work.",
      },
      {
        question: "Can the training take place during working hours?",
        answer:
          "Yes. Sessions are scheduled around duty rosters and take place online, on-site at your institution, or hybrid.",
      },
      {
        question: "How is progress documented for HR?",
        answer:
          "Every programme starts with a CEFR placement. Through Interlexico ONE, HR receives regular progress reporting.",
      },
    ],
  },
  {
    slug: "vertrieb",
    name: "Sales & business development",
    eyebrow: "Business English · Sales",
    title: "English for sales and business development",
    seoTitle: "Business English for Sales Teams | Interlexico",
    description:
      "English training for sales and business development teams: pitches, negotiations, handling objections and client conversations — tailored, with measurable progress.",
    intro:
      "In international sales, language helps decide whether a deal closes. Interlexico trains sales and business development teams for the conversations that matter: from the first call and the presentation to the price negotiation.",
    situations: [
      "Cold calls and first meetings by phone and video",
      "Product and solution presentations to international clients",
      "Handling objections confidently and arguing value",
      "Leading price and contract negotiations",
      "Writing follow-up emails, proposals and LinkedIn messages",
    ],
    topics: [
      "Sales and negotiation language",
      "Storytelling and persuasive presenting",
      "Questioning techniques and active listening",
      "Small talk and relationship building across cultures",
      "Proposal, contract and terms vocabulary",
    ],
    formats:
      "Sales teams benefit from group training with real pitches and negotiation role plays. Before important meetings, one-to-one training prepares for specific presentations or negotiations.",
    faq: [
      {
        question: "Can we prepare real client meetings?",
        answer:
          "Yes. In one-to-one training we prepare specific pitches, presentations and negotiations — with your materials and your clients' typical objections.",
      },
      {
        question: "Which level is the sales training for?",
        answer:
          "Every level. Participants are placed according to the CEFR at the start; groups are formed by similar language level.",
      },
      {
        question: "Is the training online?",
        answer: "Online, on-site or hybrid — to fit your team's travel and calendars.",
      },
    ],
  },
  {
    slug: "engineering",
    name: "Engineering & technical services",
    eyebrow: "Business English · Engineering",
    title: "Technical English for engineering and technical services",
    seoTitle: "Technical English for Engineers & Technical Teams | Interlexico",
    description:
      "Technical English for engineers, project and service technicians: specifications, project meetings, customer support and documentation — practical and industry-specific.",
    intro:
      "Engineers and technicians work with international clients, suppliers and colleagues — in project meetings, during commissioning and in service. Interlexico trains the technical English this requires: precise, clear and confident.",
    situations: [
      "Project meetings and alignment with international partners",
      "Explaining technical solutions, processes and problems",
      "Supporting customers during commissioning, maintenance and faults",
      "Reading and writing specifications, requirements and reports",
      "Communicating changes, delays and risks clearly",
    ],
    topics: [
      "Technical vocabulary for your field",
      "Describing processes, dimensions, tolerances and faults",
      "Project management English",
      "Safety and quality communication",
      "Technical documentation and emails",
    ],
    formats:
      "Project teams learn in group training with case examples from their own projects. One-to-one training with flexible scheduling suits service technicians working abroad; whole departments or sites train in class training.",
    faq: [
      {
        question: "Do trainers work with our technical vocabulary?",
        answer:
          "Yes. In an initial needs analysis we clarify products, processes and typical situations; vocabulary and case examples come from your technical environment.",
      },
      {
        question: "Does the training fit shift or project schedules?",
        answer: "Yes. Sessions are scheduled around shifts and projects — online, on-site or hybrid.",
      },
      {
        question: "Can we prepare employees for an assignment abroad?",
        answer:
          "Yes. One-to-one or group training prepares specifically for assignments, commissioning and client meetings abroad.",
      },
    ],
  },
  {
    slug: "banken-finanzen",
    name: "Banking & financial services",
    eyebrow: "Business English · Finance",
    title: "English for banking and financial services",
    seoTitle: "Financial English for Banks & Financial Services | Interlexico",
    description:
      "Financial English for banks, insurers and financial service providers: client advice, reporting, compliance and presentations — individually assessed, with measurable progress.",
    intro:
      "In banks and financial services, English is a working language — in client advice, reporting, risk management and in exchanges with international group entities. Interlexico trains the precise financial English this work requires.",
    situations: [
      "Advising international clients on accounts, financing and investments",
      "Presenting figures, results and KPIs",
      "Contributing to meetings with international group entities",
      "Explaining compliance, risk and regulatory topics",
      "Writing precise emails, memos and reports",
    ],
    topics: [
      "Financial English: balance sheet, P&L, KPIs",
      "Banking, lending and investment vocabulary",
      "Compliance and regulatory language",
      "Presenting figures and trends confidently",
      "Diplomatic phrasing in sensitive conversations",
    ],
    formats:
      "Specialist departments train in groups with case examples from their own area. Managers and specialists with presentations or negotiations use one-to-one training; programmes across sites run as class training with uniform reporting.",
    faq: [
      {
        question: "Does the training cover specialist language such as reporting and compliance?",
        answer:
          "Yes. Content is based on your areas — such as client advice, reporting, risk or compliance — and defined in the needs analysis.",
      },
      {
        question: "How is progress demonstrated?",
        answer:
          "With a CEFR placement at the start and regular progress reporting via Interlexico ONE — transparent for HR and managers.",
      },
      {
        question: "Is there training for individual managers?",
        answer:
          "Yes. One-to-one training with 60-minute sessions prepares managers for presentations, committees and negotiations.",
      },
    ],
  },
  {
    slug: "it-software",
    name: "IT & software",
    eyebrow: "Business English · IT",
    title: "English for IT and software teams",
    seoTitle: "Business English for IT & Software Teams | Interlexico",
    description:
      "English training for developers, product and IT teams: stand-ups, code reviews, stakeholder communication and documentation — practical for international teams.",
    intro:
      "In IT and software teams, English is often the working language: in stand-ups, tickets, code reviews and conversations with clients and stakeholders. Interlexico trains developers, product teams and IT departments to communicate clearly and confidently — beyond the technology.",
    situations: [
      "Running and contributing to stand-ups, plannings and retrospectives in English",
      "Writing clear code reviews, tickets and pull requests",
      "Explaining technical topics to non-technical stakeholders",
      "Clarifying requirements with clients and managing expectations",
      "Communicating incidents, delays and priorities",
    ],
    topics: [
      "Agile and project vocabulary",
      "Technical writing: docs, tickets, release notes",
      "Giving and receiving feedback",
      "Presenting architecture and product decisions",
      "Communication in distributed, multicultural teams",
    ],
    formats:
      "Development teams learn in group training using their own tickets, reviews and meetings as material. Tech leads and product owners use one-to-one training for stakeholder conversations and presentations; training usually runs online.",
    faq: [
      {
        question: "Our teams work remotely — can the training be online?",
        answer:
          "Yes. Training runs online, on-site or hybrid; for distributed teams, online training with fixed weekly sessions is common.",
      },
      {
        question: "Is it only about technical vocabulary?",
        answer:
          "No. Alongside technical English we mainly train communication: meetings, feedback, stakeholder conversations and clear writing.",
      },
      {
        question: "Can participants with different levels learn together?",
        answer:
          "Groups are formed by similar language level. Where levels differ widely, we combine group and one-to-one training.",
      },
    ],
  },
  {
    slug: "management-fuehrung",
    name: "Management & leadership",
    eyebrow: "Business English · Leadership",
    title: "Business English for managers and leadership",
    seoTitle: "Business English for Managers & Executives | Interlexico",
    description:
      "Business English coaching for managers: negotiations, presentations to boards and clients, leading teams and crisis communication — one-to-one and flexible.",
    intro:
      "Managers lead international teams, negotiate with partners and present to boards, investors and clients. Interlexico trains the English that makes leadership convincing: clear, confident and diplomatic — usually as one-to-one coaching with flexible scheduling.",
    situations: [
      "Negotiating with international partners",
      "Presenting strategy and results to boards, committees and clients",
      "Leading international teams, giving feedback and holding appraisals",
      "Chairing meetings and workshops",
      "Communicating clearly in crises and change",
    ],
    topics: [
      "Negotiation and persuasion language",
      "Executive presentations and storytelling",
      "Leadership communication and feedback",
      "Diplomatic language and escalation",
      "Change and crisis communication",
    ],
    formats:
      "For managers with tight calendars, one-to-one coaching (60-minute sessions, from 10 sessions) prepares specifically for upcoming appointments. Leadership teams can additionally work together in group training.",
    faq: [
      {
        question: "Can we focus the training on an upcoming appointment?",
        answer:
          "Yes. One-to-one coaching prepares specifically for negotiations, presentations or board meetings — with your own materials.",
      },
      {
        question: "How flexible is scheduling?",
        answer: "In one-to-one training you choose sessions freely — online, on-site or hybrid, around travel and calendars.",
      },
      {
        question: "Can a leadership team train together?",
        answer:
          "Yes. In group training (max. 7 people) leadership teams work together on meetings, presentations and negotiations; individual managers add one-to-one coaching.",
      },
    ],
  },
];
