export const hotelsRoutes = {
  home: "/hotels",
  results: "/hotels/results",
  detail: (hotelId: string) => `/hotels/${encodeURIComponent(hotelId)}`,
} as const;
