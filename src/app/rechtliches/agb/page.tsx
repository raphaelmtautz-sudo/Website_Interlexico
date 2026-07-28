import { Section, Eyebrow } from "@/components/ui/section";

export const metadata = { title: "AGB | Interlexico" };

export default function AgbPage() {
  return (
    <Section className="pt-24 lg:pt-32">
      <Eyebrow>Rechtliches</Eyebrow>
      <h1 className="font-display text-4xl text-paper mb-8">
        Allgemeine Geschäftsbedingungen
      </h1>
      <p className="font-sans text-sm leading-relaxed text-paper-dim max-w-xl">
        AGB-Inhalt folgt. Platzhalterinhalt.
      </p>
    </Section>
  );
}
