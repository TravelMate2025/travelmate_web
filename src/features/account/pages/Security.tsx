import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink, useLocation, Link } from "react-router-dom";
import { FaAngleLeft, FaAngleRight, FaRegBell, FaRegStar, FaRegUser } from "react-icons/fa";
import Footer from "../../../components/2Footer";
import Breadcrumbs from "../../../components/Breadcrumbs"
import Navbar from "../../../pages/homePage/Navbar";
import TravelmateApp from "../../../pages/homePage/TravelmateApp";
import { MdCreditCard } from "react-icons/md";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { RootState } from "../../../store"
import { useState } from "react";
import { logoutUser } from "../api/auth";
import { logout } from "../slices/authSlice"
import toast from "react-hot-toast";
import { PiSignOutFill } from "react-icons/pi";

function Security() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { accessToken } = useSelector((state: RootState) => state.auth);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const location = useLocation()

    const user = useSelector((state: RootState) => state.auth.user);
    if (!user) return null;
    const breadcrumbs = [
        { name: "Home", link: "/" },
        { name: "Account", link: "/account" },
        { name: "Security" },
    ];

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
        link: "/account/reviews",
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
    ]

  return (
    <div className="h-screen flex flex-col">
        <Navbar />
        <div className="my-10"></div>
        {/* Breadcrumbs or Back Button */}
        <div className="ml-4 md:ml-10 flex items-center">
        {/* Mobile: Back arrow */}
        <Link
            to="/account"
            className="flex md:hidden items-center gap-x-22 mb-2 hover:text-blue-800"
        >
            <div className="bg-white border border-gray-300 rounded p-1.5 
        shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_14px_rgba(0,0,0,0.25)] 
        active:scale-95 transition-all duration-200 cursor-pointer w-[35px] flex items-center justify-center">
                <FaAngleLeft size={28} />
            </div>
            <span className="text-2xl font-semibold">Security</span>
        </Link>

        {/* Desktop: Show breadcrumbs */}
        <div className="hidden md:block">
            <Breadcrumbs items={breadcrumbs} />
        </div>
        </div>
        
        {/* Responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
            {/* LEFT SIDE – hide on small screens */}
            <div className="hidden md:block border border-gray-300 rounded-xl h-auto w-[290px] m-auto">
            {options.map((item, index) => {
                const isLogout = item.title === "Log Out";
                const isActive = location.pathname === item.link;

                const content = (
                <div
                    className={`flex items-center gap-2 p-3 rounded-md cursor-pointer transition 
                    ${isActive ? "text-blue-700" : ""}`}
                >
                    <div className="mt-1">{item.icon}</div>
                    <div>
                    <h3 className={`text-lg font-semibold ${isActive ? "text-blue-700" : ""}`}>
                        {item.title}
                    </h3>
                    <p className={`text-sm ${isActive ? "text-blue-700" : "text-gray-500"}`}>
                        {item.description}
                    </p>
                    </div>
                </div>
                );

                if (isLogout) {
                return (
                    <button
                    key={index}
                    onClick={item.onClick}
                    className="text-left w-full"
                    >
                    {content}
                    </button>
                );
                }

                if (item.link) {
                return (
                    <NavLink key={index} to={item.link} state={item.state} className="text-left w-full">
                    {content}
                    </NavLink>
                );
                }

                return null;
            })}
            </div>

            {/* RIGHT SIDE */}
            <div className="h-auto w-full md:w-[830px] px-4 md:px-0">
            <Link to="/account/update-email">
                <div className="border border-gray-300 rounded-xl
                p-2 flex items-center justify-between h-[80px]">
                <div>
                    <h2 className="p-1 mb-0.5 font-semibold">Update Email</h2>
                    <p className="text-gray-500 ">{user.email}</p>
                </div>
                <FaAngleRight size={24}/>
                </div>
            </Link>

            <Link to='/account/update-password'>
                <div className="border border-gray-300 cursor-pointer rounded-xl p-2 h-[80px] 
                flex items-center justify-between mt-4">
                <h2 className="p-1 mb-0.5 font-semibold">Update Password</h2>
                <FaAngleRight size={24}/>
                </div>
            </Link>
            </div>
        </div>

        <div className="hidden md:block">
            <TravelmateApp />
        </div>
        <div className="m-10"></div>
        <Footer/>
    </div>

  )
}

export default Security
