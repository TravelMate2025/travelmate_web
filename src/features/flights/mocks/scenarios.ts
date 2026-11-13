// Dev-only switches for the fake flights API. Add `?mock=<scenario>` to any
// URL; it sticks for the browser tab until `?mock=off`.
export const MOCK_SCENARIOS = [
  "no-results", // search returns nothing
  "search-error", // search fails (network)
  "price-up", // price check: the airline raised the price
  "price-down", // price check: the price dropped
  "sold-out", // price check / hold: seats gone at this price
  "offer-expired", // price check: offer too old, search again
  "price-up-at-hold", // holding the seats re-prices the offer higher
  "hold-expired", // the payment window is 45 seconds instead of 15 minutes
  "failed-after-payment", // paid, then the booking fails; full refund starts
  "slow-ticketing", // stays "issuing your ticket"
  "schedule-change", // ticketed, then the airline moves a flight
] as const;

export type MockScenario = (typeof MOCK_SCENARIOS)[number];

const STORAGE_KEY = "tm.flights.mockScenario";

const isScenario = (value: string | null): value is MockScenario =>
  value !== null && (MOCK_SCENARIOS as readonly string[]).includes(value);

export const currentMockScenario = (): MockScenario | null => {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("mock");
    if (fromUrl === "off") {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    if (isScenario(fromUrl)) {
      window.sessionStorage.setItem(STORAGE_KEY, fromUrl);
      return fromUrl;
    }
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return isScenario(stored) ? stored : null;
  } catch {
    return null;
  }
};
