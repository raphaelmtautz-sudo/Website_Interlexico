"use client";

import { useState, useRef, useEffect } from "react";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";

interface Message {
  role: "user" | "assistant";
  content: string;
  href?: string;
  hrefLabel?: string;
}

// Lexi ist ein reiner B2B-Anfrage-Flow (siehe submitInquiry -> /api/inquiry),
// hat aber keine eigene Behandlung fuer Bewerbungen — landete eine Bewerbung
// hier, wurde sie bisher als generischer Lead im Marketing-/Sales-CRM
// abgelegt statt im QA-Bewerbungstrichter (/karriere -> quality-backend).
// Erkennung im ersten (freien) Themen-Feld bricht den Anfrage-Flow ab und
// verweist stattdessen auf das echte Bewerbungsformular mit CV-Upload.
const CAREER_INTENT_RE =
  /\b(bewerb\w*|stelle\s+als|job\s*application|apply(?:ing)?\s+(?:for|as)|career\s+(?:opportunit|opening)|vacanc\w*|hiring|postula\w*|solicitud\s+de\s+empleo|trabajar\s+como|empleo)\b/i;

// Minimale Typen für die Web Speech API (nicht in lib.dom enthalten).
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult:
    | ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void)
    | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

const speechLang: Record<Locale, string> = { de: "de-DE", en: "en-US", es: "es-ES" };

// Geführter Frage-Flow: Lexi sammelt (Anliegen → Unternehmen → Name → E-Mail
// → Details) und übergibt das Ergebnis am Ende an /api/inquiry — dieselbe
// Mail-Zustellung wie das Kontaktformular. Kein freies KI-Gespräch, solange
// keine echte KI-Anbindung existiert (siehe KONZEPT.md, "Lexi-Integration").
type Step = "topic" | "company" | "name" | "email" | "details" | "done";

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function LexiWidget({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: dict.lexi.greeting,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("topic");
  const answersRef = useRef({ topic: "", company: "", name: "", email: "", details: "" });
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  // Sprach-Eingabe (multimodal) — nur wenn der Browser sie unterstützt.
  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
    // Client-only Feature-Detection: bewusst per Effect, um SSR-Hydration-
    // Mismatch am bedingt gerenderten Mic-Button zu vermeiden.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVoiceSupported(true);
    const rec = new Ctor();
    rec.lang = speechLang[lang];
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e) => {
      const transcript = e.results?.[0]?.[0]?.transcript ?? "";
      if (transcript) setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    return () => {
      rec.onresult = null;
      rec.onend = null;
      rec.onerror = null;
    };
  }, [lang]);

  function toggleVoice() {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (listening) {
      rec.stop();
      setListening(false);
    } else {
      try {
        rec.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    }
  }

  async function submitInquiry() {
    const a = answersRef.current;
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "lexi-chat",
          topic: a.topic,
          name: a.name,
          email: a.email,
          company: a.company,
          message: a.details && a.details !== "-" ? a.details : "",
          website: "", // Honeypot, siehe /api/inquiry
        }),
      });
      if (!res.ok) throw new Error("inquiry_failed");
      setMessages((m) => [...m, { role: "assistant", content: dict.lexi.closing }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: dict.lexi.error }]);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    const value = input.trim();
    if (!value || loading || step === "done") return;
    setMessages((m) => [...m, { role: "user", content: value }]);
    setInput("");

    if (step === "email" && !isValidEmail(value)) {
      setMessages((m) => [...m, { role: "assistant", content: dict.lexi.invalidEmail }]);
      return;
    }

    if (step === "topic" && CAREER_INTENT_RE.test(value)) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: dict.lexi.careerRedirect, href: lh(lang, "/karriere"), hrefLabel: dict.lexi.careerRedirectLink },
      ]);
      setStep("done");
      return;
    }

    const a = answersRef.current;
    if (step === "topic") a.topic = value;
    else if (step === "company") a.company = value;
    else if (step === "name") a.name = value;
    else if (step === "email") a.email = value;
    else if (step === "details") a.details = value;

    const flow: { step: Step; question: string }[] = [
      { step: "company", question: dict.lexi.askCompany },
      { step: "name", question: dict.lexi.askName },
      { step: "email", question: dict.lexi.askEmail },
      { step: "details", question: dict.lexi.askDetails },
    ];
    const currentIndex = flow.findIndex((f) => f.step === step);

    if (currentIndex === -1) {
      // step === "topic": erste Frage aus dem Flow stellen.
      setMessages((m) => [...m, { role: "assistant", content: flow[0].question }]);
      setStep(flow[0].step);
      return;
    }

    const nextEntry = flow[currentIndex + 1];
    if (nextEntry) {
      setMessages((m) => [...m, { role: "assistant", content: nextEntry.question }]);
      setStep(nextEntry.step);
      return;
    }

    // Letzte Frage (Details) beantwortet → Anfrage per Mail versenden.
    setStep("done");
    setLoading(true);
    setMessages((m) => [...m, { role: "assistant", content: dict.lexi.sending }]);
    await submitInquiry();
  }

  return (
    <div data-distraction="chat" className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 flex h-[28rem] w-[22rem] flex-col border border-gold-dim bg-ink-raised shadow-2xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div>
              <p className="font-display text-lg text-paper leading-tight">Lexi</p>
              <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-paper-dim">{dict.lexi.subtitle}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="font-sans text-xs uppercase tracking-widest text-paper-dim hover:text-gold"
              aria-label={dict.lexi.close}
            >
              {dict.lexi.close}
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`font-sans text-sm leading-relaxed ${
                  m.role === "user" ? "text-paper" : "text-paper-dim"
                }`}
              >
                <span className="mr-2 font-sans text-[10px] uppercase tracking-widest text-gold">
                  {m.role === "user" ? dict.lexi.you : "Lexi"}
                </span>
                <p>{m.content}</p>
                {m.href && (
                  <a href={m.href} className="mt-1 inline-block link-underline text-gold">
                    {m.hrefLabel}
                  </a>
                )}
              </div>
            ))}
            {loading && (
              <p className="font-sans text-xs text-paper-dim">{dict.lexi.typing}</p>
            )}
          </div>
          <div className="flex border-t border-line">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={dict.lexi.placeholder}
              className="flex-1 bg-transparent px-4 py-3 font-sans text-sm text-paper placeholder:text-paper-dim focus:outline-none"
            />
            {voiceSupported && (
              <button
                onClick={toggleVoice}
                aria-label={listening ? dict.lexi.voiceStop : dict.lexi.voiceStart}
                aria-pressed={listening}
                title={dict.lexi.voiceStart}
                className={`border-l border-line px-4 transition-colors ${
                  listening ? "bg-gold text-ink" : "text-gold hover:bg-gold hover:text-ink"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className={listening ? "animate-pulse" : ""}>
                  <rect x="9" y="3" width="6" height="11" rx="0" fill="currentColor" />
                  <path d="M5 11a7 7 0 0 0 14 0M12 18v3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
            )}
            <button
              onClick={sendMessage}
              className="border-l border-line px-4 font-sans text-xs uppercase tracking-widest text-gold hover:bg-gold hover:text-ink"
            >
              {dict.lexi.send}
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="border border-gold bg-ink px-5 py-3 font-sans text-xs uppercase tracking-[0.18em] text-gold hover:bg-gold hover:text-ink transition-colors"
      >
        {dict.lexi.trigger}
      </button>
    </div>
  );
}
