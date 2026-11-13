import type {
  Campaign,
  CancellationPreview,
  ClassFares,
  CheckoutSession,
  CreateBookingInput,
  CurrencyCode,
  FareOption,
  FlightBooking,
  FlightOffer,
  FlightSearchCriteria,
  FlightSearchResult,
  Place,
  PopularRoute,
  PriceCheckResult,
} from "../types";

// Everything the flight UI can ask the server. The live implementation calls
// travelmate_backend /api/v2/flights/* (flights_plan.md §C9); the mock one
// serves recorded Amadeus test-host data. Both throw FlightApiError.
export interface FlightsApi {
  searchPlaces(query: string): Promise<Place[]>;
  getPopularRoutes(countryCode: string | null, currency: CurrencyCode): Promise<PopularRoute[]>;
  getClassFares(countryCode: string | null, currency: CurrencyCode): Promise<ClassFares | null>;
  getCampaign(countryCode: string | null): Promise<Campaign | null>;
  search(criteria: FlightSearchCriteria): Promise<FlightSearchResult>;
  getOffer(offerToken: string, currency: CurrencyCode): Promise<FlightOffer>;
  priceOffer(offerToken: string, options: { currency: CurrencyCode; includeBags: boolean }): Promise<PriceCheckResult>;
  getFareOptions(offerToken: string, currency: CurrencyCode): Promise<FareOption[]>;
  createBooking(input: CreateBookingInput): Promise<FlightBooking>;
  startCheckout(bookingId: string, currency: CurrencyCode): Promise<CheckoutSession>;
  listBookings(): Promise<FlightBooking[]>;
  getBooking(bookingId: string): Promise<FlightBooking>;
  getCancellationPreview(bookingId: string): Promise<CancellationPreview>;
  cancelBooking(bookingId: string, reason: string | null): Promise<FlightBooking>;
}
