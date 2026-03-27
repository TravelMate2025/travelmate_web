import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { logoutUser } from "../api/auth";
import { logout } from "../slices/authSlice";
import { PiSignOutFill } from "react-icons/pi";
import { useState } from "react";
import { toast } from "react-hot-toast";



export default function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    if (!user?.email || !accessToken) {
      toast.error("User session expired. Login again to continue.");
      return;
    }

    setLogoutLoading(true);
    try {
      await logoutUser(accessToken);
      dispatch(logout());
      localStorage.clear();
      navigate("/create-account");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLogoutLoading(false);
    }
  };


  if (logoutLoading) {
    return (
      <div
        onClick={handleLogout}
        className="flex items-center cursor-pointer w-[390px] h-[80px] px-6 rounded-lg transition text-left"
      >
        <div className="flex items-center gap-4 cursor-pointer">
          <div>
            <PiSignOutFill size={24} className={"text-gray-800"} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold text-gray-800`}>
              <span className="flex items-center gap-2">
                Log Out
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </span>
            </h3>
            <p className={`text-sm text-gray-500`}>
              Sign out from your account
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleLogout}
      className="flex items-center cursor-pointer w-[390px] h-[80px] px-6 rounded-lg transition text-left"
    >
      <div className="flex items-center gap-4 cursor-pointer">
        <div>
          <PiSignOutFill size={24} className={"text-gray-800"} />
        </div>
        <div>
          <h3 className={`text-lg font-semibold text-gray-800`}>Log Out</h3>
          <p className={`text-sm text-gray-500`}>Sign out from your account</p>
        </div>
      </div>
    </div>
  );
}
