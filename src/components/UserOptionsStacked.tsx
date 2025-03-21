import { FaRegUser, FaRegStar, FaRegBell } from "react-icons/fa";
import { PiSignOutFill } from "react-icons/pi";
import { MdCreditCard } from "react-icons/md";
import { Link } from "react-router-dom";

const options = [
  {
    icon: <FaRegUser size={24} />,
    title: "Profile",
    description: "Update your personal details",
    link: "/account/profile",
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
    link: "/logout",
  },
];


export default function UserOptionsStacked() {
  return (
    <div className="w-full max-w-[411px] space-y-4 border-2 border-gray-300 rounded-lg">

      {options.map((item, index) => (
        <Link
        to={item.link}
        key={index}
        className="flex items-center w-[390px] h-[80px] px-6 rounded-lg hover:bg-gray-100 transition"
        >
            <div key={index} className="flex items-center gap-4 ">
                <div>{item.icon}</div>
                <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                </div>
            </div>
        </Link>
      ))}
    </div>
  );
}
