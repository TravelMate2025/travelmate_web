import { Link, useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Navbar from "../../../pages/homePage/Navbar";
import { useEffect, useState } from "react";
import Ongoing from "../components/bookingTabs/Ongoing";
import Completed from "../components/bookingTabs/Completed";
import Cancelled from "../components/bookingTabs/Cancelled";
import Failed from "../components/bookingTabs/Failed";
import EmptyState from "../components/bookingTabs/EmptyState";
import TravelmateApp from "../../../pages/homePage/TravelmateApp";
import Footer from "../../../components/2Footer";

interface Bookings {
  id: string;
  status: "ongoing" | "completed" | "cancelled" | "failed";
  imageUrl: string;
  title: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
}
const Bookings = () => {
  const [activeTab, setActiveTab] = useState("ongoing");
  const breadcrumbs = [{ name: "Home", link: "/" }, { name: "Bookings" }];
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const bookingTabs = [
    { name: "Ongoing", link: "/bookings?tab=ongoing" },
    { name: "Completed", link: "/bookings?tab=completed" },
    { name: "Cancelled", link: "/bookings?tab=cancelled" },
    { name: "Failed", link: "/bookings?tab=failed" },
  ];
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get("tab");

  useEffect(() => {
    if (tabFromQuery) {
      setActiveTab(tabFromQuery);
    }
  }, [tabFromQuery]);


  const handleOptionClick = (tab: string) => {
    setActiveTab(tab);
    navigate(`/bookings?tab=${encodeURIComponent(tab)}`);
      setBookings([
    {
      id: "1",
      status: "ongoing",
      imageUrl: "src/assets/images/City-image.png",
      title: "Hotel California",
      checkInDate: "2024-07-01",
      checkOutDate: "2024-07-05",
      totalAmount: 500,
    },
  ]);
  };
  return (
    <div className="mt-24">
      <Navbar />
      <Breadcrumbs items={breadcrumbs} />
      <div className="lg:px-10 px-4">
        <h1 className="text-2xl py-6 font-bold">Bookings</h1>

        <div className="bg-[#F5F5F5] rounded-lg lg:p-3 p-4 flex justify-normal items-center gap-4 max-w-auto overflow-x-scroll lg:overflow-hidden lg:max-w-3xl">
          {bookingTabs.map((item) => (
            <p
              className={`  ${
                activeTab === item.name.toLowerCase()
                  ? `bg-white lg:px-6 px-8 py-3`
                  : `bg-transparent`
              } p-2 rounded-lg cursor-pointer`}
              key={item.name}
              onClick={() => handleOptionClick(item.name.toLowerCase())}
            >
              <Link to={item.link}>{item.name}</Link>
            </p>
          ))}
        </div>
        <div className="mt-6">
          {bookings.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {" "}
              {activeTab === "ongoing" && <Ongoing bookings={bookings} />}
              {activeTab === "completed" && <Completed bookings={bookings} />}
              {activeTab === "cancelled" && <Cancelled bookings={bookings} />}
              {activeTab === "failed" && <Failed bookings={bookings} />}
            </>
          )}
        </div>
      </div>
      <TravelmateApp />
      <Footer />
    </div>
  );
};

export default Bookings;
