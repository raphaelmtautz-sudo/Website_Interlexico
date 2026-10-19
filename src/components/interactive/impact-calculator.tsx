"use client";

import { useState } from "react";

const EUR_PER_UNIT = 2;
const EUR_PER_TREE = 5;
const EUR_PER_MATERIAL = 2;
const MAX_UNITS = 200;

interface ImpactDict {
  eyebrow: string;
  title: string;
  text: string;
  unitsLabel: string;
  donationPrefix: string;
  treesLabel: string;
  treesVia: string;
  materialsLabel: string;
  materialsVia: string;
  disclaimer: string;
}

export function ImpactCalculator({ dict, nabuUrl, dappUrl }: { dict: ImpactDict; nabuUrl: string; dappUrl: string }) {
  const [units, setUnits] = useState(20);
  const donation = units * EUR_PER_UNIT;
  const trees = donation / EUR_PER_TREE;
  const materials = donation / EUR_PER_MATERIAL;

  return (
    <div className="border border-line bg-ink-raised p-8 sm:p-10">
      <p className="font-sans text-xs uppercase tracking-[0.16em] text-success mb-3">{dict.eyebrow}</p>
      <h3 className="font-display text-3xl text-paper mb-4 text-balance">{dict.title}</h3>
      <p className="font-sans text-sm leading-relaxed text-paper-dim mb-8 max-w-xl">{dict.text}</p>

      <div className="mb-10">
        <div className="mb-3 flex items-baseline justify-between">
          <label htmlFor="il-impact-units" className="font-sans text-xs uppercase tracking-[0.12em] text-gold">
            {dict.unitsLabel}
          </label>
          <span className="font-display text-3xl text-paper">{units}</span>
        </div>
        <input
          id="il-impact-units"
          type="range"
          min={1}
          max={MAX_UNITS}
          value={units}
          onChange={(e) => setUnits(Number(e.target.value))}
          aria-label={dict.unitsLabel}
          className="il-range w-full"
        />
        <p className="mt-3 font-sans text-xs text-paper-dim">
          {dict.donationPrefix} {donation.toLocaleString("de-DE")} €
        </p>
      </div>

      <div className="grid gap-px bg-line sm:grid-cols-2">
        <div className="bg-ink-raised p-6">
          <p className="font-display text-4xl text-success">
            {trees.toLocaleString("de-DE", { maximumFractionDigits: 1 })}
          </p>
          <p className="mt-1 font-sans text-sm text-paper">{dict.treesLabel}</p>
          <a
            href={nabuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline mt-3 inline-block font-sans text-xs uppercase tracking-[0.08em] text-success"
          >
            {dict.treesVia} ↗
          </a>
        </div>
        <div className="bg-ink-raised p-6">
          <p className="font-display text-4xl text-brand-strong">
            {materials.toLocaleString("de-DE", { maximumFractionDigits: 1 })}
          </p>
          <p className="mt-1 font-sans text-sm text-paper">{dict.materialsLabel}</p>
          <a
            href={dappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline mt-3 inline-block font-sans text-xs uppercase tracking-[0.08em] text-brand-text"
          >
            {dict.materialsVia} ↗
          </a>
        </div>
      </div>

      <p className="mt-6 font-sans text-xs leading-relaxed text-paper-dim">{dict.disclaimer}</p>
    </div>
  );
}
