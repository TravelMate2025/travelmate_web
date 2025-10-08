// src/services/nationsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Nation {
  code: string;
  name: string;
}

export const nationsApi = createApi({
  reducerPath: "nationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://restcountries.com/v3.1/", // example public API
  }),
  endpoints: (builder) => ({
    getNations: builder.query<Nation[], void>({
      query: () => `all?fields=cca2,name`,
      transformResponse: (response: any[]): Nation[] => {
        return response
          .map((country) => ({
            code: country.cca2,
            name: country.name.common,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
      },
    }),
  }),
});

export const { useGetNationsQuery } = nationsApi;
