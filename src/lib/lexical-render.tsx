import type { CSSProperties, ReactNode } from "react";

/**
 * Renderer für das Lexical-JSON aus den richText-Feldern des Payload CMS (Ratgeber, Seiten, Blog).
 * Deckt genau die Werkzeuge der CMS-Werkzeugleiste ab (seit 20.11.2026, „wie in Word“):
 * Absatz, Überschriften H2/H3, Fett, Kursiv, Unterstrichen, Durchgestrichen, Textmarker (gelb/blau),
 * Aufzählung/Nummerierung, Link (extern, „neuer Tab“, intern auf Ratgeber), Zitat, Trennlinie, Ausrichtung.
 * Keine Abhängigkeit auf @payloadcms/richtext-lexical in der Website.
 */

interface LexicalTextNode {
  type: "text";
  text: string;
  format?: number; // Bitmaske: 1=fett, 2=kursiv, 4=durchgestrichen, 8=unterstrichen, 16=code, 32=tief, 64=hoch
  $?: { highlight?: string }; // Textmarker (TextStateFeature im CMS)
}

interface LexicalElementNode {
  type: string;
  tag?: string; // z. B. "h2" bei headings
  listType?: "bullet" | "number" | "check";
  format?: string | number; // Ausrichtung bei Absätzen/Überschriften: "left" | "center" | "right" | "justify"
  url?: string; // ältere Links
  fields?: { url?: string; newTab?: boolean; linkType?: "custom" | "internal"; doc?: { relationTo?: string; value?: { slug?: string } | string } };
  children?: LexicalNode[];
}

type LexicalNode = LexicalTextNode | LexicalElementNode;
type Opts = { lang: string };

// Textmarker-Farben – müssen zu den Werten im CMS passen (interlexico-cms src/fields/richText.ts)
const HIGHLIGHT: Record<string, string> = { yellow: "#fff3a3", blue: "#d7ecfb" };

const isTextNode = (node: LexicalNode): node is LexicalTextNode => node.type === "text";

function renderTextNode(node: LexicalTextNode, key: number): ReactNode {
  let content: ReactNode = node.text;
  const f = node.format ?? 0;
  if (f & 16) content = <code className="rounded bg-line/40 px-1 font-mono text-[0.92em]">{content}</code>;
  if (f & 1) content = <strong>{content}</strong>;
  if (f & 2) content = <em>{content}</em>;
  if (f & 4) content = <s>{content}</s>;
  if (f & 8) content = <u>{content}</u>;
  if (f & 32) content = <sub>{content}</sub>;
  if (f & 64) content = <sup>{content}</sup>;
  const bg = node.$?.highlight ? HIGHLIGHT[node.$.highlight] : undefined;
  return bg ? <mark key={key} style={{ backgroundColor: bg, color: "inherit", padding: "0 0.15em", borderRadius: 2 }}>{content}</mark> : <span key={key}>{content}</span>;
}

function renderChildren(children: LexicalNode[] | undefined, o: Opts): ReactNode {
  if (!children) return null;
  return children.map((child, i) => (isTextNode(child) ? renderTextNode(child, i) : renderNode(child, i, o)));
}

const alignStyle = (format: LexicalElementNode["format"]): CSSProperties | undefined =>
  typeof format === "string" && ["center", "right", "justify"].includes(format) ? { textAlign: format as CSSProperties["textAlign"] } : undefined;

function linkHref(node: LexicalElementNode, o: Opts): { href?: string; external: boolean; newTab: boolean } {
  const f = node.fields;
  if (f?.linkType === "internal" && f.doc) {
    const v = f.doc.value;
    const slug = typeof v === "object" && v ? v.slug : undefined;
    if (f.doc.relationTo === "guides" && slug) return { href: `/${o.lang}/ratgeber/${slug}`, external: false, newTab: !!f.newTab };
    return { href: undefined, external: false, newTab: false };
  }
  const url = f?.url ?? node.url;
  const external = !!url && /^https?:\/\//.test(url) && !/^https?:\/\/(www\.)?interlexico\.com/.test(url);
  return { href: url, external, newTab: f?.newTab ?? external };
}

function renderNode(node: LexicalElementNode, key: number, o: Opts): ReactNode {
  switch (node.type) {
    case "paragraph":
      return <p key={key} style={alignStyle(node.format)} className="font-sans leading-relaxed text-paper-dim">{renderChildren(node.children, o)}</p>;
    case "heading": {
      const Tag = (node.tag ?? "h2") as "h1" | "h2" | "h3" | "h4";
      return <Tag key={key} style={alignStyle(node.format)} className="font-display text-paper text-balance">{renderChildren(node.children, o)}</Tag>;
    }
    case "list": {
      const numbered = node.listType === "number";
      const ListTag = numbered ? "ol" : "ul";
      return <ListTag key={key} className={`${numbered ? "list-decimal" : "list-disc"} space-y-1 pl-5 font-sans text-paper-dim`}>{renderChildren(node.children, o)}</ListTag>;
    }
    case "listitem":
      return <li key={key}>{renderChildren(node.children, o)}</li>;
    case "quote":
      return <blockquote key={key} className="border-l-2 border-gold-dim pl-4 font-sans italic leading-relaxed text-paper">{renderChildren(node.children, o)}</blockquote>;
    case "horizontalrule":
      return <hr key={key} className="border-line" />;
    case "linebreak":
      return <br key={key} />;
    case "link":
    case "autolink": {
      const { href, external, newTab } = linkHref(node, o);
      if (!href) return <span key={key}>{renderChildren(node.children, o)}</span>;
      return (
        <a key={key} href={href} className="link-underline text-paper" target={newTab ? "_blank" : undefined} rel={external || newTab ? "noopener noreferrer" : undefined}>
          {renderChildren(node.children, o)}
        </a>
      );
    }
    default:
      // Unbekannter Node-Typ (z. B. Custom-Block) — Kinder trotzdem rendern, damit kein Text verschwindet.
      return <span key={key}>{renderChildren(node.children, o)}</span>;
  }
}

/** Rendert das Lexical-Root-JSON eines Payload-richText-Feldes als React-Baum. */
export function renderLexical(content: unknown, opts: Partial<Opts> = {}): ReactNode {
  if (!content || typeof content !== "object") return null;
  const root = (content as { root?: LexicalElementNode }).root;
  if (!root?.children) return null;
  return <>{renderChildren(root.children, { lang: opts.lang ?? "de" })}</>;
}
