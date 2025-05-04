import { store } from '../store';
import { RootState } from '../store';

export const getAccessToken = (): string | null => {
    try {
      const state: RootState = store.getState();
      return state.auth.accessToken || localStorage.getItem("accessToken");
    } catch (err) {
      console.warn("Could not get access token:", err);
      return null;
    }
  };
  