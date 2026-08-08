import { NextRequest, NextResponse } from "next/server";
import { rateLimit, clientKey } from "@/lib/rate-limit";

// Placeholder for local development. In production this route proxies to
// the public endpoint exposed by interlexico-one (see KONZEPT.md, Abschnitt
// "Lexi-Integration"): POST /api/public/lexi-widget.
export async function POST(req: NextRequest) {
  // Bot-/Missbrauchsschutz: max. 20 Nachrichten/Minute je Client.
  const rl = rateLimit(`lexi:${clientKey(req)}`, { limit: 20, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { reply: "Bitte einen Moment — zu viele Anfragen in kurzer Zeit. Versuchen Sie es gleich erneut." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  const { messages } = await req.json();
  const lastMessage = messages?.[messages.length - 1]?.content ?? "";

  return NextResponse.json({
    reply: `Danke für Ihre Nachricht. Ein Mitglied unseres Teams meldet sich in Kürze bei Ihnen. ("${lastMessage.slice(0, 60)}")`,
  });
}
