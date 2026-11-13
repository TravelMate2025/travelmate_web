// Which products the site shows. Set per environment at build time (Vercel:
// Production vs Preview, or .env.local), so `development` can always be
// promoted to `production` and unfinished products stay hidden there.
//
// Off unless set to "on": a production build with no settings shows hotels
// only (hotels are always on), which is the safe default.
//
//   VITE_FEATURE_STAYS=on       Stays (our backend's stays search and booking)
//   VITE_FEATURE_TRANSFERS=on   Airport transfers
//   VITE_FEATURE_FLIGHTS=on     Flights
//   VITE_FEATURE_APP_PROMO=on   "Get the TravelMate App" section (once the app is in the stores)

const isOn = (value: string | undefined) => value === "on";

export const FEATURES = {
  stays: isOn(import.meta.env.VITE_FEATURE_STAYS),
  transfers: isOn(import.meta.env.VITE_FEATURE_TRANSFERS),
  flights: isOn(import.meta.env.VITE_FEATURE_FLIGHTS),
  appPromo: isOn(import.meta.env.VITE_FEATURE_APP_PROMO),
} as const;

/** Bookings made on TravelMate itself (My bookings, Favorites): only when a product we book is on. */
export const HAS_TRAVELMATE_BOOKINGS = FEATURES.stays || FEATURES.transfers || FEATURES.flights;

/** Hotels only: the home page is the hotels search. */
export const HOTELS_ONLY = !HAS_TRAVELMATE_BOOKINGS;

/** Account sidebar links: Reviews are stay reviews, so only with Stays on. */
export const showAccountLink = (item: { link?: string }) => FEATURES.stays || item.link !== "/account/reviews";
