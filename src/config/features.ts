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

const ON_PRODUCTS = [
  "hotels",
  ...(FEATURES.stays ? ["stays"] : []),
  ...(FEATURES.flights ? ["flights"] : []),
  ...(FEATURES.transfers ? ["airport transfers"] : []),
];

/** The products that are on, for page copy: "hotels", or "hotels, stays, flights, and airport transfers". */
export const PRODUCTS_TEXT =
  ON_PRODUCTS.length <= 2 ? ON_PRODUCTS.join(" and ") : `${ON_PRODUCTS.slice(0, -1).join(", ")}, and ${ON_PRODUCTS[ON_PRODUCTS.length - 1]}`;

/** FAQ categories (names from the backend) for a product that's switched off are hidden. */
export const isFaqCategoryOn = (name: string) => {
  const n = name.trim().toLowerCase();
  if (n.startsWith("stay")) return FEATURES.stays;
  if (n.startsWith("flight")) return FEATURES.flights;
  if (n.startsWith("car") || n.includes("transfer") || n.includes("taxi")) return FEATURES.transfers;
  return true;
};
