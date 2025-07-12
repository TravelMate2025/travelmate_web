// src/types/stays.ts
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
  rateName?: string;
  boardType?: string;
  price?: {
    amount: number;
    currency: string;
  };
  cancellationPolicies: Array<{
    amount?: string;
    from?: string;
  }>;
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