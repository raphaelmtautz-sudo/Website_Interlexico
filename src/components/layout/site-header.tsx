import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/kurse", label: "Kurse" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/95 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-wide text-paper">
          Interlexico
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
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
        <Button href="/buchen" variant="secondary" className="hidden sm:inline-flex">
          Kurs buchen
        </Button>
      </Container>
    </header>
  );
}
