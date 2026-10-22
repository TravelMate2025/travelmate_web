// Sample content for the Hotels page. Photos are saved in public/images/hotels
// (originals from Pexels). Prices are "from" figures in EUR for display only
// until the live hotel search is wired in.

export type DestinationTag = "City" | "Beach" | "Mountains";

export type Destination = {
  name: string;
  country: string;
  tag: DestinationTag;
  image: string;
  alt: string;
  priceEur: number;
  months: string;
  blurb: string;
};

export type Stay = {
  id: string;
  name: string;
  place: string;
  score: string;
  priceEur: number;
  perk: string;
  badge: string;
  image: string;
  alt: string;
};

const img = (name: string) => `/images/hotels/${name}.jpg`;

export const HERO_IMAGE = img("hero");

export const destinations: Destination[] = [
  { name: "Santorini", country: "Greece", tag: "Beach", image: img("santorini"), alt: "Oia village with windmills at dusk", priceEur: 132, months: "May–Oct", blurb: "Cliffside suites, caldera sunsets and plunge pools over the Aegean." },
  { name: "Kyoto", country: "Japan", tag: "City", image: img("kyoto"), alt: "Kiyomizu-dera temple in Kyoto", priceEur: 118, months: "Oct–Nov", blurb: "Maple season, temple mornings and ryokan baths at dusk." },
  { name: "Lisbon", country: "Portugal", tag: "City", image: img("lisbon"), alt: "Rooftops of the Alfama district", priceEur: 89, months: "Mar–Jun", blurb: "Tiled hills, river light and dinners that start at ten." },
  { name: "Dolomites", country: "Italy", tag: "Mountains", image: img("dolomites"), alt: "Alpine lake below Dolomite peaks", priceEur: 124, months: "Jun–Sep", blurb: "Pale peaks, lakeside lodges and hut-to-hut walks." },
  { name: "Bali", country: "Indonesia", tag: "Beach", image: img("bali"), alt: "Cliffside villa above the ocean", priceEur: 64, months: "Apr–Oct", blurb: "Jungle villas, surf breaks and infinity pools on the cliffs." },
  { name: "Paris", country: "France", tag: "City", image: img("paris"), alt: "Paris street with the Eiffel Tower", priceEur: 146, months: "Apr–Jun", blurb: "Left Bank hotels and the long walk home along the Seine." },
  { name: "Marrakech", country: "Morocco", tag: "City", image: img("marrakech"), alt: "Riad courtyard with arches and fountain", priceEur: 72, months: "Mar–May", blurb: "Riads behind plain doors, rooftops above the souk." },
  { name: "Maldives", country: "Maldives", tag: "Beach", image: img("maldives"), alt: "Overwater bungalows on turquoise water", priceEur: 310, months: "Nov–Apr", blurb: "Overwater villas, house reefs and nothing on the calendar." },
  { name: "Chamonix", country: "France", tag: "Mountains", image: img("chamonix"), alt: "Chalet in the snowy French Alps", priceEur: 158, months: "Dec–Mar", blurb: "Ski-in chalets beneath Mont Blanc and fondue after dark." },
  { name: "New York", country: "United States", tag: "City", image: img("new-york"), alt: "Manhattan skyline from the Brooklyn Bridge", priceEur: 189, months: "Sep–Dec", blurb: "Loft hotels, late bars and the skyline from your window." },
  { name: "Cape Town", country: "South Africa", tag: "Beach", image: img("cape-town"), alt: "Cape Town coastline and Table Mountain", priceEur: 81, months: "Nov–Mar", blurb: "Two oceans, one mountain and long summer evenings." },
];

export const moreDestinations: Pick<Destination, "name" | "country" | "image" | "alt" | "priceEur">[] = [
  { name: "Barcelona", country: "Spain", image: img("barcelona"), alt: "Sagrada Família from above", priceEur: 112 },
  { name: "Rome", country: "Italy", image: img("rome"), alt: "Colosseum at sunset", priceEur: 128 },
  { name: "Amsterdam", country: "Netherlands", image: img("amsterdam"), alt: "Canal houses", priceEur: 139 },
  { name: "Dubai", country: "United Arab Emirates", image: img("dubai"), alt: "Dubai Marina skyline", priceEur: 154 },
  { name: "Istanbul", country: "Türkiye", image: img("istanbul"), alt: "Mosque on the waterfront at sunset", priceEur: 76 },
  { name: "Bangkok", country: "Thailand", image: img("bangkok"), alt: "Bangkok skyline with temples", priceEur: 48 },
  { name: "Sydney", country: "Australia", image: img("sydney"), alt: "Sydney Opera House", priceEur: 171 },
  { name: "Tulum", country: "Mexico", image: img("tulum"), alt: "Tulum coastline", priceEur: 98 },
  { name: "Iceland", country: "Iceland", image: img("iceland"), alt: "Godafoss waterfall", priceEur: 165 },
  { name: "Prague", country: "Czechia", image: img("prague"), alt: "Prague bridges from above", priceEur: 74 },
  { name: "Positano", country: "Italy", image: img("positano"), alt: "Positano houses on the cliffs", priceEur: 196 },
  { name: "Rio de Janeiro", country: "Brazil", image: img("rio"), alt: "Vidigal beach, Rio", priceEur: 83 },
];

export const topStays: Stay[] = [
  { id: "casa-alfama", name: "Casa Alfama", place: "Lisbon", score: "9.2", priceEur: 142, perk: "Breakfast included", badge: "Guest favourite", image: img("stay-casa-alfama"), alt: "Boutique hotel bedroom" },
  { id: "mar-azul", name: "Mar Azul Suites", place: "Santorini", score: "9.5", priceEur: 268, perk: "Sea-view terrace", badge: "Sea view", image: img("stay-mar-azul"), alt: "Seaside bedroom with ocean view" },
  { id: "riad-noor", name: "Riad Noor", place: "Marrakech", score: "9.0", priceEur: 96, perk: "Rooftop pool", badge: "Guest favourite", image: img("stay-riad-noor"), alt: "Moroccan bedroom with traditional decor" },
  { id: "pine-loft", name: "Pine Loft Chalet", place: "Chamonix", score: "9.3", priceEur: 214, perk: "Ski-in, ski-out", badge: "Only 2 rooms left", image: img("stay-pine-loft"), alt: "Rustic loft bedroom with wooden beams" },
];

export const stayTypes = [
  { name: "Hotels", line: "From city boutiques up", image: img("type-hotels"), alt: "Sunlit hotel lobby" },
  { name: "Resorts", line: "Pools, spas, all-inclusive", image: img("type-resorts"), alt: "Resort with winding pools" },
  { name: "Villas", line: "Room for the whole group", image: img("type-villas"), alt: "Cliffside villa in Bali" },
  { name: "Overwater", line: "Sleep above the reef", image: img("type-overwater"), alt: "Overwater villas" },
  { name: "Chalets", line: "Snow at the door", image: img("type-chalets"), alt: "Snow-covered chalets" },
  { name: "Riads", line: "Courtyards & fountains", image: img("type-riads"), alt: "Riad courtyard from above" },
];

export const promises = [
  { n: "01", title: "Clear prices", body: "Taxes and fees shown before you pay, not at the last step." },
  { n: "02", title: "Reviews from real guests", body: "Only people who stayed can leave a review." },
  { n: "03", title: "Secure booking", body: "Encrypted payments and instant confirmation by email." },
  { n: "04", title: "Your trips in one place", body: "View, change or share every booking from your account." },
];

export const reviews = [
  { quote: "Booked the riad on a Tuesday, on its roof terrace by Friday. Better than the photos.", who: "Inés · Marrakech", score: "9.6" },
  { quote: "Spotless room, kind staff and a view we still talk about.", who: "Priya · Kyoto", score: "9.4" },
  { quote: "Booking took two minutes. The suite took our breath away.", who: "Tom · Santorini", score: "9.8" },
];

export const guides = [
  { kicker: "Islands", title: "Ten quiet Greek islands, ranked by ferry time", read: "8 min read", image: img("guide-greek"), alt: "Blue dome church over the Aegean" },
  { kicker: "Season", title: "Where it’s still warm in November", read: "5 min read", image: img("guide-november"), alt: "Tropical beach from above" },
  { kicker: "City", title: "48 hours in Lisbon, one viewpoint at a time", read: "6 min read", image: img("guide-lisbon"), alt: "Lisbon bridge at sunset" },
];

export const trending = ["Weekend in Lisbon", "Kyoto in November", "Ski chalets", "Pet-friendly", "Riads with pools", "Under €80 a night"];

export const searchTabs = ["Hotels", "Homes & villas", "Resorts"] as const;

export const destinationFilters = ["All", "City", "Beach", "Mountains"] as const;

export const formatEur = (value: number) => `€${Math.round(value)}`;
