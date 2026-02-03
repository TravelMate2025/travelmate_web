import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";

// Components
import Breadcrumbs from "../components/Breadcrumbs";
import Navbar from "./homePage/Navbar";
import Ongoing from "../components/bookingTabs/Ongoing";
import Completed from "../components/bookingTabs/Completed";
import Cancelled from "../components/bookingTabs/Cancelled";
import Failed from "../components/bookingTabs/Failed";
import EmptyState from "../components/bookingTabs/EmptyState";
import TravelmateApp from "./homePage/TravelmateApp";
import Footer from "../components/2Footer";
import BookingsSkeleton from "../components/bookingTabs/SkeletonLoader";

// API & Utils
import {
  CancelStaysBookings,
  CancelTransferBookings,
  fetchAllBookings,
} from "../features/stays/api";
import { getAccessToken } from "../api/services/authUtils";

export interface NormalizedBooking {
  id: string;
  type: "stay" | "transfer" | "flight";
  reference: string;
  status:
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "failed"
    | "ongoing";
  name: string;
  date: string;
  date_to: string;
  amount: number;
  currency: string;
  imageUrl?: string;
  originalData: any;
  session_id: string;
}

const Bookings = () => {
  const [searchParams] = useSearchParams();
  const accessToken = getAccessToken();

  // State
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<NormalizedBooking[]>([]);
  const [cancelingBookingId, setCancelingBookingId] = useState<string | null>(
    null
  );

  const currentTab = searchParams.get("tab") || "pending";
  const breadcrumbs = [{ name: "Home", link: "/" }, { name: "Bookings" }];
  const bookingTabs = [
    { name: "Ongoing", value: "pending" },
    { name: "Completed", value: "completed" },
    { name: "Cancelled", value: "cancelled" },
    { name: "Failed", value: "failed" },
  ];

  const mergeBookings = (data: any): NormalizedBooking[] => {
    const stays = (data.stays || []).map((s: any) => ({
      id: s.id,
      type: "stay",
      reference: s.reference,
      status: s.booking_status?.toLowerCase(),
      name: s.hotel_name,
      date: s.check_in,
      date_to: s.check_out,
      amount: Number(s.total_amount),
      currency: s.currency,
      imageUrl: s.imageUrl,
      originalData: s,
      session_id: s.session_id,
    }));

    const transfers = (data.transfers || []).map((t: any) => ({
      id: t.booking_reference,
      type: "transfer",
      reference: t.booking_reference,
      status: t.booking_status?.toLowerCase(),
      name: t.dropoff_location_label,
      date: t.pickup_date,
      date_to: t.pickup_date,
      amount: Number(t.total_amount),
      currency: t.currency,
      imageUrl: "",
      originalData: t,
      session_id: t.payment_session_id,
    }));

    const flights = (data.flights || []).map((f: any) => ({
      id: f.booking_reference,
      type: "flight",
      reference: f.booking_reference,
      status: f.booking_status?.toLowerCase(),
      name: f.flight_booking_type,
      date: f.flight_itinerary[0].summary.departure_datetime,
      date_to: f.flight_itinerary[0].summary.arrival_datetime,
      amount: Number(f.total_amount),
      currency: f.currency,
      imageUrl: "",
      originalData: f,
      session_id: f.payment_session_id,
    }));
    return [...stays, ...transfers, ...flights].sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });
  };

  // --- Effects ---

  useEffect(() => {
    const load = async () => {
      if (!accessToken) return;

      try {
        setLoading(true);

        const res = await fetchAllBookings();
        if (res?.data) {
          setBookings(mergeBookings(res.data));
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [accessToken]);

  // --- Handlers ---

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setCancelingBookingId(bookingId);
      const bookingToCancel = bookings.find(
        (b) => b.reference === bookingId || b.id === bookingId
      );

      if (!bookingToCancel) {
        throw new Error("Booking not found");
      }
      if (bookingToCancel.type === "stay") {
        await CancelStaysBookings(bookingId);
      } else {
        await CancelTransferBookings(bookingId);
      }

      toast.success("Booking cancelled successfully");
      setBookings((prev) =>
        prev.map((book) =>
          book.reference === bookingId ? { ...book, status: "cancelled" } : book
        )
      );
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      toast.error(error.message || "Failed to cancel booking");
    } finally {
      setCancelingBookingId(null);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      const status = item.status.toLowerCase();
      const date = new Date(item.date_to);

      // Map URL tabs to specific data statuses
      switch (currentTab) {
        case "pending": // "Ongoing" tab
          return status === "ongoing" ||
            (status === "confirmed" && date > new Date());

        case "completed":
          return (
            status === "completed" ||
            (status === "confirmed" && date < new Date())
          );

        case "cancelled":
          return status === "cancelled";

        case "failed":
          return status === "pending" || status === "failed";

        default:
          return false;
      }
    });
  }, [bookings, currentTab]);

  return (
    <div className="mt-24">
      <Navbar />
      <Breadcrumbs items={breadcrumbs} />

      <div className="lg:px-10 px-4">
        <h1 className="text-2xl py-6 font-bold">Bookings</h1>

        {/* Tabs */}
        <div className="bg-[#F5F5F5] rounded-lg lg:p-3 p-4 flex items-center gap-4 overflow-x-auto lg:overflow-hidden max-w-3xl">
          {bookingTabs.map((tab) => {
            const isActive = currentTab === tab.value;
            return (
              <Link
                key={tab.name}
                to={`/bookings?tab=${tab.value}`}
                className={`${
                  isActive
                    ? "bg-white shadow-sm"
                    : "bg-transparent hover:bg-gray-200"
                } px-6 py-3 rounded-lg cursor-pointer transition-all whitespace-nowrap`}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="mt-6 min-h-[300px]">
          {loading ? (
            <BookingsSkeleton />
          ) : bookings.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {currentTab === "pending" && (
                <Ongoing
                  bookings={filteredBookings}
                  onCancel={handleCancelBooking}
                  cancelingId={cancelingBookingId}
                />
              )}
              {currentTab === "completed" && (
                <Completed bookings={filteredBookings} />
              )}
              {currentTab === "cancelled" && (
                <Cancelled bookings={filteredBookings} />
              )}
              {currentTab === "failed" && (
                <Failed bookings={filteredBookings} />
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
