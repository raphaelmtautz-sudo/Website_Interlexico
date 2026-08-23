import type { ReactNode } from "react";

/**
 * Minimaler Renderer für das Lexical-JSON, das Payload CMS aus dem
 * richText-Feld liefert. Deckt bewusst nur die Node-Typen ab, die im
 * CMS-Editor der "pages"-Collection zur Verfügung stehen (Standard-
 * Lexical-Toolbar: Absatz, Überschriften, Liste, Link, Fett/Kursiv) —
 * kein Abhängigkeit auf @payloadcms/richtext-lexical in der Website.
 */

interface LexicalTextNode {
  type: "text";
  text: string;
  format?: number; // Bitmaske: 1=bold, 2=italic, 8=underline
}

interface LexicalElementNode {
  type: string;
  tag?: string; // z. B. "h2" bei headings, "ul"/"ol" bei lists
  listType?: "bullet" | "number";
  url?: string;
  children?: LexicalNode[];
}

type LexicalNode = LexicalTextNode | LexicalElementNode;

function isTextNode(node: LexicalNode): node is LexicalTextNode {
  return node.type === "text";
}

function renderTextNode(node: LexicalTextNode, key: number): ReactNode {
  let content: ReactNode = node.text;
  const format = node.format ?? 0;
  if (format & 1) content = <strong key={key}>{content}</strong>;
  if (format & 2) content = <em key={key}>{content}</em>;
  if (format & 8) content = <u key={key}>{content}</u>;
  return <span key={key}>{content}</span>;
}

function renderChildren(children: LexicalNode[] | undefined): ReactNode {
  if (!children) return null;
  return children.map((child, i) => (isTextNode(child) ? renderTextNode(child, i) : renderNode(child, i)));
}

function renderNode(node: LexicalElementNode, key: number): ReactNode {
  switch (node.type) {
    case "paragraph":
      return (
        <p key={key} className="font-sans leading-relaxed text-paper-dim">
          {renderChildren(node.children)}
        </p>
      );
    case "heading": {
      const Tag = (node.tag ?? "h2") as "h1" | "h2" | "h3" | "h4";
      return (
        <Tag key={key} className="font-display text-paper text-balance">
          {renderChildren(node.children)}
        </Tag>
      );
    }
    case "list": {
      const ListTag = node.listType === "number" ? "ol" : "ul";
      return (
        <ListTag key={key} className="list-inside list-disc space-y-1 font-sans text-paper-dim">
          {renderChildren(node.children)}
        </ListTag>
      );
    }
    case "listitem":
      return <li key={key}>{renderChildren(node.children)}</li>;
    case "link":
      return (
        <a
          key={key}
          href={node.url}
          className="link-underline text-paper"
          target={node.url?.startsWith("http") ? "_blank" : undefined}
          rel={node.url?.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {renderChildren(node.children)}
        </a>
      );
    default:
      // Unbekannter Node-Typ (z. B. Custom-Block) — Kinder trotzdem rendern,
      // damit Text nicht stillschweigend verschwindet.
      return <span key={key}>{renderChildren(node.children)}</span>;
  }
}

/** Rendert das Lexical-Root-JSON eines Payload-richText-Feldes als React-Baum. */
export function renderLexical(content: unknown): ReactNode {
  if (!content || typeof content !== "object") return null;
  const root = (content as { root?: LexicalElementNode }).root;
  if (!root?.children) return null;
  return <>{renderChildren(root.children)}</>;
}
