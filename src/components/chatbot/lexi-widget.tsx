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
  const [openedAt, setOpenedAt] = useState("");
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

  // Die kleine Begrüßung verschwindet nach 20 Sekunden von selbst
  useEffect(() => {
    if (!teaser) return;
    const id = window.setTimeout(() => setTeaser(false), 20_000);
    return () => window.clearTimeout(id);
  }, [teaser]);

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
    if (!openedAt) setOpenedAt(new Date().toLocaleTimeString(speechLang[lang], { hour: "2-digit", minute: "2-digit" }));
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
  const shadowBtn = "shadow-[0_8px_24px_rgba(29,59,107,0.28),0_2px_6px_rgba(29,59,107,0.18)]";

  // Farben bewusst fest (wie im Mockup), unabhängig vom Seiten-Theme.
  return (
    <div data-distraction="chat" data-lexi="" className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6 flex flex-col items-end font-sans text-[#262b31]">
      {teaser && !open && !offline && (
        <button onClick={() => openChat("teaser")}
          className="mb-2.5 max-w-[180px] rounded-[12px_12px_4px_12px] bg-white px-3 py-[9px] text-left text-xs leading-[1.4] text-[#262b31] shadow-[0_4px_14px_rgba(15,23,34,0.12)] animate-fade-up">
          {t.teaser}
        </button>
      )}

      {open && (
        <section role="dialog" aria-label="Lexi" className="mb-3 flex h-[min(460px,calc(100dvh-6.5rem))] w-[min(340px,calc(100vw-2rem))] flex-col touch-pan-y overscroll-contain sm:mb-4 sm:h-[min(592px,calc(100dvh-7.5rem))] sm:w-[372px] overflow-hidden rounded-2xl bg-white shadow-[0_16px_48px_rgba(15,23,34,0.18),0_2px_8px_rgba(15,23,34,0.08)] animate-fade-up">
          <header className="flex items-center gap-3 bg-[#1d3b6b] py-3 pl-4 pr-3 text-white sm:py-4 sm:pl-[18px] sm:pr-4">
            <div className="relative h-[42px] w-[42px] shrink-0">
              <Avatar size={42} className="border-2 border-white" />
              {dot && <span aria-hidden="true" className={`absolute -bottom-px -right-px h-[13px] w-[13px] rounded-full border-[2.5px] border-[#1d3b6b] ${dot}`} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="m-0 text-base font-semibold leading-[1.2]">Lexi</p>
              <p className="m-0 mt-0.5 truncate text-xs text-[#d6e2f3]">{t.subtitle}{statusLabel && ` · ${statusLabel}`}</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label={t.minimize} title={t.minimize} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.12] hover:bg-white/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>
          </header>

          <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto overscroll-contain break-words bg-[#f7f9fb] px-4 pb-3 pt-[18px]" aria-live="polite">
            {openedAt && <p className="m-0 self-center text-[11px] text-[#58616c]">{t.today}, {openedAt}</p>}
            {messages.map((m, i) =>
              m.role === "user" ? (
                <p key={i} className="m-0 mt-1 max-w-[78%] self-end whitespace-pre-wrap rounded-[14px_14px_4px_14px] bg-[#1d3b6b] px-[13px] py-2.5 text-sm leading-[1.45] text-white">{m.content}</p>
              ) : (
                <div key={i} className="flex max-w-[88%] items-end gap-2">
                  <Avatar size={26} />
                  <div className="flex min-w-0 flex-col gap-2.5 rounded-[14px_14px_14px_4px] border border-[#e2e6ea] bg-white px-[13px] py-2.5 text-sm leading-[1.45] text-[#262b31]">
                    {m.pending && !m.content ? (
                      <span className="flex gap-1 py-0.5" aria-label={t.typing}>
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9aa6b4]" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9aa6b4] [animation-delay:200ms]" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9aa6b4] [animation-delay:400ms]" />
                      </span>
                    ) : (
                      <p className="m-0 whitespace-pre-wrap">{m.content}</p>
                    )}
                    {m.href && <a href={m.href} className="font-medium text-[#0a72bd] hover:text-[#1d3b6b]">{m.hrefLabel}</a>}
                    {m.offerInquiry && step === "chat" && (
                      <>
                        <p className="m-0">{t.offerInquiry}</p>
                        <button onClick={startInquiry} className="self-start rounded-lg bg-[#2db1fb] px-3.5 py-[9px] text-[13px] font-semibold text-[#06233a] transition-colors hover:bg-[#1a93e0]">{t.startInquiry}</button>
                      </>
                    )}
                  </div>
                </div>
              ),
            )}
            {showQuick && (
              <div className="flex flex-wrap gap-1.5 pl-[34px]">
                {t.quickReplies.map((q) => (
                  <button key={q.label} onClick={() => sendMessage(q.question)} className="rounded-full border border-[#b9c7da] bg-white px-3 py-[7px] text-[13px] font-medium text-[#1d3b6b] transition-colors hover:border-[#1d3b6b]">{q.label}</button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 border-t border-[#e2e6ea] bg-white px-3 pb-2 pt-2.5">
            <div className="flex items-center gap-1.5 rounded-xl border border-[#cfd6de] py-1 pl-3.5 pr-1 focus-within:border-[#1d3b6b]">
              <input
                ref={inputRef}
                value={input}
                maxLength={500}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={t.placeholder}
                disabled={step === "done"}
                aria-label={t.placeholder}
                className="min-w-0 flex-1 border-none bg-transparent py-2 text-base text-[#262b31] outline-none! sm:text-sm placeholder:text-[#58616c]"
              />
              {voiceSupported && (
                <button onClick={toggleVoice} aria-label={listening ? t.voiceStop : t.voiceStart} aria-pressed={listening} title={t.voiceStart}
                  className={`flex h-[38px] w-[38px] items-center justify-center rounded-lg transition-colors ${listening ? "bg-[#1d3b6b] text-white" : "text-[#58616c] hover:bg-[#f3f5f8]"}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={listening ? "animate-pulse" : ""}>
                    <rect x="9" y="3" width="6" height="11" rx="3" />
                    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                  </svg>
                </button>
              )}
              <button onClick={() => sendMessage()} disabled={loading || step === "done"} aria-label={t.send} title={t.send} className="flex h-[38px] w-[38px] items-center justify-center rounded-[9px] bg-[#1d3b6b] text-white transition-colors hover:bg-[#16305c] disabled:opacity-50">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
            </div>
            <p className="m-0 text-center text-[11px] leading-[1.4] text-[#58616c]">
              {t.aiNote}{" "}
              <a href={lh(lang, "/rechtliches/datenschutz")} className="text-[#0a72bd] hover:text-[#1d3b6b]">{t.privacyLink}</a>
            </p>
          </div>
        </section>
      )}

      <div className="group relative">
        {offline && !open && (
          <p role="tooltip" className="pointer-events-none absolute bottom-full right-0 m-0 mb-2.5 hidden w-[180px] rounded-[12px_12px_4px_12px] bg-white px-3 py-[9px] text-xs leading-[1.4] text-[#262b31] shadow-[0_4px_14px_rgba(15,23,34,0.12)] group-hover:block group-focus-within:block">{t.offlineHint}</p>
        )}
        {open ? (
          <button onClick={() => setOpen(false)} aria-label={t.close} title={t.close}
            className={`flex h-14 w-14 items-center justify-center rounded-full bg-[#1d3b6b] sm:h-16 sm:w-16 text-white ${shadowBtn}`}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        ) : (
          <button onClick={() => openChat(teaser ? "badge" : "button")}
            aria-label={`${t.openChat}${statusLabel ? ` (${statusLabel})` : ""}${teaser && !offline ? ` – ${t.newMessage}` : ""}`}
            className={`relative flex h-14 w-14 items-center justify-center rounded-full border-[3px] sm:h-16 sm:w-16 border-white bg-white p-0 ${shadowBtn}`}>
            <Avatar size={58} className="max-sm:h-[50px]! max-sm:w-[50px]!" />
            {dot && <span aria-hidden="true" className={`absolute -bottom-px -right-px h-[18px] w-[18px] rounded-full border-[3px] border-white ${dot}`} />}
            {teaser && !offline && (
              <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 flex h-[22px] min-w-[22px] items-center justify-center rounded-full border-2 border-white bg-[#b23b3b] text-[11px] font-semibold text-white">1</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
