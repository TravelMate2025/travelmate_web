// Shared look for the /flights page sections (mock: 24px bold headings, 56px gaps).
export const SECTION_CLASS = "mt-14 flex flex-col gap-4.5";
export const SECTION_TITLE_CLASS = "text-2xl font-bold text-[#181818]";
export const SECTION_SUB_CLASS = "mt-1 text-[#4E4F52]";
export const CARD_SHADOW = "shadow-[0_10px_24px_-12px_rgba(15,23,42,0.35)]";

/** Destination photos (public/images/flights, CREDITS.md); others fall back to a gradient. */
export const CITY_PHOTOS: Record<string, string> = {
  LON: "/images/flights/city-london.jpg",
  LOS: "/images/flights/city-lagos.jpg",
  ABV: "/images/flights/city-abuja.jpg",
  DXB: "/images/hotels/dubai.jpg",
};

export const COUNTRY_NAMES: Record<string, string> = {
  NG: "Nigeria",
  GB: "the UK",
  GH: "Ghana",
  US: "the US",
};

export const COUNTRY_CHOICES = [
  { code: "NG", label: "Nigeria" },
  { code: "GB", label: "United Kingdom" },
  { code: "GH", label: "Ghana" },
  { code: "US", label: "United States" },
];
