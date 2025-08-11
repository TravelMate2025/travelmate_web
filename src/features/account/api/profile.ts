import api from '../../../api/services/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface UserProfile {
  id: number;
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



export const createUserProfile = async (
  profileData: ProfileData,
  accessToken: string,
  profileId: number,
) => {
  try {
    const response = await api.put(
      `${API_BASE_URL}/profile/${profileId}/`,
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





export const fetchUserProfile = async (token: string): Promise<UserProfile> => {
  console.log("🔄 Fetching user profile...");
  console.log("📡 API Endpoint:", `${API_BASE_URL}/profile/`);

  try {
    const response = await api.get(`${API_BASE_URL}/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userProfile = response.data?.results?.[0];
    console.log("✅ Fetched profile data:", userProfile);

    if (!userProfile) {
      throw new Error("No profile found for the current user.");
    }

    return userProfile;
  } catch (error: any) {
    console.error("❌ Error fetching profile:", error);

    if (error.message === "No profile found for the current user.") {
      throw new Error("No profile found. Please complete your profile setup.");
    }

    if (error.isAxiosError) {
      const status = error.response?.status;

      if (status === 404) {
        throw new Error("User profile not found.");
      }

      if (error.message === "Network Error") {
        throw new Error("Network error. Please check your internet connection.");
      }

      console.error("🧾 Axios error details:", error.response?.data || error.message);
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



export const deleteUserAccount = async (
  accessToken: string,
  reason: string,
  feedback?: string
): Promise<void> => {
  try {
    const payload: { reason: string; additional_feedback?: string } = {
      reason,
    };

    if (reason === "Others" && feedback) {
      payload.additional_feedback = feedback;
    }

    const response = await api.delete(`${API_BASE_URL}/users/me/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: payload,
    });

    console.log("Account deleted:", response.data);
  } catch (error: any) {
    console.error("Error deleting account:", error?.response?.data || error.message);
    throw error?.response?.data || new Error("Account deletion failed.");
  }
};
