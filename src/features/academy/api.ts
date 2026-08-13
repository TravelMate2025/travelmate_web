import axios from "axios";
import api from "../../api/services/api";

export interface RegisterForClassPayload {
  full_name: string;
  email: string;
  phone: string;
  marketing_opt_in: boolean;
}

export interface RegisterForClassResponse {
  id: string;
  full_name: string;
  email: string;
  student_id: string;
  training_class_name: string;
  registered_at: string;
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>;
      if (typeof record.error === "string") return record.error;
      if (typeof record.detail === "string") return record.detail;
      // DRF field-validation shape: { field_name: ["message", ...] }
      const firstValue = Object.values(record)[0];
      if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
        return firstValue[0];
      }
    }
    return error.message;
  }
  return error instanceof Error ? error.message : "Something went wrong";
}

export const registerForClass = async (
  classSlug: string,
  payload: RegisterForClassPayload,
): Promise<RegisterForClassResponse> => {
  try {
    const response = await api.post<RegisterForClassResponse>(
      `/v1/public/academy/classes/${classSlug}/register/`,
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};
