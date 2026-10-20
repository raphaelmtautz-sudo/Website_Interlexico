import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/interactive/reveal";

/** Abschluss-CTA der Branchen- und Ratgeberseiten. */
export function PageCta({ id = "anfrage", title, text, href, label }: { id?: string; title: string; text: string; href: string; label: string }) {
  return (
    <Reveal as="section" id={id} className="border-t border-line bg-brand/5">
      <Section>
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-4xl text-paper max-w-xl text-balance">{title}</h2>
          <p className="max-w-xl font-sans leading-relaxed text-paper-dim">{text}</p>
          <Button href={href} trackEvent="cta_click" trackProps={{ cta: "angebot", place: id }}>
            {label}
          </Button>
        </Container>
      </Section>
    </Reveal>
  );
}
