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
import { CancelBookings, fetchBookings } from "../api";
import { getAccessToken } from "../../../api/services/authUtils";
import toast from "react-hot-toast";
import BookingsSkeleton from "../components/bookingTabs/SkeletonLoader";

interface Bookings {
  id: string;
  reference: string;
  status: "pending" | "completed" | "cancelled" | "failed";
  imageUrl: string;
  hotel_name: string;
  check_in: string;
  check_out: string;
  total_price: number;
}
const Bookings = () => {
  const bookingTabs = [
    { name: "Ongoing", link: "/bookings?tab=pending" },
    { name: "Completed", link: "/bookings?tab=completed" },
    { name: "Cancelled", link: "/bookings?tab=cancelled" },
    { name: "Failed", link: "/bookings?tab=failed" },
  ];
  const [activeTab, setActiveTab] = useState<string>(
    bookingTabs[0].name.toLowerCase()
  );
  const accessToken = getAccessToken();
  const [loading, setLoading] = useState(false);
  const [cancelingBookingId, setCancelingBookingId] = useState<string | null>(
    null
  );
  const breadcrumbs = [{ name: "Home", link: "/" }, { name: "Bookings" }];
  const [bookings, setBookings] = useState<Bookings[]>([]);

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
  };

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await fetchBookings(accessToken);
      setBookings(response.data || []);
    } catch (error: any) {
      console.log(error);
      // toast.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (bookings) fetchBooking();
  }, [accessToken]);

  const cancelABooking = async (bookingId: string) => {
    try {
      setCancelingBookingId(bookingId);
      await CancelBookings(bookingId, accessToken);
      toast.success("Booking cancelled successfully");

      // Update local state
      setBookings((prev) =>
        prev.map((book) =>
          book?.reference === bookingId
            ? { ...book, status: "cancelled" }
            : book
        )
      );
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      toast.error(error.message || "Failed to cancel booking");
    } finally {
      setCancelingBookingId(null);
    }
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
              key={item?.name}
              onClick={() => handleOptionClick(item?.name.toLowerCase())}
            >
              <Link to={item?.link}>{item?.name}</Link>
            </p>
          ))}
        </div>
        <div className="mt-6">
          {loading ? (
            <BookingsSkeleton />
          ) : bookings.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {" "}
              {activeTab === "ongoing" && (
                <Ongoing
                  bookings={bookings?.filter(
                    (item) => item?.status.toLowerCase() === "pending"
                  )}
                  onCancel={cancelABooking}
                  cancelingId={cancelingBookingId}
                />
              )}
              {activeTab === "completed" && (
                <Completed
                  bookings={bookings?.filter(
                    (item) => item?.status.toLowerCase() === "ongoing"
                  )}
                />
              )}
              {activeTab === "cancelled" && (
                <Cancelled
                  bookings={bookings?.filter(
                    (item) => item?.status.toLowerCase() === "cancelled"
                  )}
                />
              )}
              {activeTab === "failed" && (
                <Failed
                  bookings={bookings?.filter(
                    (item) => item?.status.toLowerCase() === "failed"
                  )}
                />
              )}
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
