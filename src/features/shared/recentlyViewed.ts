import { Hotel } from "../stays/types";
import { CarTransferOption } from "../car_rentals/types/booking";
import { CarInfo } from "../car_rentals/carPaymentSlice";
import { FlightOffer } from "../flights/types";

// Same localStorage pattern as PartnerStaySearchPage's recent-destination-
// searches (readRecentSearches/writeRecentSearches) -- generalized into a
// real shared module since none existed yet, and extended to a structured
// per-kind payload instead of a flat string list.
const storageKey = "travelmate_recently_viewed";
const maxEntries = 20;

export type RecentlyViewedKind = "stay" | "flight" | "transfer";

export interface RecentlyViewedItem {
  kind: RecentlyViewedKind;
  id: string;
  viewedAt: string; // ISO timestamp
  title: string;
  subtitle: string;
  imageUrl: string | null;
  priceLabel: string | null;
  // Kind-specific navigation data -- a snapshot, not re-fetched:
  //  - stay: the full Hotel object, exactly as passed to /stay-details today
  //  - transfer: { car, departureInfo }, exactly what TransferDetail.tsx
  //    reads from location.state today
  //  - flight: { origin, destination, departureDate, returnDate } -- flight
  //    offers expire, so tapping through re-runs a fresh search instead of
  //    attempting to resume this exact (possibly stale) offer
  payload: unknown;
}

function dedupeKey(kind: RecentlyViewedKind, id: string) {
  return `${kind}:${id}`;
}

export function getRecentlyViewed(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentlyViewedItem[];
    if (!Array.isArray(parsed)) return [];
    return [...parsed].sort(
      (a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime(),
    );
  } catch {
    return [];
  }
}

export function recordViewed(item: Omit<RecentlyViewedItem, "viewedAt">) {
  if (typeof window === "undefined") return;
  try {
    const key = dedupeKey(item.kind, item.id);
    const existing = getRecentlyViewed().filter(
      (entry) => dedupeKey(entry.kind, entry.id) !== key,
    );
    const next = [{ ...item, viewedAt: new Date().toISOString() }, ...existing].slice(
      0,
      maxEntries,
    );
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    // ignore storage failures
  }
}

function formatPrice(amount: number, currency?: string | null): string {
  const symbol = !currency || currency === "NGN" ? "₦" : `${currency} `;
  return `${symbol}${Math.round(amount).toLocaleString()}`;
}

export function recentlyViewedFromHotel(hotel: Hotel): RecentlyViewedItem {
  const id = hotel.id ?? hotel.code ?? "";
  const coverImg = hotel.images?.find((img) => img.type === "GEN") ?? hotel.images?.[0];
  return {
    kind: "stay",
    id,
    viewedAt: new Date().toISOString(),
    title: hotel.name,
    subtitle: hotel.city ?? hotel.destination?.name ?? "",
    imageUrl: coverImg?.secureUrl ?? coverImg?.url ?? null,
    priceLabel: hotel.priceFrom != null ? formatPrice(hotel.priceFrom, hotel.currency) : null,
    payload: hotel,
  };
}

export function recentlyViewedFromTransfer(
  car: CarTransferOption,
  departureInfo: CarInfo,
): RecentlyViewedItem {
  const id = String(car.id ?? "");
  const image = car.content?.images?.[0];
  const price = car.price?.totalAmount ?? car.base_fare;
  return {
    kind: "transfer",
    id,
    viewedAt: new Date().toISOString(),
    title: car.name ?? car.vehicle?.name ?? "Transfer",
    subtitle: car.provider?.displayName ?? car.vehicle?.name ?? "",
    imageUrl: image?.secureUrl ?? image?.url ?? null,
    priceLabel: price != null ? formatPrice(price, car.price?.currencyId ?? car.currency) : null,
    payload: { car, departureInfo },
  };
}

export function recentlyViewedFromFlightOffer(offer: FlightOffer): RecentlyViewedItem {
  const segments = offer.itineraries?.[0]?.segments ?? [];
  const origin = segments[0]?.departure?.iataCode;
  const destination = segments[segments.length - 1]?.arrival?.iataCode;
  const departureDate = segments[0]?.departure?.at;
  const returnSegments = offer.itineraries?.[1]?.segments;
  const returnDate = returnSegments?.[0]?.departure?.at;
  const id = `${origin ?? "?"}-${destination ?? "?"}-${departureDate ?? offer.id}`;
  const airline = segments[0]?.airline?.name ?? segments[0]?.carrierCode ?? "";

  return {
    kind: "flight",
    id,
    viewedAt: new Date().toISOString(),
    title: [origin, destination].filter(Boolean).join(" → "),
    subtitle: airline,
    imageUrl: null,
    priceLabel:
      offer.price?.total != null ? formatPrice(Number(offer.price.total), offer.price.currency) : null,
    payload: { origin, destination, departureDate, returnDate },
  };
}
