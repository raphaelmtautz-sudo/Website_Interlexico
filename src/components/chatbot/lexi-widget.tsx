"use client";

import { useState, useRef, useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";

interface Message {
  role: "user" | "assistant";
  content: string;
}

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

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const next: Message[] = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/lexi-widget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: dict.lexi.error,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div data-distraction="chat" className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 flex h-[28rem] w-[22rem] flex-col border border-gold-dim bg-ink-raised shadow-2xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-display text-lg text-paper">Lexi</p>
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
