import { NextRequest, NextResponse } from "next/server";

// Placeholder for local development. In production this route proxies to
// the public endpoint exposed by interlexico-one (see KONZEPT.md, Abschnitt
// "Lexi-Integration"): POST /api/public/lexi-widget.
export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const lastMessage = messages?.[messages.length - 1]?.content ?? "";

  return NextResponse.json({
    reply: `Danke für Ihre Nachricht. Ein Mitglied unseres Teams meldet sich in Kürze bei Ihnen. ("${lastMessage.slice(0, 60)}")`,
  });
}
