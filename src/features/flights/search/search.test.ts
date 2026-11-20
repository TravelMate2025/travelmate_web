import { beforeEach, describe, expect, it } from "vitest";
import type { Place } from "../types";
import { criteriaFromQuery, criteriaToQuery } from "./criteriaUrl";
import { loadRecentSearches, routeTitle, saveRecentSearch } from "./recentSearches";
import {
  fromCriteria,
  initialDraft,
  passengersSummary,
  stepPassengers,
  toCriteria,
  withTripType,
  type SearchDraft,
} from "./searchDraft";
import { validateSearch } from "./validateSearch";

const place = (code: string, city: string, cityCode = code): Place => ({
  code,
  type: "AIRPORT",
  name: city,
  city,
  cityCode,
  country: "",
  countryCode: "",
});
const LOS = place("LOS", "Lagos");
const LON: Place = { ...place("LON", "London"), type: "CITY" };
const LHR = place("LHR", "London", "LON");
const DXB = place("DXB", "Dubai");
const places: Record<string, Place> = { LOS, LON, LHR, DXB };

const TODAY = "2026-11-12";

const returnDraft = (overrides: Partial<SearchDraft> = {}): SearchDraft => ({
  ...initialDraft(),
  legs: [{ origin: LOS, destination: LON, date: "2026-12-15", flexibleDays: 0 }],
  returnDate: "2026-12-28",
  ...overrides,
});

describe("validateSearch", () => {
  it("accepts a complete return search", () => {
    expect(validateSearch(returnDraft(), TODAY)).toEqual({});
  });

  it("asks for every missing field", () => {
    expect(validateSearch(initialDraft(), TODAY)).toEqual({
      "leg0.origin": "Choose where you're flying from",
      "leg0.destination": "Choose where you're flying to",
      "leg0.date": "Choose a date",
      returnDate: "Choose a return date",
    });
  });

  it("blocks same-city trips, past dates and returns before departure", () => {
    const errors = validateSearch(
      returnDraft({ legs: [{ origin: LON, destination: LHR, date: "2026-11-01", flexibleDays: 0 }], returnDate: "2026-10-30" }),
      TODAY
    );
    expect(errors["leg0.destination"]).toBe("From and To can't be the same city");
    expect(errors["leg0.date"]).toBe("This date has passed");
    expect(errors.returnDate).toBe("Return can't be before departure");
  });

  it("keeps multi-city flights in date order", () => {
    const draft: SearchDraft = {
      ...returnDraft(),
      tripType: "MULTI_CITY",
      returnDate: null,
      legs: [
        { origin: LOS, destination: LON, date: "2026-12-15", flexibleDays: 0 },
        { origin: LON, destination: DXB, date: "2026-12-10", flexibleDays: 0 },
      ],
    };
    expect(validateSearch(draft, TODAY)).toEqual({ "leg1.date": "Can't be before the previous flight" });
  });

  it("checks passenger rules", () => {
    const tooMany = returnDraft({ passengers: { adults: 6, children: 3, heldInfants: 0, seatedInfants: 1 } });
    expect(validateSearch(tooMany, TODAY).passengers).toBe("Up to 9 travellers with a seat per booking");
    const laps = returnDraft({ passengers: { adults: 1, children: 0, heldInfants: 2, seatedInfants: 0 } });
    expect(validateSearch(laps, TODAY).passengers).toBe("Each infant on a lap needs their own adult");
  });
});

describe("passengers", () => {
  const base = { adults: 1, children: 0, heldInfants: 0, seatedInfants: 0 };

  it("never lets lap infants outnumber adults", () => {
    const withInfant = stepPassengers(base, "heldInfants", 1);
    expect(withInfant.heldInfants).toBe(1);
    expect(stepPassengers(withInfant, "heldInfants", 1).heldInfants).toBe(1);
    const twoAdults = stepPassengers({ ...base, adults: 2, heldInfants: 2 }, "adults", -1);
    expect(twoAdults).toEqual({ ...base, adults: 1, heldInfants: 1 });
  });

  it("caps seated travellers at 9 and adults at 1 minimum", () => {
    expect(stepPassengers({ ...base, adults: 9 }, "children", 1).children).toBe(0);
    expect(stepPassengers({ ...base, adults: 8 }, "seatedInfants", 1).seatedInfants).toBe(1);
    expect(stepPassengers(base, "adults", -1).adults).toBe(1);
  });

  it("summarises", () => {
    expect(passengersSummary(base)).toBe("1 adult");
    expect(passengersSummary({ ...base, adults: 2 })).toBe("2 adults");
    expect(passengersSummary({ adults: 2, children: 1, heldInfants: 1, seatedInfants: 0 })).toBe("4 travellers");
  });
});

describe("draft <-> criteria <-> URL", () => {
  it("expands a return trip into two legs and back", () => {
    const criteria = toCriteria(returnDraft(), "NGN");
    expect(criteria.legs).toEqual([
      { origin: "LOS", destination: "LON", date: "2026-12-15", flexibleDays: 0 },
      { origin: "LON", destination: "LOS", date: "2026-12-28", flexibleDays: 0 },
    ]);
    expect(fromCriteria(criteria, (code) => places[code] ?? null)).toEqual(returnDraft());
  });

  it("round-trips through the URL", () => {
    const criteria = toCriteria(
      returnDraft({ passengers: { adults: 2, children: 1, heldInfants: 1, seatedInfants: 0 }, nonStop: true }),
      "GBP"
    );
    const query = new URLSearchParams(
      Object.entries(criteriaToQuery(criteria)).filter((e): e is [string, string | number] => e[1] !== undefined).map(([k, v]) => [k, String(v)])
    );
    expect(query.get("legs")).toBe("LOS.LON.2026-12-15_LON.LOS.2026-12-28");
    expect(criteriaFromQuery(query, "USD")).toEqual(criteria);
  });

  it("rejects broken URLs and falls back to the default currency", () => {
    expect(criteriaFromQuery(new URLSearchParams("trip=RETURN&legs=LOS.LON.2026-12-15"), "USD")).toBeNull();
    expect(criteriaFromQuery(new URLSearchParams("trip=ONE_WAY&legs=LOS.LON.15-12-2026"), "USD")).toBeNull();
    expect(criteriaFromQuery(new URLSearchParams("trip=ONE_WAY&legs=LOS.LON.2026-12-15&adults=0"), "USD")).toBeNull();
    expect(criteriaFromQuery(new URLSearchParams("trip=ONE_WAY&legs=los.lon.2026-12-15&currency=EUR"), "NGN")).toMatchObject({
      legs: [{ origin: "LOS", destination: "LON" }],
      currency: "NGN",
    });
  });

  it("keeps typed places when switching trip type", () => {
    const multi = withTripType(returnDraft(), "MULTI_CITY");
    expect(multi.legs).toHaveLength(2);
    expect(multi.legs[1]).toEqual({ origin: LON, destination: null, date: "2026-12-28", flexibleDays: 0 });
    const oneWay = withTripType(multi, "ONE_WAY");
    expect(oneWay.legs).toEqual([{ origin: LOS, destination: LON, date: "2026-12-15", flexibleDays: 0 }]);
    expect(oneWay.returnDate).toBeNull();
  });
});

describe("recent searches", () => {
  beforeEach(() => window.localStorage.clear());

  it("keeps the latest five, newest first, without duplicates", () => {
    const criteria = toCriteria(returnDraft(), "USD");
    saveRecentSearch(criteria, [LOS, LON]);
    for (let day = 16; day <= 21; day += 1) {
      saveRecentSearch({ ...criteria, legs: [{ ...criteria.legs[0], date: `2026-12-${day}`, flexibleDays: 0 }, criteria.legs[1]] }, [LOS, LON]);
    }
    saveRecentSearch({ ...criteria, legs: [{ ...criteria.legs[0], date: "2026-12-21", flexibleDays: 0 }, criteria.legs[1]] }, [LOS, LON]);
    const recent = loadRecentSearches();
    expect(recent).toHaveLength(5);
    expect(recent[0].criteria.legs[0].date).toBe("2026-12-21");
    expect(routeTitle(recent[0].criteria, recent[0].places)).toBe("Lagos ⇄ London");
  });
});
