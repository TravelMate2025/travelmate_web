// Sample content for the Hotels page. Photos are saved in public/images/hotels
// (originals from Pexels). Prices are "from" figures in EUR for display only
// until the live hotel search is wired in.

export type DestinationTag = "City" | "Beach" | "Mountains";

export type Destination = {
  name: string;
  lat: number;
  lng: number;
  country: string;
  tag: DestinationTag;
  image: string;
  alt: string;
  months: string;
  blurb: string;
};

const img = (name: string) => `/images/hotels/${name}.jpg`;

export const HERO_IMAGE = img("hero");

export const destinations: Destination[] = [
  { name: "Santorini", lat: 36.42107, lng: 25.43087, country: "Greece", tag: "Beach", image: img("santorini"), alt: "Oia village with windmills at dusk", months: "May–Oct", blurb: "Cliffside suites, caldera sunsets and plunge pools over the Aegean." },
  { name: "Kyoto", lat: 35.02107, lng: 135.75385, country: "Japan", tag: "City", image: img("kyoto"), alt: "Kiyomizu-dera temple in Kyoto", months: "Oct–Nov", blurb: "Maple season, temple mornings and ryokan baths at dusk." },
  { name: "Lisbon", lat: 38.72509, lng: -9.1498, country: "Portugal", tag: "City", image: img("lisbon"), alt: "Rooftops of the Alfama district", months: "Mar–Jun", blurb: "Tiled hills, river light and dinners that start at ten." },
  { name: "Dolomites", lat: 46.5405, lng: 12.1357, country: "Italy", tag: "Mountains", image: img("dolomites"), alt: "Alpine lake below Dolomite peaks", months: "Jun–Sep", blurb: "Pale peaks, lakeside lodges and hut-to-hut walks." },
  { name: "Bali", lat: -8.5098, lng: 115.2654, country: "Indonesia", tag: "Beach", image: img("bali"), alt: "Cliffside villa above the ocean", months: "Apr–Oct", blurb: "Jungle villas, surf breaks and infinity pools on the cliffs." },
  { name: "Paris", lat: 48.85341, lng: 2.3488, country: "France", tag: "City", image: img("paris"), alt: "Paris street with the Eiffel Tower", months: "Apr–Jun", blurb: "Left Bank hotels and the long walk home along the Seine." },
  { name: "Marrakech", lat: 31.63416, lng: -7.99994, country: "Morocco", tag: "City", image: img("marrakech"), alt: "Riad courtyard with arches and fountain", months: "Mar–May", blurb: "Riads behind plain doors, rooftops above the souk." },
  { name: "Maldives", lat: 4.17521, lng: 73.50916, country: "Maldives", tag: "Beach", image: img("maldives"), alt: "Overwater bungalows on turquoise water", months: "Nov–Apr", blurb: "Overwater villas, house reefs and nothing on the calendar." },
  { name: "Chamonix", lat: 45.92375, lng: 6.86933, country: "France", tag: "Mountains", image: img("chamonix"), alt: "Chalet in the snowy French Alps", months: "Dec–Mar", blurb: "Ski-in chalets beneath Mont Blanc and fondue after dark." },
  { name: "New York", lat: 40.71427, lng: -74.00597, country: "United States", tag: "City", image: img("new-york"), alt: "Manhattan skyline from the Brooklyn Bridge", months: "Sep–Dec", blurb: "Loft hotels, late bars and the skyline from your window." },
  { name: "Cape Town", lat: -33.92584, lng: 18.42322, country: "South Africa", tag: "Beach", image: img("cape-town"), alt: "Cape Town coastline and Table Mountain", months: "Nov–Mar", blurb: "Two oceans, one mountain and long summer evenings." },
];

export const moreDestinations: Pick<Destination, "name" | "lat" | "lng" | "country" | "image" | "alt">[] = [
  { name: "Barcelona", lat: 41.38879, lng: 2.15899, country: "Spain", image: img("barcelona"), alt: "Sagrada Família from above" },
  { name: "Rome", lat: 41.89193, lng: 12.51133, country: "Italy", image: img("rome"), alt: "Colosseum at sunset" },
  { name: "Amsterdam", lat: 52.37403, lng: 4.88969, country: "Netherlands", image: img("amsterdam"), alt: "Canal houses" },
  { name: "Dubai", lat: 25.07725, lng: 55.30927, country: "United Arab Emirates", image: img("dubai"), alt: "Dubai Marina skyline" },
  { name: "Istanbul", lat: 41.01384, lng: 28.94966, country: "Türkiye", image: img("istanbul"), alt: "Mosque on the waterfront at sunset" },
  { name: "Bangkok", lat: 13.75398, lng: 100.50144, country: "Thailand", image: img("bangkok"), alt: "Bangkok skyline with temples" },
  { name: "Sydney", lat: -33.86785, lng: 151.20732, country: "Australia", image: img("sydney"), alt: "Sydney Opera House" },
  { name: "Tulum", lat: 20.21173, lng: -87.46325, country: "Mexico", image: img("tulum"), alt: "Tulum coastline" },
  { name: "Iceland", lat: 64.13548, lng: -21.89541, country: "Iceland", image: img("iceland"), alt: "Godafoss waterfall" },
  { name: "Prague", lat: 50.08804, lng: 14.42076, country: "Czechia", image: img("prague"), alt: "Prague bridges from above" },
  { name: "Positano", lat: 40.62829, lng: 14.48427, country: "Italy", image: img("positano"), alt: "Positano houses on the cliffs" },
  { name: "Rio de Janeiro", lat: -22.90642, lng: -43.18223, country: "Brazil", image: img("rio"), alt: "Vidigal beach, Rio" },
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

export const trending = [
  { label: "Weekend in Lisbon", spot: { name: "Lisbon", lat: 38.72509, lng: -9.1498 } },
  { label: "Kyoto in November", spot: { name: "Kyoto", lat: 35.02107, lng: 135.75385 } },
  { label: "Ski chalets", spot: { name: "Chamonix", lat: 45.92375, lng: 6.86933 } },
  { label: "Riads with pools", spot: { name: "Marrakech", lat: 31.63416, lng: -7.99994 } },
  { label: "Beach escapes", spot: { name: "Santorini", lat: 36.42107, lng: 25.43087 } },
] as const;

export const destinationFilters = ["All", "City", "Beach", "Mountains"] as const;

