
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

export interface BookingStaysVerifyDetails {
  success: boolean;
  error?: string
  data?: {
    id: number;
    reference: string;
    hotel_code: string;
    hotel_name: string;
    check_in: string; 
    check_out: string; 
    currency: string;
    payment_status: string;
    status: string;
    total_price: string; 
    created_at: string; 
    user: string;
    cancellation_fee: string;
    refund_amount: string;
    refund_status: string;
    cancellation_reason: string;
    hotel_location: string;
    rooms_details: string;
    guest_details: string;
  }

}
