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
  const isAxiosError = (e: unknown): e is { response?: { status?: number }; message?: string } =>
    typeof e === 'object' && e !== null && 'response' in e;

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
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 401) {
      console.error("Unauthorized. Please login again.");
      throw new Error("Unauthorized");
    }
    console.error("Error creating user profile:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};





export const fetchUserProfile = async (token: string): Promise<UserProfile> => {
  const isAxiosError = (e: unknown): e is { isAxiosError?: boolean; response?: { status?: number; data?: unknown }; message?: string } =>
    typeof e === 'object' && e !== null && 'isAxiosError' in e;

  try {
    const response = await api.get(`${API_BASE_URL}/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userProfile = response.data?.results?.[0];

    if (!userProfile) {
      throw new Error("No profile found for the current user.");
    }

    return userProfile;
  } catch (error: unknown) {
    console.error("❌ Error fetching profile:", error);

    if (error instanceof Error && error.message === "No profile found for the current user.") {
      throw new Error("No profile found. Please complete your profile setup.");
    }

    if (isAxiosError(error) && error.isAxiosError) {
      const status = error.response?.status;

      if (status === 404) {
        throw new Error("User profile not found.");
      }

      if ((error as { message?: string }).message === "Network Error") {
        throw new Error("Network error. Please check your internet connection.");
      }

      console.error("🧾 Axios error details:", error.response?.data || (error as { message?: string }).message);
    }

    throw new Error("An unexpected error occurred while fetching your profile.");
  }
};


export const updateUserProfile = async (
  userId: number,
  updatedData: Partial<ProfileData> | Record<string, unknown>
): Promise<UserProfile> => {
  try {
    const response = await api.patch(`${API_BASE_URL}/profile/${userId}/`, updatedData);
    return response.data;
  } catch (error: unknown) {
    console.error('Error updating profile:', error);
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const resp = (error as { response?: { data?: unknown } }).response;
      const message = error instanceof Error ? error.message : String(error);
      console.error('Axios Error Details:', resp ? resp.data : message);
    }
    throw error instanceof Error ? error : new Error(String(error));
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

    await api.delete(`${API_BASE_URL}/users/me/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: payload,
    });

  } catch (error: unknown) {
    const respData = (typeof error === 'object' && error !== null && 'response' in error)
      ? (error as { response?: { data?: unknown } }).response?.data
      : undefined;
    console.error("Error deleting account:", respData || (error instanceof Error ? error.message : String(error)));
    throw respData || new Error("Account deletion failed.");
  }
};
