import { FaRegUser, FaRegStar, FaRegBell } from "react-icons/fa";
import { PiSignOutFill } from "react-icons/pi";
import { MdCreditCard } from "react-icons/md";
import { Link } from "react-router-dom";

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
    link: "/account/payments",
  },

  {
    icon: <FaRegBell size={24} />,
    title: "Notifications",
    description: "Manage alerts and reminders",
    link: "/account/notifications",
  },
  {
    icon: <FaRegStar size={24} />,
    title: "Reviews",
    description: "View and manage reviews",
    link: "/account/security",
  },
  {
    icon: <PiSignOutFill size={24} />,
    title: "Log Out",
    description: "Sign out from your account",
    link: "/logout",
  },
];

export default function UserOptions() {
  return (
    <div className="grid grid-cols-3 gap-6 max-w-[1280px] mx-auto mt-6">
      {options.map((item, index) => (
        <Link
          to={item.link}
          key={index}
          className="flex items-center justify-between w-[408px] h-[86px] border border-gray-300 px-6 rounded-lg shadow-sm hover:bg-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="">{item.icon}</div>
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          </div>
          <span className="text-gray-400 text-lg">›</span>
        </Link>
      ))}
    </div>
  );
}
