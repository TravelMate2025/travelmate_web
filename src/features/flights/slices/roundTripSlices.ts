
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { FlightSearchRequest, FlightSearchResponse } from "../types";
import api from "../../../api/services/api";


interface FlightsState {
  loading: boolean;
  data: FlightSearchResponse | null;
  error: string | null;
}

const initialState: FlightsState = {
  loading: false,
  data: null,
  error: null,
};

  
export const fetchFlights = createAsyncThunk<
  FlightSearchResponse,
  FlightSearchRequest,
  { rejectValue: string }
>("flights/fetchFlights", async (params, { rejectWithValue }) => {
  try {
    let endpoint = "/api/flights/search";

    switch (params.tripType) {
      case "ONE_WAY":
        endpoint = "/api/flights/search/one-way";
        break;
      case "ROUND_TRIP":
        endpoint = "/api/flights/search/round-trip";
        break;
      case "MULTI_CITY":
        endpoint = "/api/flights/search/multi-city";
        break;
    }

    const response = await api.post<FlightSearchResponse>(endpoint, params, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch flights"
    );
  }
});

const flightsSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default flightsSlice.reducer;
