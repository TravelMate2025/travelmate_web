import axios from 'axios';

export const verifyCode = async (code: string) => {
  try {
    const response = await axios.post('/api/verify-code', { code });
    return response.data;  // Assuming response contains { success: boolean }
  } catch (error) {
    console.error("Verification failed:", error);
    throw new Error("Verification request failed.");
  }
};
