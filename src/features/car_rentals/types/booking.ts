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
  status?: string;
  maxPaxCapacity?: string | number;
  supplier?: string;
  vehicle: {
    name?: string;
    code?: string;
  };
  category?: {
    name?: string;
  };
  price?: {
    totalAmountWithFee?: number;
    amount?: number;
  };
  content?: {
    images?: Array<{ url?: string }>;
    transferDetailInfo?: Array<{
      value?: string | number;
      description?: string;
    }>;
    transferRemarks?: Array<{
      description?: string;
    }>;
  };
  cancellationPolicies?: Array<{
    amount?: number;
  }>;
  pickupInformation?: {
    from?: {
      description?: string;
    };
    to?: {
      description?: string;
    };
    date?: string;
    time?: string;
  };
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
