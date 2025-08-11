import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { searchHotels, getHotelDetails, createBooking } from '../stays/api';
import { BookingRequest, BookingResponse, Hotel, HotelSearchResponse } from './types';


interface BookingState {
  loading: boolean;
  error: string | null;
  booking: BookingResponse | null;
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
  selectedHotel: Hotel | null;
  detailsLoading: boolean;
  detailsError: string | null;
  booking: BookingState;
}

const initialState: StaysState = {
  hotels: [],
  loading: false,
  error: null,
  searchParams: null,
  selectedHotel: null,
  detailsLoading: false,
  detailsError: null,
  booking: {
    loading: false,
    error: null,
    booking: null
  }
};

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

export const fetchHotelDetailsAsync = createAsyncThunk(
  'stays/fetchHotelDetails',
  async (params: {
    hotelId: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    rooms: number;
    token?: string;
  }, { rejectWithValue }) => {
    try {
      return await getHotelDetails(
        params.hotelId,
        params.checkIn,
        params.checkOut,
        params.adults,
        params.children,
        params.rooms,
        params.token
      );
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBookingAsync = createAsyncThunk(
  'stays/createBooking',
  async (params: { bookingData: BookingRequest; token?: string }, { rejectWithValue }) => {
    try {
      return await createBooking(params.bookingData, params.token);
    } catch (error: any) {
      return rejectWithValue(error.message);
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
      // Hotel Details
      .addCase(fetchHotelDetailsAsync.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchHotelDetailsAsync.fulfilled, (state, action: PayloadAction<Hotel>) => {
        state.detailsLoading = false;
        state.selectedHotel = action.payload;
      })
      .addCase(fetchHotelDetailsAsync.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload as string;
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

export const { setSearchParams, clearStaysCache, clearSelectedHotel } = staysSlice.actions;
export default staysSlice.reducer;

