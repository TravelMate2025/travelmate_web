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
  adults: number;
  children: number
  infants:number
}

export type BookingResponse = {
  id: number;
  booking: Booking;
  booking_reference: string;
  booking_type: "ROUND_TRIP" | "ONE_WAY" | string;
  currency: string;
  service_fee: string;
  base_flight_cost: string;
  admin_notes: string | null;
  cancelled_by: string | null;
  cancellation_date: string | null;
  cancellation_reason: string | null;
  flights: Flight[];
  passenger_bookings: PassengerBooking[];
  payment_details: PaymentDetails;
  amadeus_status: "FAILED" | "SUCCESS" | string;
  amadeus_reference: string;
};

type PassengerBooking = {
  id: number;
  passenger: Passenger;
  ticket_number: string | null;
  seat_number: string | null;
};



type PaymentDetails = {
  id: number;
  amount: string;
  currency: string;
  payment_method: string;
  transaction_id: string;
  payment_status: "PAID" | "REFUNDED" | string;
  payment_date: string;
  additional_details: StripeCheckoutSession;
};

type StripeCheckoutSession = {
  id: string;
  url: string | null;
  mode: string;
  locale: string | null;
  object: string;
  status: string;
  consent: any;
  created: number;
  invoice: string | null;
  ui_mode: string;
  currency: string;
  customer: string | null;
  livemode: boolean;
  metadata: {
    booking_id: string;
    base_flight_cost: string;
    flight_booking_id: string;
    service_fee_percentage: string;
  };
  discounts: any[];
  refund_id: string;
  cancel_url: string;
  expires_at: number;
  custom_text: Record<string, any>;
  permissions: any;
  refund_date: string;
  submit_type: string | null;
  success_url: string;
  amount_total: number;
  payment_link: string | null;
  setup_intent: string | null;
  subscription: string | null;
  automatic_tax: {
    status: string | null;
    enabled: boolean;
    provider: string | null;
    liability: string | null;
  };
  client_secret: string | null;
  custom_fields: any[];
  refund_status: "succeeded" | "failed" | "pending" | string;
  shipping_cost: any;
  total_details: {
    amount_tax: number;
    amount_discount: number;
    amount_shipping: number;
  };
  customer_email: string | null;
  origin_context: string | null;
  payment_intent: string;
  payment_status: string;
  recovered_from: string | null;
  wallet_options: any;
  amount_subtotal: number;
  adaptive_pricing: {
    enabled: boolean;
  };
  after_expiration: any;
  customer_details: {
    name: string;
    email: string;
    phone: string | null;
    address: {
      city: string | null;
      line1: string | null;
      line2: string | null;
      state: string | null;
      country: string;
      postal_code: string | null;
    };
    tax_ids: any[];
    tax_exempt: string;
    business_name: string | null;
    individual_name: string | null;
  };
  invoice_creation: {
    enabled: boolean;
    invoice_data: {
      footer: string | null;
      issuer: string | null;
      metadata: Record<string, any>;
      description: string | null;
      custom_fields: string | null;
      account_tax_ids: string | null;
      rendering_options: any;
    };
  };
  shipping_details: any;
  shipping_options: any[];
  branding_settings: {
    icon: string | null;
    logo: string | null;
    font_family: string;
    border_style: string;
    button_color: string;
    display_name: string;
    background_color: string;
  };
  customer_creation: string;
  consent_collection: any;
  client_reference_id: string | null;
  currency_conversion: any;
  payment_method_types: string[];
  allow_promotion_codes: any;
  collected_information: any;
  payment_method_options: {
    card: {
      request_three_d_secure: string;
    };
  };
  phone_number_collection: {
    enabled: boolean;
  };
  payment_method_collection: string;
  billing_address_collection: string | null;
  shipping_address_collection: string | null;
  saved_payment_method_options: any;
  payment_method_configuration_details: any;
};

type Flight = {
  id: number;
  flight_number: string;
  airline_code: string;
  airline_name: string;
  operating_airline: string;
  departure_airport: string;
  departure_terminal: string;
  departure_city: string;
  departure_datetime: string;
  arrival_airport: string;
  arrival_terminal: string;
  arrival_city: string;
  arrival_datetime: string;
  aircraft_code: string;
  aircraft_name: string;
  segment_id: string;
  number_of_stops: number;
  duration: string;
  cabin_class: string;
  fare_basis: string;
  fare_class: string;
  fare_brand: string;
  fare_brand_label: string;
  included_checked_bags: number;
  itinerary_index: number;
  blacklisted_in_eu: boolean;
  instant_ticketing_required: boolean;
  created_at: string;
  updated_at: string;
};
export type Booking = {
  id: string;
  user: number;
  status: "Failed" | "Confirmed" | string;
  total_price: string;
  created_at: string;
  updated_at: string;
};

// export interface BookingResponse {
//   id: string;                 // booking ID
//   status: "CONFIRMED" | "PENDING" | "FAILED";
//   flight_offer_ids: string[];
//   upsell_offer_id?: string;
//   passengers: Passenger[];
//   booking_type: BookingType;
//   created_at: string;         // ISO date
//   updated_at?: string;        // ISO date
// }


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