import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "../globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LexiWidget } from "@/components/chatbot/lexi-widget";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";
import { Analytics } from "@/components/analytics/analytics";
import { CommandPalette } from "@/components/interactive/command-palette";
import { AdaptiveUI } from "@/components/interactive/adaptive-ui";
import { locales, hasLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/dictionaries";
import { SITE } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const ogLocale: Record<Locale, string> = { de: "de_DE", en: "en_US", es: "es_ES" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  const path = lang === "de" ? "/" : `/${lang}`;

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: dict.meta.titleDefault,
      template: dict.meta.titleTemplate,
    },
    description: dict.meta.description,
    alternates: {
      canonical: path,
      languages: {
        de: "/de",
        en: "/en",
        es: "/es",
        "x-default": "/de",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: ogLocale[lang],
      title: dict.meta.titleDefault,
      description: dict.meta.description,
      url: path,
    },
  };
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef1f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1722" },
  ],
};

// Läuft synchron vor dem ersten Paint — verhindert Theme-Flash (FOUC).
const themeScript = `(function(){try{document.documentElement.classList.add('js');var k='il-theme';var p=localStorage.getItem(k)||'light';var r=p;if(p==='auto'){var m=window.matchMedia;if(m&&m('(prefers-color-scheme: light)').matches)r='light';else if(m&&m('(prefers-color-scheme: dark)').matches)r='dark';else{var h=new Date().getHours();r=(h>=7&&h<19)?'light':'dark';}}var e=document.documentElement;e.setAttribute('data-theme',r);e.setAttribute('data-theme-pref',p);var c=parseFloat(localStorage.getItem('il-contrast'));if(c>0)e.style.setProperty('--contrast',c+'%');if(localStorage.getItem('il-focus')==='on')e.setAttribute('data-focus','on');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col bg-ink text-paper">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>
          <a href="#main" className="skip-link">
            {dict.skipLink}
          </a>
          <SiteHeader lang={lang} dict={dict} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter lang={lang} dict={dict} />
          <LexiWidget lang={lang} dict={dict} />
          <CommandPalette lang={lang} dict={dict} />
          <AdaptiveUI />
          <Analytics />
        </ThemeProvider>
        <OrganizationJsonLd lang={lang} />
        <WebSiteJsonLd lang={lang} />
      </body>
    </html>
  );
}
