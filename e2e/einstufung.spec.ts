import { test, expect } from "@playwright/test";

test("Einstufungstest: Startseite lädt und erste Frage ist erreichbar", async ({ page }) => {
  await page.goto("/de/einstufung");
  await expect(page.locator("h1")).toBeVisible();

  await page.getByRole("button", { name: "Englisch", exact: true }).click();

  await expect(page.getByRole("radiogroup")).toBeVisible();
});
