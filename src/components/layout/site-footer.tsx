import Link from "next/link";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-line py-16">
      <Container className="grid gap-12 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl text-paper mb-3">Interlexico</p>
          <p className="font-sans text-sm text-paper-dim leading-relaxed">
            Business English Training für Unternehmen in der DACH-Region.
          </p>
        </div>
        <div>
          <p className="font-sans text-xs tracking-[0.18em] uppercase text-gold mb-4">
            Angebot
          </p>
          <ul className="space-y-2 font-sans text-sm text-paper-dim">
            <li><Link className="link-underline" href="/kurse">Kursübersicht</Link></li>
            <li><Link className="link-underline" href="/kurse/business-english">Business English</Link></li>
            <li><Link className="link-underline" href="/shop/materialien">Materialien</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-sans text-xs tracking-[0.18em] uppercase text-gold mb-4">
            Unternehmen
          </p>
          <ul className="space-y-2 font-sans text-sm text-paper-dim">
            <li><Link className="link-underline" href="/ueber-uns">Über uns</Link></li>
            <li><Link className="link-underline" href="/kontakt">Kontakt</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-sans text-xs tracking-[0.18em] uppercase text-gold mb-4">
            Rechtliches
          </p>
          <ul className="space-y-2 font-sans text-sm text-paper-dim">
            <li><Link className="link-underline" href="/rechtliches/impressum">Impressum</Link></li>
            <li><Link className="link-underline" href="/rechtliches/datenschutz">Datenschutz</Link></li>
            <li><Link className="link-underline" href="/rechtliches/agb">AGB</Link></li>
          </ul>
        </div>
      </Container>
      <Container className="mt-14 border-t border-line pt-6">
        <p className="font-sans text-xs text-paper-dim">
          © {new Date().getFullYear()} Interlexico. Alle Rechte vorbehalten.
        </p>
      </Container>
    </footer>
  );
}
