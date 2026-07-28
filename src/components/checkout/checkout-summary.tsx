"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { getCourseFormat } from "@/content/course-types";
import { Button } from "@/components/ui/button";

export function CheckoutSummary() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const kurs = searchParams.get("kurs") ?? "";
  const formatSlug = searchParams.get("format") ?? "";
  const teilnehmer = Number(searchParams.get("teilnehmer") ?? 1);

  const result = getCourseFormat(kurs, formatSlug);

  if (!result) {
    return (
      <p className="font-sans text-sm text-paper-dim">
        Keine Buchung ausgewählt.{" "}
        <a className="link-underline text-gold" href="/buchen">
          Zurück zur Buchung
        </a>
      </p>
    );
  }

  const { course, format } = result;
  const total = format.priceFrom * teilnehmer;

  function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Stripe Checkout Session erstellen (siehe KONZEPT.md, Abschnitt 2)
    router.push("/checkout/erfolg");
  }

  return (
    <div className="space-y-10">
      <div className="border border-line p-6">
        <p className="font-sans text-xs uppercase tracking-[0.12em] text-gold mb-2">
          {course.name}
        </p>
        <p className="font-display text-2xl text-paper mb-4">{format.name}</p>
        <div className="flex justify-between font-sans text-sm text-paper-dim border-t border-line pt-4">
          <span>{teilnehmer} Teilnehmer:in(nen) × {format.priceFrom} €</span>
          <span className="text-paper">{total} €</span>
        </div>
      </div>

      <form onSubmit={handleCheckout} className="space-y-5">
        <p className="font-sans text-xs uppercase tracking-[0.12em] text-gold">
          Zahlungsart
        </p>
        <div className="border border-line p-4 font-sans text-sm text-paper-dim">
          Stripe-Zahlung (Kreditkarte / SEPA-Lastschrift) — wird bei
          Freigabe der Zahlungsintegration aktiviert.
        </div>
        <Button type="submit">Kostenpflichtig buchen</Button>
      </form>
    </div>
  );
}
