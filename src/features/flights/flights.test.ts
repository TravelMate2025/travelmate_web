import { describe, expect, it } from "vitest";
import { flightBookingSteps } from "./bookingSteps";
import { browserCountry, currencyForCountry, formatMoney } from "./currency";
import reducer, { initialFlightsState, searchFlights, selectFlightOffer, setFlightCurrency } from "./slice";
import type { FlightSearchCriteria } from "./types";

describe("currency", () => {
  it("defaults by country", () => {
    expect(currencyForCountry("NG")).toBe("NGN");
    expect(currencyForCountry("gb")).toBe("GBP");
    expect(currencyForCountry("US")).toBe("USD");
    expect(currencyForCountry(null)).toBe("USD");
  });

  it("reads the country from browser languages", () => {
    expect(browserCountry(["en-NG", "en"])).toBe("NG");
    expect(browserCountry(["en", "fr-FR"])).toBe("FR");
    expect(browserCountry(["en"])).toBeNull();
  });

  it("formats amounts with their symbol", () => {
    expect(formatMoney("1299.6", "USD")).toBe("$1,299.60");
    expect(formatMoney("1220935", "NGN")).toBe("₦1,220,935.00");
    expect(formatMoney("622.28", "GBP")).toBe("£622.28");
  });
});

describe("flightBookingSteps", () => {
  it("leaves Extras out until paid bags ship (R2)", () => {
    expect(flightBookingSteps({ extras: false }).map((s) => s.key)).toEqual(["flight", "fare", "travellers", "pay"]);
    expect(flightBookingSteps({ extras: true }).map((s) => s.label)).toEqual(["Flight", "Fare", "Travellers", "Extras", "Pay"]);
  });
});

describe("flights slice", () => {
  const criteria: FlightSearchCriteria = {
    tripType: "ONE_WAY",
    legs: [{ origin: "LOS", destination: "LON", date: "2026-12-15", flexibleDays: 0 }],
    passengers: { adults: 1, children: 0, heldInfants: 0, seatedInfants: 0 },
    cabin: "ECONOMY",
    nonStop: false,
    includeNearbyAirports: false,
    currency: "GBP",
  };

  it("keeps the criteria and drops the booking in progress when a new search starts", () => {
    let state = reducer(initialFlightsState, selectFlightOffer("offer-1"));
    state = reducer(state, setFlightCurrency("GBP"));
    state = reducer(state, searchFlights.pending("req-1", criteria));

    expect(state.criteria).toEqual(criteria);
    expect(state.search.status).toBe("loading");
    expect(state.selectedOfferToken).toBeNull();
    expect(state.currency).toBe("GBP");
  });

  it("stores the error code when a search fails", () => {
    const state = reducer(
      initialFlightsState,
      searchFlights.rejected(null, "req-1", criteria, { code: "NETWORK", message: "offline" })
    );
    expect(state.search).toMatchObject({ status: "failed", error: { code: "NETWORK" } });
  });
});
