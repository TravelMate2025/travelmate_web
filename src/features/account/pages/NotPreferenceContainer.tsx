import { useState, useEffect } from "react";
import NotPreferencePresenter from "./NotPreferencePresenter";
import api from "../../../api/services/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface NotificationPreferences {
  enabled_types: string[];
  enabled_channels: string[];
  id?: string;
}

interface NotificationPreferenceItem {
  id: string;
  enabled_types: string | string[];
  enabled_channels: string | string[];
}

interface NotificationPreferenceResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NotificationPreferenceItem[];
}

function NotPreferenceContainer() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch preferences function
  const handleListPreference = async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get<NotificationPreferenceResponse>(
        `${API_BASE_URL}/notification-prefrence/`
      );

      const pref = res.data.results.length > 0 ? res.data.results[0] : null;

      if (pref) {
        const formattedPref: NotificationPreferences = {
          id: pref.id,
          enabled_types:
            typeof pref.enabled_types === "string"
              ? pref.enabled_types.split(",").map((s) => s.trim())
              : Array.isArray(pref.enabled_types)
              ? pref.enabled_types
              : [],
          enabled_channels:
            typeof pref.enabled_channels === "string"
              ? pref.enabled_channels.split(",").map((s) => s.trim())
              : Array.isArray(pref.enabled_channels)
              ? pref.enabled_channels
              : [],
        };

        setPreferences(formattedPref);
        console.log("Loaded preferences:", formattedPref);
      } else {
        setPreferences({
          enabled_types: [],
          enabled_channels: [],
        });
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
    setLoading(true);
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
      const formattedPref: NotificationPreferences = {
        id: res.data.id, // Keeping my ID for future updates
        enabled_types: Array.isArray(res.data.enabled_types)
          ? res.data.enabled_types
          : typeof res.data.enabled_types === "string"
          ? res.data.enabled_types.split(",").map((s: string) => s.trim())
          : [],
        enabled_channels: Array.isArray(res.data.enabled_channels)
          ? res.data.enabled_channels
          : typeof res.data.enabled_channels === "string"
          ? res.data.enabled_channels.split(",").map((s: string) => s.trim())
          : [],
      };

      setPreferences(formattedPref);
    } catch (error) {
      console.error("Error saving preferences:", error);
      setError("Failed to save preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleListPreference();
  }, []);

  return (
    <NotPreferencePresenter
      preferences={preferences}
      loading={loading}
      error={error}
      onSavePreference={handleSavePreference}
    />
  );
}

export default NotPreferenceContainer;
