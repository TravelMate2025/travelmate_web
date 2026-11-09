import { useNavigate } from "react-router-dom";
import { performLogout } from "../slices/performLogout";
import { useAppDispatch } from "../../../hooks/redux";
import { FaRegUser, FaRegStar, FaRegBell } from "react-icons/fa";
import { PiSignOutFill } from "react-icons/pi";
import { MdCreditCard } from "react-icons/md";
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import { useState } from "react";

type UserOptionsStackedProps = {
  activeTab: string;
  handleOptionClick: (tab: string) => void;
};

export default function UserOptionsStacked({ activeTab, handleOptionClick }: UserOptionsStackedProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);
  

  const handleLogout = async () => {
    setLogoutLoading(true);
    await dispatch(performLogout());
    setLogoutLoading(false);
    navigate("/create-account");
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
