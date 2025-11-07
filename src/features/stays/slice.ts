import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { searchHotels, createCheckoutSession } from '../stays/api';
import { BookStaysRequest, BookStaysResponse, Hotel, HotelSearchResponse } from './types';

interface locationDetails {
  name: string
  country_name: string
  country_code: string
  code: string
}
interface BookingState {
  loading: boolean;
  error: string | null;
  booking: BookStaysResponse | null;
}

interface SearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
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
  guestInfo: null
};
export interface GuestInfoProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  countryCode: string;
  address: string
  postal: string
  city: string
}

export const fetchHotelsAsync = createAsyncThunk(
  'stays/fetchHotels',
  async (params: SearchParams & { token?: string }, { rejectWithValue }) => {
    try {
      const { token, ...searchParams } = params;
      return await searchHotels(
        searchParams.destination,
        searchParams.checkIn,
        searchParams.checkOut,
        searchParams.adults,
        searchParams.children,
        searchParams.rooms,
        token
      );
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBookingAsync = createAsyncThunk(
  'stays/createCheckoutSession',
  async (params: { bookingData: BookStaysRequest; token?: string }, { rejectWithValue }) => {
    try {
      const response = await createCheckoutSession(params.bookingData, params.token);
      return {
        checkout_url: response?.checkout_url,
        success: true,

      };
    } catch (error: any) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to create Booking");

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
    clearSelectedHotel: (state) => {
      state.selectedHotel = null;
      state.detailsError = null;
    }
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
      });
  }
});

export const { setSearchParams, setGuestInfo, clearStaysCache, clearSelectedHotel, setLocationDetails } = staysSlice.actions;
export default staysSlice.reducer;

