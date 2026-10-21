import React, { useEffect, useState } from "react";
import Navbar from "../../../pages/homePage/Navbar";
import { FaShareAlt, FaDownload } from "react-icons/fa";
import ConfirmationDetails from "../../../features/stays/components/confirmation/ConfirmationDetails";
import GuestDetails from "../../../features/stays/components/confirmation/GuestDetails";
import PriceSummary from "../../../features/stays/components/confirmation/PriceSummary";
import HotelDetails from "../../../features/stays/components/confirmation/HotelDetails";
import RoomDetails from "../../../features/stays/components/confirmation/RoomDetails";
import ContactDetails from "../../../features/stays/components/confirmation/ContactDetails";
import CancellationDetails from "../../../features/stays/components/confirmation/CancellationDetails";
import Footer from "../../../components/2Footer";
import ShareModal from "../../../features/stays/components/modals/ShareModal";
import SkeletonConfirm from "../../../features/car_rentals/carPaidFor/Skeleton";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CancelStaysBookings,
  refreshBookingRefund,
  searchHotelBookingByReference,
  verifyHotelBooking,
} from "../../../features/stays/api";
import { BookingDetailsVerifyData } from "../../../features/stays/types";
import { ChevronLeft, Loader } from "lucide-react";
import { TbInfoTriangle } from "react-icons/tb";
import { RefundPanel } from "../../../features/shared/refundTracking";
import ConfirmCancel from "./ConfirmCancel";
import WriteAReview from "./WriteAReview";
import {
  getBookingLifecycleLabel,
  getBookingLifecycleStatus,
  isBookingCancelable,
} from "../../../features/shared/bookingStatus";

type CancelledBooking = BookingDetailsVerifyData & {
  cancelled_at?: string;
};

type SnapshotRecord = Record<string, unknown>;

const text = (value: unknown, fallback = "") => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
};

const toBookingDate = (value: unknown) => {
  const raw = text(value, "");
  if (!raw) return "";
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? raw : parsed.toISOString().slice(0, 10);
};

const normalizeRoomSelections = (snapshot: SnapshotRecord): unknown[] => {
  const roomSelections = snapshot.roomSelections;
  if (!Array.isArray(roomSelections)) {
    const roomName = text(snapshot.roomName);
    return roomName
      ? [{ name: roomName, room_name: roomName, description: roomName }]
      : [];
  }

  return roomSelections
    .map((entry) => {
      if (!entry || typeof entry !== "object") return entry;
      const room = entry as SnapshotRecord;
      const name = text(
        room.roomName ?? room.name ?? room.room_name ?? room.description,
      );
      return {
        ...room,
        name,
        room_name: name,
        description: text(room.description, name),
      };
    })
    .filter(Boolean);
};

const firstNonEmpty = (...values: unknown[]) => values.find((value) => {
  if (typeof value === "number") return Number.isFinite(value);
  return typeof value === "string" && value.trim().length > 0;
});

const normalizeGuestDetails = (booking: BookingDetailsVerifyData, snapshot: SnapshotRecord) => {
  const snapshotTravelers = Array.isArray(snapshot.travelers) ? snapshot.travelers : [];
  const primaryTraveler = (snapshotTravelers[0] as SnapshotRecord | undefined) ?? {};
  const existingPrimaryGuest = booking.guest_details?.primary_guest ?? booking.guestDetails?.primary_guest;
  const customerDetails = (booking.customer_details ?? {}) as SnapshotRecord;
  const primaryGuest = {
    name: existingPrimaryGuest?.name ?? text(firstNonEmpty(primaryTraveler.firstName, primaryTraveler.first_name, customerDetails.name)),
    surname:
      existingPrimaryGuest?.surname ?? text(firstNonEmpty(primaryTraveler.lastName, primaryTraveler.last_name, customerDetails.surname)),
    email: existingPrimaryGuest?.email ?? text(firstNonEmpty(primaryTraveler.email, customerDetails.email, booking.user?.email)),
    phone: existingPrimaryGuest?.phone ?? text(firstNonEmpty(snapshot.phoneNumber, customerDetails.phone)),
    address: existingPrimaryGuest?.address ?? text(snapshot.address),
    city: existingPrimaryGuest?.city ?? text(snapshot.city),
    postal_code:
      (existingPrimaryGuest as Record<string, unknown> | undefined)?.postal_code?.toString() ??
      text(snapshot.postalCode),
    country: existingPrimaryGuest?.country ?? text(snapshot.country),
  };

  return {
    primary_guest: primaryGuest,
    additional_adults: booking.guest_details?.additional_adults ?? [],
    children: booking.guest_details?.children ?? [],
    special_requests:
      booking.guest_details?.special_requests ??
      text(snapshot.specialRequests),
  };
};

const normalizeHotelLocation = (booking: BookingDetailsVerifyData, snapshot: SnapshotRecord) => {
  const existing = booking.hotel_location ?? booking.hotelLocation;
  const address = text(existing?.address ?? booking.hotel_address ?? snapshot.address);
  const city = text(booking.destination_city ?? snapshot.city);
  const country = text(booking.destination_country ?? snapshot.country);

  if (!address && !city && !country && !existing) {
    return undefined;
  }

  return {
    address: address || existing?.address || "",
    latitude: existing?.latitude ?? 0,
    longitude: existing?.longitude ?? 0,
    destination: {
      code: text(existing?.destination?.code ?? snapshot.listingId ?? snapshot.hotelCode),
      name: text(existing?.destination?.name ?? snapshot.hotelName ?? snapshot.listingId),
      city_name: city || text(existing?.destination?.city_name),
      country_name: country || text(existing?.destination?.country_name),
    },
  };
};

const normalizeBooking = (
  booking?: BookingDetailsVerifyData,
): CancelledBooking | undefined => {
  if (!booking) return undefined;

  const snapshot = (booking.bookingSnapshot ?? booking.booking_snapshot ?? {}) as SnapshotRecord;
  const hotelName = text(
    booking.hotelName ??
      booking.hotel_name ??
      snapshot.hotelName ??
      snapshot.hotel_name ??
      snapshot.listingName ??
      snapshot.listing_name,
  );
  const hotelCode = text(
    booking.hotelCode ??
      booking.hotel_code ??
      snapshot.hotelCode ??
      snapshot.hotel_code ??
      snapshot.listingId ??
      snapshot.listing_id,
  );
  const checkIn = toBookingDate(
    booking.checkIn ?? booking.check_in ?? snapshot.checkIn ?? snapshot.check_in,
  );
  const checkOut = toBookingDate(
    booking.checkOut ?? booking.check_out ?? snapshot.checkOut ?? snapshot.check_out,
  );
  const totalPrice = text(
    booking.totalPrice ??
      booking.total_price ??
      booking.total_amount ??
      snapshot.totalPrice ??
      snapshot.total_price ??
      snapshot.totalAmount ??
      snapshot.total_amount,
  );
  const currency = text(booking.currency ?? snapshot.currency);
  const createdAt = text(
    booking.created_at ??
      snapshot.created_at ??
      snapshot.createdAt ??
      snapshot.bookedOn ??
      snapshot.booked_on ??
      snapshot.paymentDate ??
      snapshot.payment_date,
  );
  const reference = text(
    booking.reference ??
      booking.bookingReference ??
      booking.booking_reference ??
      snapshot.bookingReference ??
      snapshot.booking_reference,
  );
  // StayBookingAdminSerializer (used by searchHotelBookingByReference) names
  // this field `booking_status`, not `status` — without this, every stay
  // viewed via reference navigation fell through getBookingLifecycleStatus's
  // "unknown -> confirmed" default, regardless of its real status.
  const bookingStatus = text(booking.status ?? booking.booking_status ?? snapshot.status ?? snapshot.booking_status);
  const roomDetails = Array.isArray(booking.rooms_details)
    ? booking.rooms_details
    : Array.isArray(booking.roomsDetails)
      ? booking.roomsDetails
      : Array.isArray(booking.rooms)
        ? booking.rooms
        : normalizeRoomSelections(snapshot);
  const guestDetails = normalizeGuestDetails(booking, snapshot);
  const hotelLocation = normalizeHotelLocation(booking, snapshot);

  return {
    ...booking,
    reference,
    booking_reference: reference,
    bookingReference: reference,
    hotel_name: hotelName,
    hotelName,
    hotel_code: hotelCode || booking.hotel_code,
    hotelCode: hotelCode || booking.hotelCode,
    check_in: checkIn || booking.check_in,
    checkIn: checkIn || booking.checkIn,
    check_out: checkOut || booking.check_out,
    checkOut: checkOut || booking.checkOut,
    total_price: totalPrice || booking.total_price,
    totalPrice: totalPrice || booking.totalPrice,
    status: bookingStatus || booking.status,
    currency: currency || booking.currency,
    created_at: createdAt || booking.created_at,
    rooms_details: (roomDetails.length ? roomDetails : booking.rooms_details) ?? [],
    roomsDetails: (roomDetails.length ? roomDetails : booking.roomsDetails) ?? [],
    guest_details: booking.guest_details ?? booking.guestDetails ?? guestDetails,
    guestDetails: guestDetails,
    hotel_location: hotelLocation ?? booking.hotel_location,
    hotelLocation: hotelLocation ?? booking.hotelLocation,
    bookingSnapshot: snapshot,
    booking_snapshot: snapshot,
  };
};

const BookingStaysDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<CancelledBooking>();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams?.get("session_id");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [cancelLoad, setCancelLoad] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [cancelSubmitted, setCancelSubmitted] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const bookingStatusHint = searchParams?.get("booking_status")?.toLowerCase();
  const bookingState =
    bookingStatusHint === "completed"
      ? "completed"
      : getBookingLifecycleStatus(booking?.status, booking?.check_out);
  const bookingStateLabel =
    bookingStatusHint === "completed"
      ? "Completed"
      : getBookingLifecycleLabel(booking?.status, booking?.check_out);
  const bookingReference = searchParams?.get("booking_reference") ?? searchParams?.get("reference");
  const isReviewableBooking = bookingState === "completed";
  const canCancelBooking =
    bookingState === "confirmed" &&
    !cancelSubmitted &&
    !!booking &&
    isBookingCancelable(booking.status, booking.check_out);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        let res = bookingReference
          ? await searchHotelBookingByReference(bookingReference)
          : await verifyHotelBooking(sessionId);

        if ((!res?.success || !res?.data?.reference) && sessionId && bookingReference) {
          res = await verifyHotelBooking(sessionId);
        }

        setBooking(normalizeBooking(res?.data));
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };

    if (bookingReference || sessionId) fetchBooking();
  }, [bookingReference, sessionId]);

  if (loading) return <SkeletonConfirm />;

  const handleDownload = (cars: BookingDetailsVerifyData | undefined) => {
    if (!cars) {
      toast.error("No booking data available to download");
      return;
    }
    try {
      setDownloadLoading(true);
      window.open(
        `/stays-paid/download?data=${encodeURIComponent(JSON.stringify(cars))}`,
        "_blank",
      );
    } catch (_error) {
      toast.error("Failed to download, try again ");
    } finally {
      setDownloadLoading(false);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "completed":
      case "succeeded":
        return "text-[#2D9C5E]";
      case "pending":
        return "text-[#F2994A]";
      case "failed":
      case "payment_failed":
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
      const res = await CancelStaysBookings(
        bookingId,
        setCancelLoad,
        cancellation_reason,
      );
      toast.success("Booking cancelled successfully");

      setBooking((prev) => {
        if (!prev) return undefined;
        return {
          ...prev,
          status: "CANCELLED",
          cancelled_at: res.cancelled_at,
          // Merge the refund state the cancel response already returned
          // instead of discarding it — otherwise the panel below briefly
          // shows the pre-cancellation ("no refund applies") state until a
          // full reload.
          refund: res.refund ?? prev.refund,
        };
      });

      setCancelSubmitted(true);
      setOpenConfirm(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to cancel booking";
      console.error("Error cancelling booking:", error);
      toast.error(message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="mx-auto mt-26 lg:px-8 px-6 pb-20">
        {showShareModal && (
          <ShareModal
            onClose={() => setShowShareModal(false)}
            shareLink={`${window.location.origin}/bookings/details/${booking?.reference}`}
          />
        )}
        {openConfirm && (
          <ConfirmCancel
            bookings={booking}
            closeModal={() => setOpenConfirm(false)}
            handleCancel={(bookingId, _load, reason) =>
              handleCancelBookings(bookingId ?? booking?.reference, reason)
            }
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
            {booking && isReviewableBooking && (
              <button
                className="flex items-center gap-2 px-4 py-2 border border-[#023E8A] rounded-lg text-[#023E8A] hover:bg-blue-50 transition"
                onClick={() => setOpenReviewModal(true)}
              >
                Write a Review
              </button>
            )}
          </div>
          {showShareModal && (
            <ShareModal
              onClose={() => setShowShareModal(false)}
              shareLink={`${window.location.origin}/bookings/details/${booking?.reference}`}
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
        {!cancelSubmitted && booking && bookingState !== "cancelled" && (
          <div className="flex justify-normal gap-2 items-center border border-[#ACAEB3] p-3 rounded-lg bg-white my-6">
            <div className="flex flex-col text-sm">
              <p className="text-black font-medium">
                Booking {bookingStateLabel}
              </p>
              <p className="text-gray-500">
                This booking follows the confirmed, completed, cancelled, or payment failed lifecycle.
              </p>
            </div>
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
                {new Date(booking?.cancelled_at ?? "").toLocaleDateString()} at{" "}
                {new Date(booking?.cancelled_at ?? "").toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}
        {booking?.status?.toLowerCase() === "cancelled" && (
          <div className="my-6">
            <RefundPanel
              refund={booking.refund}
              onRefresh={booking.id
                ? async () => {
                    const refund = await refreshBookingRefund(String(booking.id));
                    setBooking((previous) => previous ? { ...previous, refund } : previous);
                    return refund;
                  }
                : undefined}
            />
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
            <CancellationDetails booking={booking} />
            <HotelDetails booking={booking} />
            <ContactDetails />
            <div className="flex flex-col w-full gap-y-5">
              {/* CANCEL BUTTON */}
              {canCancelBooking && (
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

            {booking && isReviewableBooking && (
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
