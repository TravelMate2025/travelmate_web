export interface PassengerCounts {
  adults: string;
  children:string;
  infant: string;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface BookingTimes {
  pickUpTime: string;
  dropOffTime?: string;
}

export interface DateRangeType {
  startDate: Date;
  endDate: Date;
  key: string;
}

export interface BookingFormData {
  pickupLocation: string;
  pickUpLocaDescription: string;
  dropoffLocation: string;
  dropoffLocaDescription: string
  pickupDate: string;
  pickupTime: string;
  selectedRide: string;
  passengerCounts: PassengerCounts;
  priceRange: { min: number; max: number };
  endAddress?: string;
  endCity?: string;
  endCountry?: string;
  endGeoLat?: number;
  endGeoLong?: number;
  fromLat?: number;
  fromLon?: number;
  toLat?: number;
  toLon?: number;
  searchResults?: any[]; 
}

export interface PassengerCounts {
  adults: string;
  children: string;
  infant: string;
}
export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  loading: boolean;
}