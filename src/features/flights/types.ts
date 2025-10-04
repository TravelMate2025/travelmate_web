// types/flights.ts

export type TripType = "ONE_WAY" | "ROUND_TRIP" | "MULTI_CITY";

// ---------- Request Types ----------
export interface OneWayFlightRequest {
  tripType: "ONE_WAY";
  origin: string;
  destination: string;
  departure_date: string;
  adults: number;
  children: number;
  infants: number;
  travel_class: string;
  non_stop: boolean;
  currency: string;
}

export interface RoundTripFlightRequest {
  tripType: "ROUND_TRIP";
  origin: string;
  destination: string;
  departure_date: string;
  return_date: string;
  adults: number;
  children: number;
  infants: number;
  travel_class: string;
  non_stop: boolean;
  currency: string;
}

export interface MultiCitySegment {
  origin: string;
  destination: string;
  departure_date: string;
}

export interface MultiCityFlightRequest {
  tripType: "MULTI_CITY";
  segments: MultiCitySegment[];
  adults: number;
  children: number;
  infants: number;
  travel_class: string;
  currency: string;
}

// Union type for all requests
export type FlightSearchRequest =
  | OneWayFlightRequest
  | RoundTripFlightRequest
  | MultiCityFlightRequest;

// ---------- Response Types ----------
export interface FlightData {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: string;
  price: string;
  pricingOptions: string;
  validatingAirlineCodes: string[];
  travelerPricings: string;
}

export interface FlightSearchResponse {
  data: FlightOffer[];
  dictionaries: string;
  meta: string;
}




export interface FlightOffer {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  isUpsellOffer: boolean;
  lastTicketingDate: string; // YYYY-MM-DD
  lastTicketingDateTime: string; // ISO string
  numberOfBookableSeats: number;
  itineraries: Itinerary[];
  price: Price;
  pricingOptions: PricingOptions;
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}
export interface Airport {
  id: string | null;
  name: string;
  iataCode: string | null;
  cityName: string;
  countryCode: string;
  countryName: string | null;
  geoCode: GeoCode;
  displayName: string;
  type: "AIRPORT" | "CITY";
  priority: number;
}

export interface GeoCode {
  latitude: number;
  longitude: number;
}
export interface Itinerary {
  duration: string; // ISO 8601 duration, e.g. "PT4H15M"
  segments: Segment[];
}

export interface Segment {
  departure: AirportEvent;
  arrival: AirportEvent;
  carrierCode: string;
  number: string;
  aircraft: Aircraft;
  operating: OperatingCarrier;
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
  airline: Airline;
}

export interface AirportEvent {
  iataCode: string;
  at: string; // ISO datetime
  terminal?: string;
}

export interface Aircraft {
  code: string;
}

export interface OperatingCarrier {
  carrierCode: string;
  airline: Airline;
}

export interface Airline {
  code: string;
  name: string;
}

export interface Price {
  currency: string;
  total: string;
  base: string;
  fees: Fee[];
  grandTotal: string;
  totalWithFee: number;
}

export interface Fee {
  amount: string;
  type: string;
}

export interface PricingOptions {
  fareType: string[];
  includedCheckedBagsOnly: boolean;
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: TravelerPrice;
  fareDetailsBySegment: FareDetails[];
}

export interface TravelerPrice {
  currency: string;
  total: string;
  base: string;
}

export interface FareDetails {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  brandedFare: string;
  brandedFareLabel: string;
  class: string;
  includedCheckedBags: BagAllowance;
  includedCabinBags: BagAllowance;
  amenities: Amenity[];
}

export interface BagAllowance {
  quantity: number;
}

export interface Amenity {
  description: string;
  isChargeable: boolean;
  amenityType: string;
  amenityProvider: AmenityProvider;
}

export interface AmenityProvider {
  name: string;
}


export interface UpsellFlightOfferResponse {
  data: FlightUpsellOfferResponse[];
  dictionaries: string; // If later it becomes an object, adjust here
  meta: string; // Same as above
}

export interface UpsellFlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string; // ISO date string
  numberOfBookableSeats: number;
  itineraries: string; // Might be object[] in real API (check later)
  price: string; // Usually an object, but schema shows string
  pricingOptions: string; // Same note as above
  validatingAirlineCodes: string[];
  travelerPricings: string; // Usually array of objects in real API
}


// src/redux/types/booking.ts

export type BookingType = "ONE_WAY" | "ROUND_TRIP" | "MULTI_CITY";

export interface Passenger {
  title: string;              // e.g. "MR", "MRS", "MS"
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;      // ISO format "YYYY-MM-DD"
  gender: "M" | "F";          // restrict gender values
  passport_number: string;
  passport_expiry: string;    // ISO format "YYYY-MM-DD"
  nationality: string;        // ISO country code (e.g. "US")
  phone: string;              // E.164 format recommended
  address_line1: string;
  city: string;
  country: string;            // ISO country code
  postal_code: string;
}

export interface BookingRequest {
  flight_offer_ids: string[];
  upsell_offer_id?: string;   // optional, in case user didn’t select upsell
  passengers: Passenger[];
  booking_type: BookingType;
}

export interface BookingResponse {
  id: string;                 // booking ID
  status: "CONFIRMED" | "PENDING" | "FAILED";
  flight_offer_ids: string[];
  upsell_offer_id?: string;
  passengers: Passenger[];
  booking_type: BookingType;
  created_at: string;         // ISO date
  updated_at?: string;        // ISO date
}


export interface UpSellPrice {
  currency: string;
  total: string;
  base?: string;
  grandTotal?: string;
  upsellDifference?: string;
  fees?: Array<{
    amount: string;
    type: string;
  }>;
  taxes?: Array<{
    amount: string;
    code: string;
  }>;
}
export interface FlightUpsellOfferResponse {
  type: string;
  id: string;
  originalFlightOfferId: string;
  price: UpSellPrice;
  cabin: string;
  fareAttributes: FareAttributes;
  amadeus_details: AmadeusDetails;
}

interface FareAttributes {
  refundable: boolean;
  changePenalties: boolean;
}

interface AmadeusDetails {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  paymentCardRequired: boolean;
  lastTicketingDate: string;
  itineraries: Itinerary[];
  price: Price;
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
    refundableFare: boolean;
    noRestrictionFare: boolean;
    noPenaltyFare: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}