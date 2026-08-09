"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

/**
 * Next.js ruft error.tsx als Client Component auf, ohne die üblichen Route-
 * Params — hier ist daher keine Sprache aus der URL bekannt und `getDictionary`
 * (server-only) kann nicht verwendet werden. Text ist deshalb, wie bei
 * not-found.tsx als Fallback, fest auf die Standardsprache (DE) gesetzt.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <Section className="pt-28 lg:pt-40">
      <div className="max-w-2xl">
        <Eyebrow>Fehler</Eyebrow>
        <h1 className="font-display text-6xl leading-[1.05] text-paper sm:text-7xl">
          Etwas ist schiefgelaufen.
        </h1>
        <p className="mt-8 max-w-lg font-sans text-lg leading-relaxed text-paper-dim">
          Es gab ein unerwartetes Problem beim Laden dieser Seite. Bitte versuchen Sie es erneut.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button onClick={reset}>Erneut versuchen</Button>
          <Button href="/" variant="secondary">
            Zur Startseite
          </Button>
        </div>
      </div>
    </Section>
  );
}
