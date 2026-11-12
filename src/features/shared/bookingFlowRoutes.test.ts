import { describe, expect, it } from "vitest";
import {
  bookingFlowRoutes,
  flightBookingManagePath,
  flightBookingStatusPath,
  flightResultsPath,
  flightStepPath,
  stayDetailPath,
  stayDownloadPath,
  stayResultsPath,
  transferResultsPath,
  withQuery,
} from "./bookingFlowRoutes";

describe("bookingFlowRoutes", () => {
  it("keeps the paths payment providers redirect back to", () => {
    expect(bookingFlowRoutes.transferPaymentSuccess).toBe("/transfers/payment-success");
    expect(bookingFlowRoutes.transferPaymentFailure).toBe("/transfers/payment-failure");
    expect(bookingFlowRoutes.flightPaymentReturn).toBe("/flights/payment-return");
    expect(bookingFlowRoutes.stayConfirmation).toBe("/booking-confirmation");
  });

  it("encodes query values and leaves out missing ones", () => {
    expect(withQuery("/x", { from: "Lagos & Abuja", to: undefined, seats: 2, ok: false, gone: null })).toBe(
      "/x?from=Lagos+%26+Abuja&seats=2&ok=false"
    );
    expect(withQuery("/x", {})).toBe("/x");
  });

  it("builds stay paths", () => {
    expect(stayDetailPath("ABC 1", { stay: "Eko Hotel" })).toBe("/stay-details/ABC%201?stay=Eko+Hotel");
    expect(stayDetailPath(42)).toBe("/stay-details/42");
    expect(stayResultsPath({ location: "LOS", adults: 2 })).toBe("/stay-results?location=LOS&adults=2");
  });

  it("builds transfer search paths", () => {
    expect(transferResultsPath({ ride: "Transfer", from: "LOS Airport" })).toBe(
      "/cars-searchResults?ride=Transfer&from=LOS+Airport"
    );
  });

  it("builds flight paths", () => {
    expect(flightResultsPath({ trip: "RETURN", legs: "LOS-LON-2026-12-15" })).toBe(
      "/flights/results?trip=RETURN&legs=LOS-LON-2026-12-15"
    );
    expect(flightStepPath("flightFare", "mock-return/1 2")).toBe("/flights/fare?offer=mock-return%2F1+2");
    expect(flightBookingStatusPath("bk/7")).toBe("/flights/bookings/bk%2F7/status");
    expect(flightBookingManagePath("bk-7")).toBe("/flights/bookings/bk-7");
  });

  it("round-trips the booking through the download page's data param", () => {
    const booking = { id: 7, guest: "Ada & co" };
    const url = new URL(stayDownloadPath(booking), "https://example.com");

    expect(url.pathname).toBe("/stays-paid/download");
    expect(JSON.parse(url.searchParams.get("data") ?? "")).toEqual(booking);
  });
});
