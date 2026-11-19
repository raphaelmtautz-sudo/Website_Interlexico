"use client";

import { useState, useRef, useEffect } from "react";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";
import { track } from "@/lib/track";

/**
 * Lexi auf der Website: KI-Assistentin (Interlexico ONE, lokal auf dem eigenen Server).
 *  - Minimiert: rundes Icon mit Lexis Bild und Statuspunkt (grün = online, rot = nicht erreichbar).
 *  - Nach 5 Sekunden erscheint einmal pro Sitzung eine kleine Begrüßung am Icon (nur wenn online).
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

function Avatar({ size = 36, className = "" }: { size?: number; className?: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span aria-hidden="true" style={{ width: size, height: size, fontSize: size * 0.55 }} className={`flex shrink-0 items-center justify-center rounded-full bg-[#e3ecf7] font-display font-semibold text-[#1d3b6b] ${className}`}>L</span>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={LEXI_AVATAR} alt="" width={size} height={size} onError={() => setFailed(true)} style={{ width: size, height: size }} className={`block shrink-0 rounded-full object-cover ${className}`} />
  );
}

type Status = "unknown" | "online" | "offline";
const DOT: Record<Status, string> = { unknown: "", online: "bg-[#2f9e6a]", offline: "bg-[#c93b3b]" };

export function LexiWidget({ lang, dict }: { lang: Locale; dict: Pick<Dictionary, "lexi"> }) {
  const t = dict.lexi;
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [status, setStatus] = useState<Status>("unknown");
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

  // Statuspunkt: grün = Lexi erreichbar, rot = nicht erreichbar
  useEffect(() => {
    let alive = true;
    fetch("/api/lexi/status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { online: false }))
      .then((d: { online?: boolean }) => { if (alive) setStatus(d.online ? "online" : "offline"); })
      .catch(() => { if (alive) setStatus("offline"); });
    return () => { alive = false; };
  }, []);

  // Kleiner Hinweis am Icon nach 5 Sekunden, einmal pro Sitzung
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
            setStatus(e.reason === "error" ? "offline" : "online");
            track("form_submit", { form: "lexi", variant: noAnswer ? "fallback" : "answer" });
            finished = true;
          }
        }
      }
      patchLast((m) => (m.pending ? { ...m, pending: false, content: m.content || t.unavailable, offerInquiry: !m.content } : m));
    } catch (err) {
      if ((err as Error).message !== "rate") setStatus("offline");
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

  async function sendMessage(preset?: string) {
    const value = (preset ?? input).trim();
    if (!value || loading || step === "done") return;
    setMessages((m) => [...m.map((x) => ({ ...x, offerInquiry: false })), { role: "user", content: value }]);
    if (preset === undefined) setInput("");

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

  const offline = status === "offline";
  const dot = DOT[status];
  const showQuick = step === "chat" && !loading && messages.length === 1;
  const statusLabel = offline ? t.offline : status === "online" ? t.online : "";

  return (
    <div data-distraction="chat" className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {teaser && !open && !offline && (
        <div className="relative mb-3 flex max-w-[16rem] items-start gap-2 rounded-[14px_14px_4px_14px] bg-ink-raised py-2.5 pl-3.5 pr-2 text-sm leading-snug text-paper shadow-[0_6px_20px_rgba(15,23,34,0.16)] animate-fade-up">
          <button onClick={() => openChat("teaser")} className="text-left">{t.teaser}</button>
          <button onClick={() => setTeaser(false)} aria-label={t.teaserClose} title={t.teaserClose} className="-mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-paper-dim hover:bg-line hover:text-paper">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      )}

      {open && (
        <section role="dialog" aria-label="Lexi" className="mb-4 flex h-[37rem] max-h-[calc(100dvh-7.5rem)] w-[23.5rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl bg-ink-raised shadow-[0_16px_48px_rgba(15,23,34,0.22),0_2px_8px_rgba(15,23,34,0.08)] animate-fade-up">
          <header className="flex items-center gap-3 bg-[#1d3b6b] py-3.5 pl-4 pr-3 text-white">
            <div className="relative shrink-0">
              <Avatar size={42} className="border-2 border-white" />
              {dot && <span aria-hidden="true" className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-[2.5px] border-[#1d3b6b] ${dot}`} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold leading-tight">Lexi</p>
              <p className="mt-0.5 truncate text-xs text-[#d6e2f3]">{t.subtitle}{statusLabel && ` · ${statusLabel}`}</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label={t.minimize} title={t.minimize} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>
          </header>

          <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto bg-line/25 px-4 py-4" aria-live="polite">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <p key={i} className="max-w-[80%] self-end whitespace-pre-wrap rounded-[14px_14px_4px_14px] bg-[#1d3b6b] px-3.5 py-2.5 text-sm leading-relaxed text-white">{m.content}</p>
              ) : (
                <div key={i} className="flex max-w-[90%] items-end gap-2">
                  <Avatar size={26} />
                  <div className="min-w-0 rounded-[14px_14px_14px_4px] border border-line bg-ink-raised px-3.5 py-2.5 text-sm leading-relaxed text-paper">
                    {m.pending && !m.content ? (
                      <span className="flex gap-1 py-1.5" aria-label={t.typing}>
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-paper-dim" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-paper-dim [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-paper-dim [animation-delay:300ms]" />
                      </span>
                    ) : (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    )}
                    {m.href && <a href={m.href} className="mt-1 inline-block font-medium text-brand-text underline-offset-2 hover:underline">{m.hrefLabel}</a>}
                    {m.offerInquiry && step === "chat" && (
                      <div className="mt-2.5 space-y-2">
                        <p>{t.offerInquiry}</p>
                        <button onClick={startInquiry} className="rounded-lg bg-brand px-3.5 py-2 text-[13px] font-semibold text-on-brand transition-colors hover:bg-brand-strong">{t.startInquiry}</button>
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
            {showQuick && (
              <div className="flex flex-wrap gap-1.5 pl-[34px]">
                {t.quickReplies.map((q) => (
                  <button key={q.label} onClick={() => sendMessage(q.question)} className="rounded-full border border-[#b9c7da] bg-ink-raised px-3 py-1.5 text-[13px] font-medium text-gold transition-colors hover:border-gold hover:bg-gold hover:text-ink">{q.label}</button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 border-t border-line bg-ink-raised px-3 pb-2 pt-2.5">
            <div className="flex items-center gap-1.5 rounded-xl border border-line py-1 pl-3.5 pr-1 focus-within:border-gold-dim">
              <input
                ref={inputRef}
                value={input}
                maxLength={500}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={t.placeholder}
                disabled={step === "done"}
                aria-label={t.placeholder}
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-paper placeholder:text-paper-dim focus:outline-none"
              />
              {voiceSupported && (
                <button onClick={toggleVoice} aria-label={listening ? t.voiceStop : t.voiceStart} aria-pressed={listening} title={t.voiceStart}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${listening ? "bg-[#1d3b6b] text-white" : "text-paper-dim hover:bg-line hover:text-paper"}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={listening ? "animate-pulse" : ""}>
                    <rect x="9" y="3" width="6" height="11" rx="3" />
                    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                  </svg>
                </button>
              )}
              <button onClick={() => sendMessage()} disabled={loading || step === "done"} aria-label={t.send} title={t.send} className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#1d3b6b] text-white transition-colors hover:bg-[#16305c] disabled:opacity-50">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
            </div>
            <p className="text-center text-[11px] leading-snug text-paper-dim">
              {t.aiNote}{" "}
              <a href={lh(lang, "/rechtliches/datenschutz")} className="font-medium text-brand-text underline-offset-2 hover:underline">{t.privacyLink}</a>
            </p>
          </div>
        </section>
      )}

      <div className="group relative">
        {offline && !open && (
          <p role="tooltip" className="pointer-events-none absolute bottom-full right-0 mb-3 hidden w-60 rounded-[12px_12px_4px_12px] bg-ink-raised px-3 py-2 text-xs leading-snug text-paper shadow-[0_4px_14px_rgba(15,23,34,0.14)] group-hover:block group-focus-within:block">{t.offlineHint}</p>
        )}
        {open ? (
          <button onClick={() => setOpen(false)} aria-label={t.close} title={t.close}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1d3b6b] text-white shadow-[0_8px_24px_rgba(29,59,107,0.28),0_2px_6px_rgba(29,59,107,0.18)] transition-transform hover:scale-105">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        ) : (
          <button onClick={() => openChat(teaser ? "badge" : "button")}
            aria-label={`${t.openChat}${statusLabel ? ` (${statusLabel})` : ""}${teaser && !offline ? ` – ${t.newMessage}` : ""}`}
            className="relative block h-16 w-16 rounded-full border-[3px] border-white bg-white shadow-[0_8px_24px_rgba(29,59,107,0.28),0_2px_6px_rgba(29,59,107,0.18)] transition-transform hover:scale-105">
            <Avatar size={58} />
            {dot && <span aria-hidden="true" className={`absolute -bottom-0.5 -right-0.5 h-[18px] w-[18px] rounded-full border-[3px] border-white ${dot}`} />}
            {teaser && !offline && (
              <span aria-hidden="true" className="absolute -right-1 -top-1 flex h-[22px] min-w-[22px] items-center justify-center rounded-full border-2 border-white bg-[#b23b3b] text-[11px] font-semibold text-white">1</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
