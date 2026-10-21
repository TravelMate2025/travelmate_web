import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LocationInfo {
  country: string;
  currency: string;
}

const PUBLIC_API_BASE = `${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api"}/v1/public`;

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fetchBaseQuery({ baseUrl: PUBLIC_API_BASE }),
  tagTypes: ["Location"],
  endpoints: (builder) => ({
    getLocationInfo: builder.query<
      LocationInfo,
      { latitude: number; longitude: number }
    >({
      async queryFn(
        { latitude, longitude },
        _queryApi,
        _extraOptions,
        fetchWithBQ
      ) {
        try {
          // Reverse geocoding and currency resolution are backend-owned.
          const geoRes = await fetchWithBQ({
            url: `reverse-geocode?lat=${latitude}&lng=${longitude}`,
          }) as { data?: { country?: string; currency?: string }; error?: unknown };

          if (geoRes.error) throw geoRes.error;

          const countryName = geoRes.data?.country || "Unknown";

          if (countryName === "Unknown") {
            return { data: { country: "United State", currency: "USD" } };
          }

          return {
            data: {
              country: countryName,
              currency: geoRes.data?.currency || "USD",
            },
          };
        } catch (error: unknown) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : "Failed to detect location",
            },
          };
        }
      },

      // ✅ Cache & revalidation controls
      providesTags: (result, _error, { latitude, longitude }) =>
        result ? [{ type: "Location", id: `${latitude},${longitude}` }] : [],

      // Cache lifetime in seconds
      keepUnusedDataFor: 60 * 60 * 24, // ✅ Cache for 24 hours
    }),
  }),
});

export const { useLazyGetLocationInfoQuery, useGetLocationInfoQuery } =
  locationApi;
