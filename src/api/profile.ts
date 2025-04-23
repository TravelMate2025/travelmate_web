import axios from 'axios';
import { getAccessToken } from '../utils/authUtils';
 



const API_BASE_URL = 'https://travelmate-backend-0suw.onrender.com/api';


export interface UserProfile {
  first_name: string;
  last_name: string;
  gender: string | null;
  date_of_birth: string | null;
  email: string;
  mobile_number: string | null;
  address: string | null;
}


interface ProfileData {
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  mobile_number?: string;
  address?: string;
}

// Apply the access token to the Axios request headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
      'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add the access token
api.interceptors.request.use(
  (config) => {
      const accessToken = getAccessToken();
      if (accessToken && config.headers) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);



export const createUserProfile = async (
  profileData: ProfileData,
  accessToken: string,
  userId: number
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/profile/${userId}/`,
      profileData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Profile created:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.error("Unauthorized. Please login again.");
      throw new Error("Unauthorized");
    }
    console.error("Error creating user profile:", error);
    throw error;
  }
};



export const fetchUserProfile = async (userId: number, token: string): Promise<UserProfile> => {
  console.log("Fetching user profile...");
  console.log("API Endpoint:", `${API_BASE_URL}/profile/${userId}/`);

  try {
    const response = await api.get(`${API_BASE_URL}/profile/${userId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Fetched Profile Data:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    if (error.isAxiosError) {
      const status = error.response?.status;

      if (status === 404) {
        throw new Error("User not found!");
      }

      if (error.message === 'Network Error') {
        throw new Error("Network Error! Please check your internet connection");
      }

      console.error("Axios Error Details:", error.response ? error.response.data : error.message);
    }
    throw new Error("An unexpected error occurred while fetching your profile.");
  }
};


export const updateUserProfile = async (userId: number, updatedData: any): Promise<UserProfile> => {
  console.log('Updating user profile...');
  console.log('API Endpoint:', `${API_BASE_URL}/profile/${userId}/`);
  console.log('Updated Data:', updatedData);

  try {
    const response = await api.patch(`${API_BASE_URL}/profile/${userId}/`, updatedData);
    console.log('Update Profile Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    if (error.isAxiosError) {
      console.error('Axios Error Details:', error.response ? error.response.data : error.message);
    }
    throw error;
  }
};



export const deleteUserAccount = async (userId: number, accessToken: string): Promise<void> => {
  try {
    const response = await api.delete(`${API_BASE_URL}/profile/${userId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("Account deleted:", response.data);
  } catch (error: any) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

