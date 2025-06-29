import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { searchHotels } from '../../api/stays';
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
}

const initialState: StaysState = {
  hotels: [],
  loading: false,
  error: null,
  searchParams: null,
};

// Create an async thunk for fetching hotels
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

// Create the stays slice
const staysSlice = createSlice({
  name: 'stays',
  initialState,
  reducers: {
    // Action to set search parameters in the state
    setSearchParams: (state, action: PayloadAction<SearchParams>) => {
      state.searchParams = action.payload;
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
      });
  },
});

export const { setSearchParams } = staysSlice.actions;
export default staysSlice.reducer;