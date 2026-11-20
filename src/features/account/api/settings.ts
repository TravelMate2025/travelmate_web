import api from "../../../api/services/api";

// Account settings calls for the signed-in user. They return the full response
// because the settings pages branch on the HTTP status.

// --- Change email / password (OTP sent to the current email) ---

export const requestEmailChangeToken = (email: string) =>
  api.post("/users/reset_email/", { email });

export const requestPasswordChangeToken = (email: string) =>
  api.post("/users/reset_password/", { email });

export const resendAccountToken = (email: string) =>
  api.post("/users/resend_reset_token/", { email });

export const validateAccountToken = (email: string, token: string) =>
  api.post("/users/validate-reset-token/", { token, email });

export const changeEmail = (newEmail: string, currentPassword: string) =>
  api.post("/users/set_email/", { new_email: newEmail, current_password: currentPassword });

export const changePassword = (email: string, newPassword: string) =>
  api.post("/users/set_new_password/", { email, new_password: newPassword });

// --- Notifications ---

// `nextPageUrl` is the absolute `next` link from a previous page of results
export const fetchNotifications = (nextPageUrl?: string) =>
  api.get(nextPageUrl || "/notifications/");

export const markNotificationRead = (id: string) =>
  api.post(`/notifications/${id}/mark_read/`);

export const deleteNotifications = (ids: string[]) =>
  api.post("/notifications/bulk-delete/", { notification_ids: ids });

// --- Notification preferences (the backend route is spelled "prefrence") ---

export const fetchNotificationPreferences = <T>() =>
  api.get<T>("/notification-prefrence/");

export const createNotificationPreferences = <T>(prefs: T) =>
  api.post("/notification-prefrence/", prefs);

export const updateNotificationPreferences = <T>(id: number, prefs: T) =>
  api.put(`/notification-prefrence/${id}/`, prefs);
