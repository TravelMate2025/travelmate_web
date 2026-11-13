export const hotelsRoutes = {
  home: "/hotels",
  results: "/hotels/results",
  detail: (hotelId: string) => `/hotels/${encodeURIComponent(hotelId)}`,
} as const;

/** The search form's id: the chat button hides while it is on screen (FloatingChatButton). */
export const HOTELS_SEARCH_ID = "hotels-search";
