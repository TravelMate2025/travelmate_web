import axios from 'axios';
import { Hotel, HotelSearchResponse } from '../types/stays';

const BASE_URL = 'http://127.0.0.1:8000/api';


export interface Destination {
    code: string;
    name: string;
    country_code: string;
    city_name?: string;
    token?: string;
}

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