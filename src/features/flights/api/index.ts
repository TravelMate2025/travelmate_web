import type { FlightsApi } from "./contract";
import { liveFlightsApi } from "./liveFlightsApi";

export type { FlightsApi } from "./contract";
export { FlightApiError } from "./errors";

// Every built site (Vercel: testing and live) calls travelmate_backend. Sample
// data (recorded Amadeus test responses, features/flights/mocks) is only for the
// local dev server the automated browser tests start (playwright.config.ts sets
// VITE_FLIGHTS_API_MODE=mock); a build ignores the setting and drops the mock.
// 26 Nov 2026: the testing site ran on sample data for days, so real bookings
// never showed there.
export const flightsApiMode: "mock" | "live" =
  import.meta.env.DEV && import.meta.env.VITE_FLIGHTS_API_MODE === "mock" ? "mock" : "live";

let implementation: Promise<FlightsApi> | null = null;
const resolve = () =>
  (implementation ??=
    flightsApiMode === "mock"
      ? import("../mocks/mockFlightsApi").then((module) => module.mockFlightsApi)
      : Promise.resolve(liveFlightsApi));

const withApi = <T,>(call: (api: FlightsApi) => Promise<T>) => resolve().then(call);

export const flightsApi: FlightsApi = {
  searchPlaces: (query) => withApi((a) => a.searchPlaces(query)),
  getPopularRoutes: (countryCode, currency) => withApi((a) => a.getPopularRoutes(countryCode, currency)),
  getClassFares: (countryCode, currency) => withApi((a) => a.getClassFares(countryCode, currency)),
  getCampaign: (countryCode) => withApi((a) => a.getCampaign(countryCode)),
  search: (criteria) => withApi((a) => a.search(criteria)),
  getOffer: (offerToken, currency) => withApi((a) => a.getOffer(offerToken, currency)),
  priceOffer: (offerToken, options) => withApi((a) => a.priceOffer(offerToken, options)),
  getFareOptions: (offerToken, currency) => withApi((a) => a.getFareOptions(offerToken, currency)),
  createBooking: (input) => withApi((a) => a.createBooking(input)),
  startCheckout: (bookingId, currency) => withApi((a) => a.startCheckout(bookingId, currency)),
  listBookings: () => withApi((a) => a.listBookings()),
  getBooking: (bookingId) => withApi((a) => a.getBooking(bookingId)),
  getCancellationPreview: (bookingId) => withApi((a) => a.getCancellationPreview(bookingId)),
  cancelBooking: (bookingId, reason) => withApi((a) => a.cancelBooking(bookingId, reason)),
};
