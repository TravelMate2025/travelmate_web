import React, { useEffect, useState } from "react";
import Navbar from "../../../pages/homePage/Navbar";
import { FaShareAlt, FaDownload } from "react-icons/fa";
import { GrStatusGood } from "react-icons/gr";
import ConfirmationDetails from "../components/confirmation/ConfirmationDetails";
import GuestDetails from "../components/confirmation/GuestDetails";
import PriceSummary from "../components/confirmation/PriceSummary";
import HotelDetails from "../components/confirmation/HotelDetails";
import RoomDetails from "../components/confirmation/RoomDetails";
import BackHomeButton from "../components/confirmation/BackHomeButton";
import ContactDetails from "../components/confirmation/ContactDetails";
import Footer from "../../../components/2Footer";
import ShareModal from "../components/modals/ShareModal";
import SkeletonConfirm from "../../car_rentals/carPaidFor/Skeleton";
import CarFailedPayment from "../../car_rentals/carPaidFor/CarFailedPayment";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { verifyHotelBooking } from "../api";
import { BookingDetailsVerifyData } from "../types";
import { Loader } from "lucide-react";
// import { BookingStaysVerifyDetails } from "../types";

const BookingConfirmationPage: React.FC = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<BookingDetailsVerifyData>();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams?.get("session_id");
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      const isSuccess =
        searchParams.has("success") || location.pathname.includes("success");
      try {
        setLoading(true);
        if (isSuccess) {
          const res = await verifyHotelBooking(sessionId);
          setBooking(res?.data || null);
        } else {
          return <CarFailedPayment />;
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchBooking();
  }, [sessionId]);

  if (loading) return <SkeletonConfirm />;
  if (!booking) return <></>;

  const handleDownload = (cars: any) => {
    try {
      setDownloadLoading(true);
      window.open(
        `/stays-paid/download?data=${encodeURIComponent(JSON.stringify(cars))}`,
        "_blank"
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

  return (
    <div>
      <Navbar />
      <div className="w-[93%] mx-auto mt-26 px-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Booking Confirmation
          </h1>
          <div className="flex gap-3 flex-wrap">
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

        {/* Notification */}
        {booking?.payment_status === "succeeded" && (
          <div className="bg-green-50 border border-green-600 px-4 py-2 mb-6 rounded-lg flex sm:flex-row items-start sm:items-center gap-3">
            <div className="pt-1 sm:pt-0 flex justify-center sm:justify-start items-center">
              <GrStatusGood size={24} className="text-green-600 mt-5 sm:mt-0" />
            </div>
            <p>
              <span className="font-semibold">Payment Successful</span> and your
              stay is confirmed. Booking confirmation will also be sent to{" "}
              <span className="font-semibold">
                {booking?.guest_details?.primary_guest?.email}
              </span>
              .
            </p>
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
            <BackHomeButton />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingConfirmationPage;
