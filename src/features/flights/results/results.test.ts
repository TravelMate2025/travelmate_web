import { describe, expect, it } from "vitest";
import searchesFixture from "../mocks/fixtures/searches.json";
import type { FlightOffer } from "../types";
import {
  NO_FILTERS,
  activeFilterCount,
  bagsLabel,
  dayDifference,
  facetsOf,
  formatDuration,
  layoversOf,
  matchesFilters,
  offerNotes,
  perAdultAmount,
  seatsLabel,
  sortOffers,
  stopsOf,
  totalMinutes,
} from "./offerFacts";

// Real recorded Amadeus test-host offers (Lagos <-> London, 15-28 Dec 2026)
const offers = (searchesFixture as unknown as Record<string, { offers: FlightOffer[] }>).return_los_lon.offers;
const royalAirMaroc = offers.find((o) => o.offerToken === "mock-return_los_lon-1") as FlightOffer;
const ctx = { today: "2026-11-12", fastestToken: null, destinationIsCity: true };

describe("offer facts", () => {
  it("reads the Royal Air Maroc offer the way the mock shows it", () => {
    const [out, back] = royalAirMaroc.itineraries;
    expect(formatDuration(out.durationMinutes)).toBe("12h 15m");
    expect(formatDuration(back.durationMinutes)).toBe("24h 55m");
    expect(stopsOf(out)).toBe(1);
    expect(dayDifference(out.segments[0].from.atLocal, out.segments[1].to.atLocal)).toBe(1);
    expect(perAdultAmount(royalAirMaroc)).toBe("787.70");
    expect(bagsLabel(royalAirMaroc)).toBe("1 checked bag");
  });

  it("finds the overnight stop in Casablanca on the return, not on the outbound night connection", () => {
    const [outStop] = layoversOf(royalAirMaroc.itineraries[0]);
    const [backStop] = layoversOf(royalAirMaroc.itineraries[1]);
    expect(outStop).toMatchObject({ city: "Casablanca", minutes: 245, overnight: false, long: false });
    expect(backStop).toMatchObject({ city: "Casablanca", minutes: 1025, overnight: true, long: true });
  });

  it("writes the mock's notes", () => {
    expect(offerNotes(royalAirMaroc, ctx)).toEqual([
      "Arrive Stansted, return from Gatwick",
      "Overnight stop in Casablanca on return",
    ]);
    const rwandAir = offers.find((o) => o.validatingAirline.code === "WB") as FlightOffer;
    expect(offerNotes(rwandAir, { ...ctx, fastestToken: rwandAir.offerToken })).toEqual([
      "Fastest",
      "Book by Sun 15 Nov: airline ticketing deadline",
    ]);
  });

  it("says 'leave from' between multi-city flights (mock)", () => {
    const multi = (searchesFixture as unknown as Record<string, { offers: FlightOffer[] }>).multicity.offers[0];
    expect(offerNotes(multi, ctx)[0]).toBe("Arrive Heathrow, leave from Stansted");
  });

  it("labels seats like the mock (Amadeus caps the count at 9)", () => {
    expect(seatsLabel(3)).toBe("3 seats left at this price");
    expect(seatsLabel(9)).toBe("9+ seats");
    expect(seatsLabel(null)).toBeNull();
  });
});

describe("sorting", () => {
  it("puts the cheapest and fastest first", () => {
    expect(sortOffers(offers, "CHEAPEST")[0].price.amount).toBe("787.70");
    const fastest = sortOffers(offers, "FASTEST")[0];
    expect(Math.min(...offers.map(totalMinutes))).toBe(totalMinutes(fastest));
    // Across all 60 offers the fastest trip is Royal Air Maroc via Casablanca (the mock showed one offer per airline)
    expect(fastest).toMatchObject({ validatingAirline: { code: "AT" }, price: { amount: "965.70" } });
    expect(formatDuration(totalMinutes(fastest))).toBe("19h 10m");
  });

  it("keeps every offer when sorting", () => {
    expect(sortOffers(offers, "BEST")).toHaveLength(offers.length);
  });
});

describe("filters", () => {
  it("lists airlines cheapest first with their from price", () => {
    const facets = facetsOf(offers);
    expect(facets.airlines.map((a) => a.code)).toEqual(["AT", "TK", "WB", "KQ", "ET", "QR"]);
    expect(facets.airlines[0].from).toBe(787.7);
    expect(facets.stops.find((s) => s.value === 0)?.from).toBeNull();
  });

  it("filters by airline, bags, refundability, departure time and airports", () => {
    const count = (f: Partial<typeof NO_FILTERS>) => offers.filter((o) => matchesFilters(o, { ...NO_FILTERS, ...f })).length;
    expect(count({})).toBe(60);
    expect(count({ excludedAirlines: ["AT"] })).toBe(25);
    expect(count({ twoBags: true })).toBe(16);
    expect(count({ refundable: true })).toBe(1);
    expect(count({ freeChanges: true })).toBe(0);
    expect(count({ stops: [0] })).toBe(0);
    expect(count({ departureTimes: ["EVENING"] })).toBeGreaterThan(0);
    expect(count({ sameAirportBothWays: true })).toBeLessThan(60);
    expect(activeFilterCount({ ...NO_FILTERS, twoBags: true, excludedAirlines: ["AT", "TK"] })).toBe(2);
  });
});
