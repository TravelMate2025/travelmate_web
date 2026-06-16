import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { searchHotels, createCheckoutSession, fetchStayPricing, createQuote, createHold } from '../stays/api';
import { BookingHoldReq, BookingHoldResp, BookingQuoteReq, BookingQuoteResp, BookStaysRequest, BookStaysResponse, Hotel, HotelSearchResponse, StayPricing } from './types';

interface locationDetails {
  name: string
  country_name: string
  country_code: string
  code: string
  adminLevel1?: string
  city?: string
  stayType?: string
}
interface BookingState {
  loading: boolean;
  error: string | null;
  booking: BookStaysResponse | null;
}

interface SearchParams {
  destination?: string;
  country?: string;
  adminLevel1?: string;
  city?: string;
  stayType?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  rooms?: number;
}

interface StaysState {
  hotels: Hotel[];
  loading: boolean;
  error: string | null;
  searchParams: SearchParams | null;
  locationDetails: locationDetails | null;
  selectedHotel: Hotel | null;
  detailsLoading: boolean;
  detailsError: string | null;
  booking: BookingState;
  guestInfo: GuestInfoProps | null;
  stayPricing: StayPricing | null;
  pricingLoading: boolean;
  pricingError: string | null;
  quoteResp: BookingQuoteResp | null;
  quoteLoading: boolean;
  quoteError: string | null;
  holdResp: BookingHoldResp | null;
  holdLoading: boolean;
  holdError: string | null;
}

const initialState: StaysState = {
  hotels: [],
  loading: false,
  error: null,
  searchParams: null,
  selectedHotel: null,
  detailsLoading: false,
  locationDetails: null,
  detailsError: null,
  booking: {
    loading: false,
    error: null,
    booking: null
  },
  guestInfo: null,
  stayPricing: null,
  pricingLoading: false,
  pricingError: null,
  quoteResp: null,
  quoteLoading: false,
  quoteError: null,
  holdResp: null,
  holdLoading: false,
  holdError: null,
};
export interface GuestInfoProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  countryCode: string;
  address?: string
  postal?: string
  city?: string
}

export const fetchHotelsAsync = createAsyncThunk(
  'stays/fetchHotels',
  async (params: SearchParams & { token?: string }, { rejectWithValue }) => {
    try {
      const searchParams = params as SearchParams;
      const destination =
        searchParams.city ??
        searchParams.adminLevel1 ??
        searchParams.country ??
        searchParams.destination ??
        '';
      return await searchHotels(
        destination,
        searchParams.checkIn ?? '',
        searchParams.checkOut ?? '',
        searchParams.adults ?? 1,
        searchParams.children ?? 0,
        searchParams.rooms ?? 1,
      );
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue(String(error));
    }
  }
);

export const fetchStayPricingAsync = createAsyncThunk(
  'stays/fetchStayPricing',
  async (stayId: string, { rejectWithValue }) => {
    try {
      return await fetchStayPricing(stayId);
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue(String(error));
    }
  }
);

export const createBookingAsync = createAsyncThunk(
  'stays/createCheckoutSession',
  async (params: { bookingData: BookStaysRequest}, { rejectWithValue }) => {
    try {
      const response = await createCheckoutSession(params.bookingData);
      return {
        checkout_url: response?.checkout_url,
        success: true,

      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create Booking');
    }
  }
);

export const createQuoteAsync = createAsyncThunk(
  'stays/createQuote',
  async (req: BookingQuoteReq, { rejectWithValue }) => {
    try {
      return await createQuote(req);
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue('Failed to create quote');
    }
  }
);

export const createHoldAsync = createAsyncThunk(
  'stays/createHold',
  async (req: BookingHoldReq, { rejectWithValue }) => {
    try {
      return await createHold(req);
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue('Failed to create hold');
    }
  }
);

const staysSlice = createSlice({
  name: 'stays',
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<SearchParams>) => {
      state.searchParams = action.payload;
    },
    setLocationDetails: (state, action) => {
      state.locationDetails = action.payload;
    },
    setGuestInfo: (state, action) => {
      state.guestInfo = action.payload
    },
    clearStaysCache: (state) => {
      state.hotels = [];
      state.searchParams = null;
      state.error = null;
    },
    clearSearchState: (state) => {
      state.hotels = [];
      state.searchParams = null;
      state.locationDetails = null;
      state.selectedHotel = null;
      state.detailsLoading = false;
      state.detailsError = null;
      state.error = null;
      state.guestInfo = null;
      state.booking = {
        loading: false,
        error: null,
        booking: null,
      };
    },
    clearSelectedHotel: (state) => {
      state.selectedHotel = null;
      state.detailsError = null;
    },
    clearStayPricing: (state) => {
      state.stayPricing = null;
      state.pricingError = null;
    },
    clearQuoteHold: (state) => {
      state.quoteResp = null;
      state.quoteError = null;
      state.holdResp = null;
      state.holdError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search Hotels
      .addCase(fetchHotelsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotelsAsync.fulfilled, (state, action: PayloadAction<HotelSearchResponse>) => {
        state.loading = false;
        state.hotels = action.payload.results;

      })
      .addCase(fetchHotelsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;

      })
      // Stay pricing
      .addCase(fetchStayPricingAsync.pending, (state) => {
        state.pricingLoading = true;
        state.pricingError = null;
        state.stayPricing = null;
      })
      .addCase(fetchStayPricingAsync.fulfilled, (state, action: PayloadAction<StayPricing>) => {
        state.pricingLoading = false;
        state.stayPricing = action.payload;
      })
      .addCase(fetchStayPricingAsync.rejected, (state, action) => {
        state.pricingLoading = false;
        state.pricingError = action.payload as string;
      })
      //Bookings
      .addCase(createBookingAsync.pending, (state) => {
        state.booking.loading = true;
        state.booking.error = null;
      })
      .addCase(createBookingAsync.fulfilled, (state, action) => {
        state.booking.loading = false;
        state.booking.booking = action.payload;
      })
      .addCase(createBookingAsync.rejected, (state, action) => {
        state.booking.loading = false;
        state.booking.error = action.payload as string;
      })
      // Quote
      .addCase(createQuoteAsync.pending, (state) => {
        state.quoteLoading = true;
        state.quoteError = null;
        state.quoteResp = null;
      })
      .addCase(createQuoteAsync.fulfilled, (state, action: PayloadAction<BookingQuoteResp>) => {
        state.quoteLoading = false;
        state.quoteResp = action.payload;
      })
      .addCase(createQuoteAsync.rejected, (state, action) => {
        state.quoteLoading = false;
        state.quoteError = action.payload as string;
      })
      // Hold
      .addCase(createHoldAsync.pending, (state) => {
        state.holdLoading = true;
        state.holdError = null;
        state.holdResp = null;
      })
      .addCase(createHoldAsync.fulfilled, (state, action: PayloadAction<BookingHoldResp>) => {
        state.holdLoading = false;
        state.holdResp = action.payload;
      })
      .addCase(createHoldAsync.rejected, (state, action) => {
        state.holdLoading = false;
        state.holdError = action.payload as string;
      });
  }
});

export const { setSearchParams, setGuestInfo, clearStaysCache, clearSearchState, clearSelectedHotel, setLocationDetails, clearStayPricing, clearQuoteHold } = staysSlice.actions;
export default staysSlice.reducer;
