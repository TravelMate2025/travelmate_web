import axios from "axios";

const BASE_URL = "https://travelmate.com/api";

interface SubmitCVVParams {
  cardId: number;
  cvv: string;
}

export const submitCardCVV = async ({ cardId, cvv }: SubmitCVVParams) => {
  const response = await axios.post(`${BASE_URL}/payment/verify-cvv/`, {
    card_id: cardId,
    cvv,
  });
  return response.data;
};
