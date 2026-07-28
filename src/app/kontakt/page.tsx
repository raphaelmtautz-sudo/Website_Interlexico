import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata = {
  title: "Kontakt | Interlexico",
  description: "Kontaktieren Sie Interlexico für ein unverbindliches Beratungsgespräch.",
};

export default function KontaktPage() {
  return (
    <Section className="pt-24 lg:pt-32">
      <Container className="grid gap-16 lg:grid-cols-2">
        <div>
          <Eyebrow>Kontakt</Eyebrow>
          <h1 className="font-display text-5xl text-paper mb-6 text-balance">
            Sprechen wir über Ihr Training
          </h1>
          <p className="font-sans leading-relaxed text-paper-dim mb-8">
            Erzählen Sie uns kurz von Ihrem Team und Ihren Zielen — wir melden
            uns innerhalb eines Werktages für ein unverbindliches
            Beratungsgespräch.
          </p>
          <div className="space-y-2 font-sans text-sm text-paper-dim">
            <p>info@interlexico.com</p>
            <p>+49 30 000 000</p>
          </div>
        </div>
        <ContactForm />
      </Container>
    </Section>
  );
}
