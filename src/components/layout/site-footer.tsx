import Link from "next/link";
import { Container } from "@/components/ui/container";
import { lh, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries";

export function SiteFooter({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <footer className="border-t border-line py-16">
      <Container className="grid gap-12 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl text-brand mb-3">Interlexico</p>
          <p className="font-sans text-sm text-paper-dim leading-relaxed">{dict.footer.tagline}</p>
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
            <li><Link className="link-underline" href={lh(lang, "/nachhaltigkeit")}>{dict.nav.nachhaltigkeit}</Link></li>
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
