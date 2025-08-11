import axios from "axios";

const API_URL = "https://travelmate-backend-0suw.onrender.com/api/categories/";

export const getFaqCategories = async () => {
  try {
    const response = await axios.get(API_URL);
    if (response.status === 200) {
      return response.data.results;
    }
    throw new Error("Failed to fetch FAQ categories");
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error("Failed to fetch FAQs. Please try again later.");
    }
    console.error("Unknown error:", error);
    throw error;
  }
};
