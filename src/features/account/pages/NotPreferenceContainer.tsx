import { useState, useEffect } from "react";
import NotPreferencePresenter from "./NotPreferencePresenter";
import api from "../../../api/services/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface NotificationPreferences {
  enabled_types: string[];
  enabled_channels: string[];
  id?: number;
}

interface NotificationPreferenceItem {
  id: number;
  enabled_types: string | string[];
  enabled_channels: string | string[];
}

type NotificationPreferenceResponse =
  | NotificationPreferenceItem
  | {
      message?: string;
      data?: NotificationPreferenceItem;
    };

const normalizePreference = (pref: NotificationPreferenceItem): NotificationPreferences => ({
  id: pref.id,
  enabled_types:
    typeof pref.enabled_types === "string"
      ? pref.enabled_types.split(",").map((s) => s.trim()).filter(Boolean)
      : Array.isArray(pref.enabled_types)
      ? pref.enabled_types
      : [],
  enabled_channels:
    typeof pref.enabled_channels === "string"
      ? pref.enabled_channels.split(",").map((s) => s.trim()).filter(Boolean)
      : Array.isArray(pref.enabled_channels)
      ? pref.enabled_channels
      : [],
});

function NotPreferenceContainer() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch preferences function
  const handleListPreference = async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get<NotificationPreferenceResponse>(
        `${API_BASE_URL}/notification-prefrence/`
      );

      const pref = "data" in res.data ? res.data.data : res.data;

      if (pref) {
        setPreferences(normalizePreference(pref));
      } else {
        setPreferences(null);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
      setError("Failed to load preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Saving preferences (POST if new, PATCH if existing)
  const handleSavePreference = async (updatedPrefs: NotificationPreferences): Promise<void> => {
    setSaving(true);
    setError("");

    try {
      let res;
      if (preferences?.id) {
        // Updating existing preference
        res = await api.put(
          `${API_BASE_URL}/notification-prefrence/${preferences.id}/`,
          updatedPrefs
        );
      } else {
        // Creating new preference if none exist
        res = await api.post(`${API_BASE_URL}/notification-prefrence/`, updatedPrefs);
      }

      // Normalizing response
      const responseData = "data" in res.data ? res.data.data : res.data;
      if (responseData) {
        setPreferences(normalizePreference(responseData));
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      setError("Failed to save preferences. Please try again.");
      throw error;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    handleListPreference();
  }, []);

  return (
    <NotPreferencePresenter
      preferences={preferences}
      loading={loading}
      saving={saving}
      error={error}
      onSavePreference={handleSavePreference}
    />
  );
}

export default NotPreferenceContainer;
