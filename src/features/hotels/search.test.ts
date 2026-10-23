import { describe, expect, it } from "vitest";
import { DEFAULT_SEARCH, buildSearchParams, fromIsoDate, hasPlace, nightsBetween, parseSearch, stayLine, toIsoDate } from "./search";

describe("hotel search in the page address", () => {
  it("round-trips a full search", () => {
    const search = {
      q: "",
      lat: 38.72509,
      lng: -9.1498,
      name: "Lisbon",
      checkIn: "2027-01-10",
      checkOut: "2027-01-13",
      adults: 2,
      rooms: 1,
      childAges: [4, 9],
    };
    const params = buildSearchParams(search);
    expect(params.get("lat")).toBe("38.72509");
    expect(params.get("child_ages")).toBe("4,9");
    expect(parseSearch(new URLSearchParams(params.toString()))).toEqual(search);
  });

  it("uses the typed text when no place was picked", () => {
    const params = buildSearchParams({ ...DEFAULT_SEARCH, q: " Lisbon " });
    expect(params.get("q")).toBe("Lisbon");
    expect(params.has("lat")).toBe(false);
  });

  it("falls back to safe values for bad input", () => {
    const s = parseSearch(new URLSearchParams("lat=999&lng=abc&check_in=2027-01-13&check_out=2027-01-10&adults=0&rooms=99&child_ages=4,x,40"));
    expect(s.lat).toBeNull();
    expect(s.lng).toBeNull();
    expect(s.checkIn).toBe("");
    expect(s.adults).toBe(2);
    expect(s.rooms).toBe(1);
    expect(s.childAges).toEqual([4]);
  });

  it("knows when there is a place to search", () => {
    expect(hasPlace(DEFAULT_SEARCH)).toBe(false);
    expect(hasPlace({ ...DEFAULT_SEARCH, q: "a" })).toBe(false);
    expect(hasPlace({ ...DEFAULT_SEARCH, q: "Lisbon" })).toBe(true);
    expect(hasPlace({ ...DEFAULT_SEARCH, lat: 1, lng: 2 })).toBe(true);
  });

  it("handles dates without time-zone shifts", () => {
    const d = fromIsoDate("2027-03-05");
    expect(d && toIsoDate(d)).toBe("2027-03-05");
    expect(nightsBetween("2027-03-05", "2027-03-08")).toBe(3);
    expect(nightsBetween("", "2027-03-08")).toBe(0);
  });

  it("describes the stay", () => {
    expect(stayLine({ ...DEFAULT_SEARCH, checkIn: "2027-03-05", checkOut: "2027-03-08", childAges: [5] })).toBe("5 Mar – 8 Mar · 3 nights · 2 adults, 1 child, 1 room");
    expect(stayLine(DEFAULT_SEARCH)).toBe("Add your dates for live prices · 2 adults, 1 room");
  });
});
