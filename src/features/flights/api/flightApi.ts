// src/redux/services/flightsApi.ts
import {
  BaseQueryFn,
  createApi,
 
} from "@reduxjs/toolkit/query/react";
import {
  Airport,
  BookingRequest,
  BookingResponse,
  FlightSearchRequest,
  FlightSearchResponse,
  UpsellFlightOfferResponse,
} from "../types";
import api from "../../../api/services/api";
import { AxiosError, AxiosRequestConfig } from "axios";


import dayjs from "dayjs";
import { Flight } from "../hooks/useFlightBooking";

export type TripType = "one-way" | "round-trip" | "multi-city";

interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

interface FlightSegment {
  from: Flight;
  to: Flight;
  date: string; // "DD MMM YYYY"
}

interface GetFlightParams {
  tripType: TripType;
  initialFrom: { id: string };
  initialTo: { id: string };
  selectedFrom?: { id: string };
  selectedTo?: { id: string };
  date?: string | { startDate?: string; endDate?: string };
  passengerCounts: PassengerCounts;
  travelClass: string;
  currency?: string;
  flights?: FlightSegment[]; // used for multi-city
}

export function buildFlightPayload({
  tripType,
  initialFrom,
  initialTo,
  selectedFrom,
  selectedTo,
  date,
  passengerCounts,
  travelClass,
  currency = "USD",
  flights = [],
}: GetFlightParams) {
  const basePayload = {
    adults: passengerCounts.adults,
    children: passengerCounts.children,
    infants: passengerCounts.infants,
    travel_class: travelClass.toUpperCase(),
    currency,
  };
console.log(date);

  switch (tripType) {
    case "one-way":
      return {
        ...basePayload,
        tripType: "ONE_WAY",
        origin: initialFrom.id,
        destination: initialTo.id,
        departure_date: dayjs(date as string).format(
          "YYYY-MM-DD"
        ),
        non_stop: false,
      };

    case "round-trip":
      const d = date as { startDate?: string; endDate?: string };
      return {
        ...basePayload,
        tripType: "ROUND_TRIP",
        origin: selectedFrom?.id || initialFrom.id,
        destination: selectedTo?.id || initialTo.id,
        departure_date: dayjs(d.startDate, "DD MMM YYYY").format("YYYY-MM-DD"),
        return_date: dayjs(d.endDate, "DD MMM YYYY").format("YYYY-MM-DD"),
        non_stop: false,
      };

    case "multi-city":
      return {
        ...basePayload,
        tripType: "MULTI_CITY",
        segments: flights.map((f) => ({
          origin: f.from.iataCode,
          destination: f.to.iataCode,
          departure_date: dayjs(f.date, "DD MMM YYYY").format("YYYY-MM-DD"),
        })),
      };

    default:
      throw new Error(`Unsupported trip type: ${tripType}`);
  }
}


// Wrap axios with fetchBaseQuery adapter
const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    try {
      const result = await api({ url: baseUrl + url, method, data, params });
      return { data: result.data };
    } catch (err) {
      const axiosErr = err as AxiosError;
      return {
        error: {
          status: axiosErr.response?.status,
          data: axiosErr.response?.data || axiosErr.message,
        },
      };
    }
  };

export const flightsApi = createApi({
  reducerPath: "flightsApi",
  baseQuery: axiosBaseQuery({ baseUrl: "" }),
  tagTypes: ["Airports", "Flights", "FlightDetails", "Bookings"], // ✅ define tags
  endpoints: (builder) => ({
    // ✈️ Fetch Airports
    fetchAirports: builder.query<Airport[], string>({
      query: (keyword: string) => ({
        url: `/flights/search/search_airports/`,
        method: "GET",
        params: { keyword, subType: "AIRPORT" },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Airports" as const, id })),
              { type: "Airports", id: "LIST" as string },
            ]
          : [{ type: "Airports", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),

    // ✈️ Fetch Flights
    fetchFlights: builder.query<FlightSearchResponse, FlightSearchRequest>({
      query: (params) => {
        let endpoint = "/api/flights/search";
        switch (params.tripType) {
          case "ONE_WAY":
            endpoint = "/flights/search/one_way/";
            break;
          case "ROUND_TRIP":
            endpoint = "/flights/search/round_trip/";
            break;
          case "MULTI_CITY":
            endpoint = "/flights/search/multi_city/";
            break;
        }
        return {
          url: endpoint,
          method: "POST",
          data: params,
        };
      },
      providesTags: ["Flights"], // ✅ bust cache when searching again
    }),

    // ✈️ Flight Details
    fetchFlightDetails: builder.query<any, string>({
      query: (flightId) => ({
        url: `/flights/search/flight_details/`,
        method: "GET",
        params: { flight_id: flightId },
      }),
      providesTags: (result, error, flightId) => [
        { type: "FlightDetails", id: flightId },
      ],
      keepUnusedDataFor: 600, // ✅ cache details for 10 minutes
    }),

    // ✈️ Upsell Offer
    upsellFlightOffer: builder.mutation<
      UpsellFlightOfferResponse,
      { flight_offer_id: string }
    >({
      query: (body) => ({
        url: `/flights/search/upsell_flight_offer/`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Flights"],
    }),

    // ✈️ Create Booking
    createBooking: builder.mutation<BookingResponse, BookingRequest>({
      query: (body) => ({
        url: `/flights/bookings/create_booking/`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Bookings", "Flights"], // ✅ new booking busts flights cache
    }),
    fetchBookingById: builder.query<BookingResponse, string>({
      query: (id) => ({
        url: `/flights/bookings/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Bookings", id }],
      keepUnusedDataFor: 300,
    }),
    // Inside flightsApi endpoints
    createCheckoutSession: builder.mutation<any, { id: string; body?: any }>({
      query: ({ id, body }) => ({
        url: `/flights/bookings/${id}/create_checkout_session/`,
        method: "POST",
        data: body, // optional, in case backend expects some payload
      }),
      invalidatesTags: ["Bookings"], // invalidate bookings cache when session created
    }),
    stripeWebhook: builder.mutation<any, any>({
      query: (body) => ({
        url: `/api/flights/stripe/webhook/`,
        method: "POST",
        data: body,
      }),
    }),
  }),
});

// ================= EXPORT HOOKS =================
export const {
  useFetchAirportsQuery,
  useLazyFetchAirportsQuery,
useLazyFetchFlightsQuery,
  useFetchFlightDetailsQuery,
  useUpsellFlightOfferMutation,
  useCreateBookingMutation,
  useCreateCheckoutSessionMutation,
  useFetchBookingByIdQuery
} = flightsApi;
