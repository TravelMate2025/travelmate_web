import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { logout } from "../account/slices/authSlice";
import { flightsApi } from "./api";
import { FlightApiError } from "./api/errors";
import type {
  CancellationPreview,
  ContactInput,
  CreateBookingInput,
  FlightBooking,
  CurrencyCode,
  FlightErrorCode,
  FlightSearchCriteria,
  FlightSearchResult,
  PriceCheckResult,
  TravelerInput,
} from "./types";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";
export type FlightError = { code: FlightErrorCode; message: string };

export interface FlightsState {
  /** Chosen by the user; null means "use the country default". Persisted. */
  currency: CurrencyCode | null;
  /** Chosen country for popular routes and the default currency; null = from the browser. Persisted. */
  country: string | null;
  /** Last search, so the form and results survive a reload. Persisted. */
  criteria: FlightSearchCriteria | null;
  search: { status: RequestStatus; result: FlightSearchResult | null; error: FlightError | null };
  selectedOfferToken: string | null;
  /** requestId: the latest check, so a slower earlier one (another fare) can't overwrite it. */
  priceCheck: { status: RequestStatus; result: PriceCheckResult | null; error: FlightError | null; requestId?: string };
  // Booking in progress. Never persisted: holds names, dates of birth and passports.
  travelers: TravelerInput[];
  contact: ContactInput | null;
  bagOptionIds: string[];
  bookingId: string | null;
  /** The held booking (seats held, PNR) while paying, and after. */
  booking: { status: RequestStatus; result: FlightBooking | null; error: FlightError | null };
  /** Manage: what cancelling would refund, and the cancel request itself. */
  cancellationPreview: { status: RequestStatus; result: CancellationPreview | null; error: FlightError | null };
  cancellation: { status: RequestStatus; error: FlightError | null };
}

export const initialFlightsState: FlightsState = {
  currency: null,
  country: null,
  criteria: null,
  search: { status: "idle", result: null, error: null },
  selectedOfferToken: null,
  priceCheck: { status: "idle", result: null, error: null },
  travelers: [],
  contact: null,
  bagOptionIds: [],
  bookingId: null,
  booking: { status: "idle", result: null, error: null },
  cancellationPreview: { status: "idle", result: null, error: null },
  cancellation: { status: "idle", error: null },
};

/**
 * Only these keys are written to storage (see store/index.ts). `bookingId` lets
 * Review and pay survive a reload without holding the seats twice; it is an id,
 * not personal data, and is cleared on logout or a new offer.
 */
export const PERSISTED_FLIGHT_KEYS: (keyof FlightsState)[] = ["currency", "country", "criteria", "bookingId"];

const asFlightError = (error: unknown): FlightError => {
  const e = error instanceof FlightApiError ? error : new FlightApiError("UNKNOWN", "Something went wrong. Please try again.");
  return { code: e.code, message: e.message };
};

export const searchFlights = createAsyncThunk<FlightSearchResult, FlightSearchCriteria, { rejectValue: FlightError }>(
  "flights/search",
  async (criteria, { rejectWithValue }) => {
    try {
      return await flightsApi.search(criteria);
    } catch (error) {
      return rejectWithValue(asFlightError(error));
    }
  }
);

export const checkFlightPrice = createAsyncThunk<
  PriceCheckResult,
  { offerToken: string; currency: CurrencyCode; includeBags: boolean },
  { rejectValue: FlightError }
>("flights/checkPrice", async ({ offerToken, currency, includeBags }, { rejectWithValue }) => {
  try {
    return await flightsApi.priceOffer(offerToken, { currency, includeBags });
  } catch (error) {
    return rejectWithValue(asFlightError(error));
  }
});

/** Holds the seats with the airline (creates the PNR). Payment comes next. */
export const holdFlightBooking = createAsyncThunk<FlightBooking, CreateBookingInput, { rejectValue: FlightError }>(
  "flights/holdBooking",
  async (input, { rejectWithValue }) => {
    try {
      return await flightsApi.createBooking(input);
    } catch (error) {
      return rejectWithValue(asFlightError(error));
    }
  }
);

/** Reads the booking again (hold expiry, payment and ticketing progress). */
export const refreshFlightBooking = createAsyncThunk<FlightBooking, string, { rejectValue: FlightError }>(
  "flights/refreshBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      return await flightsApi.getBooking(bookingId);
    } catch (error) {
      return rejectWithValue(asFlightError(error));
    }
  }
);

export const previewFlightCancellation = createAsyncThunk<CancellationPreview, string, { rejectValue: FlightError }>(
  "flights/previewCancellation",
  async (bookingId, { rejectWithValue }) => {
    try {
      return await flightsApi.getCancellationPreview(bookingId);
    } catch (error) {
      return rejectWithValue(asFlightError(error));
    }
  }
);

export const cancelFlightBooking = createAsyncThunk<FlightBooking, { bookingId: string; reason: string }, { rejectValue: FlightError }>(
  "flights/cancelBooking",
  async ({ bookingId, reason }, { rejectWithValue }) => {
    try {
      return await flightsApi.cancelBooking(bookingId, reason);
    } catch (error) {
      return rejectWithValue(asFlightError(error));
    }
  }
);

const clearBookingInProgress = (state: FlightsState) => {
  state.selectedOfferToken = null;
  state.priceCheck = initialFlightsState.priceCheck;
  state.travelers = [];
  state.contact = null;
  state.bagOptionIds = [];
  state.bookingId = null;
  state.booking = initialFlightsState.booking;
  state.cancellationPreview = initialFlightsState.cancellationPreview;
  state.cancellation = initialFlightsState.cancellation;
};

const flightsSlice = createSlice({
  name: "flights",
  initialState: initialFlightsState,
  reducers: {
    setFlightCurrency(state, action: PayloadAction<CurrencyCode>) {
      state.currency = action.payload;
    },
    setFlightCountry(state, action: PayloadAction<string>) {
      state.country = action.payload;
    },
    selectFlightOffer(state, action: PayloadAction<string>) {
      if (state.selectedOfferToken !== action.payload) clearBookingInProgress(state);
      state.selectedOfferToken = action.payload;
    },
    setFlightTravelers(state, action: PayloadAction<{ travelers: TravelerInput[]; contact: ContactInput }>) {
      state.travelers = action.payload.travelers;
      state.contact = action.payload.contact;
    },
    setFlightBags(state, action: PayloadAction<string[]>) {
      state.bagOptionIds = action.payload;
    },
    setFlightBookingId(state, action: PayloadAction<string>) {
      state.bookingId = action.payload;
    },
    resetFlightBooking: clearBookingInProgress,
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchFlights.pending, (state, action) => {
        state.criteria = action.meta.arg;
        state.search = { status: "loading", result: null, error: null };
        clearBookingInProgress(state);
      })
      .addCase(searchFlights.fulfilled, (state, action) => {
        state.search = { status: "succeeded", result: action.payload, error: null };
      })
      .addCase(searchFlights.rejected, (state, action) => {
        state.search = { status: "failed", result: null, error: action.payload ?? asFlightError(action.error) };
      })
      .addCase(checkFlightPrice.pending, (state, action) => {
        state.priceCheck = { status: "loading", result: null, error: null, requestId: action.meta.requestId };
      })
      .addCase(checkFlightPrice.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.priceCheck.requestId) return;
        state.priceCheck = { status: "succeeded", result: action.payload, error: null, requestId: action.meta.requestId };
      })
      .addCase(checkFlightPrice.rejected, (state, action) => {
        if (action.meta.requestId !== state.priceCheck.requestId) return;
        state.priceCheck = { status: "failed", result: null, error: action.payload ?? asFlightError(action.error), requestId: action.meta.requestId };
      })
      .addCase(holdFlightBooking.pending, (state) => {
        state.booking = { status: "loading", result: null, error: null };
      })
      .addCase(holdFlightBooking.fulfilled, (state, action) => {
        state.booking = { status: "succeeded", result: action.payload, error: null };
        state.bookingId = action.payload.id;
      })
      .addCase(holdFlightBooking.rejected, (state, action) => {
        state.booking = { status: "failed", result: null, error: action.payload ?? asFlightError(action.error) };
      })
      .addCase(refreshFlightBooking.fulfilled, (state, action) => {
        state.booking = { status: "succeeded", result: action.payload, error: null };
        state.bookingId = action.payload.id;
      })
      .addCase(refreshFlightBooking.rejected, (state, action) => {
        state.booking = { ...state.booking, status: "failed", error: action.payload ?? asFlightError(action.error) };
      })
      .addCase(previewFlightCancellation.pending, (state) => {
        state.cancellationPreview = { status: "loading", result: null, error: null };
      })
      .addCase(previewFlightCancellation.fulfilled, (state, action) => {
        state.cancellationPreview = { status: "succeeded", result: action.payload, error: null };
      })
      .addCase(previewFlightCancellation.rejected, (state, action) => {
        state.cancellationPreview = { status: "failed", result: null, error: action.payload ?? asFlightError(action.error) };
      })
      .addCase(cancelFlightBooking.pending, (state) => {
        state.cancellation = { status: "loading", error: null };
      })
      .addCase(cancelFlightBooking.fulfilled, (state, action) => {
        state.cancellation = { status: "succeeded", error: null };
        state.cancellationPreview = initialFlightsState.cancellationPreview;
        state.booking = { status: "succeeded", result: action.payload, error: null };
      })
      .addCase(cancelFlightBooking.rejected, (state, action) => {
        state.cancellation = { status: "failed", error: action.payload ?? asFlightError(action.error) };
      })
      // The next person on this browser keeps the currency and last search
      // (device-level, like recent searches) but none of the booking data.
      .addCase(logout, clearBookingInProgress);
  },
});

export const {
  setFlightCurrency,
  setFlightCountry,
  selectFlightOffer,
  setFlightTravelers,
  setFlightBags,
  setFlightBookingId,
  resetFlightBooking,
} = flightsSlice.actions;

export default flightsSlice.reducer;
