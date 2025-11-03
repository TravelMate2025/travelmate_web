import { BookingStaysVerifyDetails, BookStaysRequest, BookStaysResponse, Destination, Hotel, HotelSearchResponse } from './types';
import api from '../../api/services/api';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://travelmate-backend-0suw.onrender.com/api';

export const fetchDestinations = async (search?: string, token?: string | null): Promise<Destination[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/hotels/destinations/?search=${search?.toLowerCase()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data.results;

  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('Error fetching destinations:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const fetchRecommendedHotels = async (
  token?: string | null
): Promise<Destination> => {
  try {
    const response = await axios.get(`${BASE_URL}/hotels/recommend/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    console.log(response.data)
    return response.data.results;

  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('Error fetching recommended hotels:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const searchHotels = async (
  destination: string,
  checkIn: string,
  checkOut: string,
  adults: number = 2,
  children: number = 0,
  rooms: number = 1,
  token?: string
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
        include_details: true
      },
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    console.log('Search Result:', response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('Search error:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const getHotelDetails = async (
  hotelId: string,
  checkIn: string,
  checkOut: string,
  adults: number = 2,
  children: number = 0,
  rooms: number = 1,
  token?: string | null
): Promise<Hotel> => {
  try {
    const response = await axios.get(`${BASE_URL}/hotels/${hotelId}/details/`, {
      params: {
        check_in: checkIn,
        check_out: checkOut,
        adults,
        children,
        rooms
      },
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    console.log('Hotel Details Result:', response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || `Failed to get details for hotel ${hotelId}`;
    console.error('Details error:', errorMessage);
    throw new Error(errorMessage);

  }
};





export const createCheckoutSession = async (
  bookingData: BookStaysRequest,
  token?: string,
  setLoading?: (loading: boolean) => void
): Promise<BookStaysResponse> => {
  try {
    setLoading?.(true);
    const response = await api.post('/hotels/checkout/', bookingData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || error;
    console.error('Booking error:', errorMessage);
    throw new Error(errorMessage);

  } finally {
    setLoading?.(false);
  }
};


export const verifyHotelBooking = async (sessionId: string | null): Promise<BookingStaysVerifyDetails> => {
  try {
    const response = await api.get(`/hotels/verify-booking/?session_id=${sessionId}`);
    console.log(response.data)
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Get booking by session failed:', error);
    toast.error(error?.response?.data?.error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get booking details',
    };
  }
}






// Fetch all reviews

export const getReviews = async (hotelId: string) => {
  try {
    const response = await api.get(`/hotels/${hotelId}/reviews/`)
    return response.data.user_reviews
  } catch (error: any) {
    console.error('Failed to fetch reviews:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
  }
};

export const submitReview = async () => {
  try {
    const response = await api.post('/reviews', {
      // review data here
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to submit review:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to submit review');
  }

}

// Delete a specific review

export const deleteReview = async (reviewId: number) => {
  try {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to delete review:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete review');
  }
};

export const fetchFavorites = async (token?: string | null) => {
  try {
    const response = await api.get('/hotels/favorites/', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response;
  }
  catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('Error fetching favorites:', errorMessage);
    console.log(error)
    throw new Error(errorMessage);

  }
};

export const addOrRemoveFavorite = async (hotelId: string | null, setIsFavorite: (data: boolean) => void, favorite: boolean, token?: string | null) => {
  try {
    const response = await api.post('/hotels/favorites/toggle/', { hotel_id: hotelId }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    setIsFavorite(!favorite);
    return response.data;

  }
  catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('Error adding favorite:', errorMessage);
    throw new Error(errorMessage);

  }
};