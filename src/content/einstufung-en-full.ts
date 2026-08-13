/**
 * Vollständiger Englisch-Einstufungstest (Reading/Grammar, Listening, Writing,
 * Speaking). Reading/Grammar, Listening und die situative Speaking-Frage sind
 * automatisch auswertbar (Multiple Choice); Writing und die Audio-Aufnahme
 * können nicht automatisch bewertet werden und gehen als Freitext/Aufnahme an
 * das Interlexico-Team zur manuellen Durchsicht.
 */

export type ChoiceQuestion = {
  id: string;
  level: string;
  skill: string;
  context?: string | null;
  audioUrl?: string;
  question: string;
  options: string[];
  correctAnswer: string;
};

export type WritingTask = {
  id: string;
  level: string;
  skill: string;
  prompt: string;
  placeholder?: string;
};

export type RecordingTask = {
  id: string;
  level: string;
  skill: string;
  prompt: string;
  maxDurationSeconds: number;
};

export type TestStep =
  | { kind: "choice"; data: ChoiceQuestion }
  | { kind: "writing"; data: WritingTask }
  | { kind: "recording"; data: RecordingTask };

export const englishFullTest: {
  title: string;
  durationMinutes: number;
  steps: TestStep[];
} = {
  title: "Comprehensive English Placement Test (CEFR)",
  durationMinutes: 12,
  steps: [
    {
      kind: "choice",
      data: {
        id: "EN_READ_A2",
        level: "A2",
        skill: "Reading Comprehension",
        context:
          "Notice: 'Due to scheduled maintenance, the online learning platform will be offline on Saturday from 10:00 PM to 2:00 AM. Please ensure you submit all pending assignments before 9:00 PM.'",
        question: "When will the platform be unavailable?",
        options: [
          "All day Saturday",
          "On Saturday late evening until early Sunday morning",
          "On Sunday afternoon",
          "Only after assignment submission",
        ],
        correctAnswer: "On Saturday late evening until early Sunday morning",
      },
    },
    {
      kind: "choice",
      data: {
        id: "EN_GRAM_B2",
        level: "B2",
        skill: "Grammar",
        question:
          "Select the correct option: 'Had we taken the earlier train, we ____________ the opening remarks of the conference.'",
        options: [
          "wouldn't miss",
          "won't have missed",
          "wouldn't have missed",
          "haven't missed",
        ],
        correctAnswer: "wouldn't have missed",
      },
    },
    {
      kind: "choice",
      data: {
        id: "EN_READ_C1",
        level: "C1",
        skill: "Reading Comprehension",
        context:
          "'The proliferation of AI tools has sparked a fierce debate regarding intellectual property, as algorithms are trained on vast datasets of copyrighted human creation without explicit consent.'",
        question: "What is the core issue raised in the text?",
        options: [
          "AI algorithms are not fast enough to process big data.",
          "Copyright owners are fully compensated for AI training.",
          "Training AI on copyrighted material without consent creates legal and ethical disputes.",
          "Human creators are eager to share their work with AI developers.",
        ],
        correctAnswer:
          "Training AI on copyrighted material without consent creates legal and ethical disputes.",
      },
    },
    {
      kind: "choice",
      data: {
        id: "EN_LISTEN_B1",
        level: "B1",
        skill: "Listening Comprehension",
        context:
          "Voicemail transcript — Mark from Support: 'Hi, this is Mark from support. I looked into your account issue — the fastest fix is to reset your password using the link we just emailed you. That link stays valid for 24 hours, so please use it today. No need to call back unless it doesn't work.'",
        question: "What is the main action the user needs to take?",
        options: [
          "Call Mark back immediately.",
          "Send a new support ticket.",
          "Reset their password via email link within one day.",
          "Create a brand-new user account.",
        ],
        correctAnswer: "Reset their password via email link within one day.",
      },
    },
    {
      kind: "choice",
      data: {
        id: "EN_LISTEN_C1",
        level: "C1",
        skill: "Listening Comprehension",
        context:
          "Podcast excerpt — panel discussion on automated assessment: 'What automated tools genuinely deliver is speed and consistency — they never get tired, and they score the same answer the same way every time. What they still can't do is grasp context the way a human evaluator does: irony, unusual phrasing, or an answer that's technically imperfect but communicates brilliantly. So I'd frame them as a first pass, not a verdict.'",
        question: "What is the speaker's main point about automated tools?",
        options: [
          "They are completely unreliable for language evaluation.",
          "They provide speed and consistency, but lack human-level understanding of context and nuance.",
          "They are superior to human evaluators in every aspect.",
          "They should only be used for beginner-level learners.",
        ],
        correctAnswer:
          "They provide speed and consistency, but lack human-level understanding of context and nuance.",
      },
    },
    {
      kind: "writing",
      data: {
        id: "EN_WRITE_B1_B2",
        level: "B1-B2",
        skill: "Writing",
        prompt:
          "Write a short professional email (approx. 50–80 words) to a course supervisor explaining why you cannot attend tomorrow's class and requesting the materials for self-study.",
        placeholder: "Subject: Absence from tomorrow's class...\n\nDear...",
      },
    },
    {
      kind: "choice",
      data: {
        id: "EN_SPEAK_B2_SITUATIONAL",
        level: "B2",
        skill: "Speaking Strategy",
        context:
          "A colleague suggests taking an immediate decision on a budget allocation, but you feel that crucial information is missing.",
        question: "Which response demonstrates appropriate professional assertiveness?",
        options: [
          "No, that's a terrible idea. We don't have enough information.",
          "I see your point, but I'd suggest we gather the remaining financial figures before making a final decision.",
          "Whatever you want, I don't really care about the budget.",
          "I agree, let's just finalize it right now to save time.",
        ],
        correctAnswer:
          "I see your point, but I'd suggest we gather the remaining financial figures before making a final decision.",
      },
    },
    {
      kind: "recording",
      data: {
        id: "EN_SPEAK_C1_AUDIO_RECORD",
        level: "C1",
        skill: "Oral Production",
        prompt:
          "Record a short audio response (30–60 seconds): 'Briefly explain one key challenge in learning a new language and how you personally overcome it.'",
        maxDurationSeconds: 60,
      },
    },
  ],
};

const choiceSteps = englishFullTest.steps.filter(
  (s): s is { kind: "choice"; data: ChoiceQuestion } => s.kind === "choice",
);

/** Auswertung nur über die automatisch bewertbaren Multiple-Choice-Fragen. */
export function levelForAnswers(answersById: Record<string, string>): {
  level: string;
  title: string;
  description: string;
  correctCount: number;
  totalChoice: number;
} {
  const correctCount = choiceSteps.filter(
    (s) => answersById[s.data.id] === s.data.correctAnswer,
  ).length;
  const total = choiceSteps.length;

  if (correctCount <= Math.ceil(total * 0.33))
    return {
      level: "A2–B1",
      title: "Building the basics",
      description:
        "A structured training builds confidence in everyday life and simple professional situations.",
      correctCount,
      totalChoice: total,
    };
  if (correctCount <= Math.ceil(total * 0.66))
    return {
      level: "B1–B2",
      title: "Confidence in daily work",
      description:
        "You're getting by — with targeted training, meetings, emails, and conversations become noticeably more fluent.",
      correctCount,
      totalChoice: total,
    };
  return {
    level: "C1+",
    title: "Excellence & nuance",
    description:
      "A very strong level. Fine-tuning nuance, negotiations, and industry-specific language.",
    correctCount,
    totalChoice: total,
  };
}
