import React, { useEffect, useState } from "react";
import Navbar from "../../../pages/homePage/Navbar";
import { FaShareAlt, FaDownload } from "react-icons/fa";
import ConfirmationDetails from "../../../features/stays/components/confirmation/ConfirmationDetails";
import GuestDetails from "../../../features/stays/components/confirmation/GuestDetails";
import PriceSummary from "../../../features/stays/components/confirmation/PriceSummary";
import HotelDetails from "../../../features/stays/components/confirmation/HotelDetails";
import RoomDetails from "../../../features/stays/components/confirmation/RoomDetails";
import ContactDetails from "../../../features/stays/components/confirmation/ContactDetails";
import Footer from "../../../components/2Footer";
import ShareModal from "../../../features/stays/components/modals/ShareModal";
import SkeletonConfirm from "../../../features/car_rentals/carPaidFor/Skeleton";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CancelStaysBookings,
  verifyHotelBooking,
} from "../../../features/stays/api";
import { BookingDetailsVerifyData } from "../../../features/stays/types";
import { ChevronLeft, Loader } from "lucide-react";
import { TbInfoTriangle } from "react-icons/tb";
import ConfirmCancel from "./ConfirmCancel";
import WriteAReview from "./WriteAReview";

const BookingStaysDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<BookingDetailsVerifyData>();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams?.get("session_id");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [cancelLoad, setCancelLoad] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [cancelSubmitted, setCancelSubmitted] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await verifyHotelBooking(sessionId);
        setBooking(res?.data || null);
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchBooking();
  }, [sessionId]);

  if (loading) return <SkeletonConfirm />;

  const handleDownload = (cars: any) => {
    try {
      setDownloadLoading(true);
      window.open(
        `/stays-paid/download?data=${encodeURIComponent(JSON.stringify(cars))}`,
        "_blank",
      );
    } catch (error) {
      toast.error("Failed to download, try again ");
    } finally {
      setDownloadLoading(false);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "succeeded":
        return "text-[#2D9C5E]";
      case "pending":
        return "text-[#F2994A]";
      case "failed":
        return "text-[#EB5757]";
      default:
        return "text-[#4E4F52]";
    }
  };
  const handleCancelBookings = async (
    bookingId: string | undefined,
    cancellation_reason?: string | undefined,
  ) => {
    try {
      await CancelStaysBookings(bookingId, setCancelLoad, cancellation_reason);
      toast.success("Booking cancelled successfully");

      setBooking((prev: any) => {
        if (!prev) return null;
        return {
          ...prev,
          status: "CANCELLED",
        };
      });

      setCancelSubmitted(true);
      setOpenConfirm(false);
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      toast.error(error.message || "Failed to cancel booking");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="mx-auto mt-26 lg:px-8 px-6 pb-20">
        {showShareModal && (
          <ShareModal
            onClose={() => setShowShareModal(false)}
            shareLink={`/bookings/details/${booking?.reference}`}
          />
        )}
        {openConfirm && (
          <ConfirmCancel
            bookings={booking}
            closeModal={() => setOpenConfirm(false)}
            handleCancel={() => handleCancelBookings(booking?.reference)}
            loadCancel={cancelLoad}
          />
        )}

        {openReviewModal && (
          <WriteAReview
            closeModal={() => setOpenReviewModal(false)}
            bookings={booking}
          />
        )}
        {/* Header Section */}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div className="flex items-center lg:gap-8 gap-5 justify-normal">
            <ChevronLeft
              width={30}
              height={30}
              className="bg-white rounded-sm shadow-lg"
              onClick={() => navigate(-1)}
            />
            <h1 className="text-2xl font-bold">Booking Details</h1>
          </div>

          <div className="flex gap-3 flex-wrap py-4 lg:pt-0">
            <button
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg"
              onClick={() => setShowShareModal(true)}
            >
              <FaShareAlt size={18} />
              Share
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg"
              onClick={() => handleDownload(booking)}
            >
              {downloadLoading ? (
                <Loader className="animate-spiner" />
              ) : (
                <FaDownload size={18} />
              )}
              Download
            </button>
          </div>
          {showShareModal && (
            <ShareModal
              onClose={() => setShowShareModal(false)}
              shareLink={""}
            />
          )}
        </div>
        {cancelSubmitted && (
          <div className="flex justify-normal gap-1 items-center border border-[#D72638] p-2 rounded-lg bg-red-50">
            <TbInfoTriangle stroke="#D72638" />
            <p className="tetx-gray-500 text-sm">
              Cancellation Request has been submitted
            </p>
          </div>
        )}
        {booking?.status?.toLowerCase() === "cancelled" && (
          <div className="flex justify-normal gap-2 items-center border border-[#D72638] p-3 rounded-lg bg-red-50 my-6">
            <TbInfoTriangle stroke="#D72638" fontSize={20} />
            <div className="flex flex-col text-sm">
              <p className="text-black font-medium">
                This Stays Bookings has been cancelled
              </p>
              <p className="text-gray-500">
                Cancellation made on{" "}
                {new Date(booking?.cancelled_at).toLocaleDateString()} at{" "}
                {new Date(booking?.cancelled_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-8 sm:space-y-4">
            <ConfirmationDetails
              getStatusColor={getStatusColor}
              confirmDetails={booking}
            />
            {booking?.guest_details?.primary_guest && (
              <GuestDetails guest={booking.guest_details.primary_guest} />
            )}
          </div>

          <div className="space-y-4">
            <PriceSummary booking={booking} />
            <RoomDetails booking={booking} />
            <HotelDetails booking={booking} />
            <ContactDetails />
            <div className="flex flex-col w-full gap-y-5">
              {/* CANCEL BUTTON */}
              {booking?.status?.toLowerCase() !== "cancelled" &&
                booking?.status?.toLowerCase() === "ongoing" && (
                  <div className="pt-8 ">
                    <button
                      onClick={() => setOpenConfirm(true)}
                      className="w-full border-[#D72638] border text-[#D72638] py-3 rounded-lg font-medium hover:bg-red-50 transition"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
            </div>
            {/* WRITE A REVIEW BUTTON  */}

            {booking?.status?.toLowerCase() == "completed" && (
              <div className="pt-2 ">
                <button
                  onClick={() => setOpenReviewModal(true)}
                  className="w-full border-[#023E8A] border text-[#023E8A] py-3 rounded-lg font-medium hover:bg-blue-50 transition"
                >
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingStaysDetailsPage;
