import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Buchung bestätigt | Interlexico",
};

export default function CheckoutErfolgPage() {
  return (
    <Section className="pt-24 lg:pt-32">
      <Container className="max-w-xl text-center">
        <Eyebrow>Bestätigung</Eyebrow>
        <h1 className="font-display text-5xl text-paper mb-6 text-balance">
          Vielen Dank für Ihre Buchung
        </h1>
        <p className="font-sans leading-relaxed text-paper-dim mb-10">
          Wir haben Ihre Buchung erhalten und senden Ihnen in Kürze eine
          Bestätigung per E-Mail mit den nächsten Schritten.
        </p>
        <Button href="/">Zur Startseite</Button>
      </Container>
    </Section>
  );
}
