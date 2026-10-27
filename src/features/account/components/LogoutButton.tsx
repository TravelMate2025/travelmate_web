import { useNavigate } from "react-router-dom";
import { performLogout } from "../slices/performLogout";
import { useAppDispatch } from "../../../hooks/redux";
import { PiSignOutFill } from "react-icons/pi";
import { useState } from "react";



export default function LogoutButton() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    await dispatch(performLogout());
    setLogoutLoading(false);
    navigate("/create-account");
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
