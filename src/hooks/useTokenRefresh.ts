import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/";
import { refreshToken } from "../api/auth";
import { updateToken, logout } from "../features/auth/authSlice";

const useTokenRefresh = () => {
  const { refreshToken: refresh } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(async () => {
      if (refresh) {
        try {
          const res = await refreshToken(refresh);
          dispatch(updateToken(res.access));
        } catch (error) {
          console.error("Token refresh failed", error);
          dispatch(logout());
        }
      }
    }, 4.5 * 60 * 1000); // Every 4.5 minutes

    return () => clearInterval(interval);
  }, [refresh, dispatch]);
};

export default useTokenRefresh;
