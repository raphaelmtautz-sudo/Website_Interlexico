import { ImageResponse } from "next/og";
import { getDictionary } from "@/dictionaries";
import { hasLocale, defaultLocale, type Locale } from "@/lib/i18n";

export const alt = "Interlexico — Corporate language training: Business English & German";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const headlines: Record<Locale, string> = {
  de: "Business Englisch & Deutsch für Ihren Unternehmenserfolg",
  en: "Business English & German for your company's success",
  es: "Inglés y alemán para el éxito de su empresa",
};

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = hasLocale(lang) ? lang : defaultLocale;
  const dict = getDictionary(l);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1d3b6b",
          color: "#ffffff",
          padding: "72px 80px",
          border: "2px solid #2a4a7d",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#4bb3c2",
          }}
        >
          {dict.home.eyebrow}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", width: 120, height: 2, background: "#4bb3c2", marginBottom: 32 }} />
          <div
            style={{
              display: "flex",
              fontSize: 104,
              lineHeight: 1.05,
              fontWeight: 700,
              maxWidth: 900,
            }}
          >
            {headlines[l]}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 30,
          }}
        >
          <div style={{ display: "flex", fontWeight: 700, letterSpacing: 2 }}>
            Interlexico
          </div>
          <div style={{ display: "flex", color: "#aebfd6", fontSize: 24 }}>
            interlexico.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
