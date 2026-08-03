import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Nation {
  code: string;
  name: string;
}

interface CountryApiResponse {
  code: string;
  name: string;
}

export const nationsApi = createApi({
  reducerPath: "nationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api"}/v1/public/`,
  }),
  endpoints: (builder) => ({
    getNations: builder.query<Nation[], void>({
      query: () => "countries",
      transformResponse: (response: { results: CountryApiResponse[] }): Nation[] => {
        return response.results
          .map((country) => ({
            code: country.code,
            name: country.name,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
      },
    }),
  }),
});

export const { useGetNationsQuery } = nationsApi;
