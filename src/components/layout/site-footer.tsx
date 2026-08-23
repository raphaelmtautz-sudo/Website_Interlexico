import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SocialIcon } from "@/components/contact/social-icon";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";
import type { ContactData } from "@/lib/cms";

export function SiteFooter({
  lang,
  dict,
  socialLinks = [],
}: {
  lang: Locale;
  dict: Dictionary;
  socialLinks?: ContactData["socialLinks"];
}) {
  return (
    <footer className="border-t border-line py-16">
      <Container className="grid gap-12 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl text-brand-strong mb-3">Interlexico</p>
          <p className="font-sans text-sm text-paper-dim leading-relaxed">{dict.footer.tagline}</p>
          {socialLinks.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center border border-line text-paper-dim transition-colors hover:border-brand hover:text-brand"
                  aria-label={s.platform}
                >
                  <SocialIcon platform={s.platform} />
                </a>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="font-sans text-xs tracking-[0.18em] uppercase text-gold mb-4">
            {dict.footer.angebot}
          </p>
          <ul className="space-y-2 font-sans text-sm text-paper-dim">
            <li><Link className="link-underline" href={lh(lang, "/kurse")}>{dict.footer.kursuebersicht}</Link></li>
            <li><Link className="link-underline" href={lh(lang, "/kurse/business-english")}>Business English</Link></li>
            <li><Link className="link-underline" href={lh(lang, "/kurse/deutsch-als-fremdsprache")}>{dict.commandPalette.items.daf}</Link></li>
            <li><Link className="link-underline" href={lh(lang, "/einstufung")}>{dict.footer.einstufungLink}</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-sans text-xs tracking-[0.18em] uppercase text-gold mb-4">
            {dict.footer.unternehmen}
          </p>
          <ul className="space-y-2 font-sans text-sm text-paper-dim">
            <li><Link className="link-underline" href={lh(lang, "/ueber-uns")}>{dict.nav.ueberUns}</Link></li>
            <li><Link className="link-underline" href={lh(lang, "/interlexico-one")}>{dict.nav.interlexicoOne}</Link></li>
            <li><Link className="link-underline" href={lh(lang, "/nachhaltigkeit")}>{dict.nav.nachhaltigkeit}</Link></li>
            <li><Link className="link-underline" href={lh(lang, "/karriere")}>{dict.nav.karriere}</Link></li>
            <li><Link className="link-underline" href={lh(lang, "/blog")}>{dict.nav.blog}</Link></li>
            <li><Link className="link-underline" href={lh(lang, "/kontakt")}>{dict.nav.kontakt}</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-sans text-xs tracking-[0.18em] uppercase text-gold mb-4">
            {dict.footer.rechtliches}
          </p>
          <ul className="space-y-2 font-sans text-sm text-paper-dim">
            <li><Link className="link-underline" href={lh(lang, "/rechtliches/impressum")}>{dict.footer.impressum}</Link></li>
            <li><Link className="link-underline" href={lh(lang, "/rechtliches/datenschutz")}>{dict.footer.datenschutz}</Link></li>
            <li><Link className="link-underline" href={lh(lang, "/rechtliches/agb")}>{dict.footer.agb}</Link></li>
          </ul>
        </div>
      </Container>
      <Container className="mt-14 border-t border-line pt-6">
        <p className="font-sans text-xs text-paper-dim">
          © {new Date().getFullYear()} Interlexico. {dict.footer.rights}
        </p>
      </Container>
    </footer>
  );
}
