import { buildLlmsTxt } from "@/app/llms.txt/route";

export async function GET() {
  return new Response(buildLlmsTxt("en"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
