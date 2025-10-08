import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LocationInfo {
  country: string;
  currency: string;
}

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }), // absolute URLs used
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
          // Step 1: Reverse geocode to get country name
          const geoRes: any = await fetchWithBQ({
            url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=3&addressdetails=1`,
          
           
            
          });

          if (geoRes.error) throw geoRes.error;

          const countryName = geoRes.data?.address?.country || "Unknown";

          if (countryName === "Unknown") {
            return { data: { country: "Nigeria", currency: "NGN" } };
          }

          // Step 2: Get currency from RestCountries
          const currencyRes: any = await fetchWithBQ(
            `https://restcountries.com/v3.1/name/${encodeURIComponent(
              countryName
            )}?fields=currencies,name`
          );

          if (currencyRes.error) throw currencyRes.error;

          const currencies = currencyRes.data?.[0]?.currencies ?? {};
          const firstCurrency = Object.keys(currencies)[0] ?? "NGN";

          return {
            data: {
              country: countryName,
              currency: firstCurrency,
            },
          };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error?.message ?? "Failed to detect location",
            },
          };
        }
      },
    }),
  }),
});

export const { useLazyGetLocationInfoQuery } = locationApi;
