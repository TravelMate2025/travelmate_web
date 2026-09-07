import axios from "axios";

// Deliberately a standalone axios instance, NOT the shared one from
// ../../api/services/api. That shared instance auto-attaches a Bearer
// token from storage to every request and hard-redirects the whole page
// to /create-account on any 401 response -- reasonable for pages that
// actually require auth, but these academy endpoints are all public
// (AllowAny) and don't need a token at all. If a logged-in user's token
// happens to be expired, DRF's auth layer rejects the request with 401
// *because* bad credentials were supplied (different from no credentials
// at all) -- which, through the shared instance, would yank a student
// completely off the check-in/register page mid-flow. Not attaching a
// token here means that 401 path is never triggered in the first place.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

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

export interface RequestOTPResponse {
  email: string;
  expiry_minutes: number;
}

// Step 1 of registration: validates the submission and emails a
// confirmation code. Creates nothing yet -- see confirmRegistrationOTP.
export const requestRegistrationOTP = async (
  classSlug: string,
  payload: RegisterForClassPayload,
): Promise<RequestOTPResponse> => {
  try {
    const response = await api.post<RequestOTPResponse>(
      `/v1/public/academy/classes/${classSlug}/register/`,
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

// Step 2: submits the code from the email. Only on success does the
// enrollment (and student ID) actually get created.
export const confirmRegistrationOTP = async (
  classSlug: string,
  email: string,
  code: string,
): Promise<RegisterForClassResponse> => {
  try {
    const response = await api.post<RegisterForClassResponse>(
      `/v1/public/academy/classes/${classSlug}/register/confirm/`,
      { email, code },
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export const resendRegistrationOTP = async (
  classSlug: string,
  email: string,
): Promise<RequestOTPResponse> => {
  try {
    const response = await api.post<RequestOTPResponse>(
      `/v1/public/academy/classes/${classSlug}/register/resend/`,
      { email },
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

export type MatchMode = "all" | "any";

// "attended_any" is legacy-only -- can still appear on a link created
// before multi-session scoping shipped, no longer creatable going forward.
export type QuestionsLinkScope = "all" | "session" | "attended_any" | "sessions";

export interface QuestionsLinkPreview {
  training_class_name: string;
  session_labels: string[];
  match_mode: MatchMode | null;
  scope: QuestionsLinkScope;
  attendance_required: boolean;
  deadline_at: string | null;
  is_past_deadline: boolean;
}

// What the page shows before anyone has proven who they are --
// deliberately never includes questions_url. See verifyQuestionsLinkAccess
// for the only call that can ever reveal it. Mirrors getSessionByToken:
// reached only via a share_token in the URL, so a failure here is
// exceptional (unknown/expired token), not a distinct UI state.
export const getQuestionsLinkPreview = async (shareToken: string): Promise<QuestionsLinkPreview> => {
  try {
    const response = await api.get<QuestionsLinkPreview>(
      `/v1/public/academy/questions-link-sends/${shareToken}/`,
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export type VerifyResult =
  | { status: "success"; questions_url: string }
  | { status: "not_registered"; training_class_slug: string; message: string }
  // session_labels is empty when the send requires attendance at *any*
  // session (the legacy attended-any scope) rather than named ones --
  // there's no session to name in that case. match_mode is set only
  // for a real multi-session scope (2+ labels); null otherwise.
  | {
      status: "attendance_required";
      session_labels: string[];
      match_mode: MatchMode | null;
      message: string;
    };

// Identity+eligibility check -- on success, this is the only response
// that ever carries questions_url. not_registered/attendance_required
// are expected, distinct UI states, same convention as checkInForSession.
export const verifyQuestionsLinkAccess = async (
  shareToken: string,
  identifier: string,
): Promise<VerifyResult> => {
  try {
    const response = await api.post(`/v1/public/academy/questions-link-sends/${shareToken}/verify/`, {
      identifier,
    });
    return { status: "success", questions_url: response.data.questions_url };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as Record<string, unknown> | undefined;
      if (data?.reason === "not_registered") {
        return {
          status: "not_registered",
          training_class_slug: String(data.training_class_slug ?? ""),
          message: String(data.error ?? "We couldn't find you registered for this class."),
        };
      }
      if (data?.reason === "attendance_required") {
        return {
          status: "attendance_required",
          session_labels: Array.isArray(data.session_labels)
            ? data.session_labels.map(String)
            : [],
          match_mode: data.match_mode === "all" || data.match_mode === "any" ? data.match_mode : null,
          message: String(data.error ?? "You need to have checked in for this session."),
        };
      }
    }
    throw new Error(getErrorMessage(error));
  }
};

export type SubmitResult =
  | { status: "success"; already_submitted: boolean; assignment_link: string }
  | { status: "not_registered"; training_class_slug: string; message: string }
  | {
      status: "attendance_required";
      session_labels: string[];
      match_mode: MatchMode | null;
      message: string;
    }
  | { status: "deadline_passed"; deadline_at: string; message: string };

// Re-checks eligibility independently of any prior verify call -- the
// backend never trusts a cached "already verified" state, and neither
// does this page (see AcademyAssignmentSubmitPage). Resubmission is
// expected and safe: it updates the existing submission in place.
export const submitAssignmentLink = async (
  shareToken: string,
  identifier: string,
  assignmentLink: string,
): Promise<SubmitResult> => {
  try {
    const response = await api.post(`/v1/public/academy/questions-link-sends/${shareToken}/submit/`, {
      identifier,
      assignment_link: assignmentLink,
    });
    return {
      status: "success",
      already_submitted: Boolean(response.data.already_submitted),
      assignment_link: String(response.data.assignment_link ?? assignmentLink),
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as Record<string, unknown> | undefined;
      if (data?.reason === "not_registered") {
        return {
          status: "not_registered",
          training_class_slug: String(data.training_class_slug ?? ""),
          message: String(data.error ?? "We couldn't find you registered for this class."),
        };
      }
      if (data?.reason === "attendance_required") {
        return {
          status: "attendance_required",
          session_labels: Array.isArray(data.session_labels)
            ? data.session_labels.map(String)
            : [],
          match_mode: data.match_mode === "all" || data.match_mode === "any" ? data.match_mode : null,
          message: String(data.error ?? "You need to have checked in for this session."),
        };
      }
      if (data?.reason === "deadline_passed") {
        return {
          status: "deadline_passed",
          deadline_at: String(data.deadline_at ?? ""),
          message: String(data.error ?? "The submission deadline for this has passed."),
        };
      }
    }
    throw new Error(getErrorMessage(error));
  }
};
