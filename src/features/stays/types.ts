// src/types/stays.ts

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
  accommodation_type: string;
  description?: string | null;
  address: string;
  category?: string;
  coordinates: HotelCoordinates;
  destination: HotelDestination;
  amenities: string[];
  images: HotelImage[];
  available?: boolean;
  rooms?: Room[];
}


export interface HotelSearchResponse {
  count: number;
  results: Hotel[];
}



export interface BookingRequest {
  hotelCode: string;
  roomCode: string;
  rateKey: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  paymentMethod: string;
}

export interface BookingResponse {
  bookingId: string;
  status: string;
  confirmationNumber: string;
  totalAmount: number;
  currency: string;
}