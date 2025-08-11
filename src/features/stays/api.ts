import axios from 'axios';
import { BookingRequest, BookingResponse, Destination, Hotel, HotelSearchResponse } from './types';
import api from '../../api/services/api';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;



export const fetchDestinations = async (search?: string, token?: string | null): Promise<Destination[]> => {
    try {
        const params = search ? { search } : {};
        const response = await axios.get(`${BASE_URL}/hotels/destinations/`, {
            params,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.error || error.message;
            console.error('Error fetching destinations:', errorMessage);
        } else {
            console.error('Error fetching destinations:', error);
        }
        return [];
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
        rooms
      },
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    console.log('Search Result:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error('Search error:', errorMessage);
      throw new Error(errorMessage);
    }
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
  token?: string
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
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || `Failed to get details for hotel ${hotelId}`;
      console.error('Details error:', errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error('Failed to fetch hotel details');
  }
};





export const createBooking = async (
  bookingData: BookingRequest,
  token?: string
): Promise<BookingResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}/bookings`, bookingData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error('Booking error:', errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error('Failed to create booking');
  }
};








// Fetch all reviews

export const getReviews = async () => {
  try {
    const response = await api.get('/reviews');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch reviews:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
  }
};


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
