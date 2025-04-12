import axios from "axios";

export const toggleFavorite = async (stayId: number, isFavorite: boolean) => {
  const endpoint = isFavorite ? "/api/favorites/remove" : "/api/favorites/add";
  const response = await axios.post(endpoint, { stay_id: stayId });
  return response.data;
};
