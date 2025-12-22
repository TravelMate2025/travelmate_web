
export interface Destination {
  code: string;
  name: string;
  country_code: string;
  city_name?: string;
  token?: string;
}

export interface HotelImage {
  url: string;
  code: string;
  type: string;
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
  code: string;
  name: string;
  description?: string;
  bedType?: string;
  size_sqm?: number | null;
  max_occupancy?: number;
  amenities: string[];
  images: HotelImage[];
  rates: Rate[];
}

export interface Hotel {
  reviewsCount: any;
  code: string;
  name: string;
  accommodation_type?: string;
  description?: string | null;
  address: string;
  category?: string;
  coordinates: HotelCoordinates;
  destination: HotelDestination;
  amenities: string[];
  images: HotelImage[];
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
  [key: string]: any;
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
    [key: string]: any;
  };
  [key: string]: any;
}

export interface GuestDetails {
  primary_guest?: Customer;
  additional_adults?: Customer[];
  children?: Child[];
  special_requests?: string;
  [key: string]: any;
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
  rooms_details?: any[]; // keep as any[] unless you have a concrete shape
  guest_details?: GuestDetails | undefined;
  hotel_location?: HotelLocationDetails;
  [key: string]: any;
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

