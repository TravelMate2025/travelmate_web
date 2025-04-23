


import { FaRegUser, FaRegStar, FaRegBell } from "react-icons/fa";
import { PiSignOutFill } from "react-icons/pi";
import { MdCreditCard } from "react-icons/md";
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
// import { Dispatch, SetStateAction } from "react";



const options = [
  {
    icon: (isActive: boolean) => <FaRegUser size={24} className={isActive ? "text-[#023E8A]" : "text-gray-800"} />,
    title: "Profile",
    description: "Update your personal details",
    link: "/profile-info",
  },
  {
    icon: (isActive: boolean) => <MdCreditCard size={24} className={isActive ? "text-[#023E8A]" : "text-gray-800"} />,
    title: "Payment Method",
    description: "Manage your payment methods",
    link: "/account/payments",
  },
  {
    icon: (isActive: boolean) => <FaRegBell size={24} className={isActive ? "text-[#023E8A]" : "text-gray-800"} />,
    title: "Notifications",
    description: "Manage alerts and reminders",
    link: "#/account/notifications",
  },
  {
    icon: (isActive: boolean) => <SecurityOutlinedIcon className={isActive ? "text-[#023E8A]" : "text-gray-800"} />,
    title: "Security",
    description: "Manage your Email and Password",
    link: "#/account/security",
  },
  {
    icon: (isActive: boolean) => <FaRegStar size={24} className={isActive ? "text-[#023E8A]" : "text-gray-800"} />,
    title: "Reviews",
    description: "View and manage reviews",
    link: "#/account/security",
  },
  {
    icon: (isActive: boolean) => <PiSignOutFill size={24} className={isActive ? "text-[#023E8A]" : "text-gray-800"} />,
    title: "Log Out",
    link: "#/logout",
  },
];



// interface UserOptionsStackedProps {
//   activeTab: string;
//   onOptionClick: (tab: string) => void;
// }

type UserOptionsStackedProps = {
  activeTab: string;
  // onOptionClick: Dispatch<SetStateAction<string>>;
  handleOptionClick: (tab: string) => void; // ✅ Add this line
};



export default function UserOptionsStacked({ activeTab, handleOptionClick, }: UserOptionsStackedProps) {
  return (
    <div className="">
    <div className=" max-w-[411px] space-y-4 border-1 border-[#CDCED1] rounded-[12px] md:w-[100%] ">
      {options.map((item, index) => {
        const isActive = activeTab === item.title;

        return (
          <button
            key={index}
            onClick={() => handleOptionClick(item.title)}
            className="flex items-center w-[390px] h-[80px] px-6 rounded-lg transition text-left"
          >
            <div className="flex items-center gap-4 cursor-pointer">
              <div>{item.icon(isActive)}</div>
              <div>
                <h3 className={`text-lg font-semibold ${isActive ? "text-[#023E8A]" : "text-gray-800"}`}>
                  {item.title}
                </h3>
                <p className={`text-sm ${isActive ? "text-[#023E8A]" : "text-gray-500"}`}>
                  {item.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
    </div>
  );
}
