import { type NextRequest } from "next/server";
import { hasLocale } from "@/lib/i18n";
import { getVoucherCampaign } from "@/lib/voucher";

/**
 * Laufende Gutschein-Aktion fürs Pop-up (Frist + Texte einer Sprache). Das
 * Pop-up fragt erst, wenn es überhaupt erscheinen dürfte; ONE wird höchstens
 * einmal pro Minute gefragt (getVoucherCampaign).
 */
export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get("lang") || "de";
  const campaign = await getVoucherCampaign();
  if (!campaign || !hasLocale(lang)) return Response.json({ active: false });
  return Response.json(
    { active: true, requestEndsAt: campaign.requestEndsAt, texts: campaign.texts[lang] },
    { headers: { "cache-control": "public, max-age=60" } },
  );
}
