import { test, expect } from "@playwright/test";

test.describe("Testimonial-Karussell", () => {
  test("wechselt beim Klick auf einen Dot zum entsprechenden Testimonial", async ({ page }) => {
    await page.goto("/de");
    const tabs = page.getByRole("tab");
    await expect(tabs.first()).toBeVisible();
    const count = await tabs.count();
    expect(count).toBeGreaterThan(1);

    await tabs.nth(2).click();
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "false");
  });
});

test.describe("Impact-Rechner", () => {
  test("Slider aktualisiert Spendenbetrag, Bäume und Materialsets live", async ({ page }) => {
    await page.goto("/de/nachhaltigkeit");
    const slider = page.locator("#il-impact-units");
    await expect(slider).toBeVisible();

    await slider.evaluate((el: HTMLInputElement) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")!.set!;
      setter.call(el, "50");
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });

    await expect(page.getByText("entspricht 100 €")).toBeVisible();
    // 100 € / 5 € pro Baum = 20 Bäume; 100 € / 2 € pro Set = 50 Sets
    await expect(page.locator("p.text-success", { hasText: "20" })).toBeVisible();
    await expect(page.locator("p.text-brand-strong", { hasText: "50" })).toBeVisible();
  });

  test("Links zu NABU und DAPP Namibia sind korrekt gesetzt", async ({ page }) => {
    await page.goto("/de/nachhaltigkeit");
    await expect(page.getByRole("link", { name: /nabu\.de/i }).first()).toHaveAttribute(
      "href",
      "https://www.nabu.de/",
    );
    await expect(page.getByRole("link", { name: /dapp-namibia\.org/i }).first()).toHaveAttribute(
      "href",
      "https://dapp-namibia.org/",
    );
  });
});
