import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { logoutUser } from "../api/auth";
import { logout } from "../slices/authSlice"; 
import { FaRegUser, FaRegStar, FaRegBell } from "react-icons/fa";
import { PiSignOutFill } from "react-icons/pi";
import { MdCreditCard } from "react-icons/md";
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import { useState } from "react";
import { toast } from "react-hot-toast";

type UserOptionsStackedProps = {
  activeTab: string;
  handleOptionClick: (tab: string) => void;
};

export default function UserOptionsStacked({ activeTab, handleOptionClick }: UserOptionsStackedProps) {
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

  const options = [
    {
      icon: (isActive: boolean) => <FaRegUser size={24} className={isActive ? "text-[#023E8A]" : "text-gray-800"} />,
      title: "Profile",
      description: "Update your personal details",
      onClick: () => handleOptionClick("Profile"),
    },
    {
      icon: (isActive: boolean) => <MdCreditCard size={24} className={isActive ? "text-[#023E8A]" : "text-gray-800"} />,
      title: "Payment Method",
      description: "Manage your payment methods",
      onClick: () => handleOptionClick("Payment Method"),
    },
    {
      icon: (isActive: boolean) => <FaRegBell size={24} className={isActive ? "text-[#023E8A]" : "text-gray-800"} />,
      title: "Notifications",
      description: "Manage alerts and reminders",
      onClick: () => handleOptionClick("Notifications"),
    },
    {
      icon: (isActive: boolean) => <SecurityOutlinedIcon className={isActive ? "text-[#023E8A]" : "text-gray-800"} />,
      title: "Security",
      description: "Manage your Email and Password",
      onClick: () => handleOptionClick("Security"),
    },
    {
      icon: (isActive: boolean) => <FaRegStar size={24} className={isActive ? "text-[#023E8A]" : "text-gray-800"} />,
      title: "Reviews",
      description: "View and manage reviews",
      onClick: () => handleOptionClick("Reviews"),
    },
    {
      icon: (isActive: boolean) => (
        <PiSignOutFill size={24} className={isActive ? "text-[#023E8A]" : "text-gray-800"} />
      ),
      title: logoutLoading ? (
        <span className="flex items-center gap-2">
          Log Out
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </span>
      ) : (
        "Log Out"
      ),
      description: "Sign out from your account",
      onClick: handleLogout,
    },
    
  ];

  return (
    <div className="max-w-[411px] space-y-4 border-1 border-[#CDCED1] rounded-[12px] md:w-[100%]">
      {options.map((item, index) => {
        const isActive = activeTab === item.title;

        return (
          <button
            key={index}
            onClick={item.onClick}
            className="flex items-center w-[390px] h-[80px] px-6 rounded-lg transition text-left"
          >
            <div className="flex items-center gap-4 cursor-pointer">
              <div>{item.icon(isActive)}</div>
              <div>
                <h3 className={`text-lg font-semibold ${isActive ? "text-[#023E8A]" : "text-gray-800"}`}>
                  {item.title}
                </h3>
                {item.description && (
                  <p className={`text-sm ${isActive ? "text-[#023E8A]" : "text-gray-500"}`}>
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
