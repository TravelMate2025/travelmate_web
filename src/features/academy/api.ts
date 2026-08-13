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

export interface ClassInfo {
  name: string;
  slug: string;
  registration_open: boolean;
}

// Loaded before the registration form renders, the same way the check-in
// page loads the session first — so a closed class shows a clean closed
// state instead of a form that's certain to fail on submit.
export const getClassInfo = async (classSlug: string): Promise<ClassInfo> => {
  try {
    const response = await api.get<ClassInfo>(`/v1/public/academy/classes/${classSlug}/`);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

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

export type WindowStatus = "not_started" | "open" | "closed";

export interface SessionInfo {
  id: string;
  label: string;
  session_date: string;
  session_start_at: string;
  checkin_closes_at: string;
  training_class_name: string;
  training_class_slug: string;
  window_status: WindowStatus;
}

// The QR code is the only way this page is meant to be reached, so a
// failure here (unknown/expired token, network error) is exceptional --
// there's no "expected" failure state to branch UI on, unlike check-in.
export const getSessionByToken = async (qrToken: string): Promise<SessionInfo> => {
  try {
    const response = await api.get<SessionInfo>(`/v1/public/academy/sessions/${qrToken}/`);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export type CheckInResult =
  | {
      status: "success";
      already_checked_in: boolean;
      session_label: string;
      training_class_name: string;
      checked_in_at: string;
    }
  | { status: "window_closed"; window_status: WindowStatus; message: string }
  | { status: "not_registered"; training_class_slug: string; message: string };

// Window-closed and not-registered are expected, distinct UI states --
// not_registered from RegisterForClassView. Only network/unknown-token
// failures throw, since there's no dedicated panel for those.
export const checkInForSession = async (
  qrToken: string,
  identifier: string,
): Promise<CheckInResult> => {
  try {
    const response = await api.post(`/v1/public/academy/sessions/${qrToken}/checkin/`, {
      identifier,
    });
    return {
      status: "success",
      already_checked_in: Boolean(response.data.already_checked_in),
      session_label: response.data.session_label,
      training_class_name: response.data.training_class_name,
      checked_in_at: response.data.checked_in_at,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as Record<string, unknown> | undefined;
      if (data?.reason === "window_closed") {
        return {
          status: "window_closed",
          window_status: data.window_status as WindowStatus,
          message: String(data.error ?? "Check-in is not open for this session."),
        };
      }
      if (data?.reason === "not_registered") {
        return {
          status: "not_registered",
          training_class_slug: String(data.training_class_slug ?? ""),
          message: String(data.error ?? "We couldn't find you registered for this class."),
        };
      }
    }
    throw new Error(getErrorMessage(error));
  }
};
