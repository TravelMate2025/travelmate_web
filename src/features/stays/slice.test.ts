import { describe, expect, it } from "vitest";
import reducer, { clearSearchState, setGuestInfo, setSearchParams } from "./slice";

describe("staysSlice", () => {
  it("resets booking and search state", () => {
    const populatedState = reducer(
      reducer(
        undefined,
        setSearchParams({
          destination: "Lagos",
          checkIn: "2026-07-01",
          checkOut: "2026-07-05",
          adults: 2,
          children: 1,
          rooms: 1,
        })
      ),
      setGuestInfo({
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.com",
        phone: "+2340000000000",
        dateOfBirth: "1815-12-10",
        countryCode: "NG",
      })
    );

    const state = reducer(populatedState, clearSearchState());

    expect(state.hotels).toEqual([]);
    expect(state.searchParams).toBeNull();
    expect(state.locationDetails).toBeNull();
    expect(state.selectedHotel).toBeNull();
    expect(state.detailsLoading).toBe(false);
    expect(state.detailsError).toBeNull();
    expect(state.guestInfo).toBeNull();
    expect(state.booking).toEqual({
      loading: false,
      error: null,
      booking: null,
    });
  });
});
