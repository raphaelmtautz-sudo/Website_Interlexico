import { test, expect } from "@playwright/test";

test("Kontaktformular: zweistufiges Ausfüllen und erfolgreiches Absenden", async ({ page }) => {
  await page.goto("/de/kontakt");

  await page.getByLabel("Vorname").fill("Max");
  await page.getByLabel("Nachname").fill("Mustermann");
  await page.getByLabel("E-Mail").fill("max.mustermann@example.com");

  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByRole("button", { name: "Unverbindlich anfragen" }).click();

  await expect(page.getByText("Anfrage eingegangen.")).toBeVisible({ timeout: 15_000 });
});

test("Kontaktformular: 'Weiter' zeigt Fehler solange Pflichtfelder fehlen", async ({ page }) => {
  await page.goto("/de/kontakt");
  await page.getByLabel("Vorname").fill("Max");

  await page.getByRole("button", { name: "Weiter" }).click();
  await expect(page.getByRole("alert").first()).toBeVisible();
  // Bleibt auf Schritt 1.
  await expect(page.getByRole("button", { name: "Unverbindlich anfragen" })).toHaveCount(0);
});
