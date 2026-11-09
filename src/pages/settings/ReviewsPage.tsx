import { FaRegUser, FaRegBell, FaRegStar, FaAngleLeft } from "react-icons/fa";
import { MdCreditCard } from "react-icons/md";
import { PiSignOutFill } from "react-icons/pi";
import { Link, NavLink, useLocation } from "react-router-dom";
import Navbar from "../homePage/Navbar";
import TravelmateApp from "../homePage/TravelmateApp";
import Footer from "../../components/2Footer";
import Breadcrumbs from "../../components/Breadcrumbs";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Reviews from "../../features/stays/components/UserReviews";
import LogoutButton from "../../features/account/components/LogoutButton";

export function ReviewsSettingsPage() {
  const location = useLocation();

  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Account", link: "/account" },
    { name: "Reviews" },
  ];

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
      link: "/account/payment-method",
      state: { activeTab: "Payment Method" },
    },
    {
      icon: <FaRegBell size={24} />,
      title: "Notifications",
      description: "Manage alerts and reminders",
      link: "/account/notifications",
    },
    {
      icon: <SecurityOutlinedIcon style={{ fontSize: 24 }} />,
      title: "Security",
      description: "Manage your Email and Password",
      link: "/account/security",
    },
    {
      icon: <FaRegStar size={24} />,
      title: "Reviews",
      description: "View and manage reviews",
      link: "/account/reviews",
    },
    {
      icon: <PiSignOutFill size={24} />,
      title: "Log Out",
      description: "Sign out from your account",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="my-10"></div>

      {/* Breadcrumbs / Back */}
      <div className="ml-4 md:ml-10 flex items-center">
        <Link
          to="/account"
          className="flex md:hidden items-center gap-x-2 mb-2 hover:text-blue-800"
        >
          <div
            className="bg-white border border-gray-300 rounded p-1.5 
          shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_14px_rgba(0,0,0,0.25)] 
          active:scale-95 transition-all duration-200 cursor-pointer w-[35px] flex items-center justify-center"
          >
            <FaAngleLeft size={28} />
          </div>
          <span className="text-2xl font-semibold">Reviews</span>
        </Link>

        <div className="hidden md:block">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 px-4 md:px-10">
        {/* LEFT SIDE MENU */}
        <div className="hidden md:block w-[350px]">
          <div className="border border-gray-300 rounded-xl w-[290px] m-auto">
            {options.map((item, index) => {
              const isActive = location.pathname === item.link;

              if (item.title == "Log Out") {
                return <LogoutButton />;
              }

              return (
                <NavLink
                  key={index}
                  to={item.link || "#"}
                  state={item.state}
                  className={`flex items-center gap-2 p-3 rounded-md transition 
                  ${isActive ? "text-blue-700" : ""}`}
                >
                  <div className="mt-1">{item.icon}</div>

                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        isActive ? "text-blue-700" : ""
                      }`}
                    >
                      {item.title}
                    </h3>

                    <p
                      className={`text-sm ${
                        isActive ? "text-blue-700" : "text-gray-500"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE CONTENT */}
        <div className="w-full md:-ml-16">
          <Reviews />
        </div>
      </div>

      {/* Bottom Sections */}
      <div className="hidden md:block">
        <TravelmateApp />
      </div>

      <div className="m-10"></div>
      <Footer />
    </div>
  );
}
