// Flights v2 data contract, shared by the fake data layer and the real
// travelmate_backend API (/api/v2/flights/*). Mirrors flights_plan.md §C2/§C9;
// when this file changes, update the plan so the backend follows it.
//
// Money is always a decimal string in the selling currency the server chose.
// The UI never converts currencies or sends prices back: bookings use offerToken.

export type CurrencyCode = "USD" | "NGN" | "GBP";
export const SELLING_CURRENCIES: readonly CurrencyCode[] = ["USD", "NGN", "GBP"];

export interface Money {
  amount: string;
  currency: CurrencyCode;
}

export type CabinClass = "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
export type TravelerType = "ADULT" | "CHILD" | "HELD_INFANT" | "SEATED_INFANT";
export type TripType = "RETURN" | "ONE_WAY" | "MULTI_CITY";

// ---------------------------------------------------------------- places

export interface Place {
  /** IATA code: an airport (LHR) or a city with several airports (LON). */
  code: string;
  type: "AIRPORT" | "CITY";
  name: string;
  city: string;
  cityCode: string;
  country: string;
  countryCode: string;
}

/** Staff-configured per country (dashboard, later); priceFrom is the server's cached cheapest fare. */
export interface PopularRoute {
  origin: Place;
  destination: Place;
  /** Null when there's no recent fare to show. */
  priceFrom: Money | null;
}

/** "From" fares per cabin on one route, from the server's latest search. */
export interface ClassFares {
  origin: Place;
  destination: Place;
  fares: { cabin: CabinClass; priceFrom: Money | null }[];
}

/** Promo card content, set by staff in the dashboard. Null when none is running. */
export interface Campaign {
  label: string;
  headline: string;
  body: string;
  ctaLabel: string;
  /** Prefills the search form when set. */
  route: { origin: string; destination: string } | null;
}

// ---------------------------------------------------------------- search

export type FlexibleDays = 0 | 1 | 2 | 3;

export interface SearchLeg {
  origin: string;
  destination: string;
  /** Local departure date, YYYY-MM-DD. */
  date: string;
  /** Also search this many days either side (Amadeus dateWindow, up to 3). */
  flexibleDays: FlexibleDays;
}

export interface PassengerCounts {
  adults: number;
  children: number;
  /** Under 2, on an adult's lap. At most one per adult. */
  heldInfants: number;
  /** Under 2, in their own seat. */
  seatedInfants: number;
}

export interface FlightSearchCriteria {
  tripType: TripType;
  /** RETURN: 2 legs (out, back). ONE_WAY: 1. MULTI_CITY: 2 to 6. */
  legs: SearchLeg[];
  passengers: PassengerCounts;
  cabin: CabinClass;
  nonStop: boolean;
  /** Also search airports near origin and destination (Amadeus origin/destination radius). */
  includeNearbyAirports: boolean;
  currency: CurrencyCode;
}

// ---------------------------------------------------------------- offers

export interface SegmentEndpoint {
  iata: string;
  terminal: string | null;
  /** Local time at that airport, no offset: 2026-12-15T19:05:00. */
  atLocal: string;
  city: string;
  airportName: string;
}

export interface Carrier {
  code: string;
  name: string;
}

export interface Segment {
  id: string;
  from: SegmentEndpoint;
  to: SegmentEndpoint;
  marketing: Carrier & { number: string };
  /** Null when the marketing carrier operates the flight. */
  operating: Carrier | null;
  aircraft: string | null;
  durationMinutes: number;
  cabin: CabinClass;
  /** Airline fare family label, e.g. "Eco Essential". */
  brandedFare: string | null;
  /** Technical stops (the plane lands but you stay on board). */
  stops: number;
}

export interface Itinerary {
  durationMinutes: number;
  segments: Segment[];
}

export interface BagAllowance {
  quantity: number | null;
  weightKg: number | null;
}

export interface BaggageAllowance {
  checked: BagAllowance | null;
  cabin: BagAllowance | null;
}

export interface FareConditions {
  refundable: boolean;
  changeable: boolean;
  /** Highest change fee the airline charges, before any fare difference. */
  changePenalty: Money | null;
}

export type AmenityKind = "MEAL" | "SEAT" | "BAGGAGE" | "SERVICE" | "MILES" | "CHANGES" | "OTHER";

export interface Amenity {
  kind: AmenityKind;
  description: string;
  /** false = included in the fare, true = available for a fee. */
  chargeable: boolean;
}

export interface TravelerPrice {
  type: TravelerType;
  count: number;
  /** Price for one traveller of this type. */
  amount: string;
}

export interface OfferPrice extends Money {
  perTraveler: TravelerPrice[];
  breakdown: { base: string; taxesAndFees: string };
}

export interface FlightOffer {
  /** Opaque. The only thing the UI sends back to price or book this offer. */
  offerToken: string;
  source: "GDS" | "NDC" | "LTC" | "EAC";
  validatingAirline: Carrier & { logoUrl: string | null };
  itineraries: Itinerary[];
  baggage: BaggageAllowance;
  fareConditions: FareConditions;
  amenities: Amenity[];
  seatsLeft: number | null;
  price: OfferPrice;
  /** Book (and ticket) by this date or the fare is lost. */
  lastTicketingAt: string | null;
  flags: {
    upsellAvailable: boolean;
    paymentCardRequired: boolean;
    instantTicketingRequired: boolean;
  };
  /** After this the offer can't be priced; search again. ISO with offset. */
  expiresAt: string;
}

export interface FlightSearchResult {
  searchId: string;
  criteria: FlightSearchCriteria;
  offers: FlightOffer[];
  expiresAt: string;
}

// ---------------------------------------------------------------- price check

export interface PriceChange {
  previous: Money;
  current: Money;
  direction: "UP" | "DOWN";
}

export interface TravelerRequirements {
  travelerId: string;
  type: TravelerType;
  genderRequired: boolean;
  dateOfBirthRequired: boolean;
  passportRequired: boolean;
  residenceRequired: boolean;
}

export interface BookingRequirements {
  emailRequired: boolean;
  mobileRequired: boolean;
  travelers: TravelerRequirements[];
}

export interface BagOption {
  id: string;
  /** Index into offer.itineraries this bag applies to. */
  itineraryIndex: number;
  /** Extra bags on top of the included allowance. */
  quantity: number;
  weightKg: number | null;
  price: Money;
  travelerIds: string[];
}

export interface FareRuleText {
  category: "CHANGES" | "REFUNDS" | "OTHER";
  title: string;
  text: string;
}

export interface PriceCheckResult {
  offer: FlightOffer;
  priceChange: PriceChange | null;
  requirements: BookingRequirements;
  /** Empty when the airline sells no extra bags for this offer. */
  bagOptions: BagOption[];
  fareRules: FareRuleText[];
}

// ---------------------------------------------------------------- fare families (R2)

export interface FareOption {
  offerToken: string;
  brandName: string;
  price: Money;
  /** Difference from the offer the user picked, e.g. "26.30". */
  priceDifference: string;
  baggage: BaggageAllowance;
  fareConditions: FareConditions;
  amenities: Amenity[];
}

// ---------------------------------------------------------------- booking

/** Amadeus also accepts UNDISCLOSED ("Prefer not to say"). */
export type Gender = "FEMALE" | "MALE" | "UNDISCLOSED";

export interface TravelerInput {
  travelerId: string;
  type: TravelerType;
  firstName: string;
  lastName: string;
  gender: Gender | null;
  dateOfBirth: string | null;
  /** For HELD_INFANT: the adult whose lap they travel on. */
  associatedAdultId: string | null;
  /** issuingCountry / nationality: ISO 3166-1 alpha-2. */
  passport: { number: string; expiryDate: string; issuingCountry: string; nationality: string | null } | null;
  frequentFlyer: { airlineCode: string; number: string } | null;
}

export interface ContactInput {
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
}

export interface CreateBookingInput {
  offerToken: string;
  travelers: TravelerInput[];
  contact: ContactInput;
  /** BagOption ids from the price check (R2). */
  bagOptionIds: string[];
  currency: CurrencyCode;
}

export type FlightBookingStatus =
  | "HELD" // PNR created, waiting for payment
  | "HOLD_EXPIRED" // not paid in time, PNR released, nothing charged
  | "PAID" // payment received, handing to the consolidator
  | "TICKETING" // with the consolidator
  | "TICKETED"
  | "FAILED" // could not book or ticket; see failure
  | "CANCELLATION_REQUESTED"
  | "CANCELLED";

export interface TravelerSummary {
  travelerId: string;
  type: TravelerType;
  firstName: string;
  lastName: string;
  ticketNumber: string | null;
}

export type RefundStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface RefundInfo {
  status: RefundStatus;
  amount: Money;
  startedAt: string;
  completedAt: string | null;
}

export interface ScheduleChange {
  segmentId: string;
  detectedAt: string;
  previousDepartureLocal: string;
  newDepartureLocal: string;
  newArrivalLocal: string;
}

/** What the customer pays in one selling currency, fixed when the seats are held. */
export interface PayableAmount {
  currency: CurrencyCode;
  flights: string;
  bags: string;
  total: string;
}

export interface FlightBooking {
  id: string;
  /** TravelMate booking reference shown to customers and support. */
  reference: string;
  /** Airline/GDS record locator. Null until the hold succeeds. */
  pnr: string | null;
  status: FlightBookingStatus;
  offer: FlightOffer;
  travelers: TravelerSummary[];
  contact: ContactInput;
  bags: BagOption[];
  total: Money;
  /** The same total in each selling currency (mock: "Pay in" USD / NGN / GBP). */
  payable: PayableAmount[];
  /** The hold re-priced the offer and it changed since the price check. */
  priceChange: PriceChange | null;
  /** HELD only: pay before this or the seats are released. */
  holdExpiresAt: string | null;
  payment: { status: "PENDING" | "PAID" | "FAILED"; paidAt: string | null; amount: Money } | null;
  failure: { stage: "BEFORE_PAYMENT" | "AFTER_PAYMENT"; reason: string } | null;
  refund: RefundInfo | null;
  scheduleChanges: ScheduleChange[];
  createdAt: string;
}

export interface CheckoutSession {
  /** Flutterwave hosted checkout. */
  checkoutUrl: string;
}

export interface CancellationPreview {
  kind: "FULL_REFUND" | "VOID" | "AIRLINE_REFUND";
  paid: Money;
  deduction: Money | null;
  /** Estimate until the airline confirms (AIRLINE_REFUND). */
  refund: Money | null;
  requiresAirlineConfirmation: boolean;
}

// ---------------------------------------------------------------- errors

export type FlightErrorCode =
  | "SEARCH_EXPIRED"
  | "OFFER_EXPIRED"
  | "OFFER_UNAVAILABLE" // sold out at this price
  | "HOLD_EXPIRED"
  | "VALIDATION"
  | "AUTH_REQUIRED"
  | "NOT_FOUND"
  | "NETWORK"
  | "UNKNOWN";

export interface FlightApiErrorBody {
  code: FlightErrorCode;
  message: string;
  fields?: Record<string, string>;
}
