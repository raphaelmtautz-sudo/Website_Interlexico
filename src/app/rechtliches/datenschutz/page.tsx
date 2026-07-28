import { Section, Eyebrow } from "@/components/ui/section";

export const metadata = { title: "Datenschutz | Interlexico" };

export default function DatenschutzPage() {
  return (
    <Section className="pt-24 lg:pt-32">
      <Eyebrow>Rechtliches</Eyebrow>
      <h1 className="font-display text-4xl text-paper mb-8">Datenschutzerklärung</h1>
      <p className="font-sans text-sm leading-relaxed text-paper-dim max-w-xl">
        Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO
        folgen. Platzhalterinhalt.
      </p>
    </Section>
  );
}
