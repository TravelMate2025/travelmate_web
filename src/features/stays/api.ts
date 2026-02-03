import {
  BookingDetailsVerifyData,
  BookingStaysVerifyDetails,
  BookStaysRequest,
  BookStaysResponse,
  Destination,
  Hotel,
  HotelSearchResponse,
} from './types';
import api from '../../api/services/api';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://travelmate-backend-0suw.onrender.com/api';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Cache for destinations
const recommendedHotelsCache: { [key: string]: CacheEntry<Destination[]> } = {};
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

/**
 * Fetch hotel destinations with optional search and token.
 * Uses caching for repeated requests.
 */
export const fetchDestinations = async (
  search?: string,
  token?: string | null
): Promise<Destination[]> => {
  const now = Date.now();
  const normalizedSearch = search?.toLowerCase().trim() || 'default';
  const cacheKey = `hotel_destinations_${normalizedSearch}`;
  const cachedEntry = recommendedHotelsCache[cacheKey];

  if (cachedEntry && now - cachedEntry.timestamp < CACHE_DURATION_MS) {
    return cachedEntry.data;
  }

  try {
    const params = search ? { search: normalizedSearch } : {};
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.get(`${BASE_URL}/hotels/destinations/`, {
      params,
      headers,
    });

    const results: Destination[] = response.data.results || response.data;

    recommendedHotelsCache[cacheKey] = { data: results, timestamp: now };

    return results;
  } catch (error: any) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.error || error.message
      : error.message || 'Error fetching destinations';
    console.error('Error fetching destinations:', errorMessage);
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
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('Error fetching recommended hotels:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Search hotels
 */
export const searchHotels = async (
  destination: string,
  checkIn: string,
  checkOut: string,
  adults: number = 1,
  children: number = 0,
  rooms: number = 1
): Promise<HotelSearchResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/hotels/search/`, {
      params: {
        destination,
        check_in: checkIn,
        check_out: checkOut,
        adults,
        children,
        rooms,
        include_details: true,
      },
    });
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    toast.error('Search error: ' + errorMessage);
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
  rooms: number = 1
): Promise<Hotel> => {
  try {
    const response = await axios.get(`${BASE_URL}/hotels/${hotelId}/details/`, {
      params: { check_in: checkIn, check_out: checkOut, adults, children, rooms },
    });
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || `Failed to get details for hotel ${hotelId}`;
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Create checkout session
 */
export const createCheckoutSession = async (
  bookingData: BookStaysRequest,
  setLoading?: (loading: boolean) => void
): Promise<BookStaysResponse> => {
  try {
    setLoading?.(true);
    const response = await api.post('/hotels/checkout/', bookingData);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || error.message || 'Something went wrong!';
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
  sessionId: string | null
): Promise<BookingStaysVerifyDetails> => {
  try {
    const response = await api.get(`/hotels/verify-booking/?session_id=${sessionId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || error.message || 'Something went wrong!';
    toast.error(errorMessage);
    return {
      data: {} as BookingDetailsVerifyData,
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get booking details',
    };
  }
};

/**
 * Verify transfers booking
 */
export const verifyTransfersBooking = async (
  sessionId: string | null
): Promise<any> => {
  try {
    const response = await api.get(
      `/transfers/booking/confirmation/by-session/?session_id=${sessionId}`
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || error.message || 'Something went wrong!';
    toast.error(errorMessage);
    return {
      data: {} as BookingDetailsVerifyData,
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get booking details',
    };
  }
};

// Fetch all reviews

export const getReviews = async (hotelId: string | number | undefined) => {
  try {
    const response = await axios.get(`/hotels/${hotelId}/reviews/`)
    console.log(response)
    return response.data.user_reviews
  } catch (error: any) {
    console.error('Failed to fetch reviews:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
  }
};

export const submitReview = async (hotelId: string | undefined | number, id: string | undefined | number, comment: string, title: number, rating: number) => {
  try {
    const response = await api.post(`/hotels/${hotelId}/reviews/`, {
      rating,
      title,
      comment,
      id


    });
    console.log(response)
    return response.data;
  } catch (error: any) {
    console.error('Failed to submit review:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to submit review');
  }
};

export const deleteReview = async (reviewId: number) => {
  try {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to delete review:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete review');
  }
};

// Favorites
export const fetchFavorites = async () => {
  try {
    const response = await api.get('/hotels/favorites/');
    console.log(
      response.data
    )
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('Error fetching favorites:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const addOrRemoveFavorite = async (
  hotelId: string | null,
  setIsFavorite: (data: boolean) => void,
  favorite: boolean
) => {
  try {
    const response = await api.post('/hotels/favorites/toggle/', { hotel_id: hotelId });
    setIsFavorite(!favorite);
    return response.data.message;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('Error adding favorite:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Bookings cache
let cachedResponse: any = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 60 * 1000;

export const fetchAllBookings = async (forceRefresh = false) => {
  const now = Date.now();
  if (!forceRefresh && cachedResponse && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION) {
    return cachedResponse;
  }

  try {
    const response = await api.get(`/bookings/my/`);
    cachedResponse = response;
    cacheTimestamp = now;
    return response;
  } catch (error: any) {
    cachedResponse = null;
    cacheTimestamp = null;
    const errorMessage = error.response?.data?.error || error.message || 'Something went wrong!';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Cancel bookings
export const CancelStaysBookings = async (
  bookingId: string | undefined,
  setLoading?: (loading: boolean) => void,
  cancellation_reason?: string
) => {
  try {
    setLoading?.(true);
    const response = await api.post(`/hotels/${bookingId}/cancel-booking/`, cancellation_reason);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || error;
    toast.error(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setLoading?.(false);
  }
};

export const CancelTransferBookings = async (
  bookingId: string | undefined,
  setLoading?: (loading: boolean) => void,
  reason?: string
) => {
  try {
    setLoading?.(true);
    const response = await api.post(`/transfers/booking/${bookingId}/cancel/`, reason);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || error;
    toast.error(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setLoading?.(false);
  }
};
