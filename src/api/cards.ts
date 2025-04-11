import axios from "../utils/axiosConfig";

interface AddCardPayload {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  isDefault?: boolean;
  type: "visa" | "mastercard";
}

export const addNewCard = async (data: AddCardPayload) => {
  const response = await axios.post("/api/cards/", data);
  return response.data;
};
