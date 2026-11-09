import Navbar from "../../../pages/homePage/Navbar";
import { GrStatusGood } from "react-icons/gr";
import HotelCard from "../components/BookingProgressHotelCard";
import GuestInformation from "../components/booking-progress/GuestInformation";
import PriceSummary from "../components/booking-progress/PriceSummary";
import BookingDetails from "../components/booking-progress/BookingDetails";
import RefundCancellation from "../components/booking-progress/RefundCancellation";
import Footer from "../../../components/2Footer";
import { useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createQuoteAsync, createHoldAsync, clearQuoteHold, fetchStayPricingAsync } from "../slice";
import { RootState, AppDispatch } from "../../../store";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Info, Loader } from "lucide-react";
import type { GuestInfoProps } from "../slice";
import {
  bookingReviewLabel,
  continueToPaymentLabel,
  guestDetailsLabel,
} from "../../shared/booking/bookingFlowLabels";
import { bookingFlowRoutes } from "../../shared/bookingFlowRoutes";
import { useEffect } from "react";
import { createStayPaymentIntent } from "../api";

type BookingGuestInfo = GuestInfoProps;

/** How many units of `room` to book, honoring the room count the guest
 * picked on the stay search screen (`requestedRooms`) while never exceeding
 * what's actually bookable -- the partner's per-booking cap (maxPerBooking)
 * and, when known, live remaining inventory. */
function resolveRoomQuantity(
  room: { maxPerBooking?: number; remainingInventory?: number; totalInventory?: number } | null | undefined,
  requestedRooms: number,
): number {
  const requested = Math.max(1, requestedRooms || 1);
  if (!room) return requested;
  const caps = [room.maxPerBooking, room.remainingInventory ?? room.totalInventory].filter(
    (v): v is number => v != null,
  );
  if (!caps.length) return requested;
  const cap = Math.min(...caps);
  return cap < 1 ? requested : Math.min(requested, cap);
}

const steps = [
  { title: bookingReviewLabel() },
  { title: guestDetailsLabel() },
  { title: continueToPaymentLabel() },
];

const BookingStepper = ({ activeStep }: { activeStep: number }) => (
  <div className="w-full max-w-3xl">
    <div className="flex items-center justify-between gap-4">
      {steps.map((step, index) => {
        const isComplete = index < activeStep;
        const isActive = index === activeStep;
        return (
          <div key={step.title} className="flex flex-1 flex-col items-center text-center">
            <div
              className={`flex size-8 items-center justify-center rounded-full border text-sm font-semibold ${
                isComplete || isActive
                  ? "border-[#023E8A] bg-[#023E8A] text-white"
                  : "border-gray-300 bg-white text-gray-500"
              }`}
            >
              {isComplete ? <FaCheck size={12} /> : index + 1}
            </div>
            <p className={`mt-2 text-xs sm:text-sm ${isComplete || isActive ? "text-[#023E8A]" : "text-gray-500"}`}>
              {step.title}
            </p>
          </div>
        );
      })}
    </div>
    <div className="mt-4 flex items-center gap-2">
      {steps.map((step, index) => (
        <div
          key={`${step.title}-bar`}
          className={`h-1 flex-1 rounded-full ${index <= activeStep ? "bg-[#023E8A]" : "bg-gray-200"}`}
        />
      ))}
    </div>
  </div>
);

const BookingProgress: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchParams, accessToken, quoteLoading, quoteError, holdLoading, holdError, stayPricing } = useSelector(
    (state: RootState) => ({
      ...state.stays,
      accessToken: state.auth.accessToken,
    })
  );
  const quoteResp = useSelector((state: RootState) => state.stays.quoteResp);
  const holdResp = useSelector((state: RootState) => state.stays.holdResp);
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedRoom, selectedOption, hotel, checkIn, checkOut, guestsAdults, guestsChild } =
    location.state || {};

  const isUnitLevel = selectedRoom == null;
  const roomQuantity = isUnitLevel ? 1 : resolveRoomQuantity(selectedRoom, searchParams?.rooms ?? 1);

  const [currentStep, setCurrentStep] = useState(0);
  const [guestInfo, setGuestInfo] = useState<BookingGuestInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof GuestInfoProps, string>>>({});
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Clear stale quote/hold state on mount
  useEffect(() => {
    dispatch(clearQuoteHold());
  }, [dispatch]);

  useEffect(() => {
    if (!hotel?.id || stayPricing) return;
    dispatch(fetchStayPricingAsync({
      stayId: hotel.id,
      checkIn: checkIn ?? searchParams?.checkIn,
      checkOut: checkOut ?? searchParams?.checkOut,
      adults: guestsAdults ?? searchParams?.adults,
      children: guestsChild ?? searchParams?.children,
      rooms: searchParams?.rooms,
    }));
  }, [dispatch, hotel?.id, stayPricing, checkIn, checkOut, guestsAdults, guestsChild, searchParams?.checkIn, searchParams?.checkOut, searchParams?.adults, searchParams?.children, searchParams?.rooms]);

  const effectiveCheckIn = checkIn ?? searchParams?.checkIn;
  const effectiveCheckOut = checkOut ?? searchParams?.checkOut;
  const nights =
    effectiveCheckIn && effectiveCheckOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(effectiveCheckOut).getTime() - new Date(effectiveCheckIn).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 1;

  const validatePersonalInfo = () => {
    const newErrors: Partial<Record<keyof GuestInfoProps, string>> = {};
    if (!guestInfo.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!guestInfo.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!guestInfo.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(guestInfo.email)) newErrors.email = "Email is invalid.";
    if (!guestInfo.phone.trim()) newErrors.phone = "Phone number is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validatePersonalInfo()) return;
    if (currentStep < 2) setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else navigate(-1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGuestStepContinue = async () => {
    if (!validatePersonalInfo()) return;
    await handleQuoteAndHold();
  };

  const isLoading = quoteLoading || holdLoading;
  const reviewPricing = (() => {
    if (quoteResp?.pricing) return quoteResp.pricing;
    if (!stayPricing) return null;

    if (!isUnitLevel && selectedRoom && selectedOption) {
      const wantsRefundable = selectedOption.optionId === "FREE_CANCELLATION";
      const roomId = selectedRoom.id ?? selectedRoom.code ?? "";
      const matchingPlan =
        stayPricing.ratePlans.find(
          (plan) =>
            plan.roomId === roomId &&
            plan.isActive &&
            (wantsRefundable ? plan.planType === "refundable" : plan.planType === "non_refundable"),
        ) ?? stayPricing.ratePlans.find((plan) => plan.roomId === roomId && plan.isActive);

      // Only use live pricing values here. Catalog room baseRate is not
      // date/occupancy-specific and must never become a customer booking
      // price when live pricing is unavailable.
      const nightlyRate = matchingPlan?.nightlyRate ?? selectedOption.amount ?? 0;
      const base = nightlyRate * nights * roomQuantity;
      const total = selectedOption.amount * nights * roomQuantity;
      const taxAndFees = Math.max(0, total - base);

      return {
        currency: selectedOption.currency,
        base,
        tax: taxAndFees,
        fees: 0,
        total,
      };
    }

    return {
      currency: stayPricing.currency,
      base: stayPricing.priceBreakdown.base.amount,
      tax: stayPricing.priceBreakdown.taxes.amount,
      fees: stayPricing.priceBreakdown.fees.amount,
      total: stayPricing.priceBreakdown.total.amount,
    };
  })();
  const quoteCurrency = reviewPricing?.currency ?? selectedOption?.currency ?? stayPricing?.currency ?? "NGN";
  const quoteNote = quoteResp?.pricing
    ? "Prices are shown from the quote response."
    : stayPricing
      ? !isUnitLevel && selectedRoom
        ? "Estimate based on your selected room. Final totals will be confirmed after quote."
        : "Initial estimate based on the current stay pricing. Final totals will be locked after quote creation."
      : "Prices will appear once stay pricing is loaded.";

  const handleQuoteAndHold = async () => {
    const stayId = hotel?.id;
    if (!stayId || !selectedOption || !effectiveCheckIn || !effectiveCheckOut) {
      toast.error("Missing booking details. Please go back and try again.");
      return;
    }

    let resolvedStayPricing = stayPricing;
    if (!resolvedStayPricing?.ratePlans?.length) {
      try {
        resolvedStayPricing = await dispatch(fetchStayPricingAsync({
          stayId,
          checkIn: effectiveCheckIn,
          checkOut: effectiveCheckOut,
          adults: guestsAdults ?? searchParams?.adults,
          children: guestsChild ?? searchParams?.children,
          rooms: searchParams?.rooms,
        })).unwrap();
      } catch {
        toast.error("Unable to load stay pricing. Please try again.");
        return;
      }
    }

    const roomSelections =
      isUnitLevel || !selectedRoom
        ? undefined
        : [{ roomId: selectedRoom.id ?? selectedRoom.code ?? "", quantity: roomQuantity }];

    const ratePlanId = (() => {
      if (!selectedOption || !resolvedStayPricing?.ratePlans?.length) return null;
      const wantsRefundable = selectedOption.optionId === "FREE_CANCELLATION";
      const activePlans = resolvedStayPricing.ratePlans.filter((plan) => plan.isActive);

      if (isUnitLevel) {
        return (
          activePlans.find((plan) =>
            wantsRefundable ? plan.planType === "refundable" : plan.planType === "non_refundable",
          )?.id ?? activePlans[0]?.id ?? null
        );
      }

      const roomId = selectedRoom?.id ?? selectedRoom?.code ?? "";
      const matchedByScope = activePlans.find((plan) => {
        if (plan.roomId !== roomId) return false;
        return wantsRefundable ? plan.planType === "refundable" : plan.planType === "non_refundable";
      });

      return (
        matchedByScope?.id ??
        activePlans.find((plan) => plan.roomId === roomId)?.id ??
        activePlans[0]?.id ??
        null
      );
    })();

    // Step 1: Quote
    let lockId: string | null = null;
    try {
      const quotePayload = {
        listingType: "stay" as const,
        listingId: stayId,
        cancellationOptionId: selectedOption.optionId,
        currency: resolvedStayPricing.currency ?? selectedOption.currency ?? "NGN",
        checkInDate: effectiveCheckIn,
        checkOutDate: effectiveCheckOut,
        ...(roomSelections ? { roomSelections } : {}),
        ...(ratePlanId ? { ratePlanId } : {}),
      };
      const quoteResult = await dispatch(createQuoteAsync(quotePayload)).unwrap();
      lockId = quoteResult.lockId;
    } catch {
      return; // quoteError already in Redux state
    }

    if (!lockId) return;

    const guestCount = Math.max(1, (guestsAdults ?? searchParams?.adults ?? 1) + (guestsChild ?? searchParams?.children ?? 0));

    // Step 2: Hold
    try {
      await dispatch(
        createHoldAsync({
          listingType: "stay",
          listingId: stayId,
          quoteLockId: lockId,
          guestCount,
          travelers: [
            {
              firstName: guestInfo.firstName,
              lastName: guestInfo.lastName,
              type: "adult",
              email: guestInfo.email,
            },
          ],
          customerReference: `WEB-${Date.now()}`,
          hotel_name: hotel?.name || "",
          check_in: effectiveCheckIn || "",
          check_out: effectiveCheckOut || "",
          hotel_address: hotel?.address || "",
          hotel_city: hotel?.city || "",
          hotel_country: hotel?.country || "",
          room_name: selectedRoom?.name || selectedRoom?.description || "",
          room_selections: roomSelections,
          rate_plan_id: ratePlanId,
          cancellation_option_id: selectedOption.optionId,
          cancellation_option_label: selectedOption.label,
        }),
      ).unwrap();
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      // holdError already in Redux state
    }
  };

  const getStayConfirmationUrl = () => {
    const url = new URL(bookingFlowRoutes.stayConfirmation, window.location.origin);
    url.protocol = "https:";
    return url.toString();
  };

  const handlePayment = async () => {
    if (!quoteResp?.lockId || !holdResp?.bookingReference) {
      toast.error("Booking details are missing. Please go back and try again.");
      return;
    }
    try {
      setPaymentLoading(true);
      const result = await createStayPaymentIntent({
        quoteLockId: quoteResp.lockId,
        bookingReference: holdResp.bookingReference,
        redirectUrl: getStayConfirmationUrl(),
        customer: {
          name: `${guestInfo.firstName} ${guestInfo.lastName}`.trim(),
          email: guestInfo.email,
          phone: guestInfo.phone,
        },
      });
      if (!result.success || !result.paymentLink) {
        toast.error(result.error || "Payment link unavailable. Please try again.");
        return;
      }
      if (result.paymentIntentId) {
        sessionStorage.setItem("stay_payment_intent_id", result.paymentIntentId);
      }
      window.location.href = result.paymentLink;
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="md:w-full lg:px-10 px-4 mx-auto my-28 space-y-6">
        <div className="px-4 py-2 flex gap-6">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md shadow-sm p-1 cursor-pointer"
          >
            <IoChevronBack size={24} />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {currentStep === 0
              ? bookingReviewLabel()
              : currentStep === 1
                ? guestDetailsLabel()
                : continueToPaymentLabel()}
          </h1>
        </div>

        <div className="lg:px-4 justify-center flex items-center">
          <BookingStepper activeStep={currentStep} />
        </div>

        <div className="px-1 space-y-4">
          {/* ── Step 0: Booking Review ── */}
          {currentStep === 0 && (
            <>
              <div className="bg-blue-100 border border-[#023E8A] px-4 py-2 rounded-lg flex flex-row justify-normal items-center gap-3">
                <GrStatusGood className="text-green-600 size-12 lg:size-6" />
                <p className="lg:text-base text-gray-800 leading-relaxed text-sm">
                  {selectedOption?.policyCopy ||
                    "Cancellation terms will be shown after a rate is selected."}
                </p>
              </div>

              {!accessToken && (
                <div className="bg-red-100 border border-red-400 px-4 py-2 rounded-lg flex flex-row items-start sm:items-center gap-3 mx-4 sm:mx-0">
                  <Info stroke="#D72638" />
                  <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                    To continue your booking, please create an account or log in.
                  </p>
                </div>
              )}

              <HotelCard
                imageUrl={
                  selectedRoom?.images?.[0]?.secureUrl ??
                  selectedRoom?.images?.[0]?.url ??
                  hotel?.images?.[0]?.secureUrl ??
                  hotel?.images?.[0]?.url ??
                  "src/assets/images/StayImage3.png"
                }
                roomDetails={selectedRoom?.description || selectedRoom?.name || hotel?.name || "---"}
                name={
                  selectedRoom?.bedConfiguration ??
                  selectedRoom?.bedType ??
                  selectedRoom?.bed_type ??
                  hotel?.propertyType ??
                  "---"
                }
                location={hotel?.address || "---"}
                policyCopy={selectedOption?.policyCopy}
              />

              {selectedOption && (
                <div className="mx-4 sm:mx-0 mt-2 rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm">
                  <span className="font-semibold text-blue-800">{selectedOption.label}</span>
                  <span className="mx-2 text-blue-400">·</span>
                  <span className="text-blue-700">{selectedOption.policyCopy}</span>
                </div>
              )}

              <div className="lg:grid grid-cols-2 gap-4 items-start">
                <BookingDetails
                  roomType={selectedRoom?.description ?? selectedRoom?.name ?? hotel?.name}
                  bedType={
                    selectedRoom?.bedConfiguration ??
                    selectedRoom?.bedType ??
                    selectedRoom?.bed_type ??
                    hotel?.propertyType
                  }
                  checkIn={effectiveCheckIn}
                  checkOut={effectiveCheckOut}
                  guests={`${guestsAdults ?? searchParams?.adults ?? 1} Adults${
                    (guestsChild ?? searchParams?.children)
                      ? `, ${guestsChild ?? searchParams?.children} Children`
                      : ""
                  }`}
                />
                <div className="lg:order-5">
                <PriceSummary
                  pricing={reviewPricing}
                  nights={nights}
                  roomType={selectedRoom?.description ?? hotel?.name}
                  numberOfRooms={roomQuantity}
                  currency={quoteCurrency}
                  note={quoteNote}
                />
                  <div className="lg:flex hidden justify-center items-center">
                    <button
                      onClick={handleNext}
                      className="bg-[#023E8A] text-white p-3 mt-12 rounded-lg w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={!accessToken}
                    >
                      Continue
                    </button>
                  </div>
                </div>
                <div className="lg:order-3">
                  <RefundCancellation
                    policyCopy={selectedOption?.policyCopy}
                    refundPercent={selectedOption?.refundPercent}
                    deadlineLabel={
                      selectedOption?.cancelDeadlineHoursBeforeCheckIn
                        ? `${selectedOption.cancelDeadlineHoursBeforeCheckIn} hours before check-in`
                        : selectedOption?.deadlineType === "service_date"
                          ? "the service date"
                          : undefined
                    }
                  />
                </div>
              </div>

              <div className="flex justify-center items-center lg:hidden">
                <button
                  onClick={handleNext}
                  className="bg-[#023E8A] text-white p-3 mt-12 rounded-lg lg:w-[40%] w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!accessToken}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* ── Step 1: Guest Information ── */}
          {currentStep === 1 && (
            <>
              <GuestInformation
                onGuestInfoChange={(info) =>
                  setGuestInfo({
                    firstName: info.firstName || "",
                    lastName: info.lastName || "",
                    email: info.email || "",
                    phone: info.phone || "",
                  })
                }
                formData={guestInfo}
                errors={errors}
              />
              <div className="flex justify-center items-center">
                <button
                  onClick={handleGuestStepContinue}
                  disabled={isLoading}
                  className="bg-[#023E8A] text-white p-3 mt-12 rounded-lg lg:w-[40%] w-full"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      Processing… <Loader className="animate-spin" size={16} />
                    </span>
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </>
          )}

          {/* ── Step 2: Confirm & Hold ── */}
          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-xl font-semibold">Booking Summary</h2>

              {/* Property / room summary */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm">
                <h3 className="font-semibold text-gray-700 pb-3 border-b border-gray-100">Booking Details</h3>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Property</span>
                    <span className="font-medium text-right">
                      {hotel?.name ?? selectedRoom?.name ?? "—"}
                    </span>
                  </div>
                  {!isUnitLevel && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Room</span>
                      <span className="font-medium text-right">
                        {selectedRoom?.description ?? selectedRoom?.name ?? "—"}
                      </span>
                    </div>
                  )}
                  {!isUnitLevel && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Number of Rooms</span>
                      <span className="font-medium text-right">{roomQuantity}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Check-in</span>
                    <span className="font-medium">{effectiveCheckIn ?? "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Check-out</span>
                    <span className="font-medium">{effectiveCheckOut ?? "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Guests</span>
                    <span className="font-medium">
                      {guestsAdults ?? searchParams?.adults ?? 1} Adults
                      {(guestsChild ?? searchParams?.children)
                        ? `, ${guestsChild ?? searchParams?.children} Children`
                        : ""}
                    </span>
                  </div>
                  {selectedOption && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rate</span>
                      <span className="font-medium">{selectedOption.label}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Traveler summary */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm">
                <h3 className="font-semibold text-gray-700 pb-3 border-b border-gray-100">Guest Details</h3>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name</span>
                    <span className="font-medium">
                      {guestInfo.firstName} {guestInfo.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium">{guestInfo.email}</span>
                  </div>
                </div>
              </div>

              {/* Price breakdown — always from the locked quote */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm">
                <h3 className="font-semibold text-gray-700 pb-3 border-b border-gray-100">Price Breakdown</h3>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Base rate</span>
                    <span className="font-medium">
                      {quoteResp?.pricing
                        ? `${quoteResp.pricing.currency} ${(quoteResp.pricing.base ?? 0).toLocaleString()}`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Taxes</span>
                    <span className="font-medium">
                      {quoteResp?.pricing
                        ? `${quoteResp.pricing.currency} ${(quoteResp.pricing.tax ?? 0).toLocaleString()}`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fees</span>
                    <span className="font-medium">
                      {quoteResp?.pricing
                        ? `${quoteResp.pricing.currency} ${(quoteResp.pricing.fees ?? 0).toLocaleString()}`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 mt-1 border-t border-gray-200 font-semibold text-base">
                    <span>Total</span>
                    <span>
                      {quoteResp?.pricing
                        ? `${quoteResp.pricing.currency} ${(quoteResp.pricing.total ?? 0).toLocaleString()}`
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cancellation policy — from the locked quote */}
              {quoteResp?.cancellationOptionSelection && (
                <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm">
                  <h3 className="font-semibold text-gray-700 pb-3 border-b border-gray-100">Cancellation Policy</h3>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Policy</span>
                      <span className="font-medium text-right">
                        {quoteResp.cancellationOptionSelection.label}
                      </span>
                    </div>
                    {quoteResp.cancellationOptionSelection.cancellationCutoffAtLocal && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cancel by</span>
                        <span className="font-medium text-right">
                          {new Date(quoteResp.cancellationOptionSelection.cancellationCutoffAtLocal).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {quoteResp.cancellationOptionSelection.policyCopy && (
                      <p className="pt-1 text-xs text-gray-500 leading-relaxed">
                        {quoteResp.cancellationOptionSelection.policyCopy}
                      </p>
                    )}
                    {quoteResp.cancellationOptionSelection.refundPercent != null && (
                      <p className="pt-1 text-sm font-semibold text-[#2D9C5E]">
                        {quoteResp.cancellationOptionSelection.refundPercent}% refund if cancelled on time
                        {quoteResp.pricing?.total != null && (
                          <> · {quoteResp.pricing.currency} {(quoteResp.pricing.total * quoteResp.cancellationOptionSelection.refundPercent / 100).toLocaleString()}</>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Error display */}
              {(quoteError || holdError) && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {quoteError
                    ? `Quote failed: ${quoteError}`
                    : `Hold failed: ${holdError}`}
                </div>
              )}

              {/* Loading status */}
              {isLoading && (
                <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-700 flex items-center gap-2">
                  <Loader className="animate-spin" size={16} />
                  {quoteLoading ? "Getting price quote…" : "Confirming your reservation…"}
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={handlePayment}
                  disabled={isLoading || paymentLoading || !holdResp}
                  className="bg-[#023E8A] text-white p-3 rounded-lg lg:w-[60%] w-full disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                >
                  {paymentLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      Redirecting to payment… <Loader className="animate-spin" size={16} />
                    </span>
                  ) : (
                    "Continue to Payment"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingProgress;
