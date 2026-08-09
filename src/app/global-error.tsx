"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

/**
 * Fängt Fehler im Root-Layout selbst (src/app/[lang]/layout.tsx) ab — muss
 * eigenes <html>/<body> mitbringen, da es das Layout ersetzt statt zu umschließen.
 * Getrennt von error.tsx (Fehler innerhalb der Seiten) und global-not-found.tsx
 * (unbekannte URLs), siehe next.js-Docs zu global-error.js.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="de">
      <body style={{ background: "#0f1722", color: "#e8ecf2", fontFamily: "sans-serif" }}>
        <div style={{ maxWidth: 560, margin: "15vh auto", padding: "0 24px", textAlign: "center" }}>
          <h1 style={{ fontSize: 32, marginBottom: 16 }}>Etwas ist schiefgelaufen.</h1>
          <p style={{ opacity: 0.7, marginBottom: 24 }}>
            Es gab ein unerwartetes Problem. Bitte laden Sie die Seite neu.
          </p>
          {/* Bewusst <a> statt next/link: global-error greift, wenn das Root-Layout
              selbst abstürzt — der Client-Router ist dann ggf. nicht mehr intakt. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" style={{ color: "#4bb3c2" }}>
            Zur Startseite
          </a>
        </div>
      </body>
    </html>
  );
}
