import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { CopyCode, NewsletterBox } from "@/components/voucher/voucher-confirmation";
import { getDictionary } from "@/dictionaries";
import { hasLocale, lh, type Locale } from "@/lib/i18n";
import { confirmVoucher } from "@/lib/voucher";

// Ziel des Bestätigungslinks aus der Gutschein-Mail (und des Newsletter-Buttons
// in der Code-Mail). Jeder Aufruf bestätigt idempotent und zeigt den Code; der
// Token gehört in keinen Suchindex und in keinen Cache.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return {
    title: getDictionary(lang).voucher.page.metaTitle,
    robots: { index: false, follow: false },
    referrer: "no-referrer",
  };
}

const dateTag: Record<Locale, string> = { de: "de-DE", en: "en-GB", es: "es-ES" };

export default async function VoucherConfirmedPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ token?: string; from?: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { token = "", from } = await searchParams;
  const t = getDictionary(lang).voucher;
  const p = t.page;
  const result = await confirmVoucher(token);

  if (!result.ok) {
    const [title, text] =
      result.reason === "invalid" ? [p.invalidTitle, p.invalidText]
      : result.reason === "expired" ? [p.expiredTitle, p.expiredText]
      : [p.errorTitle, p.errorText];
    return (
      <Section className="pt-24 lg:pt-32">
        <Container className="mx-auto max-w-lg text-center">
          <h1 className="font-display text-4xl mb-4 text-balance">{title}</h1>
          <p className="font-sans text-base leading-relaxed text-paper-dim mb-8">{text}</p>
          <Button href={lh(lang, "/")} variant="secondary">{p.home}</Button>
        </Container>
      </Section>
    );
  }

  const date = new Date(result.expiresAt).toLocaleDateString(dateTag[lang], {
    day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Berlin",
  });

  return (
    <Section className="pt-24 lg:pt-32">
      <Container className="mx-auto flex max-w-lg flex-col gap-6">
        <div className="animate-rise text-center">
          <Eyebrow>{p.thanks.replace("{name}", result.name)}</Eyebrow>
          <h1 className="font-display text-4xl text-balance sm:text-5xl">{p.title}</h1>
        </div>

        <div className="flex flex-col items-center gap-2 border border-dashed border-brand-strong px-6 py-6 text-center">
          <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-paper-dim">{p.codeLabel}</span>
          <code className="font-mono text-2xl font-semibold tracking-[0.12em] text-paper sm:text-3xl">{result.code}</code>
          {!result.redeemed && <CopyCode code={result.code} t={p} />}
        </div>

        <p className="text-center font-sans text-sm text-paper-dim">
          {result.redeemed ? p.redeemed : p.codeNote.replace("{date}", date).replace("{min}", String(result.minUnits))}
        </p>

        {!result.redeemed && (
          <Button href={`${lh(lang, "/kontakt")}?gutschein=${encodeURIComponent(result.code)}`} className="self-center">
            {p.cta}
          </Button>
        )}

        <NewsletterBox lang={lang} token={token} initial={result.newsletter} fromMail={from === "mail"} t={t} />
      </Container>
    </Section>
  );
}
