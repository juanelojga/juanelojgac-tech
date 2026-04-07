import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["iPhone 14"],
        viewport: { width: 375, height: 812 },
      },
    },
    {
      name: "desktop-wide",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "tablet",
      use: {
        ...devices["iPad (gen 7)"],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: "mobile-small",
      use: {
        ...devices["iPhone SE"],
        viewport: { width: 320, height: 568 },
      },
    },
  ],
  webServer: {
    command: "pnpm run dev",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
  },
});
