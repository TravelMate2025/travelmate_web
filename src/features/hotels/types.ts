export type HotelReview = { score: number; scale: number; count: number };

export type HotelSummary = {
  id: string;
  name: string;
  stars: number | null;
  city: string | null;
  country: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  image: string | null;
  distance_km?: number;
  review: HotelReview | null;
  facilities: string[];
  /** IMPT's own detail page for this hotel (live prices, then checkout), already tagged for TravelMate. */
  book_url: string;
};

export type HotelDetails = HotelSummary & {
  images: string[];
  full_address: string | null;
  description: string;
  check_in_time: string | null;
  check_out_time: string | null;
};

export type Place = {
  name: string;
  lat: number;
  lng: number;
  country_code?: string | null;
  /** IMPT's live results page for the same place. */
  results_url?: string;
};

export type PlaceSuggestion = { name: string; country_code: string | null; lat: number; lng: number };

export type HotelsPageResult = {
  place: Place | null;
  hotels: HotelSummary[];
  page: number;
  pages: number;
  total: number;
  page_size: number;
};

/** What the visitor asked for. Dates are YYYY-MM-DD. `childAges` has one entry per child. */
export type SearchState = {
  q: string;
  lat: number | null;
  lng: number | null;
  name: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  rooms: number;
  childAges: number[];
};
