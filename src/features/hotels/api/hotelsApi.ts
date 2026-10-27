import { buildSearchParams } from "../search";
import type { HotelDetails, HotelsPageResult, PlaceSuggestion, SearchState } from "../types";

/**
 * The hotels data service (static hotel facts: no prices). Every hotel it returns carries `book_url`,
 * IMPT's own detail page for that hotel, where live prices and checkout happen.
 * The key is limited to TravelMate's own websites and is rate-limited on the server.
 */
const BASE = (import.meta.env.VITE_HOTELS_API_BASE as string | undefined) || "https://grow.impt.io/hotels-api/v1";
const KEY = (import.meta.env.VITE_HOTELS_API_KEY as string | undefined) || "";

export class HotelsApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function get<T>(path: string, params: URLSearchParams, signal?: AbortSignal): Promise<T> {
  if (!KEY) throw new HotelsApiError("Hotel search is not set up yet.", 0);
  params.set("key", KEY);
  let response: Response;
  try {
    response = await fetch(`${BASE}${path}?${params.toString()}`, { signal });
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    throw new HotelsApiError("We could not reach the hotel service. Please try again.", 0);
  }
  let body: { ok?: boolean; error?: string } & Record<string, unknown> = {};
  try {
    body = (await response.json()) as typeof body;
  } catch {
    /* handled below */
  }
  if (!response.ok || body.ok === false) {
    const message =
      response.status === 429
        ? "Too many searches. Please wait a minute and try again."
        : body.error || "Something went wrong. Please try again.";
    throw new HotelsApiError(message, response.status);
  }
  return body as unknown as T;
}

export async function suggestPlaces(query: string, signal?: AbortSignal): Promise<PlaceSuggestion[]> {
  const data = await get<{ places: PlaceSuggestion[] }>("/places/suggest", new URLSearchParams({ q: query }), signal);
  return data.places;
}

export function searchHotels(search: SearchState, page: number, signal?: AbortSignal): Promise<HotelsPageResult> {
  return get<HotelsPageResult>("/hotels", buildSearchParams(search, { page: String(page) }), signal);
}

export async function getHotel(hotelId: string, search: SearchState, signal?: AbortSignal): Promise<HotelDetails> {
  // the hotel id is part of the path, so the place is not needed: only dates and guests, for the "Check price" link
  const params = buildSearchParams({ ...search, q: "", lat: null, lng: null, name: "" });
  const data = await get<{ hotel: HotelDetails }>(`/hotels/${encodeURIComponent(hotelId)}`, params, signal);
  return data.hotel;
}
