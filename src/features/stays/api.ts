import {
  BookingDetailsVerifyData,
  BookingHoldReq,
  BookingHoldResp,
  BookingQuoteReq,
  BookingQuoteResp,
  BookingStaysVerifyDetails,
  BookStaysRequest,
  BookStaysResponse,
  Destination,
  Hotel,
  HotelSearchResponse,
  StayPricing,
} from "./types";
import api from "../../api/services/api";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { fetchPartnerStayLocations } from "../shared/partnerLocationsService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type StaySearchParams = {
  destination?: string;
  country?: string;
  adminLevel1?: string;
  city?: string;
  stayType?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  rooms?: number;
};

function mapPartnerStayLocationToDestination(
  location: {
    country: string;
    adminLevel1: string;
    city: string;
    listingCount: number;
    areas: string[];
    displayName: string;
  },
): Destination {
  return {
    code: location.city,
    name: location.displayName,
    country_code: location.country.slice(0, 2).toUpperCase(),
    country_name: location.country,
    city_name: location.city,
  };
}

function normalizePublicCatalogResults(input: unknown): unknown[] {
  if (Array.isArray(input)) {
    return input;
  }
  if (input && typeof input === "object") {
    const maybe = input as {
      data?: unknown;
      results?: unknown;
    };
    if (Array.isArray(maybe.results)) {
      return maybe.results;
    }
    if (Array.isArray(maybe.data)) {
      return maybe.data;
    }
    if (maybe.data && typeof maybe.data === "object") {
      const nested = maybe.data as { results?: unknown };
      if (Array.isArray(nested.results)) {
        return nested.results;
      }
    }
  }
  return [];
}

function mapPublicCatalogStayToHotel(item: unknown): Hotel {
  const stay = item as {
    id?: string;
    code?: string;
    name?: string;
    propertyType?: string;
    saleMode?: string;
    bookingOptions?: { saleMode?: string };
    country?: string;
    adminLevel1?: string;
    city?: string;
    area?: string;
    priceFrom?: number;
    ratingScore?: number;
    reviewsCount?: number;
    address?: string;
    description?: string;
    rooms?: Hotel["rooms"];
    images?: Hotel["images"];
    amenities?: string[];
    amenityDetails?: Hotel["amenityDetails"];
    coordinates?: Hotel["coordinates"];
    destination?: Hotel["destination"];
    roomSummary?: unknown;
    mediaSummary?: unknown;
    checkInTime?: string;
    checkOutTime?: string;
  };

  return {
    id: stay.id ?? stay.code,
    code: stay.code ?? stay.id,
    name: stay.name ?? "Stay",
    saleMode: stay.bookingOptions?.saleMode ?? stay.saleMode,
    propertyType: stay.propertyType,
    country: stay.country,
    adminLevel1: stay.adminLevel1,
    city: stay.city,
    address: stay.address ?? "",
    description: stay.description,
    priceFrom: stay.priceFrom,
    ratingScore: stay.ratingScore,
    reviewsCount: stay.reviewsCount,
    checkInTime: stay.checkInTime,
    checkOutTime: stay.checkOutTime,
    rooms: stay.rooms,
    images: stay.images,
    amenities: stay.amenities,
    amenityDetails: stay.amenityDetails,
    coordinates: stay.coordinates,
    roomSummary: stay.roomSummary as Record<string, unknown> | undefined,
    mediaSummary: stay.mediaSummary as Record<string, unknown> | undefined,
    bookingOptions: stay.bookingOptions as Record<string, unknown> | undefined,
    destination:
      stay.destination ??
      (stay.city
        ? {
            code: stay.city.toLowerCase().replace(/\s+/g, "-"),
            name: stay.city,
          }
        : undefined),
  };
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const resp = error.response?.data as unknown;
    if (resp && typeof resp === "object") {
      const maybe = resp as { error?: string; detail?: unknown; message?: string };
      if (maybe.error) return String(maybe.error);
      if (Array.isArray(maybe.detail)) return String(maybe.detail[0]);
      if (maybe.message) return String(maybe.message);
    }
    return (error as AxiosError).message || String(error);
  }
  return error instanceof Error ? error.message : String(error);
}
/**
 * Fetch partner stay destinations with optional search.
 */
export const fetchDestinations = async (
  search?: string,
  token?: string | null,
): Promise<Destination[]> => {
  void token;
  try {
    const response = await fetchPartnerStayLocations();
    const query = search?.toLowerCase().trim();
    return response.locations
      .map(mapPartnerStayLocationToDestination)
      .filter((item) => {
        if (!query) return true;
        return [item.code, item.name, item.city_name, item.country_code]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      });
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error) || "Error fetching destinations";
    console.error("Error fetching destinations:", errorMessage);
    toast.error(errorMessage);
    return [];
  }
};

/**
 * Fetch recommended hotels
 */
export const fetchRecommendedHotels = async (): Promise<Destination[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/hotels/recommend/`);
    return response.data.results;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error("Error fetching recommended hotels:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Search partner stays
 */
export const searchStays = async (
  searchParams: StaySearchParams,
): Promise<HotelSearchResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/v1/public/catalog/stays`, {
      params: {
        country: searchParams.country,
        adminLevel1: searchParams.adminLevel1,
        city: searchParams.city ?? searchParams.destination,
        area: undefined,
      },
    });
    const results = normalizePublicCatalogResults(response.data).map(mapPublicCatalogStayToHotel);
    const normalized: HotelSearchResponse = {
      count: results.length,
      results,
    };
    console.debug("[Stays][search] response", normalized);
    return normalized;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    toast.error("Search error: " + errorMessage);
    throw new Error(errorMessage);
  }
};

export const searchHotels = searchStays;

/**
 * Fetch partner stay pricing — GET /api/v1/public/catalog/stays/{stayId}/pricing
 */
export const fetchStayPricing = async (stayId: string): Promise<StayPricing> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/v1/public/catalog/stays/${stayId}/pricing`,
    );
    return (response.data?.data ?? response.data) as StayPricing;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error) || `Failed to load pricing for ${stayId}`;
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get hotel details
 */
export const getHotelDetails = async (
  hotelId: string,
  checkIn: string,
  checkOut: string,
  adults: number = 1,
  children: number = 0,
  rooms: number = 1,
): Promise<Hotel> => {
  try {
    const response = await axios.get(`${BASE_URL}/v1/public/catalog/stays/${hotelId}`, {
      params: {
        check_in: checkIn,
        check_out: checkOut,
        adults,
        children,
        rooms,
      },
    });
    console.debug("[Stays][detail] response", response.data);
    return (response.data?.data ?? response.data) as Hotel;
  } catch (error: unknown) {
    let errorMessage = `Failed to get details for hotel ${hotelId}`;
    if (axios.isAxiosError(error)) {
      const resp = error.response?.data as unknown;
      if (resp && typeof resp === "object" && "error" in resp) {
        errorMessage = String((resp as { error?: string }).error);
      } else if ((error as AxiosError).message) {
        errorMessage = (error as AxiosError).message;
      }
    }
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Create checkout session
 */
export const createCheckoutSession = async (
  bookingData: BookStaysRequest,
  setLoading?: (loading: boolean) => void,
): Promise<BookStaysResponse> => {
  try {
    setLoading?.(true);
    const response = await api.post("/hotels/checkout/", bookingData);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error) || "Something went wrong!";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setLoading?.(false);
  }
};

/**
 * Verify hotel booking
 */
export const verifyHotelBooking = async (
  sessionId: string | null,
): Promise<BookingStaysVerifyDetails> => {
  console.debug("[Stays][verify] request", { sessionId });
  try {
    const response = await api.get(
      `/v1/public/bookings/verification?payment_intent_id=${encodeURIComponent(sessionId ?? "")}`,
    );
    console.debug("[Stays][verify] response", response.data);
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error) || "Something went wrong!";
    console.debug("[Stays][verify] failed", error);
    toast.error(errorMessage);
    return {
      data: {} as BookingDetailsVerifyData,
      success: false,
      error: error instanceof Error ? error.message : "Failed to get booking details",
    };
  }
};

/**
 * Verify transfers booking
 */
export const verifyTransfersBooking = async (
  sessionId: string | null,
): Promise<BookingStaysVerifyDetails> => {
  try {
    const response = await api.get(
      `/transfers/booking/confirmation/by-session/?payment_intent_id=${encodeURIComponent(sessionId ?? "")}`,
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error) || "Something went wrong!";
    toast.error(errorMessage);
    return {
      data: {} as BookingDetailsVerifyData,
      success: false,
      error: error instanceof Error ? error.message : "Failed to get booking details",
    };
  }
};

// Fetch all reviews

export const getReviews = async (hotelId: string | number | undefined) => {
  try {
    const response = await axios.get(`/hotels/${hotelId}/reviews/`);
    console.log(response);
    return response.data.user_reviews;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error("Failed to fetch reviews:", errorMessage);
    throw new Error(errorMessage || "Failed to fetch reviews");
  }
};
export const getUserReviews = async () => {
  try {
    const response = await api.get(`/hotels/my-reviews/`);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error) || "Failed to fetch reviews");
  }
};
export const getUserReview = async (hotelId:string) => {
  try {
    const response = await api.get(`/hotels/${hotelId}/my-review/`);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error) || "Failed to fetch reviews");
  }
};
export const deleteUserReview = async (hotelId:string) => {
  try {
    const response = await api.delete(`/hotels/${hotelId}/my-review/`);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error) || "Failed to fetch reviews");
  }
};

export const submitReview = async (
  hotelId: string | undefined | number,
  id: string | undefined | number,
  comment: string,
  title: number,
  rating: number,
) => {
  try {
    const response = await api.post(`/hotels/${hotelId}/reviews/`, {
      rating,
      title,
      comment,
      id,
    });
    console.log(response);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error("Failed to submit review:", errorMessage);
    throw new Error(errorMessage || "Failed to submit review");
  }
};

export const deleteReview = async (reviewId: number) => {
  try {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error("Failed to delete review:", errorMessage);
    throw new Error(errorMessage || "Failed to delete review");
  }
};

// Favorites
export const fetchFavorites = async () => {
  try {
    const response = await api.get("/hotels/favorites/");
    console.log(response.data);
    return response;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error("Error fetching favorites:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const addOrRemoveFavorite = async (
  hotelId: string | null,
  setIsFavorite: (isFav: boolean) => void,
  favorite: boolean,
) => {
  try {
    const response = await api.post("/hotels/favorites/toggle/", {
      hotel_id: hotelId,
    });
    setIsFavorite(!favorite);
    return response.data.message;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error("Error adding favorite:", errorMessage);
    throw new Error(errorMessage);
  }
};

// Bookings cache
let cachedResponse: unknown = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 60 * 1000;

export const fetchAllBookings = async (forceRefresh = false) => {
  const now = Date.now();
  if (
    !forceRefresh &&
    cachedResponse &&
    cacheTimestamp &&
    now - cacheTimestamp < CACHE_DURATION
  ) {
    return cachedResponse;
  }

  try {
    const response = await api.get<{ stays?: unknown[]; transfers?: unknown[]; flights?: unknown[] }>(`/bookings/my/`);
    cachedResponse = response;
    cacheTimestamp = now;
    return response;
  } catch (error: unknown) {
    cachedResponse = null;
    cacheTimestamp = null;
    const errorMessage = getErrorMessage(error) || "Something went wrong!";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Cancel bookings
export const CancelStaysBookings = async (
  bookingId: string | undefined,
  setLoading?: (loading: boolean) => void,
  cancellation_reason?: string,
) => {
  try {
    setLoading?.(true);
    const response = await api.post(
      `/hotels/${bookingId}/cancel-booking/`,
      cancellation_reason,
    );
    return response.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error) || String(error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setLoading?.(false);
  }
};

/**
 * Create a quote lock — POST /api/v1/public/bookings/quote
 */
export const createQuote = async (req: BookingQuoteReq): Promise<BookingQuoteResp> => {
  try {
    const response = await axios.post(`${BASE_URL}/v1/public/bookings/quote`, req);
    return (response.data?.data ?? response.data) as BookingQuoteResp;
  } catch (error: unknown) {
    const msg = getErrorMessage(error) || "Failed to create quote";
    toast.error(msg);
    throw new Error(msg);
  }
};

/**
 * Create a hold from a quote lock — POST /api/v1/public/bookings/holds
 */
export const createHold = async (req: BookingHoldReq): Promise<BookingHoldResp> => {
  try {
    const response = await axios.post(`${BASE_URL}/v1/public/bookings/holds`, req);
    return (response.data?.data ?? response.data) as BookingHoldResp;
  } catch (error: unknown) {
    const msg = getErrorMessage(error) || "Failed to create hold";
    toast.error(msg);
    throw new Error(msg);
  }
};

export const CancelTransferBookings = async (
  bookingId: string | undefined,
  setLoading?: (loading: boolean) => void,
  reason?: string,
) => {
  try {
    setLoading?.(true);
    const response = await api.post(
      `/transfers/booking/${bookingId}/cancel/`,
      reason,
    );
    return response.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error) || String(error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setLoading?.(false);
  }
};
