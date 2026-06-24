import { Divider } from "@mui/material";
import Navbar from "../../../pages/homePage/Navbar";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CheckIcon from "@mui/icons-material/Check";
import { Link, useLocation } from "react-router-dom";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import Footer from "../../../components/2Footer";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { useDispatch } from "react-redux";
import { resetForm } from "../carPaymentSlice";
import { useEffect, useMemo, useState } from "react";
import { transferService } from "../services/transferService";
import toast from "react-hot-toast";
import { useFormPersistence } from "../hooks/useFormPersistence";
import { BookingFormData } from "../types/booking";
import SkeletonConfirm from "./Skeleton";
import { Download, Loader, Share } from "lucide-react";
import ShareModal from "../../stays/components/modals/ShareModal";
import CarFailedPayment from "./CarFailedPayment";

interface TransferConfirmation {
  booking_reference?: string;
  reference?: string;
  booking_status?: string;
  status?: string;
  currency?: string;
  total_amount?: number | string;
  totalNetAmount?: number | string;
  passenger_capacity?: number | string;
  luggage_capacity?: number | string;
  holder?: { email?: string; name?: string; surname?: string; phone?: string };
  supplier?: { name?: string } | null;
  pickup_date?: string;
  pickup_time?: string;
  pickup_location_label?: string;
  dropoff_location_label?: string;
  transfer_type?: string;
  pickup_location?: string;
  dropoff_location?: string;
  transfers?: Array<{
    pickupInformation?: {
      from?: { description?: string };
      to?: { description?: string };
      date?: string;
      time?: string;
    };
    content?: {
      transferDetailInfo?: Array<{ value?: string | number; description?: string }>;
    };
    passenger_capacity?: number | string;
    luggage_capacity?: number | string;
    category?: { name?: string };
    supplier?: { name?: string } | null;
  }>;
}

type TransferSuccessCache = {
  bookingReference?: string;
  quoteLockId?: string;
  paymentIntentId?: string;
  departureInfo?: {
    pickupLocaDescription: string;
    pickupDate: string;
    pickupTime: string;
    dropoffLocaDescription: string;
    selectedRide: string;
    priceRange: string;
  };
  passFormData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  car?: {
    id?: string | number;
    name?: string;
    description?: string;
    rateKey?: string;
    price?: { totalAmountWithFee?: number | string; totalAmount?: number | string };
    vehicle?: { name?: string; code?: string };
    category?: { name?: string };
    content?: { transferDetailInfo?: Array<{ value?: string | number; description?: string }> };
    maxPaxCapacity?: number | string;
    passenger_capacity?: number | string;
    luggage_capacity?: number | string;
    supplier?: { name?: string } | string;
  };
  quotePricing?: {
    currency?: string;
    total?: number;
  };
  storedAt?: string;
};

const getCurrencySymbol = (currency?: string) => {
  switch ((currency ?? "").toUpperCase()) {
    case "NGN":
      return "₦";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    default:
      return currency ? `${currency} ` : "₦";
  }
};

const normalizeCachedBooking = (successCache: TransferSuccessCache): TransferConfirmation => ({
  booking_status: "CONFIRMED",
  status: "confirmed",
  holder: {
    email: successCache.passFormData?.email,
    name: successCache.passFormData?.firstName,
    surname: successCache.passFormData?.lastName,
    phone: successCache.passFormData?.phone,
  },
  supplier:
    typeof successCache.car?.supplier === "string"
      ? { name: successCache.car.supplier }
      : successCache.car?.supplier ?? null,
  transfers: [
    {
      pickupInformation: {
        from: { description: successCache.departureInfo?.pickupLocaDescription },
        to: { description: successCache.departureInfo?.dropoffLocaDescription },
        date: successCache.departureInfo?.pickupDate,
        time: successCache.departureInfo?.pickupTime,
      },
      content: {
        transferDetailInfo: [
          { value: successCache.departureInfo?.pickupDate, description: "Date" },
          { value: successCache.departureInfo?.pickupTime, description: "Time" },
          { value: successCache.car?.vehicle?.name ?? successCache.car?.name, description: "Vehicle" },
          { value: successCache.car?.category?.name, description: "Category" },
          {
            value: successCache.car?.passenger_capacity ?? successCache.car?.maxPaxCapacity,
            description: "Seats",
          },
          { value: successCache.car?.luggage_capacity, description: "Luggage" },
        ],
      },
      category: { name: successCache.car?.category?.name },
      supplier:
        typeof successCache.car?.supplier === "string"
          ? { name: successCache.car.supplier }
          : successCache.car?.supplier ?? null,
    },
  ],
  booking_reference: successCache.bookingReference,
  reference: successCache.bookingReference,
  currency: successCache.quotePricing?.currency,
  total_amount:
    successCache.quotePricing?.total ??
    successCache.car?.price?.totalAmountWithFee ??
    successCache.car?.price?.totalAmount,
  totalNetAmount:
    successCache.quotePricing?.total ??
    successCache.car?.price?.totalAmountWithFee ??
    successCache.car?.price?.totalAmount,
  passenger_capacity:
    successCache.car?.passenger_capacity ?? successCache.car?.maxPaxCapacity,
  luggage_capacity: successCache.car?.luggage_capacity,
});

const CarPaidForPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<TransferConfirmation | null>(null);
  const dispatch = useDispatch();
  const { clearSavedData } = useFormPersistence({} as BookingFormData);
  const searchParams = new URLSearchParams(location.search);
  const [showShareModal, setShowShareModal] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const paymentStatus = (searchParams.get("status") ?? "").toLowerCase();
  const isSuccess =
    paymentStatus === "successful" ||
    paymentStatus === "success" ||
    searchParams.has("success") ||
    location.pathname.includes("success");

  const successCache = useMemo<TransferSuccessCache | null>(() => {
    if (!isSuccess) return null;
    try {
      const cached = window.localStorage.getItem("transferPaymentSuccess");
      return cached ? (JSON.parse(cached) as TransferSuccessCache) : null;
    } catch {
      return null;
    }
  }, [isSuccess]);
  // paymentIntentId is the TravelMate-issued ID saved before the Flutterwave
  // redirect. Used for Path B confirm and for the by-session lookup.
  const paymentIntentId =
    successCache?.paymentIntentId ??
    searchParams.get("payment_intent_id") ??
    "";
  const sessionId =
    successCache?.bookingReference ??
    searchParams.get("booking_reference") ??
    searchParams.get("session_id") ??
    searchParams.get("tx_ref") ??
    searchParams.get("transaction_id") ??
    "";

  useEffect(() => {
    let cancelled = false;

    const delay = (milliseconds: number) =>
      new Promise((resolve) => setTimeout(resolve, milliseconds));

    const fetchBooking = async () => {
      try {
        setLoading(true);

        // Path B — call once before polling so the booking is marked confirmed
        // even if the Flutterwave webhook fires late. Idempotent — safe to call
        // if the webhook already fired.
        if (isSuccess && paymentIntentId) {
          await transferService.confirmPaymentIntent(paymentIntentId);
        }

        // Poll the verification endpoint until the booking details are available.
        const maxAttempts = 5;
        const retryDelayMs = 1500;
        const lookupId = paymentIntentId || sessionId;

        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
          if (cancelled) return;

          if (isSuccess && lookupId) {
            const res = await transferService.getBookingBySession(lookupId);
            const fetchedBooking = (res?.data as TransferConfirmation) || null;
            if (
              fetchedBooking?.reference ||
              fetchedBooking?.booking_reference ||
              fetchedBooking?.transfers?.length
            ) {
              setBooking(fetchedBooking);
              return;
            }
          }

          if (attempt < maxAttempts) {
            await delay(retryDelayMs);
          }
        }

        if (isSuccess && successCache) {
          setBooking(normalizeCachedBooking(successCache));
          return;
        }
      } catch (error: unknown) {
        console.error("Error fetching booking:", error);
        if (isSuccess && successCache) {
          setBooking(normalizeCachedBooking(successCache));
        }
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
  }, [isSuccess, sessionId, paymentIntentId, successCache]);

  if (loading) return <SkeletonConfirm />;
  if (!isSuccess && !booking) return <CarFailedPayment />;
  if (isSuccess && !booking) {
    return (
      <div>
        <Navbar />
        <div className="lg:pt-24 pt-20">
          <main className="mx-auto max-w-3xl px-6 py-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#D5EBDF] text-[#2D9C5E]">
              <CheckIcon sx={{ fontSize: 34 }} />
            </div>
            <h1 className="text-2xl font-semibold text-[#181818]">Payment successful</h1>
            <p className="mt-3 text-[#4E4F52]">Your transfer payment completed successfully.</p>
            {(searchParams.get("tx_ref") || searchParams.get("transaction_id")) && (
              <p className="mt-4 text-sm text-[#4E4F52]">
                Reference: {searchParams.get("tx_ref") || searchParams.get("transaction_id")}
              </p>
            )}
            <div className="mt-8">
              <Link to="/" className="rounded-lg bg-[#023E8A] px-5 py-3 text-white">
                Back to home
              </Link>
            </div>
          </main>
        </div>
        <div className="mt-24">
          <Footer />
        </div>
      </div>
    );
  }

  const handleDownload = (currentBooking: TransferConfirmation | null) => {
    if (!currentBooking) return;
    try {
      setDownloadLoading(true);
      window.open(
        `/car-paid/download?data=${encodeURIComponent(JSON.stringify(currentBooking))}`,
        "_blank",
      );
    } catch (err: unknown) {
      console.error("Failed to download:", err);
      toast.error("Failed to download, try again ");
    } finally {
      setDownloadLoading(false);
    }
  };

  const currentTransfer = booking?.transfers?.[0];
  const transferDetailItems = currentTransfer?.content?.transferDetailInfo ?? [];
  const statusLabel = booking?.status ?? booking?.booking_status ?? "Unknown";
  const paymentEmail = booking?.holder?.email ?? "your email";
  const totalAmount = booking?.totalNetAmount ?? booking?.total_amount ?? 0;
  const currency = booking?.currency ?? successCache?.quotePricing?.currency;
  const seatCount =
    booking?.passenger_capacity ??
    currentTransfer?.passenger_capacity ??
    currentTransfer?.content?.transferDetailInfo?.find((item) => (item.description ?? "").toLowerCase().includes("seat"))?.value ??
    transferDetailItems.find((item) => (item.description ?? "").toLowerCase().includes("seat"))?.value ??
    successCache?.car?.passenger_capacity ??
    successCache?.car?.maxPaxCapacity ??
    "Not Available";
  const luggageCount =
    booking?.luggage_capacity ??
    currentTransfer?.luggage_capacity ??
    currentTransfer?.content?.transferDetailInfo?.find((item) => (item.description ?? "").toLowerCase().includes("luggage"))?.value ??
    transferDetailItems.find((item) => (item.description ?? "").toLowerCase().includes("luggage"))?.value ??
    successCache?.car?.luggage_capacity ??
    "Not Available";

  return (
    <div>
      <Navbar />
      <div className="lg:pt-32 pt-20">
        {showShareModal && (
          <ShareModal onClose={() => setShowShareModal(false)} shareLink="/cars/bookings/" />
        )}

        <div className="lg:hidden px-6 lg:px-8 py-6 m-auto flex justify-between">
          <Link to="/">
            <p className="text-[14px] mt-[5px] font-medium font-inter">Done</p>
          </Link>
          <p className="text-[20px] font-semibold font-inter">Transfer Confirmation</p>
          <div
            className="w-[35px] h-[35px] p-[4px] bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px]"
            onClick={() => handleDownload(booking)}
          >
            <FileDownloadOutlinedIcon className="font-bold " />
          </div>
        </div>

        <div className="hidden px-6 lg:px-8 py-6 m-auto lg:flex justify-between">
          <p className="text-[20px] font-semibold font-inter">Transfer Confirmation</p>
          <div className="flex items-center justify-end gap-4">
            <div
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 rounded-md border-[1px] border-[#ACAEB3] p-2 cursor-pointer"
            >
              <Share />
              <span>Share</span>
            </div>
            <div
              onClick={() => handleDownload(booking)}
              className="flex items-center gap-2 rounded-md border-[1px] border-[#ACAEB3] p-2 cursor-pointer"
            >
              {downloadLoading ? <Loader className="animate-spin" /> : <Download />}
              <span>Download</span>
            </div>
          </div>
        </div>

        {(statusLabel ?? "").toLowerCase() === "confirmed" && (
          <div className="mb-8 px-6 lg:px-8 m-auto">
            <div className="border-1 border-[#2D9C5E] w-full bg-[#D5EBDF4D] pt-[10px] pb-[10px] pr-[10px] pl-[10px] rounded-[8px]">
              <div className="flex gap-2 items-center">
                <div className="border-[#2D9C5E] h-[20px] w-[20px] border-2 mt-[6px] rounded-full flex justify-center">
                  <CheckIcon
                    sx={{
                      width: "15px",
                      position: "relative",
                      top: "-3px",
                      color: "#2D9C5E",
                    }}
                  />
                </div>
                <div className="text-[12px]">
                  Payment successful. Transfer confirmation details will also be sent to {paymentEmail}
                </div>
              </div>
            </div>
          </div>
        )}

        <div id="pdf-content" className="lg:grid lg:grid-cols-2 lg:w-full">
          <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-1">
            <p className="text-[16px] font-medium text-[#181818] mb-[15px]">Confirmation Details</p>
            <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
              <div className="flex justify-between">
                <p className="text-[#4E4F52] text-[14px] font-normal">Payment Status</p>
                <p className="text-[14px] font-normal text-[#2D9C5E]">{statusLabel}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#4E4F52] text-[14px] font-normal">Booking ID</p>
                <p className="text-[14px] font-normal">{booking?.reference ?? booking?.booking_reference}</p>
              </div>
            </div>
          </div>

          <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} className="lg:hidden" />

          <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-3">
            <p className="text-[14px] font-inter py-4 font-medium text-[#181818]">Transfer details</p>
            <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Pick Up location</p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {currentTransfer?.pickupInformation?.from?.description ??
                      booking?.pickup_location_label ??
                      "Not Available"}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Pick Up Date</p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {currentTransfer?.pickupInformation?.date ?? booking?.pickup_date ?? "Not Available"}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Pick Up Time</p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {currentTransfer?.pickupInformation?.time ?? booking?.pickup_time ?? "Not Available"}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Drop Off Location</p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {currentTransfer?.pickupInformation?.to?.description ??
                      booking?.dropoff_location_label ??
                      "Not Available"}
                  </p>
                </div>
                <div className="flex justify-between w-full">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Transfer detail</p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {transferDetailItems[0]?.value ?? "Not Available"}{" "}
                    {transferDetailItems[0]?.description || "Not Available"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} className="lg:hidden" />

          <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-5">
            <p className="text-[14px] font-inter py-4 font-medium text-[#181818]">Vehicle details</p>
            <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Type</p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {currentTransfer?.category?.name ?? booking?.transfer_type ?? "Not Available"}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Seats</p>
                  <p className="text-[#181818] text-[14px] font-inter">{seatCount} Seats</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Luggages</p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {luggageCount}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Provider</p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {booking?.supplier?.name || currentTransfer?.supplier?.name || "Not Available"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} className="lg:hidden" />

          <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-7">
            <p className="text-[14px] font-medium text-[#181818] py-4">Guest details</p>
            <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
              <div className="flex justify-between mb-[6px]">
                <p className="text-[#4E4F52] text-[14px]">Name</p>
                <p className="text-[#181818] text-[14px]">
                  {booking?.holder?.name ?? ""} {booking?.holder?.surname ?? ""}
                </p>
              </div>
              <div className="flex justify-between mb-[6px]">
                <p className="text-[#4E4F52] text-[14px]">Email Address</p>
                <p className="text-[#181818] text-[14px]">{booking?.holder?.email ?? "Not Available"}</p>
              </div>
              <div className="flex justify-between mb-[6px]">
                <p className="text-[#4E4F52] text-[14px] ">Phone Number</p>
                <p className="text-[#181818] text-[14px]">{booking?.holder?.phone ?? "Not Available"}</p>
              </div>
            </div>
          </div>

          <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} className="lg:hidden" />

          <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-2">
            <p className="text-[14px] font-inter py-4 font-medium text-[#181818]">Estimated price summary</p>
            <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
              <div className="flex justify-between">
                <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Total</p>
                <p className="text-[#181818] text-[14px] font-inter">
                  {getCurrencySymbol(currency)}
                  {totalAmount}
                </p>
              </div>
            </div>
          </div>

          <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} className="lg:hidden" />
          <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-4">
            <p className="text-[14px] font-medium text-[#181818] py-4">Contacts</p>
            <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <LocalPhoneOutlinedIcon sx={{ fontSize: "14px", marginTop: "2px" }} />
                  <p className="text-[#4E4F52] text-[14px]">Customer Support</p>
                </div>
                <p className="text-[#181818] text-[14px]">+234 808 412 2474</p>
              </div>
            </div>
          </div>

          <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} className="lg:hidden" />

          <div className="px-6 lg:px-8 m-auto lg:m-0 lg:hidden">
            <p className="text-[14px] font-medium text-[#181818] mb-4">Actions</p>
            <div>
              <p onClick={() => setShowShareModal(true)} className="text-[#4E4F52] text-[14px] mb-2">
                <ShareOutlinedIcon /> <span>Share this booking</span>
              </p>
              <p
                className="text-[#181818] text-[14px]"
                onClick={() => {
                  handleDownload(booking);
                }}
              >
                {" "}
                {downloadLoading ? <Loader className="animate-spin" /> : <FileDownloadOutlinedIcon />}
                <span>Download as PDF</span>
              </p>
            </div>
          </div>

          <Divider sx={{ marginTop: "150px", marginBottom: "30px" }} className="lg:hidden" />

          <div className="mx-6 lg:mx-8  lg:order-6">
            <Link to="/">
              <button
                className="w-full text-white px-2 py-3 rounded-[6px] cursor-pointer bg-[#023E8A]"
                onClick={() => {
                  dispatch(resetForm());
                  clearSavedData();
                }}
              >
                Back to home
              </button>
            </Link>
          </div>

        </div>
        <div className="mt-24">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default CarPaidForPage;
