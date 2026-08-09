import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: process.env.CI ? 1 : 2,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  reporter: "html",
  timeout: 45_000,
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3105",
    trace: "on-first-retry",
    navigationTimeout: 20_000,
    actionTimeout: 15_000,
    // Locale-Proxy (src/proxy.ts) leitet nach Accept-Language um — Tests
    // gehen vom primären Markt (DE) aus, sonst würden Chromiums Default-
    // Locale-Header ungewollt auf /en umleiten.
    locale: "de-DE",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run dev -- -p 3105",
        url: "http://localhost:3105",
        reuseExistingServer: false,
        timeout: 30_000,
      },
});
