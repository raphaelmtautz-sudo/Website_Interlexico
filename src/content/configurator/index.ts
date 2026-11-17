import type { Locale } from "@/lib/i18n";
import type { ConfiguratorState, Plan } from "@/lib/configurator-plan";
import type { ConfiguratorContent } from "./types";
import { configurator as de } from "./de";
import { configurator as en } from "./en";
import { configurator as es } from "./es";

export type { ConfiguratorContent };

const byLocale: Record<Locale, ConfiguratorContent> = { de, en, es };

export function getConfiguratorContent(locale: Locale): ConfiguratorContent {
  return byLocale[locale];
}

/**
 * Nachricht für das Kontaktformular aus einer Konfigurator-Auswahl. Eine Stelle
 * für beide Seiten (Konfigurator zeigt, Kontaktformular übernimmt), damit der
 * Vertrieb immer dieselbe Zusammenfassung sieht.
 */
export function configuratorSummaryText(
  locale: Locale,
  s: Partial<ConfiguratorState>,
  plan: Pick<Plan, "units" | "unitsRecommended">,
  formatName: string,
): string {
  const c = byLocale[locale];
  const label = <T extends string>(opts: { value: T; label: string }[], v?: string) =>
    opts.find((o) => o.value === v)?.label;
  const lines = [
    c.prefill.intro,
    `• ${formatName}`,
    s.participants ? `• ${c.prefill.participants}: ${s.participants}` : "",
    s.audience ? `• ${c.prefill.audience}: ${label(c.audiences, s.audience)}` : "",
    s.industry ? `• ${c.prefill.industry}: ${s.industry}` : "",
    s.level ? `• ${c.prefill.level}: ${label(c.levels, s.level)}` : "",
    s.goals?.length ? `• ${c.prefill.goals}: ${s.goals.map((g) => label(c.goals, g)).filter(Boolean).join(", ")}` : "",
    s.delivery ? `• ${c.prefill.delivery}: ${label(c.deliveries, s.delivery)}` : "",
    `• ${c.prefill.scope(plan.units, plan.unitsRecommended)}`,
  ];
  return lines.filter(Boolean).join("\n");
}
