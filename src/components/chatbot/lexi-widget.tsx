"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function LexiWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Guten Tag. Ich bin Lexi. Wie kann ich Ihnen bei Ihrem Business-English-Training helfen?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

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
          content: "Entschuldigung, es gab ein technisches Problem. Bitte versuchen Sie es später erneut.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 flex h-[28rem] w-[22rem] flex-col border border-gold-dim bg-ink-raised shadow-2xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-display text-lg text-paper">Lexi</p>
            <button
              onClick={() => setOpen(false)}
              className="font-sans text-xs uppercase tracking-widest text-paper-dim hover:text-gold"
              aria-label="Chat schließen"
            >
              Schließen
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
                  {m.role === "user" ? "Sie" : "Lexi"}
                </span>
                <p>{m.content}</p>
              </div>
            ))}
            {loading && (
              <p className="font-sans text-xs text-paper-dim">Lexi tippt…</p>
            )}
          </div>
          <div className="flex border-t border-line">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ihre Frage…"
              className="flex-1 bg-transparent px-4 py-3 font-sans text-sm text-paper placeholder:text-paper-dim focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="border-l border-line px-4 font-sans text-xs uppercase tracking-widest text-gold hover:bg-gold hover:text-ink"
            >
              Senden
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="border border-gold bg-ink px-5 py-3 font-sans text-xs uppercase tracking-[0.18em] text-gold hover:bg-gold hover:text-ink transition-colors"
      >
        Fragen? — Lexi
      </button>
    </div>
  );
}
