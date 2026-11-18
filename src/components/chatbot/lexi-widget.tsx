"use client";

import { useState, useRef, useEffect } from "react";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";
import { track } from "@/lib/track";

/**
 * Lexi auf der Website: KI-Assistentin (Interlexico ONE, lokal auf dem eigenen Server).
 *  - Nach 5 Sekunden erscheint einmal pro Sitzung ein kleines Pop-up mit Begrüßung.
 *  - Freie Fragen → /api/lexi/chat (Antwort als Stream, nur aus geprüften Wissensartikeln,
 *    keine Quellenangabe, keine Preise).
 *  - Findet Lexi keine Antwort, bietet sie die geführte Anfrage an das Team an
 *    (Unternehmen → Name → E-Mail → Details → /api/inquiry, wie bisher).
 */
const LEXI_AVATAR = "/lexi-avatar";
const TEASER_DELAY_MS = 5000;
const TEASER_KEY = "lexi-teaser-seen";

interface Message {
  role: "user" | "assistant";
  content: string;
  href?: string;
  hrefLabel?: string;
  offerInquiry?: boolean;
  pending?: boolean;
}

// Bewerbungen gehören nicht in den Anfrage-Flow, sondern ins Bewerbungsformular (/karriere).
const CAREER_INTENT_RE =
  /\b(bewerb\w*|stelle\s+als|job\s*application|apply(?:ing)?\s+(?:for|as)|career\s+(?:opportunit|opening)|vacanc\w*|hiring|postula\w*|solicitud\s+de\s+empleo|trabajar\s+como|empleo)\b/i;

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;
const speechLang: Record<Locale, string> = { de: "de-DE", en: "en-US", es: "es-ES" };

type Step = "chat" | "company" | "name" | "email" | "details" | "done";
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function Avatar({ size = 36 }: { size?: number }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span aria-hidden="true" style={{ width: size, height: size }} className="flex shrink-0 items-center justify-center rounded-full border border-gold bg-ink font-display text-gold">L</span>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={LEXI_AVATAR} alt="" width={size} height={size} onError={() => setFailed(true)} style={{ width: size, height: size }} className="shrink-0 rounded-full border border-gold-dim object-cover" />
  );
}

export function LexiWidget({ lang, dict }: { lang: Locale; dict: Pick<Dictionary, "lexi"> }) {
  const t = dict.lexi;
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: t.greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("chat");
  const answersRef = useRef({ topic: "", company: "", name: "", email: "", details: "" });
  const lastQuestion = useRef("");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  // Pop-up nach 5 Sekunden, einmal pro Sitzung
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(TEASER_KEY) === "1"; } catch { /* ignore */ }
    if (seen) return;
    const id = window.setTimeout(() => {
      setTeaser(true);
      try { sessionStorage.setItem(TEASER_KEY, "1"); } catch { /* ignore */ }
      track("cta_click", { cta: "lexi_teaser_shown" });
    }, TEASER_DELAY_MS);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
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
    return () => { rec.onresult = null; rec.onend = null; rec.onerror = null; };
  }, [lang]);

  function toggleVoice() {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (listening) { rec.stop(); setListening(false); return; }
    try { rec.start(); setListening(true); } catch { setListening(false); }
  }

  function openChat(source: string) {
    setTeaser(false);
    setOpen(true);
    track("cta_click", { cta: "lexi_open", source });
  }

  const patchLast = (fn: (m: Message) => Message) => setMessages((ms) => ms.map((m, i) => (i === ms.length - 1 ? fn(m) : m)));

  async function askLexi(question: string) {
    lastQuestion.current = question;
    setLoading(true);
    setMessages((m) => [...m, { role: "assistant", content: "", pending: true }]);
    try {
      const res = await fetch("/api/lexi/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, language: lang }) });
      if (res.status === 429) throw new Error("rate");
      if (!res.ok || !res.body) throw new Error("unavailable");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let finished = false;
      while (!finished) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (!line) continue;
          const e = JSON.parse(line) as { type: string; text?: string; reason?: string; mode?: string };
          if (e.type === "token" && e.text) patchLast((m) => ({ ...m, content: m.content + e.text }));
          else if (e.type === "busy") { patchLast((m) => ({ ...m, content: e.text ?? t.unavailable, pending: false, offerInquiry: true })); finished = true; }
          else if (e.type === "done") {
            const noAnswer = e.reason === "no_match" || e.reason === "model_fallback" || e.reason === "price" || e.reason === "empty" || e.reason === "error";
            patchLast((m) => ({ ...m, content: e.text ?? m.content, pending: false, offerInquiry: noAnswer }));
            track("form_submit", { form: "lexi", variant: noAnswer ? "fallback" : "answer" });
            finished = true;
          }
        }
      }
      patchLast((m) => (m.pending ? { ...m, pending: false, content: m.content || t.unavailable, offerInquiry: !m.content } : m));
    } catch (err) {
      patchLast((m) => ({ ...m, pending: false, content: (err as Error).message === "rate" ? t.rateLimited : t.unavailable, offerInquiry: (err as Error).message !== "rate" }));
    } finally {
      setLoading(false);
    }
  }

  function startInquiry() {
    answersRef.current = { topic: lastQuestion.current, company: "", name: "", email: "", details: "" };
    setMessages((m) => [...m.map((x) => ({ ...x, offerInquiry: false })), { role: "assistant", content: t.askCompany }]);
    setStep("company");
    track("cta_click", { cta: "lexi_inquiry" });
    inputRef.current?.focus();
  }

  async function submitInquiry() {
    const a = answersRef.current;
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "lexi-chat", topic: a.topic || "Anfrage über Lexi", name: a.name, email: a.email, company: a.company, message: a.details && a.details !== "-" ? a.details : "", website: "" }),
      });
      if (!res.ok) throw new Error("inquiry_failed");
      setMessages((m) => [...m, { role: "assistant", content: t.closing }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: t.error }]);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    const value = input.trim();
    if (!value || loading || step === "done") return;
    setMessages((m) => [...m.map((x) => ({ ...x, offerInquiry: false })), { role: "user", content: value }]);
    setInput("");

    if (step === "chat") {
      if (CAREER_INTENT_RE.test(value)) {
        setMessages((m) => [...m, { role: "assistant", content: t.careerRedirect, href: lh(lang, "/karriere"), hrefLabel: t.careerRedirectLink }]);
        return;
      }
      await askLexi(value);
      return;
    }

    if (step === "email" && !isValidEmail(value)) {
      setMessages((m) => [...m, { role: "assistant", content: t.invalidEmail }]);
      return;
    }
    const a = answersRef.current;
    if (step === "company") a.company = value;
    else if (step === "name") a.name = value;
    else if (step === "email") a.email = value;
    else if (step === "details") a.details = value;

    const flow: { step: Step; question: string }[] = [
      { step: "name", question: t.askName },
      { step: "email", question: t.askEmail },
      { step: "details", question: t.askDetails },
    ];
    const order: Step[] = ["company", "name", "email", "details"];
    const next = flow.find((f) => order.indexOf(f.step) === order.indexOf(step) + 1);
    if (next) {
      setMessages((m) => [...m, { role: "assistant", content: next.question }]);
      setStep(next.step);
      return;
    }
    setStep("done");
    setLoading(true);
    setMessages((m) => [...m, { role: "assistant", content: t.sending }]);
    await submitInquiry();
  }

  return (
    <div data-distraction="chat" className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {teaser && !open && (
        <div role="dialog" aria-label="Lexi" className="mb-3 w-[19rem] max-w-[calc(100vw-3rem)] border border-gold-dim bg-ink-raised p-4 shadow-2xl animate-fade-up">
          <div className="flex gap-3">
            <Avatar size={44} />
            <p className="font-sans text-sm leading-relaxed text-paper">{t.teaser}</p>
          </div>
          <div className="mt-3 flex items-center justify-end gap-4">
            <button onClick={() => setTeaser(false)} className="font-sans text-[11px] uppercase tracking-[0.12em] text-paper-dim hover:text-gold">{t.teaserClose}</button>
            <button onClick={() => openChat("teaser")} className="border border-gold px-4 py-2 font-sans text-[11px] uppercase tracking-[0.14em] text-gold hover:bg-gold hover:text-ink transition-colors">{t.teaserCta}</button>
          </div>
        </div>
      )}

      {open && (
        <div className="mb-4 flex h-[32rem] max-h-[calc(100vh-7rem)] w-[23rem] max-w-[calc(100vw-3rem)] flex-col border border-gold-dim bg-ink-raised shadow-2xl">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar size={36} />
              <div>
                <p className="font-display text-lg text-paper leading-tight">Lexi</p>
                <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-paper-dim">{t.subtitle}</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="font-sans text-xs uppercase tracking-widest text-paper-dim hover:text-gold" aria-label={t.close}>{t.close}</button>
          </div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`font-sans text-sm leading-relaxed ${m.role === "user" ? "text-paper" : "text-paper-dim"}`}>
                <span className="mr-2 font-sans text-[10px] uppercase tracking-widest text-gold">{m.role === "user" ? t.you : "Lexi"}</span>
                {m.pending && !m.content ? <p className="animate-pulse">{t.typing}</p> : <p className="whitespace-pre-wrap">{m.content}</p>}
                {m.href && <a href={m.href} className="mt-1 inline-block link-underline text-gold">{m.hrefLabel}</a>}
                {m.offerInquiry && step === "chat" && (
                  <div className="mt-2 space-y-2">
                    <p className="text-paper">{t.offerInquiry}</p>
                    <button onClick={startInquiry} className="border border-gold px-3 py-1.5 font-sans text-[11px] uppercase tracking-[0.12em] text-gold hover:bg-gold hover:text-ink transition-colors">{t.startInquiry}</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="border-t border-line px-4 py-2 font-sans text-[10px] leading-snug text-paper-dim">
            {t.aiNote}{" "}
            <a href={lh(lang, "/rechtliches/datenschutz")} className="link-underline text-gold">{t.privacyLink}</a>
          </p>
          <div className="flex border-t border-line">
            <input
              ref={inputRef}
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={t.placeholder}
              disabled={step === "done"}
              aria-label={t.placeholder}
              className="flex-1 bg-transparent px-4 py-3 font-sans text-sm text-paper placeholder:text-paper-dim focus:outline-none"
            />
            {voiceSupported && (
              <button onClick={toggleVoice} aria-label={listening ? t.voiceStop : t.voiceStart} aria-pressed={listening} title={t.voiceStart}
                className={`border-l border-line px-4 transition-colors ${listening ? "bg-gold text-ink" : "text-gold hover:bg-gold hover:text-ink"}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className={listening ? "animate-pulse" : ""}>
                  <rect x="9" y="3" width="6" height="11" rx="0" fill="currentColor" />
                  <path d="M5 11a7 7 0 0 0 14 0M12 18v3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
            )}
            <button onClick={sendMessage} disabled={loading} className="border-l border-line px-4 font-sans text-xs uppercase tracking-widest text-gold hover:bg-gold hover:text-ink disabled:opacity-50">{t.send}</button>
          </div>
        </div>
      )}

      <button
        onClick={() => (open ? setOpen(false) : openChat("button"))}
        className="flex items-center gap-2 border border-gold bg-ink py-2 pl-2 pr-5 font-sans text-xs uppercase tracking-[0.18em] text-gold hover:bg-gold hover:text-ink transition-colors"
      >
        <Avatar size={28} />
        {t.trigger}
      </button>
    </div>
  );
}
