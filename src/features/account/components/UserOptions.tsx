import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { RootState } from "../../../store";
import { logoutUser } from "../api/auth";
import { logout } from "../slices/authSlice";
import { FaRegUser, FaRegStar, FaRegBell } from "react-icons/fa";
import { PiSignOutFill } from "react-icons/pi";
import { MdCreditCard } from "react-icons/md";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { useState } from "react";
import toast from "react-hot-toast";

export default function UserOptions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [logoutLoading, setLogoutLoading] = useState(false);


  const handleLogout = async () => {
    if (!accessToken) {
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
      icon: <FaRegUser size={24} />,
      title: "Profile",
      description: "Update your personal details",
      link: "/profile-info",
    },
    {
      icon: <MdCreditCard size={24} />,
      title: "Payment Method",
      description: "Manage your payment methods",
      link: "/profile-info",
      state: { activeTab: "Payment Method" },
    },
    {
      icon: <FaRegBell size={24} />,
      title: "Notifications",
      description: "Manage alerts and reminders",
      link: "/account/notifications",
    },
    {
      icon: <SecurityOutlinedIcon />,
      title: "Security",
      description: "Manage your Email and Password",
      link: "/account/security",
    },
    {
      icon: <FaRegStar size={24} />,
      title: "Reviews",
      description: "View and manage reviews",
      link: "/account/security",
    },
    {
      icon: logoutLoading ? (
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      ) : (
        <PiSignOutFill size={24} />
      ),
      title: "Log Out",
      description: "Sign out from your account",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1280px] mx-auto mt-6 px-4">
      {options.map((item, index) => {
        const isLogout = item.title === "Log Out";

        const content = (
          <div className="flex items-center gap-4 justify-between w-full sm:w-[408px] h-[86px] border border-gray-300 px-6 rounded-lg shadow-sm hover:bg-gray-100">
            <div className="flex items-center gap-4">
              <div>{item.icon}</div>
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
            <span className="text-gray-400 text-lg">
              <ArrowForwardIosOutlinedIcon />
            </span>
          </div>
        );

        if (isLogout) {
          return (
            <button
              key={index}
              onClick={item.onClick}
              className="text-left cursor-pointer"
            >
              {content}
            </button>
          );
        }

        if (item.link) {
          return (
            <NavLink
              key={index}
              to={item.link}
              state={item.state}
              className="text-left"
            >
              {content}
            </NavLink>
          );
        }

        return null; // fallback if link is missing and it's not logout
      })}

    </div>
  );
}
