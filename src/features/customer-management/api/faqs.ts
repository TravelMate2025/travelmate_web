import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/categories/`;

interface FaqCategory {
  id: number;
  name_display: string;
  faqs?: unknown[];
  short_name?: string;
}

export const getFaqCategories = async (): Promise<FaqCategory[]> => {
  try {
    const response = await axios.get<{ results?: FaqCategory[] }>(API_URL);
    if (response.status === 200) {
      return response.data.results ?? [];
    }
    throw new Error("Failed to fetch FAQ categories");
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error("Failed to fetch FAQs. Please try again later.");
    }
    console.error("Unknown error:", error);
    throw error;
  }
};
