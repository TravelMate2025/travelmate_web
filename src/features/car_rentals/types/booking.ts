export interface PassengerCounts {
  adults: number;
  children: number;
  infant: number;
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
  pickupLocaDescription: string;
  dropoffLocation: string;
  dropoffLocaDescription: string
  pickupDate: string;
  pickupTime: string;
  selectedRide: string;
  passengerCounts: PassengerCounts;
  priceRange: { min: number; max: number };
  toLat?: number;
  toLon?: number;
  searchResults?: CarTransferOption[];
  search_id?: string;
  rate_key?: string;
  confirmationId?: string
}

export interface CarTransferOption {
  id?: string | number;
  name?: string;
  description?: string;
  status?: string;
  transferType?: string;
  transfer_type?: string;
  // rideType is the partner's current field ("private_hire" | "shared");
  // transferType/transfer_type above predate the partner's rename and are
  // kept only for older cached data.
  rideType?: string;
  ride_type?: string;
  maxPaxCapacity?: string | number;
  passenger_capacity?: number;
  luggage_capacity?: number;
  vehicleCount?: number;
  vehicle_count?: number;
  estimatedDurationMinutes?: number;
  estimated_duration_minutes?: number;
  // Only present for shared rides, and only when the search included a
  // pickup date+time (the backend derives pickupAt server-side from the
  // pickup_date/pickup_time already sent — see PartnerTransferService).
  availableSeats?: number | null;
  available_seats?: number | null;
  provider?: {
    name?: string;
    displayName?: string;
    contactPhone?: string;
    websiteUrl?: string;
    arrivalInstructions?: string;
  } | null;
  features?: string[];
  currency?: string;
  base_fare?: number;
  rateKey?: string;
  supplier?: string;
  vehicle: {
    name?: string;
    code?: string;
  };
  category?: {
    name?: string;
    code?: string;
  };
  price?: {
    currencyId?: string;
    totalAmount?: number;
    totalAmountWithFee?: number;
    amount?: number;
  };
  content?: {
    images?: Array<{ url?: string; secureUrl?: string }>;
    transferDetailInfo?: Array<{
      value?: string | number;
      description?: string;
    }>;
    transferRemarks?: Array<{
      description?: string;
    }>;
  };
  cancellationPolicies?: Array<{
    optionId?: string;
    label?: string;
    amount?: number;
    currency?: string;
    cancelDeadlineHoursBeforeCheckIn?: number | null;
    policyCopy?: string;
  }>;
  pickupInformation?: {
    from?: { description?: string };
    to?: { description?: string };
    date?: string;
    time?: string;
  };
  raw?: Record<string, unknown>;
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
