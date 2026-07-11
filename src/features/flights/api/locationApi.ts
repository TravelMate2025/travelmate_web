import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LocationInfo {
  country: string;
  currency: string;
}

interface GeoCodeResponse {
  countryName?: string;
}

interface CurrencyLookupResponse {
  currencies?: Record<string, unknown>;
}

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
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
          // ✅ Step 1: Reverse geocode with BigDataCloud
          const geoRes = await fetchWithBQ({
            url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          }) as { data?: GeoCodeResponse; error?: unknown };

          if (geoRes.error) throw geoRes.error;

          const countryName = geoRes.data?.countryName || "Unknown";

          if (countryName === "Unknown") {
            return { data: { country: "United State", currency: "USD" } };
          }

          // ✅ Step 2: Get currency from RestCountries
          const currencyRes = await fetchWithBQ(
            `https://restcountries.com/v3.1/name/${encodeURIComponent(
              countryName
            )}?fields=currencies,name`
          ) as { data?: CurrencyLookupResponse[]; error?: unknown };

          if (currencyRes.error) throw currencyRes.error;

          const currencies = currencyRes.data?.[0]?.currencies ?? {};
          const firstCurrency = Object.keys(currencies)[0] ?? "NGN";

          return {
            data: { country: countryName, currency: firstCurrency },
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
