import instance, { API_BASE_URL } from "../../../api/services/api";

export const fetchRecentSearches = async (
  setLocation: (data: string[]) => void,
  accessToken: string,
) => {
    try {
        const response = await instance.get(
            `${API_BASE_URL}/cars/recent-searches/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        );
        setLocation(response.data)
        return response.data;
    } catch (error: unknown) {
        console.error("Error fetching recent searches:", error);
        throw error;
    }
};
