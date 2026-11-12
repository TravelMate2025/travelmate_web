import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CreateBookingInput, FlightSearchCriteria } from "../types";
import { mockFlightsApi as api } from "./mockFlightsApi";
import { DEV_ONLY_RATES_FROM_USD, shiftLocal } from "./transform";

const returnLondon = (overrides: Partial<FlightSearchCriteria> = {}): FlightSearchCriteria => ({
  tripType: "RETURN",
  legs: [
    { origin: "LOS", destination: "LON", date: "2026-12-15", flexibleDays: 0 },
    { origin: "LON", destination: "LOS", date: "2026-12-28", flexibleDays: 0 },
  ],
  passengers: { adults: 1, children: 0, heldInfants: 0, seatedInfants: 0 },
  cabin: "ECONOMY",
  nonStop: false,
  includeNearbyAirports: false,
  currency: "USD",
  ...overrides,
});

// Runs a mock call to completion: its simulated network delay uses timers.
// The outcome is captured before timers run, so an expected rejection is never "unhandled".
const settle = async <T,>(promise: Promise<T>) => {
  const outcome = promise.then(
    (value) => ({ ok: true as const, value }),
    (error: unknown) => ({ ok: false as const, error })
  );
  await vi.runAllTimersAsync();
  const result = await outcome;
  if (!result.ok) throw result.error;
  return result.value;
};

const setScenario = (scenario: string | null) => {
  window.history.replaceState({}, "", scenario ? `/?mock=${scenario}` : "/?mock=off");
};

const bookingInput = (offerToken: string): CreateBookingInput => ({
  offerToken,
  travelers: [
    {
      travelerId: "1",
      type: "ADULT",
      firstName: "Adaeze",
      lastName: "Okafor",
      gender: "FEMALE",
      dateOfBirth: null,
      associatedAdultId: null,
      passport: null,
      frequentFlyer: null,
    },
  ],
  contact: { email: "adaeze@example.com", phoneCountryCode: "+234", phoneNumber: "8012345678" },
  bagOptionIds: [],
  currency: "USD",
});

describe("mockFlightsApi", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-12T10:00:00Z"));
    window.sessionStorage.clear();
    setScenario(null);
  });

  afterEach(() => {
    setScenario(null);
    vi.useRealTimers();
  });

  it("returns the recorded Lagos-London results, cheapest first offer at $787.70", async () => {
    const result = await settle(api.search(returnLondon()));

    expect(result.offers).toHaveLength(60);
    const prices = result.offers.map((o) => Number(o.price.amount));
    expect(Math.min(...prices)).toBe(787.7);
    const first = result.offers[0];
    expect(first.validatingAirline.name).toBe("Royal Air Maroc");
    expect(first.itineraries[0].segments[0].from).toMatchObject({ iata: "LOS", atLocal: "2026-12-15T19:05:00" });
  });

  it("moves offers to the searched dates", async () => {
    const result = await settle(
      api.search(
        returnLondon({
          legs: [
            { origin: "LOS", destination: "LON", date: "2026-12-18", flexibleDays: 0 },
            { origin: "LON", destination: "LOS", date: "2026-12-30", flexibleDays: 0 },
          ],
        })
      )
    );
    const offer = result.offers[0];
    expect(offer.itineraries[0].segments[0].from.atLocal).toBe("2026-12-18T19:05:00");
    expect(offer.itineraries[1].segments[0].from.atLocal).toBe("2026-12-30T16:10:00");
  });

  it("narrows a city search to one airport", async () => {
    const result = await settle(
      api.search(
        returnLondon({
          legs: [
            { origin: "LOS", destination: "LHR", date: "2026-12-15", flexibleDays: 0 },
            { origin: "LON", destination: "LOS", date: "2026-12-28", flexibleDays: 0 },
          ],
        })
      )
    );
    expect(result.offers.length).toBeGreaterThan(0);
    result.offers.forEach((o) => {
      const segments = o.itineraries[0].segments;
      expect(segments[segments.length - 1].to.iata).toBe("LHR");
    });
  });

  it("converts prices to the selling currency", async () => {
    const result = await settle(api.search(returnLondon({ currency: "NGN" })));
    const cheapest = result.offers.find((o) => o.offerToken === "mock-return_los_lon-1");
    expect(cheapest?.price).toMatchObject({ currency: "NGN", amount: (787.7 * DEV_ONLY_RATES_FROM_USD.NGN).toFixed(2) });
  });

  it("returns nothing for routes, cabins or scenarios without a recording", async () => {
    const domestic = await settle(
      api.search(returnLondon({ tripType: "ONE_WAY", legs: [{ origin: "ABV", destination: "PHC", date: "2026-12-15", flexibleDays: 0 }] }))
    );
    expect(domestic.offers).toEqual([]);
    expect((await settle(api.search(returnLondon({ cabin: "BUSINESS" })))).offers).toEqual([]);

    setScenario("no-results");
    expect((await settle(api.search(returnLondon()))).offers).toEqual([]);
  });

  it("prices the recorded offer with bags, fare rules and requirements", async () => {
    await settle(api.search(returnLondon()));
    const priced = await settle(api.priceOffer("mock-return_los_lon-1", { currency: "USD", includeBags: true }));

    expect(priced.priceChange).toBeNull();
    expect(priced.requirements).toMatchObject({ emailRequired: true, mobileRequired: true });
    expect(priced.requirements.travelers).toHaveLength(1);
    expect(priced.bagOptions.map((b) => b.price.amount)).toEqual(["210.00", "530.00", "235.20", "593.60"]);
    expect(priced.fareRules.map((r) => r.category)).toEqual(["CHANGES", "REFUNDS"]);
  });

  it("reports a price rise in the price-up scenario", async () => {
    await settle(api.search(returnLondon()));
    setScenario("price-up");
    const priced = await settle(api.priceOffer("mock-return_los_lon-1", { currency: "USD", includeBags: false }));
    expect(priced.priceChange).toMatchObject({ direction: "UP", previous: { amount: "787.70" } });
    expect(Number(priced.offer.price.amount)).toBeGreaterThan(787.7);
  });

  it("returns whole-trip fare families for the recorded offer", async () => {
    await settle(api.search(returnLondon()));
    const options = await settle(api.getFareOptions("mock-return_los_lon-1", "USD"));
    expect(options.map((o) => [o.brandName, o.price.amount, o.priceDifference])).toEqual([
      ["Eco Essential", "787.70", "0.00"],
      ["Eco Classic", "840.20", "52.50"],
      ["Eco Flex", "945.20", "157.50"],
    ]);
  });

  it("rejects an offer that was never searched", async () => {
    await expect(settle(api.priceOffer("unknown", { currency: "USD", includeBags: false }))).rejects.toMatchObject({
      code: "OFFER_EXPIRED",
    });
  });

  it("holds, takes payment, then tickets over time", async () => {
    await settle(api.search(returnLondon()));
    const held = await settle(api.createBooking(bookingInput("mock-return_los_lon-1")));
    expect(held).toMatchObject({ status: "HELD", total: { amount: "787.70", currency: "USD" } });
    expect(held.pnr).toMatch(/^[A-Z0-9]{6}$/);

    const checkout = await settle(api.startCheckout(held.id, "USD"));
    expect(checkout.checkoutUrl).toContain("/flights/payment-return?status=successful");
    expect((await settle(api.getBooking(held.id))).status).toBe("PAID");

    vi.advanceTimersByTime(5_000);
    expect((await settle(api.getBooking(held.id))).status).toBe("TICKETING");

    vi.advanceTimersByTime(10_000);
    const ticketed = await settle(api.getBooking(held.id));
    expect(ticketed.status).toBe("TICKETED");
    expect(ticketed.travelers[0].ticketNumber).toMatch(/^147-\d{10}$/);
  });

  it("releases an unpaid hold when the payment window ends", async () => {
    setScenario("hold-expired");
    await settle(api.search(returnLondon()));
    const held = await settle(api.createBooking(bookingInput("mock-return_los_lon-1")));

    vi.advanceTimersByTime(46_000);
    expect((await settle(api.getBooking(held.id))).status).toBe("HOLD_EXPIRED");
    await expect(settle(api.startCheckout(held.id, "USD"))).rejects.toMatchObject({ code: "HOLD_EXPIRED" });
  });

  it("refunds in full when the booking fails after payment", async () => {
    setScenario("failed-after-payment");
    await settle(api.search(returnLondon()));
    const held = await settle(api.createBooking(bookingInput("mock-return_los_lon-1")));
    await settle(api.startCheckout(held.id, "USD"));

    vi.advanceTimersByTime(5_000);
    const failed = await settle(api.getBooking(held.id));
    expect(failed).toMatchObject({ status: "FAILED", failure: { stage: "AFTER_PAYMENT" }, refund: { status: "PROCESSING" } });
  });

  it("cancels before ticketing for a full refund", async () => {
    await settle(api.search(returnLondon()));
    const held = await settle(api.createBooking(bookingInput("mock-return_los_lon-1")));
    await settle(api.startCheckout(held.id, "USD"));

    const preview = await settle(api.getCancellationPreview(held.id));
    expect(preview).toMatchObject({ kind: "FULL_REFUND", refund: { amount: "787.70" } });
    const cancelled = await settle(api.cancelBooking(held.id, "Change of plans"));
    expect(cancelled).toMatchObject({ status: "CANCELLED", refund: { status: "PROCESSING" } });
  });
});

describe("shiftLocal", () => {
  it("shifts dates and date-times across month ends", () => {
    expect(shiftLocal("2026-12-30T23:10:00", 3)).toBe("2027-01-02T23:10:00");
    expect(shiftLocal("2026-12-15", -15)).toBe("2026-11-30");
  });
});
