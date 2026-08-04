import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { searchStays, createCheckoutSession, fetchStayPricing, createQuote, createHold, getHotelDetails, getHotelRooms } from '../stays/api';
import { BookingHoldReq, BookingHoldResp, BookingQuoteReq, BookingQuoteResp, BookStaysRequest, BookStaysResponse, Hotel, HotelSearchResponse, StayPricing, StayRoomsResponse } from './types';

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
  stayRooms: StayRoomsResponse | null;
  roomsLoading: boolean;
  roomsError: string | null;
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
  stayRooms: null,
  roomsLoading: false,
  roomsError: null,
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
}

export const fetchHotelsAsync = createAsyncThunk(
  'stays/fetchHotels',
  async (params: SearchParams & { token?: string }, { rejectWithValue }) => {
    try {
      const searchParams = params as SearchParams;
      const destination =
        searchParams.destination ??
        searchParams.city ??
        searchParams.adminLevel1 ??
        searchParams.country ??
        '';
      return await searchStays({
        ...searchParams,
        destination,
      });
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue(String(error));
    }
  }
);

export const fetchStayPricingAsync = createAsyncThunk(
  'stays/fetchStayPricing',
  async (params: {
    stayId: string;
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    children?: number;
    rooms?: number;
  }, { rejectWithValue }) => {
    try {
      return await fetchStayPricing(
        params.stayId,
        params.checkIn,
        params.checkOut,
        params.adults ?? 1,
        params.children ?? 0,
        params.rooms ?? 1,
      );
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue(String(error));
    }
  }
);

export const fetchStayRoomsAsync = createAsyncThunk(
  'stays/fetchStayRooms',
  async (params: {
    stayId: string;
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    children?: number;
    rooms?: number;
  }, { rejectWithValue }) => {
    try {
      return await getHotelRooms(
        params.stayId,
        params.checkIn,
        params.checkOut,
        params.adults ?? 1,
        params.children ?? 0,
        params.rooms ?? 1,
      );
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue(String(error));
    }
  }
);

export const fetchStayDetailsAsync = createAsyncThunk(
  'stays/fetchStayDetails',
  async (
    params: {
      stayId: string;
      checkIn?: string;
      checkOut?: string;
      adults?: number;
      children?: number;
      rooms?: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const { stayId, checkIn, checkOut, adults, children, rooms } = params;
      return await getHotelDetails(
        stayId,
        checkIn ?? "",
        checkOut ?? "",
        adults ?? 1,
        children ?? 0,
        rooms ?? 1,
      );
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
      // Stay rooms (live remainingInventory/isExhausted)
      .addCase(fetchStayRoomsAsync.pending, (state) => {
        state.roomsLoading = true;
        state.roomsError = null;
      })
      .addCase(fetchStayRoomsAsync.fulfilled, (state, action: PayloadAction<StayRoomsResponse>) => {
        state.roomsLoading = false;
        state.stayRooms = action.payload;
        // Merge remainingInventory/isExhausted onto the rooms already
        // driving the room-selection UI (selectedHotel.rooms), rather than
        // replacing that data source -- the detail response's rooms[]
        // still has name/description/images/rates this endpoint doesn't.
        if (state.selectedHotel?.rooms?.length) {
          const byId = new Map(action.payload.rooms.map((r) => [r.id, r]));
          state.selectedHotel.rooms = state.selectedHotel.rooms.map((room) => {
            const live = room.id ? byId.get(room.id) : undefined;
            return live
              ? { ...room, remainingInventory: live.remainingInventory, isExhausted: live.isExhausted }
              : room;
          });
        }
      })
      .addCase(fetchStayRoomsAsync.rejected, (state, action) => {
        state.roomsLoading = false;
        state.roomsError = action.payload as string;
      })
      // Stay details
      .addCase(fetchStayDetailsAsync.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchStayDetailsAsync.fulfilled, (state, action: PayloadAction<Hotel>) => {
        state.detailsLoading = false;
        // Preserve any live remainingInventory/isExhausted already merged in
        // by fetchStayRoomsAsync -- the detail endpoint's rooms[] never
        // carries these (always null by backend design), so a wholesale
        // replace here would silently wipe them back to null if this
        // action resolves after the rooms-liveness fetch (e.g. re-fetching
        // detail on a check-in/check-out change while a prior rooms fetch
        // is still in flight).
        const priorLiveById = new Map(
          (state.selectedHotel?.rooms ?? [])
            .filter((r) => r.id && (r.remainingInventory != null || r.isExhausted != null))
            .map((r) => [r.id, r]),
        );
        const nextHotel = action.payload;
        if (priorLiveById.size && nextHotel.rooms?.length) {
          nextHotel.rooms = nextHotel.rooms.map((room) => {
            const prior = room.id ? priorLiveById.get(room.id) : undefined;
            return prior
              ? { ...room, remainingInventory: prior.remainingInventory, isExhausted: prior.isExhausted }
              : room;
          });
        }
        state.selectedHotel = nextHotel;
      })
      .addCase(fetchStayDetailsAsync.rejected, (state, action) => {
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
