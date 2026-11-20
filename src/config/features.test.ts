import { afterEach, describe, expect, it, vi } from "vitest";

const load = async (env: Record<string, string>) => {
  vi.resetModules();
  Object.entries(env).forEach(([key, value]) => vi.stubEnv(key, value));
  return import("./features");
};

describe("product switches", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("a build with nothing set is the hotels-only site", async () => {
    const f = await load({ VITE_FEATURE_STAYS: "", VITE_FEATURE_TRANSFERS: "", VITE_FEATURE_FLIGHTS: "", VITE_FEATURE_APP_PROMO: "" });
    expect(f.FEATURES).toEqual({ stays: false, transfers: false, flights: false, appPromo: false });
    expect(f.HOTELS_ONLY).toBe(true);
    expect(f.HAS_TRAVELMATE_BOOKINGS).toBe(false);
  });

  it("only the exact word 'on' turns a product on", async () => {
    const f = await load({ VITE_FEATURE_STAYS: "true", VITE_FEATURE_TRANSFERS: "ON", VITE_FEATURE_FLIGHTS: "on", VITE_FEATURE_APP_PROMO: "1" });
    expect(f.FEATURES).toEqual({ stays: false, transfers: false, flights: true, appPromo: false });
    expect(f.HOTELS_ONLY).toBe(false);
    expect(f.HAS_TRAVELMATE_BOOKINGS).toBe(true);
  });
});
