import instance from "../../../utils/axiosConfig";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
        console.log("Recent searches:", response.data);
        return response.data;
    } catch (error: unknown) {
        console.error("Error fetching recent searches:", error);
        throw error;
    }
};
