import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../../pages/homePage/Navbar";
import Footer from "../../../components/2Footer";
import { FaDownload, FaShareAlt } from "react-icons/fa";
import { GrStatusGood } from "react-icons/gr";
import { Loader } from "lucide-react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import ShareModal from "../components/modals/ShareModal";
import ConfirmationDetails from "../components/confirmation/ConfirmationDetails";
import HotelDetails from "../components/confirmation/HotelDetails";
import RoomDetails from "../components/confirmation/RoomDetails";
import BackHomeButton from "../components/confirmation/BackHomeButton";
import ContactDetails from "../components/confirmation/ContactDetails";
import SkeletonConfirm from "../../car_rentals/carPaidFor/Skeleton";
import CarFailedPayment from "../../car_rentals/carPaidFor/CarFailedPayment";
import { verifyHotelBooking } from "../api";
import { BookingDetailsVerifyData } from "../types";
import { bookingConfirmationLabel } from "../../shared/booking/bookingFlowLabels";

const BookingConfirmationPage: React.FC = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<BookingDetailsVerifyData>();
  const [showShareModal, setShowShareModal] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const sessionId =
    searchParams.get("session_id") ??
    searchParams.get("tx_ref") ??
    searchParams.get("transaction_id") ??
    searchParams.get("booking_reference");
  const paymentStatus = (searchParams.get("status") ?? "").toLowerCase();
  const isSuccess =
    paymentStatus === "successful" ||
    paymentStatus === "success" ||
    searchParams.has("success") ||
    location.pathname.includes("success");
  const normalizedPaymentStatus = (
    booking?.payment_state ?? booking?.payment_status ?? paymentStatus ?? ""
  ).toLowerCase();
  const isSuccessfulPayment =
    isSuccess ||
    normalizedPaymentStatus === "succeeded" ||
    normalizedPaymentStatus === "confirmed";
  const isPendingPayment =
    normalizedPaymentStatus === "pending" ||
    normalizedPaymentStatus === "processing" ||
    normalizedPaymentStatus === "requires_action";
  const isFailedPayment =
    normalizedPaymentStatus === "failed" ||
    normalizedPaymentStatus === "expired" ||
    normalizedPaymentStatus === "canceled" ||
    normalizedPaymentStatus === "cancelled";

  useEffect(() => {
    let cancelled = false;
    const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

    const fetchBooking = async () => {
      if (!sessionId) return;

      try {
        setLoading(true);
        for (let attempt = 0; attempt < 5 && !cancelled; attempt += 1) {
          try {
            const res = await verifyHotelBooking(sessionId);
            if (!cancelled && res?.data) {
              console.debug("[Stays][confirmation] page data", res.data);
              setBooking(res.data);
              return;
            }
          } catch (error) {
            console.error("Error fetching booking:", error);
          }

          if (attempt < 4 && !cancelled) {
            await delay(1500);
          }
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchBooking();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const handleDownload = (bookingData: BookingDetailsVerifyData) => {
    try {
      setDownloadLoading(true);
      window.open(
        `/stays-paid/download?data=${encodeURIComponent(JSON.stringify(bookingData))}`,
        "_blank",
      );
    } catch (_error) {
      toast.error("Failed to download, try again");
    } finally {
      setDownloadLoading(false);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "succeeded":
      case "confirmed":
        return "text-[#2D9C5E]";
      case "pending":
        return "text-[#F2994A]";
      case "failed":
        return "text-[#EB5757]";
      default:
        return "text-[#4E4F52]";
    }
  };

  const currentRooms = booking?.rooms_details ?? [];
  const primaryGuest = booking?.guest_details?.primary_guest;
  const supportEmail = primaryGuest?.email ?? booking?.user?.email ?? "your email";
  const paymentLabel = booking?.payment_state ?? booking?.payment_status ?? "N/A";
  const isConfirmed = ["succeeded", "confirmed"].includes(
    (booking?.payment_state ?? booking?.payment_status ?? "").toLowerCase(),
  );
  const shareLink = typeof window !== "undefined" ? window.location.href : "";
  const roomName =
    currentRooms[0] && typeof currentRooms[0] === "object"
      ? (currentRooms[0] as { name?: string; room_name?: string; description?: string }).name ??
        (currentRooms[0] as { name?: string; room_name?: string; description?: string }).room_name ??
        (currentRooms[0] as { name?: string; room_name?: string; description?: string }).description ??
        booking?.hotel_name
      : typeof currentRooms[0] === "string" || typeof currentRooms[0] === "number"
        ? String(currentRooms[0])
        : booking?.hotel_name;

  if (loading) return <SkeletonConfirm />;

  if (isPendingPayment) {
    return (
      <div>
        <Navbar />
        <div className="lg:pt-24 pt-20">
          <main className="mx-auto max-w-3xl px-6 py-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF4D6] text-[#F2994A]">
              <Loader className="h-8 w-8 animate-spin" />
            </div>
            <h1 className="text-2xl font-semibold text-[#181818]">Payment pending</h1>
            <p className="mt-3 text-[#4E4F52]">
              We’re still waiting for the payment provider to confirm this stay booking.
            </p>
            {(sessionId || searchParams.get("transaction_id")) && (
              <p className="mt-4 text-sm text-[#4E4F52]">
                Reference: {sessionId || searchParams.get("transaction_id")}
              </p>
            )}
            <div className="mt-8">
              <a href="/" className="rounded-lg bg-[#023E8A] px-5 py-3 text-white">
                Back to home
              </a>
            </div>
          </main>
        </div>
        <div className="mt-24">
          <Footer />
        </div>
      </div>
    );
  }

  if (isFailedPayment && !booking) return <CarFailedPayment />;

  if (!isSuccessfulPayment && !booking) return <CarFailedPayment />;

  if (!booking) {
    return (
      <div>
        <Navbar />
        <div className="lg:pt-24 pt-20">
          <main className="mx-auto max-w-3xl px-6 py-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#D5EBDF] text-[#2D9C5E]">
              <GrStatusGood size={34} />
            </div>
            <h1 className="text-2xl font-semibold text-[#181818]">Payment successful</h1>
            <p className="mt-3 text-[#4E4F52]">
              Your stay payment completed successfully. We’re still loading the booking details.
            </p>
            {(sessionId || searchParams.get("transaction_id")) && (
              <p className="mt-4 text-sm text-[#4E4F52]">
                Reference: {sessionId || searchParams.get("transaction_id")}
              </p>
            )}
            <div className="mt-8">
              <a href="/" className="rounded-lg bg-[#023E8A] px-5 py-3 text-white">
                Back to home
              </a>
            </div>
          </main>
        </div>
        <div className="mt-24">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="lg:pt-32 pt-20">
        {showShareModal && (
          <ShareModal onClose={() => setShowShareModal(false)} shareLink={shareLink} />
        )}

        <div className="lg:hidden px-6 lg:px-8 py-6 m-auto flex justify-between">
          <p className="text-[20px] font-semibold font-inter">{bookingConfirmationLabel()}</p>
          <div className="flex items-center gap-3">
            <div
              className="w-[35px] h-[35px] p-[4px] bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px]"
              onClick={() => setShowShareModal(true)}
            >
              <FaShareAlt className="text-[#023E8A]" />
            </div>
            <div
              className="w-[35px] h-[35px] p-[4px] bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px]"
              onClick={() => handleDownload(booking)}
            >
              {downloadLoading ? <Loader className="animate-spin" /> : <FaDownload className="text-[#023E8A]" />}
            </div>
          </div>
        </div>

        <div className="hidden px-6 lg:px-8 py-6 m-auto lg:flex justify-between">
          <p className="text-[20px] font-semibold font-inter">{bookingConfirmationLabel()}</p>
          <div className="flex items-center justify-end gap-4">
            <div
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 rounded-md border-[1px] border-[#ACAEB3] p-2 cursor-pointer"
            >
              <FaShareAlt />
              <span>Share</span>
            </div>
            <div
              onClick={() => handleDownload(booking)}
              className="flex items-center gap-2 rounded-md border-[1px] border-[#ACAEB3] p-2 cursor-pointer"
            >
              {downloadLoading ? <Loader className="animate-spin" /> : <FaDownload />}
              <span>Download</span>
            </div>
          </div>
        </div>

        {isConfirmed && (
          <div className="mb-8 px-6 lg:px-8 m-auto">
            <div className="border-1 border-[#2D9C5E] w-full bg-[#D5EBDF4D] pt-[10px] pb-[10px] pr-[10px] pl-[10px] rounded-[8px]">
              <div className="flex gap-2 items-center">
                <div className="border-[#2D9C5E] h-[20px] w-[20px] border-2 mt-[6px] rounded-full flex justify-center">
                  <GrStatusGood
                    size={15}
                    className="relative top-[-3px] text-[#2D9C5E]"
                  />
                </div>
                <div className="text-[12px]">
                  Payment successful. Your stay confirmation details will also be sent to {supportEmail}
                </div>
              </div>
            </div>
          </div>
        )}

        <div id="pdf-content" className="lg:grid lg:grid-cols-2 lg:w-full">
          <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-1">
            <p className="text-[16px] font-medium text-[#181818] mb-[15px]">Confirmation details</p>
            <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
              <div className="flex justify-between">
                <p className="text-[#4E4F52] text-[14px] font-normal">Payment Status</p>
                <p className={`text-[14px] font-normal ${getStatusColor(paymentLabel)}`}>{paymentLabel}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#4E4F52] text-[14px] font-normal">Booking ID</p>
                <p className="text-[14px] font-normal">{booking.reference}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#4E4F52] text-[14px] font-normal">Hotel</p>
                <p className="text-[14px] font-normal">{booking.hotel_name}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#4E4F52] text-[14px] font-normal">Check-in</p>
                <p className="text-[14px] font-normal">{booking.check_in}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#4E4F52] text-[14px] font-normal">Check-out</p>
                <p className="text-[14px] font-normal">{booking.check_out}</p>
              </div>
            </div>
          </div>

          <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-3">
            <p className="text-[14px] font-inter py-4 font-medium text-[#181818]">Stay details</p>
            <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Hotel Code</p>
                  <p className="text-[#181818] text-[14px] font-inter">{booking.hotel_code || "N/A"}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Location</p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {booking.hotel_location?.address || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Room</p>
                  <p className="text-[#181818] text-[14px] font-inter">{roomName || "N/A"}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Primary guest</p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {primaryGuest?.name || "N/A"} {primaryGuest?.surname || ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-5">
            <p className="text-[14px] font-medium text-[#181818] py-4">Guest details</p>
            <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
              <div className="flex justify-between mb-[6px]">
                <p className="text-[#4E4F52] text-[14px]">Name</p>
                <p className="text-[#181818] text-[14px]">
                  {primaryGuest?.name ?? "N/A"} {primaryGuest?.surname ?? ""}
                </p>
              </div>
              <div className="flex justify-between mb-[6px]">
                <p className="text-[#4E4F52] text-[14px]">Email Address</p>
                <p className="text-[#181818] text-[14px]">{primaryGuest?.email ?? "N/A"}</p>
              </div>
              <div className="flex justify-between mb-[6px]">
                <p className="text-[#4E4F52] text-[14px] ">Phone Number</p>
                <p className="text-[#181818] text-[14px]">{primaryGuest?.phone ?? "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-2">
            <p className="text-[14px] font-inter py-4 font-medium text-[#181818]">Estimated price summary</p>
            <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
              <div className="flex justify-between">
                <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Total</p>
                <p className="text-[#181818] text-[14px] font-inter">
                  {booking.currency || "EUR"} {booking.total_price}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-4">
            <p className="text-[14px] font-medium text-[#181818] py-4">Hotel details</p>
            <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
              <ConfirmationDetails getStatusColor={getStatusColor} confirmDetails={booking} />
              <div className="mt-4">
                <HotelDetails booking={booking} />
              </div>
            </div>
          </div>

          <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-6">
            <p className="text-[14px] font-medium text-[#181818] py-4">Room details</p>
            <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
              <RoomDetails booking={booking} />
            </div>
          </div>

          <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-7">
            <p className="text-[14px] font-medium text-[#181818] py-4">Contacts</p>
            <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
              <ContactDetails />
            </div>
          </div>

          <div className="mx-6 lg:mx-8 lg:order-8">
            <BackHomeButton />
          </div>

          <div className="mt-24 lg:order-9">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
