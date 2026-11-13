import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: "https://127.0.0.1:3100",
    ignoreHTTPSErrors: true,
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 3100",
    url: "https://127.0.0.1:3100",
    ignoreHTTPSErrors: true,
    reuseExistingServer: true,
    // Flights run on the recorded Amadeus data (src/features/flights/mocks)
    env: { VITE_FLIGHTS_API_MODE: "mock", VITE_FLIGHTS_EXTRAS: "on" },
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
