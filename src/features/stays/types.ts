
export interface Destination {
  code: string;
  name: string;
  country_code: string;
  city_name?: string;
  token?: string;
}

export interface HotelImage {
  /** Actual partner API field */
  secureUrl?: string;
  /** Legacy / mock field */
  url?: string;
  code?: string;
  type?: string;
  order?: number;
  roomId?: string | null;
  spaceType?: string | null;
  uploadedAt?: string;
  publicId?: string;
}

export interface HotelDestination {
  code: string;
  name: string;
}

export interface HotelCoordinates {
  latitude: number;
  longitude: number;
}


export interface Rate {
  rateKey?: string;
  rateClass?: string;
  rateType?: string;
  net?: string;
  boardCode?: string;
  boardName?: string;
  cancellationPolicies?: Array<{
    amount?: string;
    from?: string;
  }>;
  adults?: number;
  children?: number;
  paymentType?: string;
  price_with_commission?: string
}


export interface Room {
  /** Actual partner API field */
  id?: string;
  /** Legacy / mock field */
  code?: string;
  name: string;
  description?: string;
  /** Actual partner API field */
  bedConfiguration?: string;
  /** Legacy / mock field */
  bedType?: string;
  bed_type?: string;
  /** Actual partner API field */
  occupancy?: number;
  /** Legacy / mock field */
  max_occupancy?: number;
  /** Actual partner API field — per-room nightly base rate (room_level) */
  baseRate?: number;
  isBookable?: boolean;
  totalInventory?: number;
  maxPerBooking?: number;
  size_sqm?: number | null;
  amenities?: string[];
  images?: HotelImage[];
  rates?: Rate[];
}

export interface AmenityDetail {
  code: string;
  label: string;
}

export interface Hotel {
  /** Actual partner API field (UUID) */
  id?: string;
  /** Legacy / mock field */
  code?: string;
  name: string;
  /** Actual partner API field */
  saleMode?: string;
  /** Legacy / mock field */
  accommodation_type?: string;
  /** Actual partner API field */
  propertyType?: string;
  /** Legacy / mock field */
  category?: string;
  reviewsCount?: number | null;
  country?: string;
  adminLevel1?: string;
  city?: string;
  description?: string | null;
  address: string;
  /** Nightly price from (for list display) */
  priceFrom?: number;
  /** Quality / rating score 0–100 */
  ratingScore?: number;
  checkInTime?: string;
  checkOutTime?: string;
  houseRules?: string;
  status?: string;
  coordinates?: HotelCoordinates;
  destination?: HotelDestination;
  amenities?: string[];
  amenityDetails?: AmenityDetail[];
  images?: HotelImage[];
  available?: boolean;
  rooms?: Room[];
  is_favorite?: boolean;
}


export interface HotelSearchResponse {
  count: number;
  results: Hotel[];
}



export interface BookStaysRequest {
  rate_key?: string;
  customer?: Customer;
  hold_suite?: boolean;
}

export interface Customer {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  age?: number;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  children?: Child[];
}

export interface Child {
  name?: string;
  surname?: string;
  age?: number;
  room_id?: number;
}
export interface BookStaysResponse {
  success: boolean
  checkout_url: string;
}

export interface UserSummary {
  id: number;
  email?: string;
  [key: string]: unknown;
}
export interface HotelLocationDetails {
  address: string;
  latitude: number;
  longitude: number;
  destination?: {
    code?: string;
    name?: string;
    city_name?: string;
    country_name?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface GuestDetails {
  primary_guest?: Customer;
  additional_adults?: Customer[];
  children?: Child[];
  special_requests?: string;
  [key: string]: unknown;
}
export interface BookingDetailsVerifyData {
  id: number;
  reference: string;
  hotel_code: string | number;
  hotel_name: string;
  check_in: string;
  check_out: string;
  currency: string;
  payment_status: string;
  status: string;
  total_price: string;
  created_at: string;
  user: UserSummary;
  cancellation_fee?: string | null;
  cancellation_reason?: string | null;
  refund_amount?: string | null;
  refund_status?: string;
  rooms_details?: unknown[]; // unknown[] until concrete shape is defined
  guest_details?: GuestDetails | undefined;
  hotel_location?: HotelLocationDetails;
  [key: string]: unknown;
}
export interface BookingStaysVerifyDetails {
  success: boolean;
  data: BookingDetailsVerifyData;
  error?: string

}
export interface CancellationPolicy {
  amount: number;
  currency: string;
  from: string; // ISO datetime string
  comments: string | null;
}

// --- Partner pricing types (aligned to actual API response) ---

export interface StayPricingCancellationPolicy {
  policyType: string;                          // "non_refundable" | "free_cancellation_until"
  penaltyType: string;                         // "full_charge" | "none"
  cancelDeadlineHoursBeforeCheckIn?: number | null;
  terms?: string | null;
  penaltyAmount?: number | null;
  penaltyPercent?: number | null;
}

export interface StayPricingRatePlan {
  id: string;
  roomId: string;
  code: string;
  name: string;
  planType: string;                            // "non_refundable" | "refundable"
  isActive: boolean;
  nightlyRate: number;
  policyVersion?: number;
  startsOn?: string | null;
  endsOn?: string | null;
  cancellationPolicy: StayPricingCancellationPolicy;
}

/** One selectable option surfaced to the guest (e.g. NON_CANCELLABLE / FREE_CANCELLATION) */
export interface StayPricingCancellationOption {
  optionId: string;                            // "NON_CANCELLABLE" | "FREE_CANCELLATION"
  label: string;
  amount: number;
  currency: string;
  cancelDeadlineHoursBeforeCheckIn?: number | null;
  policyCopy: string;
}

export interface StayPricingRoomCancellationOptions {
  roomId: string;
  cancellationOptions: StayPricingCancellationOption[];
}

export interface StayPricingAmount {
  amount: number;
}

export interface StayPricingPriceBreakdown {
  currency: string;
  base: StayPricingAmount;
  taxes: { amount: number; inclusive: boolean };
  fees: { amount: number; inclusive: boolean };
  total: StayPricingAmount;
  rateBands: {
    weekday: StayPricingAmount;
    weekend: StayPricingAmount;
  };
  previewOptionId: string;
  notes?: string;
}

export interface StayPricing {
  currency: string;
  baseRate: number;
  weekdayRate: number;
  weekendRate: number;
  minStayNights?: number;
  maxStayNights?: number;
  seasonalOverrides?: unknown[];
  blackoutDates?: string[];
  ratePlans: StayPricingRatePlan[];
  /** Property-level options (unit_level stays, or cheapest-room preview for room_level) */
  cancellationOptions: StayPricingCancellationOption[];
  /** Per-room options — primary data source for room_level rate plan selection */
  roomCancellationOptions: StayPricingRoomCancellationOptions[];
  priceBreakdown: StayPricingPriceBreakdown;
}

// --- end partner pricing types ---

export interface BookingTransfersVerifyDetails {
  id: string;

  booking_reference: string;
  booking_status: "CONFIRMED" | "CANCELLED" | "PENDING";

  payment_status: "PAID" | "UNPAID" | "FAILED";
  payment_session_id: string | null;
  payment_transaction_id: string | null;

  total_amount: string;
  currency: string;

  cancellation_policy: CancellationPolicy;

  first_name: string;
  last_name: string;
  passenger_name: string;
  dob: string;

  email: string;
  phone: string;
  contact_phone: string;
  country_code: string;

  pickup_location: string;
  pickup_location_label: string;
  pickup_date: string;
  pickup_time: string; 

  dropoff_location: string;
  dropoff_location_label: string;

  transfer_type: "PRIVATE" | "SHARED" | "PRIVATE AND SHARED";

  date_booked: string; // ISO datetime string
}
