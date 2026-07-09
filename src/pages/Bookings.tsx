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
import {
  getBookingLifecycleStatus,
} from "../features/shared/bookingStatus";

// API & Utils
import {
  CancelStaysBookings,
  CancelTransferBookings,
  fetchAllBookings,
} from "../features/stays/api";
import { getAccessToken } from "../api/services/authUtils";

type BookingsResponse = {
  data?: {
    stays?: unknown[];
    transfers?: unknown[];
    flights?: unknown[];
  };
};

const getImageUrlFromRecord = (record: Record<string, unknown>): string => {
  const hotelImageUrl = record["hotel_image_url"];
  if (typeof hotelImageUrl === "string" && hotelImageUrl.trim()) {
    return hotelImageUrl;
  }

  const images = record["images"];
  if (Array.isArray(images)) {
    for (const image of images) {
      if (!image || typeof image !== "object") continue;
      const img = image as Record<string, unknown>;
      const url =
        (typeof img["secureUrl"] === "string" && img["secureUrl"]) ||
        (typeof img["secure_url"] === "string" && img["secure_url"]) ||
        (typeof img["url"] === "string" && img["url"]) ||
        (typeof img["imageUrl"] === "string" && img["imageUrl"]);
      if (url) return url;
    }
  }

  return "";
};

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
  originalData: Record<string, unknown>;
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
    { name: "Confirmed", value: "pending" },
    { name: "Completed", value: "completed" },
    { name: "Cancelled", value: "cancelled" },
    { name: "Payment failed", value: "failed" },
  ];

  const mergeBookings = (data: unknown): NormalizedBooking[] => {
    const obj = (data as Record<string, unknown> | null) || {};

    const staysArr = Array.isArray(obj.stays as unknown)
      ? (obj.stays as unknown[])
      : [];
    const stays = staysArr.map((s) => {
      const sRec = s as Record<string, unknown>;
      return {
        id: String(sRec['id']),
        type: "stay",
        reference: String(sRec['reference']),
        status: String((sRec['booking_status'] as string) || "").toLowerCase(),
        name: String(sRec['hotel_name'] || ""),
        date: String(sRec['check_in'] || ""),
        date_to: String(sRec['check_out'] || ""),
        amount: Number(sRec['total_amount'] as number || 0),
        currency: String(sRec['currency'] || ""),
        imageUrl: getImageUrlFromRecord(sRec),
        originalData: sRec as Record<string, unknown>,
        session_id: String(sRec['session_id'] || ""),
      } as NormalizedBooking;
    });

    const transfersArr = Array.isArray(obj.transfers as unknown)
      ? (obj.transfers as unknown[])
      : [];
    const transfers = transfersArr.map((t) => {
      const tRec = t as Record<string, unknown>;
      return {
        id: String(tRec['booking_reference']),
        type: "transfer",
        reference: String(tRec['booking_reference']),
        status: String((tRec['booking_status'] as string) || "").toLowerCase(),
        name: String(tRec['dropoff_location_label'] || ""),
        date: String(tRec['pickup_date'] || ""),
        date_to: String(tRec['pickup_date'] || ""),
        amount: Number(tRec['total_amount'] as number || 0),
        currency: String(tRec['currency'] || ""),
        imageUrl: getImageUrlFromRecord(tRec),
        originalData: tRec as Record<string, unknown>,
        session_id: String(tRec['payment_session_id'] || ""),
      } as NormalizedBooking;
    });

    const flightsArr = Array.isArray(obj.flights as unknown)
      ? (obj.flights as unknown[])
      : [];
    const flights = flightsArr.map((f) => {
      const fRec = f as Record<string, unknown>;
      let dep = "";
      let arr = "";
      const itinerary = fRec['flight_itinerary'] as unknown;
      if (Array.isArray(itinerary) && itinerary.length > 0) {
        const first = itinerary[0] as Record<string, unknown>;
        const summary = first['summary'] as Record<string, unknown> | undefined;
        dep = String(summary?.['departure_datetime'] ?? "");
        arr = String(summary?.['arrival_datetime'] ?? "");
      }
      return {
        id: String(fRec['booking_reference']),
        type: "flight",
        reference: String(fRec['booking_reference']),
        status: String((fRec['booking_status'] as string) || "").toLowerCase(),
        name: String(fRec['flight_booking_type'] || ""),
        date: dep,
        date_to: arr,
        amount: Number(fRec['total_amount'] as number || 0),
        currency: String(fRec['currency'] || ""),
        imageUrl: getImageUrlFromRecord(fRec),
        originalData: fRec as Record<string, unknown>,
        session_id: String(fRec['payment_session_id'] || ""),
      } as NormalizedBooking;
    });

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

        const res = (await fetchAllBookings()) as BookingsResponse;
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
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("Error cancelling booking:", msg);
      toast.error(msg || "Failed to cancel booking");
    } finally {
      setCancelingBookingId(null);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      const lifecycleStatus = getBookingLifecycleStatus(item.status, item.date_to || item.date);

      // Map URL tabs to specific data statuses
      switch (currentTab) {
        case "pending":
          return lifecycleStatus === "confirmed";

        case "completed":
          return lifecycleStatus === "completed";

        case "cancelled":
          return lifecycleStatus === "cancelled";

        case "failed":
          return lifecycleStatus === "payment_failed";

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
