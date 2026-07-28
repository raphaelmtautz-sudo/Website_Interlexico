import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";

export const metadata = {
  title: "Über uns | Interlexico",
  description: "Interlexico — Business English Training für Unternehmen in der DACH-Region.",
};

const values = [
  {
    title: "Fachlich statt generisch",
    description:
      "Wir bringen Sprache mit dem fachlichen Kontext unserer Kund:innen zusammen — keine Lehrbuchszenarien ohne Bezug zum Arbeitsalltag.",
  },
  {
    title: "Messbar statt gefühlt",
    description:
      "HR-Entscheider bekommen bei uns nachvollziehbare Fortschrittsdaten, keine vagen Einschätzungen.",
  },
  {
    title: "Persönlich statt anonym",
    description:
      "Feste Trainer:innen, feste Ansprechpartner:innen — auch bei Klassentrainings über mehrere Standorte hinweg.",
  },
];

export default function UeberUnsPage() {
  return (
    <>
      <Section className="pt-24 lg:pt-32">
        <div className="max-w-2xl">
          <Eyebrow>Über Interlexico</Eyebrow>
          <h1 className="font-display text-5xl text-paper mb-6 text-balance">
            Sprachtraining, das sich an Ihrem Unternehmen orientiert
          </h1>
          <p className="font-sans text-lg leading-relaxed text-paper-dim">
            Interlexico wurde gegründet, um Business-English-Training in der
            DACH-Region so anzubieten, wie es Unternehmen tatsächlich
            brauchen: fachbezogen, flexibel und mit klarer Erfolgsmessung.
          </p>
        </div>
      </Section>

      <Section className="border-t border-line">
        <Container className="grid gap-12 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="border-t border-gold-dim pt-6">
              <h3 className="font-display text-2xl text-paper mb-3">{v.title}</h3>
              <p className="font-sans text-sm leading-relaxed text-paper-dim">
                {v.description}
              </p>
            </div>
          ))}
        </Container>
      </Section>
    </>
  );
}
