import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { searchHotels, getHotelDetails, HotelDetail } from '../../api/stays'; // Import getHotelDetails and HotelDetail type
import { Hotel } from '../../pages/StaysSearchResults'; // Import the Hotel type

// Define the type for the search parameters
interface SearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  filters?: {
    min_price?: number;
    max_price?: number;
    amenities?: string[];
  };
}

// Define the state for the stays slice
interface StaysState {
  hotels: Hotel[];
  loading: boolean;
  error: string | null;
  searchParams: SearchParams | null;
  selectedHotel: HotelDetail | null; // NEW: State for the currently selected hotel's details
  detailsLoading: boolean; // NEW: Loading state for hotel details
  detailsError: string | null; // NEW: Error state for hotel details
}

const initialState: StaysState = {
  hotels: [],
  loading: false,
  error: null,
  searchParams: null,
  selectedHotel: null, // Initialize selectedHotel
  detailsLoading: false, // Initialize detailsLoading
  detailsError: null, // Initialize detailsError
};

// Create an async thunk for fetching hotels (existing)
export const fetchHotelsAsync = createAsyncThunk(
  'stays/fetchHotels',
  async ({ searchParams, filters, token }: { searchParams: SearchParams; filters: any; token: string | undefined }, { rejectWithValue }) => {
    try {
      if (!token) {
        return rejectWithValue("Authentication token missing.");
      }
      const response = await searchHotels(
        searchParams.destination,
        searchParams.checkIn,
        searchParams.checkOut,
        searchParams.adults,
        searchParams.children,
        filters,
        token
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// NEW ASYNC THUNK: Fetch details for a specific hotel by ID
export const fetchHotelDetailsAsync = createAsyncThunk(
  'stays/fetchHotelDetails',
  async ({ hotelId, token }: { hotelId: string; token: string | undefined }, { rejectWithValue }) => {
    try {
      if (!token) {
        return rejectWithValue("Authentication token missing.");
      }
      const response = await getHotelDetails(hotelId, token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


// Create the stays slice
const staysSlice = createSlice({
  name: 'stays',
  initialState,
  reducers: {
    // Action to set search parameters in the state
    setSearchParams: (state, action: PayloadAction<SearchParams>) => {
      state.searchParams = action.payload;
    },
    // A reducer to clear the cached hotel data and search parameters
    clearStaysCache: (state) => {
      state.hotels = [];
      state.searchParams = null;
      state.error = null;
      state.loading = false;
    },
    // NEW: Action to clear the selected hotel details
    clearSelectedHotel: (state) => {
      state.selectedHotel = null;
      state.detailsError = null;
      state.detailsLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotelsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotelsAsync.fulfilled, (state, action: PayloadAction<Hotel[]>) => {
        state.loading = false;
        state.hotels = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchHotelsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.hotels = [];
      })
      // NEW: Handlers for fetchHotelDetailsAsync
      .addCase(fetchHotelDetailsAsync.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
        state.selectedHotel = null; // Clear previous details when fetching new ones
      })
      .addCase(fetchHotelDetailsAsync.fulfilled, (state, action: PayloadAction<HotelDetail>) => {
        state.detailsLoading = false;
        state.selectedHotel = action.payload;
      })
      .addCase(fetchHotelDetailsAsync.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload as string;
        state.selectedHotel = null;
      });
  },
});

// MODIFIED: Export all actions
export const { setSearchParams, clearStaysCache, clearSelectedHotel } = staysSlice.actions;
export default staysSlice.reducer;
