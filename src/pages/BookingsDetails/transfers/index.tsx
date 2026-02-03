import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

// Icons
import { Divider } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { ChevronLeft, Loader } from "lucide-react";
import { TbInfoTriangle } from "react-icons/tb";
import { FaDownload, FaShareAlt } from "react-icons/fa";

// Components
import Navbar from "../../homePage/Navbar";
import Footer from "../../../components/2Footer";
import SkeletonDetails from "../Skeleton";
import ShareModal from "../../../features/stays/components/modals/ShareModal";
import ConfirmCancel from "./ConfirmCancel";

// API
import {
  CancelTransferBookings,
  verifyTransfersBooking,
} from "../../../features/stays/api";

import toast from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { TransfersDetailsResponse } from "./type";
import { useNavigate } from "react-router-dom";
import NotFound from "../NotFound";

const BookingTransfersDetails = () => {
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams?.get("session_id");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<TransfersDetailsResponse>();
  const [showShareModal, setShowShareModal] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [cancelLoad, setCancelLoad] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [cancelSubmitted, setCancelSubmitted] = useState(false);

  const transfer = booking?.transfers?.[0];
  const cancellationPolicy = transfer?.cancellationPolicies?.[0];

  useEffect(() => {
    const fetchDetails = async () => {
      if (!sessionId) return;
      try {
        setLoading(true);
        const res = await verifyTransfersBooking(sessionId);
        setBooking(res?.data?.bookings[0] ?? null);
      } catch (error) {
        console.error("Error fetching details:", error);
        toast.error("Could not load booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [sessionId]);

  const handleDownload = (bookingItem: any) => {
    try {
      setDownloadLoading(true);
      window.open(
        `/car-paid/download?data=${encodeURIComponent(
          JSON.stringify(bookingItem)
        )}`,
        "_blank"
      );
    } catch (error) {
      toast.error("Failed to download, try again");
    } finally {
      setDownloadLoading(false);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "succeeded":
        return "text-[#2D9C5E]";
      case "pending":
        return "text-[#F2994A]";
      case "cancelled":
      case "failed":
        return "text-[#EB5757]";
      default:
        return "text-[#4E4F52]";
    }
  };

  const handleCancelBookings = async (bookingId: string | undefined) => {
    try {
      await CancelTransferBookings(bookingId, setCancelLoad);
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

  if (loading) return <SkeletonDetails />;
  if (!booking && !loading) return <NotFound />;

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <Navbar />
      <ToastContainer />
      <div className="py-20 w-full">
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

        {/* --- Notifications --- */}
        <div className="px-6 lg:px-10 mb-6 space-y-4">
          {cancelSubmitted && (
            <div className="flex justify-normal gap-1 items-center border border-[#D72638] p-2 rounded-lg bg-red-50 text-red-700">
              <TbInfoTriangle stroke="#D72638" />
              <p>Cancellation Request has been submitted</p>
            </div>
          )}
          {booking?.status.toLowerCase() === "cancelled" && (
            <div className="flex justify-normal gap-2 items-center border border-[#D72638] p-2 rounded-lg bg-red-50 my-3">
              <TbInfoTriangle stroke="#D72638" fontSize={20} />
              <div className="flex flex-col ">
                <p className="text-black">This transfer has been cancelled</p>
                <p className="text-gray-500 text-sm">
                  Cancellation made on{" "}
                  {/* {new Date(cancellationPolicy?.from).toLocaleDateString()} at{" "} */}
                  {/* {new Date(booking?.cancelled_at).toLocaleTimeString()} */}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* --- Header Section (Title & Buttons) --- */}
        <div className="px-6 lg:px-10 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-5 lg:gap-8">
              <ChevronLeft
                width={30}
                height={30}
                className="bg-white rounded-sm shadow-lg cursor-pointer"
                onClick={() => navigate(-1)}
              />
              <h1 className="text-2xl font-bold">Booking Details</h1>
            </div>

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
                  <Loader className="animate-spin w-4 h-4" />
                ) : (
                  <FaDownload size={18} />
                )}
                Download
              </button>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div
          className="px-6 lg:px-10 pb-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
          id="pdf-content"
        >
          {/* ============ LEFT COLUMN: Trip Info ============ */}
          <div className=" space-y-8">
            {/* 1. Confirmation Details */}
            <div>
              <p className="text-[16px] font-medium text-[#181818] mb-[15px]">
                Confirmation Details
              </p>
              <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3] space-y-2 pb-3">
                <div className="flex justify-between">
                  <p className="text-[#4E4F52] text-[14px] font-normal">
                    Payment Status
                  </p>
                  <p
                    className={`text-[14px] font-normal ${getStatusColor(
                      booking?.status
                    )}`}
                  >
                    {booking?.status}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#4E4F52] text-[14px] font-normal">
                    Booking ID
                  </p>
                  <p className="text-[14px] font-normal">
                    {booking?.reference}
                  </p>
                </div>
              </div>
              <Divider className="lg:hidden my-4" />
            </div>

            {/* 2. Trip Details */}
            <div>
              <p className="text-[14px] font-inter font-medium text-[#181818] mb-[15px]">
                Trip Details
              </p>
              <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3] space-y-3 pb-3">
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Pick Up location
                  </p>
                  <p className="text-[#181818] text-[14px] font-inter text-right">
                    {transfer?.pickupInformation.from.description}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Pick Up Date
                  </p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {transfer?.pickupInformation.date}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Pick Up Time
                  </p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {transfer?.pickupInformation.time || "Not Available"}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Drop Off Location
                  </p>
                  <p className="text-[#181818] text-[14px] font-inter text-right">
                    {transfer?.pickupInformation.to.description}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Estimated Duration
                  </p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {transfer?.content.transferDetailInfo[0].value}{" "}
                    {transfer?.content.transferDetailInfo[0].description ||
                      "Not Available"}
                  </p>
                </div>
              </div>
              <Divider className="lg:hidden my-4" />
            </div>

            {/* 3. Taxi Details */}
            <div>
              <p className="text-[14px] font-inter font-medium text-[#181818] mb-[15px]">
                Taxi Details
              </p>
              <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3] space-y-3 pb-3">
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Type
                  </p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {transfer?.category.name} Car
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Seats
                  </p>
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    {transfer?.content.transferDetailInfo[2]?.value} Seats
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Luggages
                  </p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {transfer?.content.transferDetailInfo[3].value}{" "}
                    {transfer?.content.transferDetailInfo[3].description ||
                      "Not Available"}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Provider
                  </p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {booking?.supplier.name || "Not Available"}
                  </p>
                </div>
              </div>
              <Divider className="lg:hidden my-4" />
            </div>

            {/* 4. Passenger Details */}
            <div>
              <p className="text-[14px] font-medium text-[#181818] mb-[15px]">
                Passenger Details
              </p>
              <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3] space-y-2 pb-3">
                <div className="flex justify-between">
                  <p className="text-[#4E4F52] text-[14px]">Name</p>
                  <p className="text-[#181818] text-[14px]">
                    {booking?.holder.name} {booking?.holder.surname}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#4E4F52] text-[14px]">Email Address</p>
                  <p className="text-[#181818] text-[14px]">
                    {booking?.holder.email}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#4E4F52] text-[14px]">Phone Number</p>
                  <p className="text-[#181818] text-[14px]">
                    {booking?.holder.phone}
                  </p>
                </div>
              </div>
              <Divider className="lg:hidden my-4" />
            </div>
          </div>

          {/* ============ RIGHT COLUMN: Price, Contacts, Actions ============ */}
          <div className="lg:col-span-1 space-y-8">
            {/* Refunds and Cancellations */}
            {cancellationPolicy?.amount && (
              <div>
                <h3 className="text-[14px] font-inter font-medium text-[#181818] mb-[15px]">
                  Refunds and Cancellations
                </h3>
                <div className="lg:border-[1px] lg:border-[#ACAEB3] lg:rounded-lg lg:p-3 pb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Policy</span>
                    <span className="text-sm font-medium text-gray-900 text-right">
                      {cancellationPolicy?.amount}
                    </span>
                  </div>
                </div>
                <Divider className="lg:hidden my-4" />
              </div>
            )}

            {/* Price Summary */}
            <div>
              <p className="text-[14px] font-inter font-medium text-[#181818] mb-[15px]">
                Price Summary
              </p>
              <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3] pb-3">
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Total
                  </p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    €{booking?.totalAmount}
                  </p>
                </div>
              </div>
              <Divider className="lg:hidden my-4" />
            </div>

            {/* Contacts */}
            <div>
              <p className="text-[14px] font-medium text-[#181818] mb-[15px]">
                Contacts
              </p>
              <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3] pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <LocalPhoneOutlinedIcon sx={{ fontSize: "14px" }} />
                    <p className="text-[#4E4F52] text-[14px]">
                      Customer Support
                    </p>
                  </div>
                  <p className="text-[#181818] text-[14px]">
                    +234 808 412 2474
                  </p>
                </div>
              </div>
              <Divider className="lg:hidden my-4" />
            </div>

            {/* Actions / Cancel Button */}
            <div>
              {/* Mobile Only: Extra Action Links */}
              <div className="lg:hidden mb-4 space-y-2">
                <p className="text-[14px] font-medium text-[#181818] mb-2">
                  Actions
                </p>
                <div
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 text-[#4E4F52] text-[14px] cursor-pointer"
                >
                  <ShareOutlinedIcon fontSize="small" />
                  <span>Share this booking</span>
                </div>
                <div
                  className="flex items-center gap-2 text-[#181818] text-[14px] cursor-pointer"
                  onClick={() => handleDownload(booking)}
                >
                  {downloadLoading ? (
                    <Loader className="animate-spin w-4 h-4" />
                  ) : (
                    <FileDownloadOutlinedIcon fontSize="small" />
                  )}
                  <span>Download as PDF</span>
                </div>
              </div>

              {/* Cancel Button (Visible if Pending) */}
              {booking?.status?.toLowerCase() !== "cancelled" && (
                <button
                  onClick={() => setOpenConfirm(true)}
                  className="w-full border-[#D72638] border text-[#D72638] py-3 rounded-lg font-medium hover:bg-red-50 transition"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default BookingTransfersDetails;
