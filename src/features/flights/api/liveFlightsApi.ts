import api from "../../../api/services/api";
import type { FlightsApi } from "./contract";
import { toFlightApiError } from "./errors";

const BASE = "/v2/flights";

const call = async <T>(request: () => Promise<{ data: T }>): Promise<T> => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    throw toFlightApiError(error);
  }
};

const id = (value: string) => encodeURIComponent(value);

export const liveFlightsApi: FlightsApi = {
  searchPlaces: (query) => call(() => api.get(`${BASE}/places`, { params: { q: query } })),
  getPopularRoutes: (countryCode, currency) =>
    call(() => api.get(`${BASE}/popular-routes`, { params: { country: countryCode ?? undefined, currency } })),
  getClassFares: (countryCode, currency) =>
    call(() => api.get(`${BASE}/class-fares`, { params: { country: countryCode ?? undefined, currency } })),
  getCampaign: (countryCode) => call(() => api.get(`${BASE}/campaign`, { params: { country: countryCode ?? undefined } })),
  search: (criteria) => call(() => api.post(`${BASE}/search`, criteria)),
  getOffer: (offerToken, currency) => call(() => api.get(`${BASE}/offers/${id(offerToken)}`, { params: { currency } })),
  priceOffer: (offerToken, { currency, includeBags }) =>
    call(() => api.post(`${BASE}/offers/${id(offerToken)}/price`, null, { params: { currency, bags: includeBags } })),
  getFareOptions: (offerToken, currency) =>
    call(() => api.post(`${BASE}/offers/${id(offerToken)}/upsell`, null, { params: { currency } })),
  createBooking: (input) => call(() => api.post(`${BASE}/bookings`, input)),
  startCheckout: (bookingId, currency) => call(() => api.post(`${BASE}/bookings/${id(bookingId)}/checkout`, { currency })),
  listBookings: () => call(() => api.get(`${BASE}/bookings`)),
  getBooking: (bookingId) => call(() => api.get(`${BASE}/bookings/${id(bookingId)}`)),
  getCancellationPreview: (bookingId) => call(() => api.get(`${BASE}/bookings/${id(bookingId)}/cancellation-preview`)),
  cancelBooking: (bookingId, reason) => call(() => api.post(`${BASE}/bookings/${id(bookingId)}/cancel`, { reason })),
};
