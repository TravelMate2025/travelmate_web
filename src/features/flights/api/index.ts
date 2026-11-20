import type { FlightsApi } from "./contract";
import { liveFlightsApi } from "./liveFlightsApi";

export type { FlightsApi } from "./contract";
export { FlightApiError } from "./errors";

// VITE_FLIGHTS_API_MODE=mock serves recorded Amadeus test data (see
// features/flights/mocks/README.md); anything else calls travelmate_backend.
// The mode is fixed at build time, so a live build drops the mock entirely.
export const flightsApiMode: "mock" | "live" = import.meta.env.VITE_FLIGHTS_API_MODE === "mock" ? "mock" : "live";

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
