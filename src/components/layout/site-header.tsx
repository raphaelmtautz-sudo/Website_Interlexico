import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavMore } from "@/components/layout/nav-more";
import { ThemeControl } from "@/components/theme/theme-control";
import { CommandTrigger } from "@/components/interactive/command-trigger";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { getSiteSettings } from "@/lib/cms";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";

export async function SiteHeader({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  // Primäre Links direkt sichtbar, sekundäre in "Mehr" gebündelt — sonst
  // laufen auf lg-Breakpoints 6 Links + Suche/Sprache/Theme/CTA über.
  // "Kontakt" fehlt bewusst: der "Anfragen"-Button führt bereits dorthin.
  const primaryItems = [
    { href: lh(lang, "/kurse"), label: dict.nav.kurse },
    { href: lh(lang, "/einstufung"), label: dict.nav.einstufung },
  ];
  const { logoUrl, logoAlt, blogEnabled } = await getSiteSettings();
  const secondaryItems = [
    { href: lh(lang, "/ueber-uns"), label: dict.nav.ueberUns },
    { href: lh(lang, "/interlexico-one"), label: dict.nav.interlexicoOne },
    { href: lh(lang, "/nachhaltigkeit"), label: dict.nav.nachhaltigkeit },
    { href: lh(lang, "/karriere"), label: dict.nav.karriere },
    ...(blogEnabled ? [{ href: lh(lang, "/blog"), label: dict.nav.blog }] : []),
  ];
  const mobileItems = [...primaryItems, ...secondaryItems, { href: lh(lang, "/kontakt"), label: dict.nav.kontakt }];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/70 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-ink/60">
      <Container className="flex h-20 items-center justify-between">
        <Link href={lh(lang, "/")} aria-label="Interlexico">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={logoAlt || "Interlexico"}
              width={160}
              height={40}
              priority
              className="h-9 w-auto sm:h-10"
            />
          ) : (
            <span className="font-display text-2xl tracking-wide text-brand-strong">Interlexico</span>
          )}
        </Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {primaryItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-underline font-sans text-sm tracking-[0.06em] uppercase text-paper-dim hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
          <NavMore label={dict.nav.mehr} items={secondaryItems} />
        </nav>
        <div className="flex items-center gap-3">
          <CommandTrigger className="hidden lg:flex" label={dict.nav.search} ariaLabel={dict.nav.searchOpen} />
          <LanguageSwitcher lang={lang} className="hidden lg:flex" ariaLabel={dict.nav.sprache} />
          <ThemeControl className="hidden lg:block" dict={dict} />
          <Button href={lh(lang, "/kontakt")} variant="secondary" className="hidden lg:inline-flex">
            {dict.nav.anfragen}
          </Button>
          <MobileNav items={mobileItems} lang={lang} dict={dict} logoUrl={logoUrl} logoAlt={logoAlt} />
        </div>
      </Container>
    </header>
  );
}
