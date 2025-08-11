// import { RootState, store } from '../../store';


export const getAccessToken = (): string | null => {
    try {
      // const state: RootState = store.getState();
      return localStorage.getItem("accessToken");
    } catch (err) {
      console.warn("Could not get access token:", err);
      return null;
    }
  };
  