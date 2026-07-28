import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { products } from "@/content/products";

export const metadata = {
  title: "Materialien | Interlexico",
  description: "Digitale Zusatzmaterialien von Interlexico.",
};

export default function MaterialienPage() {
  return (
    <Section className="pt-24 lg:pt-32">
      <Eyebrow>Shop</Eyebrow>
      <h1 className="font-display text-5xl text-paper mb-16 text-balance">
        Digitale Materialien
      </h1>
      <div className="grid gap-px bg-line md:grid-cols-2">
        {products.map((p) => (
          <div key={p.slug} className="bg-ink p-8 flex flex-col">
            <h3 className="font-display text-2xl text-paper mb-2">{p.name}</h3>
            <p className="font-sans text-sm leading-relaxed text-paper-dim mb-6 flex-1">
              {p.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl text-gold">{p.price} €</span>
              <Button variant="secondary">In den Warenkorb</Button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
