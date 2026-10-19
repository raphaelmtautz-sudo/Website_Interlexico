import { buildLlmsFullTxt } from "@/app/llms-full.txt/route";

export async function GET() {
  return new Response(await buildLlmsFullTxt("es"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
