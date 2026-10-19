import { test, expect } from "@playwright/test";

test("Kontaktformular: zweistufiges Ausfüllen und erfolgreiches Absenden", async ({ page }) => {
  await page.goto("/de/kontakt");

  await page.getByLabel("Vorname").fill("Max");
  await page.getByLabel("Nachname").fill("Mustermann");
  await page.getByLabel("E-Mail").fill("max.mustermann@example.com");

  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByRole("checkbox", { name: /Datenschutzerklärung/ }).check();
  await page.getByRole("button", { name: "Unverbindlich anfragen" }).click();

  await expect(page.getByText("Anfrage eingegangen.")).toBeVisible({ timeout: 15_000 });
});

test("Kontaktformular: 'Weiter' bleibt inaktiv solange Pflichtfelder fehlen", async ({ page }) => {
  await page.goto("/de/kontakt");
  await page.getByLabel("Vorname").fill("Max");

  await expect(page.getByRole("button", { name: "Weiter" })).toHaveClass(/pointer-events-none/);
  await expect(page.getByLabel("Nachname")).toBeVisible();
});
