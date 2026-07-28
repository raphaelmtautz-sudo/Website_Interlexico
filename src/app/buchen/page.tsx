import { Suspense } from "react";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { BookingFlow } from "@/components/booking/booking-flow";

export const metadata = {
  title: "Kurs buchen | Interlexico",
  description: "Buchen Sie Ihr Business-English-Training bei Interlexico.",
};

export default function BuchenPage() {
  return (
    <Section className="pt-24 lg:pt-32">
      <Container className="max-w-3xl">
        <Eyebrow>Buchung</Eyebrow>
        <h1 className="font-display text-5xl text-paper mb-12 text-balance">
          Ihr Training buchen
        </h1>
        <Suspense>
          <BookingFlow />
        </Suspense>
      </Container>
    </Section>
  );
}
