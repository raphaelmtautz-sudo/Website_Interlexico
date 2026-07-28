"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const fieldClasses =
  "w-full border border-line bg-transparent px-4 py-3 font-sans text-sm text-paper placeholder:text-paper-dim focus:border-gold focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: an /api/v1/leads (interlexico-one) anbinden, siehe KONZEPT.md
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="border border-gold-dim p-8">
        <p className="font-display text-2xl text-paper mb-2">Vielen Dank.</p>
        <p className="font-sans text-sm text-paper-dim">
          Wir melden uns in Kürze bei Ihnen.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <input required name="firstName" placeholder="Vorname" className={fieldClasses} />
        <input required name="lastName" placeholder="Nachname" className={fieldClasses} />
      </div>
      <input required type="email" name="email" placeholder="E-Mail" className={fieldClasses} />
      <input name="company" placeholder="Unternehmen" className={fieldClasses} />
      <textarea
        name="message"
        placeholder="Ihre Nachricht"
        rows={5}
        className={fieldClasses}
      />
      <Button type="submit">Nachricht senden</Button>
    </form>
  );
}
