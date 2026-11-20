"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
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
// Kleines Begrüßungsfenster: einmal pro Besuch, Computer nach 8 s, Handy nach 12 s; schließt nach 45 s
// von selbst oder sofort, wenn das Gutschein-Pop-up erscheint (nie beides gleichzeitig).
// Seitenabhängig: nach 6 s eine passende Frage mit Antwortmöglichkeiten (Besucher ins Gespräch holen).
// Je Seitengruppe einmal pro Besuch, höchstens 3 pro Besuch; nach zweimal „X“ Ruhe für diesen Besuch.
const TEASER_DELAY_MS = 6000;
const TEASER_VISIBLE_MS = 45000;
const OPENERS_KEY = "lexi-openers";
const OPENERS_MAX = 3;
const NO_OPENER = /^\/(kontakt|karriere|rechtliches|demo|interlexico-one|gutschein)(\/|$)/;
type OpenerState = { shown: string[]; closed: number };
const readOpeners = (): OpenerState => { try { return { shown: [], closed: 0, ...JSON.parse(sessionStorage.getItem(OPENERS_KEY) || "{}") }; } catch { return { shown: [], closed: 0 }; } };
const writeOpeners = (v: OpenerState) => { try { sessionStorage.setItem(OPENERS_KEY, JSON.stringify(v)); } catch { /* ignore */ } };

interface Message {
  role: "user" | "assistant";
  content: string;
  href?: string;
  hrefLabel?: string;
  offerInquiry?: boolean;
  pending?: boolean;
  ctas?: Cta[];
  ai?: boolean; // KI-Antwort → im Chat auf Kurzform gekürzt
  actions?: { label: string; value: string }[]; // Antwort-Buttons im Ablauf (z. B. Datenschutz bestätigen)
  privacyLink?: boolean;
  promoNote?: string; // Aktionshinweis (einmal pro Gespräch, nur bei Verkaufsthemen)
  more?: { path: string; title: string }; // „Mehr dazu“: passende Seite auf interlexico.com
  form?: "offer"; // Angebotsformular im Chat
  label?: string; // angeklickte Antwortmöglichkeit (für die Zusammenfassung)
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

// Buttons unter Lexis Antworten statt langer Texte: immer „Angebot anfragen“, dazu passend zum Thema
// Einstufungstest oder Konfigurator (höchstens zwei).
type Cta = "inquiry" | "placement" | "configurator" | "voucher";
// Laufende Gutschein-Aktion nur bei Verkaufsthemen anbieten (nicht aufdringlich)
const SALES_RE = /(preis|kosten|kostet|price|cost|precio|cuesta|rabatt|discount|descuento|angebot|offer|oferta|buch|book|reserv|start|beginn|gutschein|voucher|cup[oó]n|kostenfrei|gratis|free|aktion|promo|probier|try|testen|unterrichtseinheit)/;
function pickCtas(text: string, promo = false): Cta[] {
  const t = text.toLowerCase();
  const out: Cta[] = ["inquiry"];
  if (promo && SALES_RE.test(t)) out.push("voucher");
  if (/(einstuf|niveau|level|nivel|prueba|test\b|a1|b1|b2|c1)/.test(t)) out.push("placement");
  else if (/(kurs|course|curso|training|formaci|format|gruppe|group|grupo|einzel|1:1|team|vor ort|on-site|presencial|online|angebot|offer)/.test(t)) out.push("configurator");
  return out.slice(0, 3);
}

type Step = "chat" | "vName" | "vEmail" | "vPrivacy" | "vNewsletter" | "company" | "name" | "email" | "details" | "done";
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

/**
 * Lexis Antwort lesbar darstellen (auch schon während sie geschrieben wird): Vorspann wie „**ANTWORT:**“
 * und Formatierungszeichen entfernen, Zeilen mit „- “ als Aufzählung. Nur Text, kein HTML aus der KI.
 */
function cleanAnswer(raw: string) {
  return raw
    .replace(/^\s*[*_#\s]*(antwort|answer|respuesta|lexi)\s*[*_]*\s*:\s*[*_]*\s*/i, "")
    .replace(/\s+[-•*]\s+(?=\*\*)/g, "\n- ")
    .split("\n")
    .map((l) => l.replace(/^\s*#{1,6}\s+/, "").replace(/^\s*[•*]\s+/, "- ").replace(/^\s*\d+[.)]\s+/, "- ").replace(/\*\*/g, "").replace(/__/g, "").trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
/**
 * Kürzt Lexis Antwort hart auf Chat-Länge (das kleine Modell hält Längenvorgaben nicht zuverlässig ein):
 * höchstens 4 Sätze (~70 Wörter); bei Aufzählungen 1 Einleitungssatz + höchstens 4 Punkte (Name – kurze Erklärung, ohne Klammern).
 * Unvollständige Satzreste am Ende fallen weg. Für Details gibt es die Buttons darunter.
 */
function shortenAnswer(text: string): string {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const sentences = (s: string) => s.match(/[^.!?]+[.!?]+(\s|$)/g)?.map((x) => x.trim()) ?? [];
  const fixCaps = (s: string) => s.replace(/^([A-ZÄÖÜ]{2,4})(?=[,!.\s])/, (w) => w.charAt(0) + w.slice(1).toLowerCase());
  const listIdx = lines.findIndex((l) => /^-\s+/.test(l));
  if (listIdx >= 0) {
    const intro = lines.slice(0, listIdx).join(" ");
    const introS = sentences(intro);
    const head = introS.length ? introS[introS.length - 1] : intro;
    const cut = (t: string, n: number) => { const w = t.replace(/[.;,:]+$/, "").split(/\s+/).filter(Boolean); return w.length > n ? w.slice(0, n).join(" ").replace(/[,;:]$/, "") + " …" : w.join(" "); };
    const items = lines.slice(listIdx).filter((l) => /^-\s+/.test(l)).slice(0, 4).map((l) => {
      const item = l.replace(/^-\s+/, "").replace(/\s*\([^)]*\)?/g, "").trim();
      const m = /^([^:]{2,60}):\s+(.*)$/.exec(item);
      // „Einzeltraining: Individuelle Betreuung für …“ → „Einzeltraining – Individuelle Betreuung für …“ (kurz)
      if (m && m[1].split(/\s+/).length <= 5) return `- ${m[1]} – ${cut(m[2].split(/(?<=[.!?])\s/)[0], 9)}`;
      return "- " + cut(item.split(/(?<=[.!?])\s/)[0], 12);
    });
    // Rückfrage am Ende (führt das Gespräch weiter) nicht wegkürzen
    const tailQ = lines.slice(listIdx).filter((l) => !/^-\s+/.test(l) && /\?$/.test(l)).pop();
    return [fixCaps(head.trim()), ...items, ...(tailQ ? [tailQ] : [])].filter(Boolean).join("\n");
  }
  const all = lines.join(" ");
  const s = sentences(all);
  if (!s.length) return fixCaps(all);
  // höchstens 4 Sätze und etwa 70 Wörter
  const out: string[] = [];
  let words = 0;
  for (const x of s.slice(0, 4)) {
    const n = x.split(/\s+/).length;
    if (out.length && words + n > 70) break;
    out.push(x); words += n;
  }
  // Rückfrage am Ende behalten, auch wenn sie hinter dem 4. Satz kommt
  const lastQ = s[s.length - 1];
  if (/\?$/.test(lastQ) && !out.includes(lastQ)) { if (out.length >= 4) out.pop(); out.push(lastQ); }
  return fixCaps(out.join(" "));
}

/** Aus dem Chat erkannte Angaben für das Team (einfache Muster, keine KI – sofort und nachvollziehbar). */
function chatFacts(userTexts: string[]) {
  const t = userTexts.join(" \n ").toLowerCase();
  const f: Record<string, string> = {};
  if (/business english|englisch|english|inglés|ingles/.test(t)) f.course = "Business English";
  if (/deutsch|german|alemán|aleman|daf\b/.test(t)) f.course = f.course ? `${f.course} + Deutsch als Fremdsprache` : "Deutsch als Fremdsprache";
  const n = /(\d+)\s*(?:–|-|bis)\s*(\d+)\s*(?:personen|teilnehm|mitarbeit|people|personas)?/.exec(t) || /(\d+)\s*(?:personen|teilnehm|mitarbeit|kolleg|people|persons|employees|personas|empleados)/.exec(t);
  if (n) f.participants = n[2] ? `${n[1]}–${n[2]}` : n[1];
  else if (/(eine person|one person|una persona|einzeln)/.test(t)) f.participants = "1";
  else if (/mehr als 7|more than 7|más de 7/.test(t)) f.participants = "mehr als 7";
  if (/einzel|1:1|one-to-one|individual/.test(t)) f.format = "Einzeltraining";
  else if (/klasse|class\b|clase/.test(t)) f.format = "Klassentraining";
  else if (/gruppe|group|grupo/.test(t)) f.format = "Gruppentraining";
  const where = [/vor ort|präsenz|praesenz|on-site|onsite|presencial|im unternehmen|bei uns|at our company/.test(t) && "vor Ort", /online|virtuell|remote/.test(t) && "online", /hybrid|gemischt|mixed|mixta/.test(t) && "hybrid"].filter(Boolean);
  if (where.length) f.location = where.join(" / ");
  const when = /(januar|februar|märz|maerz|april|mai|juni|juli|august|september|oktober|november|dezember|january|february|march|may|june|july|october|december|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|sofort|asap|nächste[nr]? (?:woche|monat)|next (?:week|month)|q[1-4]\b)/.exec(t);
  if (when) f.when = when[1];
  const goal = /(meeting|präsentation|presentation|verhandl|negotiat|vertrieb|sales|e-?mail|telefon|onboarding|führungskr|manager|executive|interkulturell|intercultural)/.exec(t);
  if (goal) f.goal = goal[1];
  return f;
}

function AnswerText({ text, ai }: { text: string; ai?: boolean }) {
  const blocks: ({ type: "p"; text: string } | { type: "ul"; items: string[] })[] = [];
  const shown = ai ? shortenAnswer(cleanAnswer(text)) : cleanAnswer(text);
  for (const line of shown.split("\n")) {
    const item = /^\s*-\s+(.*)$/.exec(line);
    const last = blocks[blocks.length - 1];
    if (item) {
      if (last?.type === "ul") last.items.push(item[1]);
      else blocks.push({ type: "ul", items: [item[1]] });
    } else if (line.trim()) {
      if (last?.type === "p") last.text += "\n" + line;
      else blocks.push({ type: "p", text: line });
    }
  }
  return (
    <div className="flex flex-col gap-1.5">
      {blocks.map((b, i) => b.type === "ul" ? (
        <ul key={i} className="m-0 flex list-none flex-col gap-1 p-0">
          {b.items.map((it, j) => (
            <li key={j} className="flex gap-2"><span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#1d3b6b]" /><span>{it}</span></li>
          ))}
        </ul>
      ) : (
        <p key={i} className="m-0 whitespace-pre-wrap">{b.text}</p>
      ))}
    </div>
  );
}

type Status = "unknown" | "online" | "offline";
const DOT: Record<Status, string> = { unknown: "", online: "bg-[#2f9e6a]", offline: "bg-[#c93b3b]" };

export function LexiWidget({ lang, dict }: { lang: Locale; dict: Pick<Dictionary, "lexi"> }) {
  const t = dict.lexi;
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const pathname = usePathname() || "/";
  const [opener, setOpener] = useState<{ key: string; text: string; options: { label: string; question: string }[] } | null>(null);
  const [status, setStatus] = useState<Status>("unknown");
  const [promo, setPromo] = useState(false); // läuft gerade die Gutschein-Aktion?
  const [openedAt, setOpenedAt] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: t.greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("chat");
  const answersRef = useRef({ topic: "", company: "", name: "", email: "", details: "" });
  const voucherRef = useRef({ name: "", email: "" });
  const promoShown = useRef(false);
  const answeredTurns = useRef(0);
  const [offerOpen, setOfferOpen] = useState(false); // Angebotsformular als eigenes Fenster (nicht im Chat – dort keine persönlichen Daten)
  const offerAsked = useRef(false);
  const lastQuestion = useRef("");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    fetch(`/api/voucher/campaign?lang=${lang}`).then((r) => (r.ok ? r.json() : null)).then((d) => setPromo(!!d?.active)).catch(() => {});
  }, [lang]);

  // Statuspunkt: grün = Lexi erreichbar, rot = nicht erreichbar
  useEffect(() => {
    let alive = true;
    fetch("/api/lexi/status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { online: false }))
      .then((d: { online?: boolean }) => { if (alive) setStatus(d.online ? "online" : "offline"); })
      .catch(() => { if (alive) setStatus("offline"); });
    return () => { alive = false; };
  }, []);

  // Begrüßungsfenster je Seite (nicht, wenn gerade das Gutschein-Pop-up offen ist)
  const voucherOpen = useRef(false);
  useEffect(() => {
    const onVoucher = () => { voucherOpen.current = true; setTeaser(false); };
    window.addEventListener("ix:voucher-shown", onVoucher);
    return () => window.removeEventListener("ix:voucher-shown", onVoucher);
  }, []);
  useEffect(() => {
    setTeaser(false);
    const path = pathname.replace(/^\/(de|en|es)(?=\/|$)/, "") || "/";
    if (NO_OPENER.test(path)) return;
    const rule = t.pageOpeners.find((r) => new RegExp(r.match).test(path));
    const key = rule?.match ?? "default";
    const st = readOpeners();
    if (st.closed >= 2 || st.shown.length >= OPENERS_MAX || st.shown.includes(key)) return;
    const id = window.setTimeout(() => {
      if (voucherOpen.current || open) return;
      setOpener(rule ? { key, text: rule.text, options: rule.options } : null);
      setTeaser(true);
      const now = readOpeners();
      writeOpeners({ ...now, shown: [...now.shown, key] });
      track("cta_click", { cta: "lexi_teaser_shown", page: key });
    }, TEASER_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!teaser) return;
    const id = window.setTimeout(() => setTeaser(false), TEASER_VISIBLE_MS);
    return () => window.clearTimeout(id);
  }, [teaser]);

  // Solange Lexi-Fenster oder Chat offen sind, wartet das Gutschein-Pop-up (niemand wird beim Schreiben unterbrochen)
  useEffect(() => {
    (window as unknown as { __ixLexiBusy?: boolean }).__ixLexiBusy = open || teaser;
  }, [open, teaser]);

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
    setMessages((m) => [...m, { role: "assistant", content: "", pending: true, ai: true }]);
    try {
      const res = await fetch("/api/lexi/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, language: lang, page: window.location.pathname }) });
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
          const e = JSON.parse(line) as { type: string; text?: string; reason?: string; mode?: string; promoNote?: string; more?: { path: string; title: string } };
          if (e.type === "token" && e.text) patchLast((m) => ({ ...m, content: m.content + e.text }));
          else if (e.type === "busy") { patchLast((m) => ({ ...m, content: e.text ?? t.unavailable, pending: false, offerInquiry: true, ai: false })); finished = true; }
          else if (e.type === "done") {
            const noAnswer = e.reason === "no_match" || e.reason === "model_fallback" || e.reason === "price" || e.reason === "empty" || e.reason === "error";
            const ctas = pickCtas(`${question} ${noAnswer ? "" : (e.text ?? "")}`, promo).filter((c) => !noAnswer || c !== "inquiry");
            // Aktion einmal pro Gespräch erwähnen – nur bei Verkaufsthemen (Kosten, Start, Buchung …), nicht aufdringlich
            const note = e.promoNote && !promoShown.current && SALES_RE.test(question.toLowerCase()) ? e.promoNote : undefined;
            if (note) promoShown.current = true;
            // Verkaufsgespräch: nach der zweiten beantworteten Frage einmal ein Angebot anbieten
            if (!noAnswer) answeredTurns.current += 1;
            if (!noAnswer && answeredTurns.current >= 2 && !offerAsked.current) {
              offerAsked.current = true;
              window.setTimeout(() => setMessages((ms) => [...ms, { role: "assistant", content: t.offer.ask, actions: [{ label: t.offer.yes, value: "offer-yes" }, { label: t.offer.later, value: "offer-later" }] }]), 900);
            }
            patchLast((m) => ({ ...m, content: e.text ?? m.content, pending: false, offerInquiry: noAnswer, ai: !noAnswer, ctas: ctas.length ? ctas : undefined, promoNote: note,
              // „Mehr dazu“ nur auf eigene Seiten und nicht auf die Seite, auf der der Besucher schon ist
              more: e.more && /^\/[a-z]{2}(\/|$)/.test(e.more.path) && e.more.path !== window.location.pathname.replace(/\/+$/, "") ? e.more : undefined }));
            setStatus(e.reason === "error" ? "offline" : "online");
            track("form_submit", { form: "lexi", variant: noAnswer ? "fallback" : "answer" });
            finished = true;
          }
        }
      }
      patchLast((m) => (m.pending ? { ...m, pending: false, content: m.content || t.unavailable, offerInquiry: !m.content, ai: !!m.content } : m));
    } catch (err) {
      if ((err as Error).message !== "rate") setStatus("offline");
      patchLast((m) => ({ ...m, pending: false, ai: false, content: (err as Error).message === "rate" ? t.rateLimited : t.unavailable, offerInquiry: (err as Error).message !== "rate" }));
    } finally {
      setLoading(false);
    }
  }

  // Gutschein-Aktion direkt im Chat abschließen: Name → E-Mail → Datenschutz (Button) → Newsletter (freiwillig) → /api/voucher
  const vc = t.voucherChat;
  const clearButtons = (ms: Message[]) => ms.map((x) => ({ ...x, offerInquiry: false, ctas: undefined, actions: undefined }));
  function startVoucher() {
    voucherRef.current = { name: "", email: "" };
    setMessages((m) => [...clearButtons(m), { role: "assistant", content: vc.intro }]);
    setStep("vName");
    track("cta_click", { cta: "lexi_voucher_start" });
    inputRef.current?.focus();
  }
  const privacyMsg = (text: string): Message => ({ role: "assistant", content: text, privacyLink: true, actions: [{ label: vc.privacyBtn, value: "privacy" }] });
  const newsletterMsg = (): Message => ({ role: "assistant", content: `${vc.newsletterQ}\n\n${vc.newsletterConsent}`, actions: [{ label: vc.yes, value: "nl-yes" }, { label: vc.no, value: "nl-no" }] });
  async function onAction(value: string, label: string) {
    setMessages((m) => [...clearButtons(m), { role: "user", content: label }]);
    if (value === "privacy") { setMessages((m) => [...m, newsletterMsg()]); setStep("vNewsletter"); return; }
    if (value === "offer-yes") { setOfferOpen(true); track("cta_click", { cta: "lexi_offer_yes" }); return; }
    if (value === "offer-later") { setMessages((m) => [...m, { role: "assistant", content: t.offer.laterReply }]); return; }
    if (value === "nl-yes" || value === "nl-no") {
      const newsletter = value === "nl-yes";
      setLoading(true);
      setMessages((m) => [...m, { role: "assistant", content: vc.sending, pending: false }]);
      try {
        const res = await fetch("/api/voucher", {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ name: voucherRef.current.name, email: voucherRef.current.email, privacyAck: true, newsletter, newsletterConsentText: newsletter ? vc.newsletterConsent : undefined, locale: lang, website: "" }),
        });
        if (res.status === 410) throw new Error("ended");
        if (!res.ok) throw new Error("send");
        try { localStorage.setItem("il-voucher", JSON.stringify({ submitted: true })); } catch { /* ignore */ }
        track("voucher_submitted", { variant: "lexi", newsletter: newsletter ? "yes" : "no" });
        setMessages((m) => [...m, { role: "assistant", content: vc.done }]);
      } catch (e) {
        setMessages((m) => [...m, { role: "assistant", content: (e as Error).message === "ended" ? vc.ended : vc.error }]);
      } finally {
        setLoading(false);
        setStep("chat");
      }
    }
  }

  function startInquiry() {
    // Angebot über das kleine Formular im Chat (Name, E-Mail, optional Telefon/Unternehmen, Newsletter freiwillig)
    offerAsked.current = true;
    setMessages((m) => clearButtons(m));
    setOfferOpen(true);
    track("cta_click", { cta: "lexi_offer_form" });
  }
  const factsNow = () => chatFacts([...messages.filter((m) => m.role === "user").map((m) => m.content), ...messages.map((m) => m.label ?? "")]);
  async function submitOffer(d: { name: string; email: string; phone: string; company: string; notes: string; newsletter: boolean }) {
    const userTexts = messages.filter((m) => m.role === "user").map((m) => m.content);
    const f = chatFacts([...userTexts, ...messages.map((m) => m.label ?? "")]);
    const factLines = [
      f.course && `Sprache/Kurs: ${f.course}`, f.participants && `Teilnehmende: ${f.participants}`, f.format && `Format: ${f.format}`,
      f.location && `Ort: ${f.location}`, f.when && `Zeitraum: ${f.when}`, f.goal && `Schwerpunkt: ${f.goal}`,
    ].filter(Boolean) as string[];
    const transcript = messages
      .filter((m) => !m.form && !m.pending && m.content && !m.actions)
      .map((m) => `${m.role === "user" ? "Besucher" : "Lexi"}: ${m.ai ? shortenAnswer(cleanAnswer(m.content)) : m.content}`)
      .join("\n").slice(-4000);
    const message = [
      "Angebotsanfrage über Lexi (Website-Chat).",
      factLines.length ? `\nErkannte Angaben (automatisch aus dem Chat, bitte prüfen):\n- ${factLines.join("\n- ")}` : "",
      d.notes ? `\nErgänzungen des Besuchers:\n${d.notes}` : "",
      `\nSeite: ${window.location.pathname}`,
      `\nGesprächsverlauf:\n${transcript}`,
    ].join("\n");
    const res = await fetch("/api/inquiry", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "lexi-chat", topic: f.course ? `Angebot ${f.course}` : "Angebotsanfrage über Lexi", name: d.name, email: d.email, phone: d.phone, company: d.company, message, course: f.course ?? "", format: f.format ?? "", participants: (f.participants ?? "").replace(/\D.*$/, ""), language: lang, website: "" }),
    });
    if (!res.ok) throw new Error("inquiry_failed");
    if (d.newsletter) fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: d.email, source: "lexi-chat" }) }).catch(() => {});
    track("form_submit", { form: "lexi-offer", newsletter: d.newsletter ? "yes" : "no" });
    setOfferOpen(false);
    setOpen(true);
    setMessages((m) => [...m, { role: "assistant", content: d.newsletter ? `${t.closing}\n\n${t.offer.nlDone}` : t.closing }]);
  }
  function startStepInquiry() {
    answersRef.current = { topic: lastQuestion.current, company: "", name: "", email: "", details: "" };
    setMessages((m) => [...m.map((x) => ({ ...x, offerInquiry: false, ctas: undefined, actions: undefined })), { role: "assistant", content: t.askCompany }]);
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

  async function sendMessage(preset?: string, display?: string) {
    const value = (preset ?? input).trim();
    if (!value || loading || step === "done") return;
    setMessages((m) => [...m.map((x) => ({ ...x, offerInquiry: false, ctas: undefined, actions: undefined })), { role: "user", content: display ?? value, label: display ? value : undefined }]);
    if (preset === undefined) setInput("");

    if (step === "chat") {
      if (CAREER_INTENT_RE.test(value)) {
        setMessages((m) => [...m, { role: "assistant", content: t.careerRedirect, href: lh(lang, "/karriere"), hrefLabel: t.careerRedirectLink }]);
        return;
      }
      await askLexi(value);
      return;
    }

    if (step === "vName") {
      voucherRef.current.name = value.slice(0, 120);
      setMessages((m) => [...m, { role: "assistant", content: vc.email }]);
      setStep("vEmail");
      return;
    }
    if (step === "vEmail") {
      if (!isValidEmail(value)) { setMessages((m) => [...m, { role: "assistant", content: t.invalidEmail }]); return; }
      voucherRef.current.email = value.trim().slice(0, 200);
      setMessages((m) => [...m, privacyMsg(vc.privacy)]);
      setStep("vPrivacy");
      return;
    }
    if (step === "vPrivacy") { setMessages((m) => [...m, privacyMsg(vc.privacyNeeded)]); return; }
    if (step === "vNewsletter") { setMessages((m) => [...m, newsletterMsg()]); return; }

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
        <section aria-label="Lexi" className="mb-3 w-[min(300px,calc(100vw-2rem))] rounded-2xl bg-white p-3.5 shadow-[0_10px_32px_rgba(15,23,34,0.18),0_2px_6px_rgba(15,23,34,0.08)] animate-fade-up">
          <div className="flex items-start gap-2.5">
            <div className="relative h-9 w-9 shrink-0">
              <Avatar size={36} />
              {dot && <span aria-hidden="true" className={`absolute -bottom-px -right-px h-3 w-3 rounded-full border-2 border-white ${dot}`} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="m-0 text-[13px] font-semibold text-[#1d3b6b]">Lexi</p>
              <p className="m-0 text-sm leading-snug text-[#262b31]">{opener?.text ?? t.teaser}</p>
            </div>
            <button onClick={() => { setTeaser(false); const st = readOpeners(); writeOpeners({ ...st, closed: st.closed + 1 }); track("cta_click", { cta: "lexi_teaser_close" }); }} aria-label={t.teaserClose} title={t.teaserClose}
              className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#58616c] hover:bg-[#f3f5f8]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          {opener ? (
            <div className="mt-2.5 flex flex-col gap-1.5">
              {opener.options.map((o) => (
                <button key={o.label} onClick={() => {
                  track("cta_click", { cta: "lexi_opener_option", page: opener.key });
                  openChat("teaser_option");
                  if (o.question === "@inquiry") startInquiry(); else void sendMessage(o.question, o.label);
                }} className="rounded-lg border border-[#b9c7da] bg-white px-3 py-1.5 text-left text-[13px] font-medium text-[#1d3b6b] hover:border-[#1d3b6b] hover:bg-[#f5f8fc]">{o.label}</button>
              ))}
              <button onClick={() => openChat("teaser")} className="self-start pt-0.5 text-[12.5px] font-medium text-[#0a72bd] hover:text-[#1d3b6b]">{t.teaserCta} →</button>
            </div>
          ) : (
          <div className="mt-3 flex gap-2">
            <button onClick={() => openChat("teaser")} className="flex-1 rounded-lg bg-[#1d3b6b] py-2 text-[13px] font-semibold text-white hover:bg-[#16305c]">{t.teaserCta}</button>
            {promo ? (
              <button onClick={() => { setTeaser(false); track("cta_click", { cta: "lexi_teaser_voucher" }); window.dispatchEvent(new CustomEvent("ix:open-voucher")); }} className="flex-1 rounded-lg border border-[#e8b44a] bg-[#fff8e8] py-2 text-[13px] font-semibold text-[#7a5200] hover:bg-[#ffefc9]">{t.ctaVoucher}</button>
            ) : (
              <button onClick={() => { openChat("teaser_inquiry"); startInquiry(); }} className="flex-1 rounded-lg border border-[#b9c7da] py-2 text-[13px] font-semibold text-[#1d3b6b] hover:border-[#1d3b6b]">{t.ctaInquiry}</button>
            )}
          </div>
          )}
        </section>
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
                      <AnswerText text={m.content} ai={m.ai} />
                    )}
                    {m.ctas && step === "chat" && !loading && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {m.ctas.map((c) => c === "inquiry" ? (
                          <button key={c} onClick={() => { track("cta_click", { cta: "lexi_cta_inquiry" }); startInquiry(); }} className="rounded-lg bg-[#2db1fb] px-3 py-1.5 text-[13px] font-semibold text-[#06233a] transition-colors hover:bg-[#1a93e0]">{t.ctaInquiry}</button>
                        ) : c === "voucher" ? (
                          <button key={c} onClick={() => { track("cta_click", { cta: "lexi_cta_voucher" }); window.dispatchEvent(new CustomEvent("ix:open-voucher")); }}
                            className="rounded-lg border border-[#e8b44a] bg-[#fff8e8] px-3 py-1.5 text-[13px] font-semibold text-[#7a5200] transition-colors hover:bg-[#ffefc9]">{t.ctaVoucher}</button>
                        ) : (
                          <a key={c} href={lh(lang, c === "placement" ? "/einstufung" : "/konfigurator")} onClick={() => track("cta_click", { cta: `lexi_cta_${c}` })}
                            className="rounded-lg border border-[#b9c7da] px-3 py-1.5 text-[13px] font-medium text-[#1d3b6b] transition-colors hover:border-[#1d3b6b]">{c === "placement" ? t.ctaPlacement : t.ctaConfigurator}</a>
                        ))}
                      </div>
                    )}
                    {m.more && step === "chat" && (
                      <a href={m.more.path} onClick={() => track("cta_click", { cta: "lexi_more", target: m.more!.path })} className="self-start text-[13px] font-medium text-[#0a72bd] hover:text-[#1d3b6b]">{t.moreLabel}: {m.more.title} →</a>
                    )}
                    {m.promoNote && <p className="m-0 rounded-lg border border-[#f1d48a] bg-[#fff8e8] px-2.5 py-1.5 text-[13px] leading-snug text-[#5c4300]">{m.promoNote}</p>}
                    {m.privacyLink && <a href={lh(lang, "/rechtliches/datenschutz")} target="_blank" rel="noopener" className="font-medium text-[#0a72bd] hover:text-[#1d3b6b]">{t.privacyLink} ↗</a>}
                    {m.actions && !loading && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {m.actions.map((a, k) => (
                          <button key={a.value} onClick={() => onAction(a.value, a.label)}
                            className={k === 0 ? "rounded-lg bg-[#2db1fb] px-3 py-1.5 text-[13px] font-semibold text-[#06233a] transition-colors hover:bg-[#1a93e0]" : "rounded-lg border border-[#b9c7da] px-3 py-1.5 text-[13px] font-medium text-[#1d3b6b] hover:border-[#1d3b6b]"}>{a.label}</button>
                        ))}
                      </div>
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

      {offerOpen && (
        <OfferDialog t={t.offer} facts={factsNow()} privacyHref={lh(lang, "/rechtliches/datenschutz")} privacyLabel={t.privacyLink}
          newsletterConsent={t.voucherChat.newsletterConsent} errorText={t.error} onClose={() => setOfferOpen(false)} onSubmit={submitOffer} />
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

/**
 * Angebotsformular als eigenes kleines Fenster (Computer: Mitte, Handy: von unten) – bewusst NICHT im Chat,
 * weil dort „keine persönlichen Daten“ gilt. Zeigt, was Lexi aus dem Gespräch mitnimmt.
 * Pflicht: Name + E-Mail; Telefon/Unternehmen/Ergänzungen optional; Newsletter freiwillig (eigener Double-Opt-In).
 */
function OfferDialog({ t, facts, privacyHref, privacyLabel, newsletterConsent, errorText, onClose, onSubmit }: {
  t: Dictionary["lexi"]["offer"]; facts: Record<string, string>; privacyHref: string; privacyLabel: string; newsletterConsent: string; errorText: string;
  onClose: () => void; onSubmit: (d: { name: string; email: string; phone: string; company: string; notes: string; newsletter: boolean }) => Promise<void>;
}) {
  const [d, setD] = useState({ name: "", email: "", phone: "", company: "", notes: "", newsletter: false });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const chips = [facts.course, facts.participants && `${facts.participants} Pers.`, facts.format, facts.location, facts.when].filter(Boolean) as string[];
  const field = "w-full rounded-lg border border-[#cfd6de] bg-white px-3 py-2 text-base text-[#262b31] outline-none! focus:border-[#1d3b6b] sm:text-sm";
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!d.name.trim() || !isValidEmail(d.email)) { setErr(t.required); return; }
    setBusy(true); setErr("");
    try { await onSubmit({ ...d, name: d.name.trim(), email: d.email.trim(), phone: d.phone.trim(), company: d.company.trim(), notes: d.notes.trim().slice(0, 1500) }); }
    catch { setErr(errorText); setBusy(false); }
  };
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[rgba(15,23,34,0.45)] sm:items-center" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-label={t.title} className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 text-[#262b31] shadow-[0_16px_48px_rgba(15,23,34,0.25)] animate-fade-up sm:max-w-[440px] sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="m-0 text-lg font-semibold text-[#1d3b6b]">{t.title}</h2>
            <p className="m-0 mt-1 text-[12.5px] leading-snug text-[#58616c]">{t.subtitle}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t.close} title={t.close} className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#58616c] hover:bg-[#f3f5f8]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        {chips.length > 0 && (
          <div className="mt-3 rounded-xl bg-[#f3f7fb] px-3 py-2.5">
            <p className="m-0 text-[11.5px] font-semibold uppercase tracking-wide text-[#58616c]">{t.summary}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">{chips.map((c) => <span key={c} className="rounded-full bg-white px-2.5 py-1 text-[12.5px] font-medium text-[#1d3b6b] ring-1 ring-[#d8e2ee]">{c}</span>)}</div>
          </div>
        )}
        <form onSubmit={submit} className="mt-3 flex flex-col gap-2">
          <input className={field} placeholder={`${t.name} *`} aria-label={t.name} autoComplete="name" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} maxLength={120} autoFocus />
          <input className={field} placeholder={`${t.email} *`} aria-label={t.email} type="email" autoComplete="email" value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} maxLength={200} />
          <div className="grid gap-2 sm:grid-cols-2">
            <input className={field} placeholder={t.phone} aria-label={t.phone} type="tel" autoComplete="tel" value={d.phone} onChange={(e) => setD({ ...d, phone: e.target.value })} maxLength={40} />
            <input className={field} placeholder={t.company} aria-label={t.company} autoComplete="organization" value={d.company} onChange={(e) => setD({ ...d, company: e.target.value })} maxLength={200} />
          </div>
          <textarea className={field} rows={2} placeholder={t.notesPh} aria-label={t.notes} value={d.notes} onChange={(e) => setD({ ...d, notes: e.target.value })} maxLength={1500} />
          <label className="flex items-start gap-2 text-[12px] leading-snug text-[#58616c]">
            <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0" checked={d.newsletter} onChange={(e) => setD({ ...d, newsletter: e.target.checked })} />
            <span><b className="font-semibold text-[#262b31]">{t.newsletterLabel}</b> – {newsletterConsent}</span>
          </label>
          <p className="m-0 text-[11.5px] leading-snug text-[#58616c]">{t.privacy} <a href={privacyHref} target="_blank" rel="noopener" className="text-[#0a72bd]">{privacyLabel}</a></p>
          {err && <p className="m-0 text-[12.5px] text-[#b23b3b]">{err}</p>}
          <button type="submit" disabled={busy} className="mt-1 rounded-lg bg-[#2db1fb] py-2.5 text-[14px] font-semibold text-[#06233a] hover:bg-[#1a93e0] disabled:opacity-60">{busy ? t.sending : t.submit}</button>
        </form>
      </section>
    </div>
  );
}
