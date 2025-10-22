import { useEffect, useState } from "react";
import Navbar from "../../../pages/homePage/Navbar";
import Footer from "../../../components/2Footer";
import Breadcrumbs from "../../../components/Breadcrumbs";
import TravelmateApp from "../../../pages/homePage/TravelmateApp";
import { FaAngleLeft, FaRegBell, FaRegStar, FaRegUser } from "react-icons/fa";
import { MdCreditCard } from "react-icons/md";
import { PiSignOutFill } from "react-icons/pi";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { Link, NavLink, useLocation } from "react-router-dom";
import SwitchButton from "../components/SwitchButton";
import { toast } from "react-toastify";
import SuccessModal from "../components/SuccessModal";

interface NotificationPreferences {
  enabled_types: string[];
  enabled_channels: string[];
}

interface NotPreferencePresenterProps {
  preferences: NotificationPreferences | null;
  loading: boolean;
  error: string;
  onSavePreference: (prefs: NotificationPreferences) => Promise<void>;
}

function NotPreferencePresenter({
  preferences,
  loading,
  error,
  onSavePreference,
}: NotPreferencePresenterProps) {
  const location = useLocation();

  //My Local state for toggles
  const [browserNotif, setBrowserNotif] = useState(false);
  const [emailNotif, setEmailNotif] = useState(false);
  const [bookingConfirm, setBookingConfirm] = useState(false);
  const [bookingReminder, setBookingReminder] = useState(false);
  const [scheduleChanges, setScheduleChanges] = useState(false);
  const [specialOffers, setSpecialOffers] = useState(false);
  const [latestFeatures, setLatestFeatures] = useState(false);

  const [isSuccessfullySave, setIsSuccessfullySave] = useState(false)

  //Sync state with loaded preferences
  useEffect(() => {
    console.log("Loaded preferences:", preferences);
    if (preferences) {
      setBrowserNotif(preferences.enabled_channels?.includes("push"));
      setEmailNotif(preferences.enabled_channels?.includes("email"));
      setBookingConfirm(preferences.enabled_types?.includes("booking_update"));
      setBookingReminder(preferences.enabled_types?.includes("booking_reminder"));
      setScheduleChanges(preferences.enabled_types?.includes("schedule_change"));
      setSpecialOffers(preferences.enabled_types?.includes("marketing_and_promotional"));
      setLatestFeatures(preferences.enabled_types?.includes("news_and_updates"));
    }
  }, [preferences]);

  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Account", link: "/account" },
    { name: "Notifications" },
  ];

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
      icon: <PiSignOutFill size={24} />,
      title: "Log Out",
      description: "Sign out from your account",
    },
  ];

  //Save preferences handler
  const handleSave = async () => {
    const payload: NotificationPreferences = {
      enabled_types: [
        ...(bookingConfirm ? ["booking_update"] : []),
        ...(bookingReminder ? ["booking_reminder"] : []),
        ...(scheduleChanges ? ["schedule_change"] : []),
        ...(specialOffers ? ["marketing_and_promotional"] : []),
        ...(latestFeatures ? ["news_and_updates"] : []),
      ],
      enabled_channels: [
        ...(browserNotif ? ["push"] : []),
        ...(emailNotif ? ["email"] : []),
      ],
    };

    try {
      await onSavePreference(payload);
      setIsSuccessfullySave(true)

      setTimeout(() => {
        setIsSuccessfullySave(false)
      },3000)
  
    } catch (err) {
      console.error(err);
      toast.error("Failed to save preferences. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
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
            <span className="text-2xl font-semibold">Notification</span>
        </Link>

        {/* Desktop: Show breadcrumbs */}
        <div className="hidden md:block">
            <Breadcrumbs items={breadcrumbs} />
        </div>
        </div>

      {isSuccessfullySave && (
        <SuccessModal>
        <SuccessModal.Body>
            <p>Notification Saved Successfully</p>
        </SuccessModal.Body>
        </SuccessModal>
      )}


      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 px-4 md:px-10">
        {/* LEFT SIDE MENU */}
        <div className="hidden md:block w-[350px]">
          <div className="border border-gray-300 rounded-xl h-auto w-[290px] m-auto">
            {options.map((item, index) => {
              const isActive = location.pathname === item.link;
              return (
                <NavLink
                  key={index}
                  to={item.link || "#"}
                  state={item.state}
                  className={`flex items-center gap-2 p-3 rounded-md cursor-pointer transition 
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
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4">
              {error}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-10 mt-[20%]">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}


          {/* Empty state */}
          {!loading && !preferences && (
            <div className="text-center py-10 text-gray-500">
              No notification preferences found.
            </div>
          )}

          {/* Preferences UI */}
          {!loading && preferences && (
            <>
              {/* Notification Channels */}
              <div className="border border-gray-300 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-2">Notification Channels</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Choose how you want to receive notifications
                </p>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <div>
                    <h3 className="font-medium">Browser Notifications</h3>
                    <p className="text-gray-500 text-sm">
                      Get real-time updates about your bookings in this browser
                    </p>
                  </div>
                  <div>
                     <SwitchButton
                    checked={browserNotif}
                    onChange={(e) => setBrowserNotif(e.target.checked)}
                  />
                  </div>
                </div>

                <div className="flex justify-between items-center py-3">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-gray-500 text-sm">
                      Receive updates via email at your registered address
                    </p>
                  </div>
                  <div>
                    <SwitchButton
                    checked={emailNotif}
                    onChange={(e) => setEmailNotif(e.target.checked)}
                  />
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="border border-gray-300 rounded-xl p-6 mt-5">
                <h2 className="text-lg font-semibold mb-2">
                  Select the Notifications you want to receive
                </h2>

                {/* Booking Updates */}
                <div className="mt-4">
                  <h3 className="font-semibold mb-3">Booking Updates</h3>
                  {[
                    {
                      label: "Booking Confirmation",
                      desc: "When your booking is confirmed",
                      value: bookingConfirm,
                      set: setBookingConfirm,
                    },
                    {
                      label: "Booking Reminders",
                      desc: "24 hours before your booking",
                      value: bookingReminder,
                      set: setBookingReminder,
                    },
                    {
                      label: "Schedule Changes",
                      desc: "When there are changes to your booking",
                      value: scheduleChanges,
                      set: setScheduleChanges,
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-none"
                    >
                      <div>
                        <h4 className="font-medium">{item.label}</h4>
                        <p className="text-gray-500 text-sm">{item.desc}</p>
                      </div>
                      <div>
                        <SwitchButton
                        checked={item.value}
                        onChange={(e) => item.set(e.target.checked)}
                      />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Marketing & Promotions */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Marketing & Promotions</h3>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <h4 className="font-medium">Special Offers</h4>
                      <p className="text-gray-500 text-sm">
                        Exclusive deals and discounts
                      </p>
                    </div>
                    <div>
                        <SwitchButton
                      checked={specialOffers}
                      onChange={(e) => setSpecialOffers(e.target.checked)}
                    />
                    </div>
                  </div>
                </div>

                {/* News & Updates */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">News & Updates</h3>
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <h4 className="font-medium">Latest Features</h4>
                      <p className="text-gray-500 text-sm">
                        Latest features and improvements
                      </p>
                    </div>
                    <div>
                        <SwitchButton
                      checked={latestFeatures}
                      onChange={(e) => setLatestFeatures(e.target.checked)}
                    />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`bg-blue-700 cursor-pointer w-[300px] text-white px-10 py-2 rounded-md transition ${
                    loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-800"
                  }`}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

        <div className="hidden md:block">
            <TravelmateApp />
        </div>
      <div className="m-10"></div>
      <Footer />
    </div>
  );
}

export default NotPreferencePresenter;
