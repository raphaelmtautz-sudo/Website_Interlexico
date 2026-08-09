import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("Startseite lädt und redirected auf /de", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/de$/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("Hauptnavigation führt zu den Kernseiten", async ({ page }) => {
    await page.goto("/de");
    await page.getByRole("link", { name: "Kurse", exact: true }).first().click();
    await expect(page).toHaveURL(/\/de\/kurse$/);

    // "Interlexico ONE" steckt im "Mehr"-Dropdown der Hauptnavigation.
    await page.goto("/de");
    await page.getByRole("button", { name: "Mehr", exact: true }).click();
    await page.getByRole("menuitem", { name: "Interlexico ONE" }).click();
    await expect(page).toHaveURL(/\/de\/interlexico-one$/);

    // Kein eigener "Kontakt"-Nav-Link mehr — der "Anfragen"-Button führt dorthin.
    await page.goto("/de");
    await page.getByRole("link", { name: "Anfragen", exact: true }).first().click();
    await expect(page).toHaveURL(/\/de\/kontakt$/);
  });

  test("Sprachumschaltung wechselt Locale und behält den Pfad bei", async ({ page }) => {
    await page.goto("/de/ueber-uns");
    await page.getByRole("button", { name: "Sprache wählen" }).click();
    await page.getByRole("menuitemradio", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en\/ueber-uns$/);
  });

  test("404-Seite zeigt Vorschläge und Rückweg zur Startseite", async ({ page }) => {
    await page.goto("/de/diese-seite-gibt-es-nicht");
    await expect(page.getByText("Fehler 404")).toBeVisible();
    await page.getByRole("link", { name: "Zur Startseite" }).click();
    await expect(page).toHaveURL(/\/de$/);
  });
});
