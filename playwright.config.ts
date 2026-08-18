import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Serve the dev app so no build step is required. Dummy Pixabay credentials
  // keep `getRequiredEnvVar` from throwing at runtime; the scan only exercises
  // static UI, so a real API key is unnecessary.
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_PIXABAY_BASE_URL: "https://pixabay.com/api/",
      VITE_PIXABAY_API_KEY: "a11y-scan",
    },
  },
});
