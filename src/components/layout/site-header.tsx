import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeControl } from "@/components/theme/theme-control";
import { CommandTrigger } from "@/components/interactive/command-trigger";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { getSiteSettings } from "@/lib/cms";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";

export async function SiteHeader({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const navItems = [
    { href: lh(lang, "/kurse"), label: dict.nav.kurse },
    { href: lh(lang, "/einstufung"), label: dict.nav.einstufung },
    { href: lh(lang, "/ueber-uns"), label: dict.nav.ueberUns },
    { href: lh(lang, "/nachhaltigkeit"), label: dict.nav.nachhaltigkeit },
    { href: lh(lang, "/kontakt"), label: dict.nav.kontakt },
  ];
  const { logoUrl, logoAlt } = await getSiteSettings();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/70 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-ink/60">
      <Container className="flex h-20 items-center justify-between">
        <Link href={lh(lang, "/")} aria-label="Interlexico">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- Logo kommt aus dem CMS (externe Domain), next/image bräuchte dafür eine feste remotePatterns-Konfiguration.
            <img src={logoUrl} alt={logoAlt || "Interlexico"} className="h-9 w-auto sm:h-10" />
          ) : (
            <span className="font-display text-2xl tracking-wide text-brand">Interlexico</span>
          )}
        </Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-underline font-sans text-sm tracking-[0.06em] uppercase text-paper-dim hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <CommandTrigger className="hidden lg:flex" label={dict.nav.search} ariaLabel={dict.nav.searchOpen} />
          <LanguageSwitcher lang={lang} className="hidden lg:flex" />
          <ThemeControl className="hidden lg:block" dict={dict} />
          <Button href={lh(lang, "/kontakt")} variant="secondary" className="hidden lg:inline-flex">
            {dict.nav.anfragen}
          </Button>
          <MobileNav items={navItems} lang={lang} dict={dict} logoUrl={logoUrl} logoAlt={logoAlt} />
        </div>
      </Container>
    </header>
  );
}
