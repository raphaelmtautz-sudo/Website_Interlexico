import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * AI-/Answer-Engine-Crawler werden explizit zugelassen (GEO): Viele Betreiber
 * werten das Fehlen einer eigenen Gruppe als "nicht ausdrücklich erlaubt",
 * und Interlexico soll in ChatGPT, Perplexity, Claude, Gemini & Co. als
 * Quelle für Firmen-Sprachtraining auftauchen. Reine Trainings-Crawler sind
 * bewusst mit eingeschlossen — es gibt keine Inhalte, die geschützt werden müssten.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "Meta-ExternalAgent",
  "MistralAI-User",
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  // Interne/technische Pfade nicht indexieren.
  const disallow = ["/api/"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: AI_CRAWLERS, allow: ["/", "/llms.txt", "/llms-full.txt"], disallow },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
