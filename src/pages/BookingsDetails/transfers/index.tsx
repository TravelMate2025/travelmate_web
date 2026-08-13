import { useCallback, useEffect, useState } from "react";
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
import WriteAReview from "./WriteAReview";

// API
import {
  CancelTransferBookings,
  refreshBookingRefund,
  searchTransferBookingByReference,
  verifyTransfersBooking,
  getTransferReviews,
} from "../../../features/stays/api";
import { CatalogReview } from "../../../features/stays/types";

import toast from "react-hot-toast";
import { TransfersDetailsResponse } from "./type";
import { useLocation, useNavigate } from "react-router-dom";
import NotFound from "../NotFound";
import {
  getBookingLifecycleLabel,
  getBookingLifecycleStatus,
  isBookingCancelable,
} from "../../../features/shared/bookingStatus";
import { RefundPanel } from "../../../features/shared/refundTracking";

const text = (value: unknown, fallback = "Not Available") => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
};

const formatDate = (value?: string | null) => {
  if (!value) return "Not Available";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toDateString();
};

const formatAmount = (value: unknown, currency = "") => {
  const raw = typeof value === "number" ? String(value) : text(value, "");
  const cleaned = raw.replace(/[^0-9.-]/g, "");
  const parsed = Number(cleaned);
  if (!Number.isFinite(parsed)) return `${currency}${raw || "Not Available"}`;
  return `${currency}${parsed.toLocaleString()}`;
};

type BackendTransferBooking = TransfersDetailsResponse & {
  booking_reference?: string;
  booking_status?: string;
  listing_name?: string;
  pickup_location?: string;
  pickup_location_label?: string;
  dropoff_location?: string;
  dropoff_location_label?: string;
  transfer_type?: string;
  ride_type?: string;
  vehicle_count?: number | null;
  available_seats?: number | null;
  vehicle_class?: string;
  passenger_capacity?: number | null;
  luggage_capacity?: number | null;
  provider_name?: string;
  estimated_duration_minutes?: number | null;
  pickup_date?: string | null;
  pickup_time?: string | null;
  total_amount?: number | string | null;
  cancellation_policy?: Array<Record<string, unknown>>;
  first_name?: string;
  last_name?: string;
  email?: string;
  contact_phone?: string;
  phone?: string;
  images?: unknown[];
};

const normalizeBackendTransferShape = (
  value: TransfersDetailsResponse,
): TransfersDetailsResponse => {
  if (Array.isArray(value.transfers) && value.transfers.length > 0) {
    return value;
  }

  const backend = value as BackendTransferBooking;
  const hasStructuredTransferData = Boolean(
    backend.pickup_location ||
      backend.pickup_date ||
      backend.dropoff_location ||
      backend.vehicle_class ||
      backend.provider_name,
  );
  if (!hasStructuredTransferData) return value;

  const pickupLabel = backend.pickup_location_label || backend.pickup_location || "";
  const dropoffLabel =
    backend.dropoff_location_label || backend.dropoff_location || "";
  const duration = backend.estimated_duration_minutes;
  const cancellationPolicies = (backend.cancellation_policy ?? []).map((policy) => ({
    from: String(policy.from ?? ""),
    amount: Number(policy.amount ?? 0),
    currencyId: String(policy.currency ?? backend.currency ?? ""),
    isForceMajeure: Boolean(policy.isForceMajeure ?? policy.is_force_majeure),
  }));

  return {
    ...value,
    holder: value.holder ?? {
      name: backend.first_name ?? "",
      surname: backend.last_name ?? "",
      email: backend.email ?? "",
      phone: backend.contact_phone ?? backend.phone ?? "",
    },
    transfers: [
      {
        id: backend.id ?? "",
        price: {
          netAmount: Number(backend.total_amount ?? value.totalAmount ?? 0),
          totalAmount: Number(backend.total_amount ?? value.totalAmount ?? 0),
          currencyId: backend.currency ?? "",
        },
        status: value.status,
        rateKey: backend.id ?? value.reference ?? "",
        vehicle: {
          code: backend.vehicle_class ?? "",
          name: backend.vehicle_class || backend.transfer_type || "Transfer",
        },
        category: {
          code: backend.ride_type ?? backend.transfer_type ?? "",
          name: backend.ride_type ?? backend.transfer_type ?? "Transfer",
        },
        factsheetId: 0,
        transferType: backend.ride_type ?? backend.transfer_type ?? "",
        arrivalShipName: null,
        arrivalTrainInfo: null,
        departureShipName: null,
        departureTrainInfo: null,
        arrivalFlightNumber: null,
        departureFlightNumber: null,
        sourceMarketEmergencyNumber: "",
        pickupInformation: {
          from: { code: "", type: "", typeEnum: "", description: pickupLabel },
          to: { code: "", type: "", typeEnum: "", description: dropoffLabel },
          date: backend.pickup_date ?? "",
          time: backend.pickup_time ?? "",
          pickup: {
            zip: null,
            town: null,
            image: null,
            number: null,
            address: pickupLabel,
            altitude: null,
            latitude: 0,
            longitude: 0,
            pickupId: null,
            stopName: null,
            checkPickup: {
              url: null,
              mustCheckPickupTime: false,
              hoursBeforeConsulting: null,
            },
            description: pickupLabel,
          },
        },
        content: {
          images: Array.isArray(backend.images) ? backend.images : [],
          vehicle: {
            code: backend.vehicle_class ?? "",
            name: backend.vehicle_class || backend.ride_type || backend.transfer_type || "Transfer",
          },
          category: {
            code: backend.transfer_type ?? "",
            name: backend.ride_type || backend.transfer_type || "Transfer",
          },
          transferRemarks: [],
          transferDetailInfo: [
            ...(duration != null
              ? [{ id: "duration", name: "Duration", type: "", value: String(duration), description: "minutes" }]
              : []),
            { id: "stops", name: "Stops", type: "", value: "", description: "" },
            ...(backend.passenger_capacity != null
              ? [{ id: "capacity", name: "Capacity", type: "", value: String(backend.passenger_capacity), description: "Seats" }]
              : [{ id: "capacity", name: "Capacity", type: "", value: "", description: "Seats" }]),
            ...(backend.luggage_capacity != null
              ? [{ id: "luggage", name: "Luggage", type: "", value: String(backend.luggage_capacity), description: "bags" }]
              : [{ id: "luggage", name: "Luggage", type: "", value: "", description: "bags" }]),
          ],
          customerTransferTimeInfo: [],
          supplierTransferTimeInfo: [],
        },
        cancellationPolicies,
      } as unknown as TransfersDetailsResponse["transfers"][number],
    ],
    totalAmount: Number(backend.total_amount ?? value.totalAmount ?? 0),
    supplier: value.supplier ?? { name: backend.provider_name ?? "", vatNumber: "" },
  };
};

const normalizeTransferBooking = (value: unknown): TransfersDetailsResponse | undefined => {
  const payload = value as
    | { bookings?: TransfersDetailsResponse[]; booking?: TransfersDetailsResponse }
    | TransfersDetailsResponse
    | null
    | undefined;

  const booking =
    payload && typeof payload === "object" && "bookings" in payload && Array.isArray(payload.bookings)
      ? payload.bookings[0]
      : payload && typeof payload === "object" && "booking" in payload
        ? payload.booking
        : (payload as TransfersDetailsResponse | null | undefined);

  if (!booking || typeof booking !== "object") return undefined;

  const normalized = booking as TransfersDetailsResponse & {
    booking_reference?: string;
    booking_status?: string;
    totalNetAmount?: number;
  };

  const hasUsefulData =
    Boolean(normalized.reference) ||
    Boolean(normalized.booking_reference) ||
    Boolean(normalized.status) ||
    Boolean(normalized.booking_status) ||
    Boolean(normalized.holder) ||
    Boolean(normalized.transfers?.length) ||
    Boolean(normalized.totalAmount) ||
    Boolean(normalized.totalNetAmount);

  if (!hasUsefulData) return undefined;

  return normalizeBackendTransferShape({
    ...normalized,
    reference: normalized.reference || normalized.booking_reference || "",
    status: normalized.status || normalized.booking_status || "CONFIRMED",
    totalAmount: normalized.totalAmount ?? normalized.totalNetAmount ?? 0,
    transfers: Array.isArray(normalized.transfers) ? normalized.transfers : [],
  });
};

const BookingTransfersDetails = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams?.get("session_id");
  const bookingReference = searchParams?.get("booking_reference") ?? searchParams?.get("reference");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<TransfersDetailsResponse>();
  const [showShareModal, setShowShareModal] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [cancelLoad, setCancelLoad] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [cancelSubmitted, setCancelSubmitted] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [reviews, setReviews] = useState<CatalogReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  // Mirrors stays' `booking_status` query-param hint (BookingsDetails/stays/
  // index.tsx) — the list page can pass this explicitly so the review/
  // cancel gating doesn't depend solely on however the detail API happens
  // to report status.
  const bookingStatusHint = searchParams?.get("booking_status")?.toLowerCase();

  const transfer = booking?.transfers?.[0];
  const cancellationPolicy = transfer?.cancellationPolicies?.[0];
  const pickupDate = transfer?.pickupInformation?.date;
  const bookingStatus = booking?.status ?? booking?.booking_status;
  const bookingState =
    bookingStatusHint === "completed"
      ? "completed"
      : getBookingLifecycleStatus(bookingStatus, pickupDate);
  const bookingStateLabel =
    bookingStatusHint === "completed"
      ? "Completed"
      : getBookingLifecycleLabel(bookingStatus, pickupDate);
  const isReviewableBooking = bookingState === "completed";

  const fetchTransferReviews = useCallback(async () => {
    const transferId = transfer?.id;
    if (transferId == null || String(transferId).trim() === "") {
      setReviews([]);
      return;
    }

    setReviewsLoading(true);
    setReviewsError(null);
    try {
      const result = await getTransferReviews(transferId);
      setReviews(result);
    } catch (error: unknown) {
      setReviews([]);
      setReviewsError(error instanceof Error ? error.message : "Unable to load reviews");
    } finally {
      setReviewsLoading(false);
    }
  }, [transfer?.id]);

  useEffect(() => {
    void fetchTransferReviews();
  }, [fetchTransferReviews]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!sessionId && !bookingReference) return;
      try {
        setLoading(true);
        const sessionResult = sessionId
          ? await verifyTransfersBooking(sessionId, { suppressToast: true })
          : undefined;
        const sessionBooking = normalizeTransferBooking(sessionResult?.data);
        if (sessionBooking) {
          setBooking(sessionBooking);
          return;
        }

        const referenceResult = bookingReference
          ? await searchTransferBookingByReference(bookingReference, { suppressToast: true })
          : undefined;
        const referenceBooking = normalizeTransferBooking(referenceResult?.data);
        if (referenceBooking) {
          setBooking(referenceBooking);
          return;
        }

        throw new Error("Booking not found");
      } catch (error) {
        console.error("Error fetching details:", error);
        toast.error("Could not load booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [bookingReference, sessionId]);

  const handleDownload = (bookingItem: TransfersDetailsResponse | undefined) => {
    if (!bookingItem) {
      toast.error("No booking data available to download");
      return;
    }
    try {
      setDownloadLoading(true);
      window.open(
        `/car-paid/download?data=${encodeURIComponent(
          JSON.stringify(bookingItem)
        )}`,
        "_blank"
      );
    } catch (_error) {
      toast.error("Failed to download, try again");
    } finally {
      setDownloadLoading(false);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "succeeded":
      case "completed":
        return "text-[#2D9C5E]";
      case "pending":
        return "text-[#F2994A]";
      case "cancelled":
      case "failed":
      case "payment_failed":
        return "text-[#EB5757]";
      default:
        return "text-[#4E4F52]";
    }
  };

  const handleCancelBookings = async (bookingId: string | undefined, reason?: string) => {
    try {
      const res = reason?.trim()
        ? await CancelTransferBookings(bookingId, setCancelLoad, reason)
        : await CancelTransferBookings(bookingId, setCancelLoad);
      toast.success("Booking cancelled successfully");

      setBooking((prev) => {
        if (!prev) return undefined;
        return {
          ...prev,
          status: "CANCELLED",
          // Merge the refund state the cancel response already returned
          // instead of discarding it — otherwise the panel below briefly
          // shows the pre-cancellation ("no refund applies") state until a
          // full reload.
          refund: res?.refund ?? prev.refund,
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

  const displayReference = booking?.reference || booking?.booking_reference;
  const displayCurrency = booking?.currency ? `${booking.currency} ` : "";
  const displayTotalAmount = booking?.totalAmount ?? booking?.totalNetAmount ?? 0;
  const hasCancelableState = isBookingCancelable(bookingStatus, pickupDate);

  if (loading) return <SkeletonDetails />;
  if (!booking && !loading) return <NotFound />;

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="py-20 w-full">
        {showShareModal && (
          <ShareModal
            onClose={() => setShowShareModal(false)}
            shareLink={`/bookings/details/${displayReference}`}
          />
        )}
        {openConfirm && (
          <ConfirmCancel
            bookings={booking}
            closeModal={() => setOpenConfirm(false)}
            // POST /transfers/booking/{id}/cancel/ requires the
            // TransferBooking row's own pk, not booking_reference — ignore
            // ConfirmCancel's own `data` arg (it only knows the reference)
            // and use the real id captured here instead.
            handleCancel={(_data, _load, reason) =>
              handleCancelBookings(booking?.id ?? displayReference, reason)
            }
            loadCancel={cancelLoad}
          />
        )}
        {openReviewModal && (
          <WriteAReview
            bookings={booking}
            closeModal={() => setOpenReviewModal(false)}
            onSubmitted={fetchTransferReviews}
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
          {booking?.status?.toLowerCase() === "cancelled" && (
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
          {booking?.status?.toLowerCase() === "cancelled" && (
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
              <div>
                <h1 className="text-2xl font-bold">Booking Details</h1>
                {booking?.listing_name && (
                  <p className="text-[#4E4F52] text-sm mt-1">{booking.listing_name}</p>
                )}
              </div>
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
                    Booking State
                  </p>
                  <p
                    className={`text-[14px] font-normal ${getStatusColor(
                      bookingState,
                    )}`}
                  >
                    {bookingStateLabel}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#4E4F52] text-[14px] font-normal">
                    Booking ID
                  </p>
                  <p className="text-[14px] font-normal">
                    {displayReference}
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
                    {text(transfer?.pickupInformation?.from?.description)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Pick Up Date
                  </p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {formatDate(transfer?.pickupInformation?.date)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Pick Up Time
                  </p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {text(transfer?.pickupInformation?.time)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Drop Off Location
                  </p>
                  <p className="text-[#181818] text-[14px] font-inter text-right">
                    {text(transfer?.pickupInformation?.to?.description)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Estimated Duration
                  </p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {text(transfer?.content?.transferDetailInfo?.[0]?.value)}{" "}
                    {text(transfer?.content?.transferDetailInfo?.[0]?.description)}
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
                    {text(transfer?.vehicle?.name || transfer?.category?.name)} Car
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Seats
                  </p>
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    {text(transfer?.content?.transferDetailInfo?.[2]?.value)} Seats
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Luggages
                  </p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {text(transfer?.content?.transferDetailInfo?.[3]?.value)}{" "}
                    {text(transfer?.content?.transferDetailInfo?.[3]?.description)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Provider
                  </p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {text(booking?.supplier?.name)}
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
                    {text(booking?.holder?.name, "")} {text(booking?.holder?.surname, "")}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#4E4F52] text-[14px]">Email Address</p>
                  <p className="text-[#181818] text-[14px]">
                    {text(booking?.holder?.email)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#4E4F52] text-[14px]">Phone Number</p>
                  <p className="text-[#181818] text-[14px]">
                    {text(booking?.holder?.phone)}
                  </p>
                </div>
              </div>
              <Divider className="lg:hidden my-4" />
            </div>
          </div>

          {/* ============ RIGHT COLUMN: Price, Contacts, Actions ============ */}
          <div className="lg:col-span-1 space-y-8">
            {/* Refunds and Cancellations */}
            {cancellationPolicy?.amount != null && (
              <div>
                <h3 className="text-[14px] font-inter font-medium text-[#181818] mb-[15px]">
                  Refunds and Cancellations
                </h3>
                <div className="lg:border-[1px] lg:border-[#ACAEB3] lg:rounded-lg lg:p-3 pb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Policy</span>
                    <span className="text-sm font-medium text-gray-900 text-right">
                      {formatAmount(cancellationPolicy?.amount, displayCurrency)}
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
                    {formatAmount(displayTotalAmount, displayCurrency)}
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
            <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
              <h2 className="text-lg font-semibold text-[#181818]">Reviews</h2>
              {reviewsLoading && <p className="mt-2 text-sm text-gray-500">Loading reviews…</p>}
              {reviewsError && <p className="mt-2 text-sm text-red-600">{reviewsError}</p>}
              {!reviewsLoading && !reviewsError && reviews.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">No reviews available.</p>
              )}
              {!reviewsLoading && !reviewsError && reviews.length > 0 && (
                <div className="mt-3 space-y-3">
                  {reviews.slice(0, 6).map((review, index) => (
                    <article key={`${review.submittedAt ?? "review"}-${index}`} className="border-b border-gray-100 pb-3 last:border-b-0">
                      <p className="text-sm font-medium text-gray-800">{review.rating.toFixed(1)} / 5</p>
                      {review.comment && <p className="mt-1 text-sm text-gray-600">{review.comment}</p>}
                    </article>
                  ))}
                </div>
              )}
            </section>
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

              {/* Cancel Button (Visible only while confirmed/ongoing) */}
              {booking && hasCancelableState && (
                <button
                  onClick={() => setOpenConfirm(true)}
                  className="w-full border-[#D72638] border text-[#D72638] py-3 rounded-lg font-medium hover:bg-red-50 transition"
                >
                  Cancel Booking
                </button>
              )}

              {/* Write a Review Button (Visible only once completed) */}
              {booking && isReviewableBooking && (
                <button
                  onClick={() => setOpenReviewModal(true)}
                  className="w-full border-[#023E8A] border text-[#023E8A] py-3 rounded-lg font-medium hover:bg-blue-50 transition mt-4"
                >
                  Write a Review
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
