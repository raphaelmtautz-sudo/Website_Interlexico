import { Suspense } from "react";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";

export const metadata = {
  title: "Kasse | Interlexico",
};

export default function CheckoutPage() {
  return (
    <Section className="pt-24 lg:pt-32">
      <Container className="max-w-2xl">
        <Eyebrow>Kasse</Eyebrow>
        <h1 className="font-display text-5xl text-paper mb-12 text-balance">
          Bestellung abschließen
        </h1>
        <Suspense>
          <CheckoutSummary />
        </Suspense>
      </Container>
    </Section>
  );
}
