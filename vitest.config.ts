import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: false,
    exclude: ["**/node_modules/**", "**/e2e/**"],
    // Tests cover every product; the hotels-only production build is checked in src/config/features.test.ts
    env: { VITE_FEATURE_STAYS: "on", VITE_FEATURE_TRANSFERS: "on", VITE_FEATURE_FLIGHTS: "on", VITE_FEATURE_APP_PROMO: "on" },
  },
});
