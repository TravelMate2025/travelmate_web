import { BookingRequest, BookingResponse, Destination, Hotel, HotelSearchResponse } from './types';
import api from '../../api/services/api';



export const fetchDestinations = async (search?: string, token?: string | null): Promise<Destination[]> => {
  try {
    const response = await api.get(`/hotels/destinations/?search=${search?.toLowerCase()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data.results;

  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('Error fetching destinations:', errorMessage);
    throw new Error(errorMessage); // Better to throw than return empty array
    throw new Error('Unexpected error while fetching destinations');
  }
};

export const fetchRecommendedHotels = async (
  token?: string | null
): Promise<Destination> => {
  try {
    const response = await api.get('/hotels/recommend/', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    console.log(response.data)
    return response.data.results;

  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('Error fetching recommended hotels:', errorMessage);
    throw new Error(errorMessage);

    throw new Error('Unexpected error while fetching recommended hotels');
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
    const response = await api.get('/hotels/search/', {
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
    throw new Error('Failed to search hotels');
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
    const response = await api.get('/hotels/${hotelId}/details/', {
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
  bookingData: BookingRequest,
  token?: string
): Promise<BookingResponse> => {
  try {
    const response = await api.post('/api/hotels/checkout/', bookingData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('Booking error:', errorMessage);
    throw new Error(errorMessage);

  }
};








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

export const addOrRemoveFavorite = async (hotelId: string | null, token?: string | null) => {
  try {
    const response = await api.post('/hotels/favorites/toggle/', { hotel_id: hotelId }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data;
  }
  catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('Error adding favorite:', errorMessage);
    throw new Error(errorMessage);

  }
};