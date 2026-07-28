import { Section, Eyebrow } from "@/components/ui/section";

export const metadata = { title: "Impressum | Interlexico" };

export default function ImpressumPage() {
  return (
    <Section className="pt-24 lg:pt-32">
      <Eyebrow>Rechtliches</Eyebrow>
      <h1 className="font-display text-4xl text-paper mb-8">Impressum</h1>
      <p className="font-sans text-sm leading-relaxed text-paper-dim max-w-xl">
        Angaben gemäß § 5 TMG folgen. Platzhalterinhalt.
      </p>
    </Section>
  );
}
