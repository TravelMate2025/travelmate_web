import React, { useState, useEffect } from "react";
import Navbar from "../../../pages/homePage/Navbar";

import MobilePage from "./MobilePage";
import { useLocation, useNavigate } from "react-router";
import Footer from "../../../components/2Footer";
import { transferService } from "../services/transferService";
import toast from "react-hot-toast";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import type { Dispatch, SetStateAction } from "react";
import {
  continueToPaymentLabel,
  guestDetailsLabel,
  transferReviewLabel,
} from "../../shared/booking/bookingFlowLabels";

export interface CarOfferInfo {
  id?: string | number;
  vehicle?: { name?: string; code?: string };
  category?: { name?: string };
  content?: {
    images?: Array<{ url?: string }>;
    transferDetailInfo?: Array<{ value?: string; description?: string }>;
    transferRemarks?: Array<{ description?: string }>;
  };
  maxPaxCapacity?: number | string;
  supplier?: { name?: string } | string;
  price?: { totalAmountWithFee?: number | string };
  rateKey?: string;
}

type DepartureInfo = {
  pickupLocaDescription: string;
  pickupDate: string;
  pickupTime: string;
  dropoffLocaDescription: string;
  selectedRide: string;
  priceRange: string;
};

type PassengerFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type FormDataState = {
  agreement: boolean;
};

type StepState = {
  gilad: boolean;
  jason: boolean;
  antoine: boolean;
};

export type QuotePricing = {
  currency?: string;
  base?: number;
  tax?: number;
  fees?: number;
  total?: number;
};

type TransferSuccessCache = {
  bookingReference?: string;
  quoteLockId?: string;
  departureInfo?: DepartureInfo;
  passFormData?: PassengerFormData;
  car?: CarOfferInfo;
  quotePricing?: QuotePricing;
  storedAt?: string;
};

export interface DeskProps {
  activeStep: number;
  steps: string[];
  handleBack: () => void;
  handleNext: () => void;
  handleConfirm: () => void;
  isFormValids: boolean;
  handleSubmit: () => void;
  passFormData: PassengerFormData;
  setPassFormData: Dispatch<SetStateAction<PassengerFormData>>;
  loadingSubmit?: boolean;
  isTheFormValid: boolean;
  state: StepState;
  setState: Dispatch<SetStateAction<StepState>>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
  submitted: boolean;
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangePayment: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  formData: FormDataState;
  isFormValid: boolean;
  setIsTheFormValid: Dispatch<SetStateAction<boolean>>;
  car?: CarOfferInfo;
  departureInfo?: DepartureInfo;
  quotePricing?: QuotePricing;
}

const Page = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Derive route state (no hooks, safe to do before hooks)
  const routeState = (location.state ?? {}) as {
    search_id?: string;
    departureInfo?: DepartureInfo;
    car?: CarOfferInfo;
    quoteLockId?: string;
    cancellationOptionId?: string;
  };
  const departureInfo: DepartureInfo = routeState.departureInfo ?? {
    pickupLocaDescription: "",
    pickupDate: "",
    pickupTime: "",
    dropoffLocaDescription: "",
    selectedRide: "",
    priceRange: "",
  };
  const precomputedQuoteLockId: string = routeState.quoteLockId ?? "";
  const precomputedCancellationOptionId: string = routeState.cancellationOptionId ?? "";
  const listingId = String(routeState.car?.id ?? routeState.car?.rateKey ?? "");

  const getTransferSuccessRedirectUrl = () => {
    const url = new URL("/transfers/payment-success", window.location.origin);
    const isLocalHost =
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "::1";
    if (!isLocalHost && url.protocol === "http:") {
      url.protocol = "https:";
    }
    return url.toString();
  };

  // ALL hooks unconditionally — no early returns until after this block
  const [quoteLockId, setQuoteLockId] = useState("");
  const [quotePricing, setQuotePricing] = useState<QuotePricing | undefined>(undefined);
  const [bookingReference, setBookingReference] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [submitted, setSubmitted] = useState(false);
  const steps = [transferReviewLabel(), guestDetailsLabel(), continueToPaymentLabel()];
  const [state, setState] = useState<StepState>({ gilad: true, jason: false, antoine: true });
  const [formData, setFormData] = useState<FormDataState>({ agreement: false });
  const [passFormData, setPassFormData] = useState<PassengerFormData>({
    firstName: "", lastName: "", email: "", phone: "",
  });
  const [errors, setErrors] = useState({
    firstName: "", lastName: "", email: "", phone: "",
  });
  const [isFormValid, setIsFormValid] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [isTheFormValid, setIsTheFormValid] = useState(false);

  useEffect(() => { setIsFormValid(formData.agreement); }, [formData]);

  useEffect(() => {
    const isValid =
      passFormData.firstName.trim() !== "" &&
      passFormData.lastName.trim() !== "" &&
      passFormData.email.trim() !== "" &&
      /\S+@\S+\.\S+/.test(passFormData.email) &&
      passFormData.phone.trim() !== "";
    setIsTheFormValid(isValid);
  }, [passFormData]);

  // Guard: redirect if page was opened without router state (e.g. on refresh)
  useEffect(() => {
    if (!routeState.departureInfo) navigate("/", { replace: true });
  }, [routeState.departureInfo, navigate]);

  if (!routeState.departureInfo) return null;

  // Handlers (after all hooks and the early-return guard)
  const isFormValids = formData.agreement;

  const validatePersonalInfo = () => {
    const newErrors = {
      firstName: "", lastName: "", email: "", phone: "",
    };
    if (!passFormData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!passFormData.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!passFormData.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(passFormData.email)) newErrors.email = "Email is invalid.";
    if (!passFormData.phone.trim()) newErrors.phone = "Phone number is required.";
    setErrors(newErrors);
    return Object.values(newErrors).every((v) => v === "");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleChangePayment = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, agreement: e.target.checked }));
  };

  const handleNext = () => {
    if (activeStep === 1 && !validatePersonalInfo()) return;
    if (activeStep < steps.length - 1) setActiveStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    } else {
      navigate(
        `/cars-searchResults?ride=${encodeURIComponent(departureInfo.selectedRide)}&from=${departureInfo.pickupLocaDescription}&to=${departureInfo.dropoffLocaDescription}&time=${departureInfo.pickupDate}&pricerange=${departureInfo.priceRange}`
      );
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirm = async () => {
    setSubmitted(true);
    if (!isTheFormValid || !validatePersonalInfo()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }
    if (!accessToken) {
      toast.error("You must be logged in to continue.");
      return;
    }
    try {
      setLoadingSubmit(true);
      let resolvedQuoteLockId = precomputedQuoteLockId;

      if (!resolvedQuoteLockId) {
        const quoteResult = await transferService.createTransferQuote({
          listingType: "transfer",
          listingId,
          currency: "NGN",
          cancellationOptionId: precomputedCancellationOptionId || undefined,
          pickupAt: (() => {
            const dt = new Date(`${departureInfo.pickupDate}T${departureInfo.pickupTime}:00`);
            const off = -dt.getTimezoneOffset();
            const sign = off >= 0 ? "+" : "-";
            const hh = String(Math.floor(Math.abs(off) / 60)).padStart(2, "0");
            const mm = String(Math.abs(off) % 60).padStart(2, "0");
            return `${departureInfo.pickupDate}T${departureInfo.pickupTime}:00${sign}${hh}:${mm}`;
          })(),
        });

        if (!quoteResult.success) {
          throw new Error(quoteResult.error || "Failed to create transfer quote");
        }

        const quoteData = (quoteResult.data as { data?: { quoteLockId?: string; lockId?: string; pricing?: QuotePricing } } | undefined)?.data;
        resolvedQuoteLockId = quoteData?.quoteLockId ?? quoteData?.lockId ?? "";
        if (!resolvedQuoteLockId) {
          throw new Error("Quote lock was not returned");
        }
        if (quoteData?.pricing) setQuotePricing(quoteData.pricing);
      }

      const holdResult = await transferService.createTransferHold({
        listingType: "transfer",
        listingId,
        quoteLockId: resolvedQuoteLockId,
        guestCount: 1,
        travelers: [
          {
            firstName: passFormData.firstName,
            lastName: passFormData.lastName,
            type: "adult",
            email: passFormData.email,
          },
        ],
        customerReference: `WEB-${Date.now()}`,
      });

      if (!holdResult.success) {
        throw new Error(holdResult.error || "Failed to create transfer hold");
      }

      const holdData = (holdResult.data as { data?: { bookingReference?: string; bookingId?: string } } | undefined)?.data;
      const holdBookingReference = holdData?.bookingReference ?? holdData?.bookingId ?? "";
      if (!holdBookingReference) {
        throw new Error("Booking reference was not returned");
      }

      setQuoteLockId(resolvedQuoteLockId);
      setBookingReference(holdBookingReference);
      setActiveStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: unknown) {
      console.error("Booking failed:", String(error));
      const msg = error instanceof Error ? error.message : "Booking failed";
      toast.error(`${msg} Please search again`);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoadingSubmit(true);
      const successCache: TransferSuccessCache = {
        bookingReference,
        quoteLockId,
        departureInfo,
        passFormData,
        car: routeState.car,
        quotePricing,
        storedAt: new Date().toISOString(),
      };
      console.debug("Transfer payment intent payload", {
        quoteLockId,
        bookingReference,
        redirectUrl: getTransferSuccessRedirectUrl(),
        customer: {
          name: `${passFormData.firstName} ${passFormData.lastName}`.trim(),
          email: passFormData.email,
          phone: passFormData.phone,
        },
      });
      const response = await transferService.createTransferPaymentIntent({
        quoteLockId,
        bookingReference,
        redirectUrl: getTransferSuccessRedirectUrl(),
        customer: {
          name: `${passFormData.firstName} ${passFormData.lastName}`.trim(),
          email: passFormData.email,
          phone: passFormData.phone,
        },
      });

      const payload = response.data as {
        data?: {
          paymentIntentId?: string;
          paymentLink?: string;
          nextAction?: { url?: string };
        };
      } | undefined;
      console.debug("Transfer payment intent response", {
        paymentIntentId: payload?.data?.paymentIntentId,
        paymentLink: payload?.data?.paymentLink ?? payload?.data?.nextAction?.url,
      });
      const paymentUrl = payload?.data?.paymentLink ?? payload?.data?.nextAction?.url;
      if (response.success && paymentUrl) {
        window.localStorage.setItem("transferPaymentSuccess", JSON.stringify(successCache));
        window.location.href = paymentUrl;
      } else {
        throw new Error(response.error || "Payment handoff unavailable");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error in payment";
      console.error("Error in payment:", error);
      toast.error(message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div>
      <Navbar />
      {/* {isMobile ? ( */}
      <MobilePage
        setState={setState}
        handleBack={handleBack}
        handleNext={handleNext}
        handleConfirm={handleConfirm}
        steps={steps}
        activeStep={activeStep}
        errors={errors}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        state={state}
        isFormValids={isFormValids}
        isFormValid={isFormValid}
        handleChangePayment={handleChangePayment}
        handleCheckboxChange={handleCheckboxChange}
        passFormData={passFormData}
        setPassFormData={setPassFormData}
        setIsTheFormValid={setIsTheFormValid}
        isTheFormValid={isTheFormValid}
        loadingSubmit={loadingSubmit}
        submitted={submitted}
        quotePricing={quotePricing}
      />
      <Footer />
    </div>
  );
};

export default Page;
