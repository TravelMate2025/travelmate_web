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
  dateOfBirth: string;
  countryCode: string;
};

type FormDataState = {
  agreement: boolean;
};

type StepState = {
  gilad: boolean;
  jason: boolean;
  antoine: boolean;
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
  handleBlur: () => void;
  formData: FormDataState;
  isFormValid: boolean;
  setIsTheFormValid: Dispatch<SetStateAction<boolean>>;
  car?: CarOfferInfo;
  departureInfo?: DepartureInfo;
}

const Page = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [quoteLockId, setQuoteLockId] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [submitted, setSubmitted] = useState(false);
  // const dispatch = useDispatch();

  const steps = [transferReviewLabel(), guestDetailsLabel(), continueToPaymentLabel()];

  const [state, setState] = useState<StepState>({
    gilad: true,
    jason: false,
    antoine: true,
  });
  const { search_id, departureInfo } = location.state as {
    search_id: string;
    departureInfo: DepartureInfo;
    car?: CarOfferInfo;
  };
  const precomputedQuoteLockId: string = location.state?.quoteLockId ?? "";
  const precomputedCancellationOptionId: string = location.state?.cancellationOptionId ?? "";
  const listingId = String(location.state?.car?.id ?? location.state?.car?.rateKey ?? "");
  const rate_key = location.state?.car?.rateKey || "";
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const [formData, setFormData] = useState<FormDataState>({
    agreement: false,
  });

  const handleBlur = () => {};
  const [passFormData, setPassFormData] = useState<PassengerFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    countryCode: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    countryCode: "",
  });
  const validatePersonalInfo = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      email: "",
      phone: "",
      countryCode: "",
    };
    if (!passFormData.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!passFormData.lastName.trim())
      newErrors.lastName = "Last name is required.";
    if (!passFormData.dateOfBirth.trim())
      newErrors.dateOfBirth = "Date of birth is required.";
    if (
      new Date(passFormData.dateOfBirth).toISOString() >
      new Date().toISOString()
    )
      newErrors.dateOfBirth = "Date of Birth invalid!";
    if (!passFormData.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(passFormData.email))
      newErrors.email = "Email is invalid.";
    if (!passFormData.phone.trim())
      newErrors.phone = "Phone number is required.";
    if (!passFormData.countryCode.trim())
      newErrors.countryCode = "Country code is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChangePayment = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, agreement: e.target.checked }));
  };

  const [isFormValid, setIsFormValid] = useState(true);

  useEffect(() => {
    setIsFormValid(formData.agreement);
  }, [formData]);
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep === 1) {
      if (!validatePersonalInfo()) {
        return;
      }
    }
    if (activeStep < steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    } else {
      navigate(
        `/cars-searchResults?ride=${encodeURIComponent(
          departureInfo.selectedRide
        )}&from=${departureInfo.pickupLocaDescription}&to=${
          departureInfo.dropoffLocaDescription
        }&time=${departureInfo.pickupDate}&pricerange=${
          departureInfo.priceRange
        }`
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
          pickupAt: `${departureInfo.pickupDate}T${departureInfo.pickupTime}`,
        });

        if (!quoteResult.success) {
          throw new Error(quoteResult.error || "Failed to create transfer quote");
        }

        const quoteData = (quoteResult.data as { data?: { quoteLockId?: string; lockId?: string } } | undefined)?.data;
        resolvedQuoteLockId = quoteData?.quoteLockId ?? quoteData?.lockId ?? "";
        if (!resolvedQuoteLockId) {
          throw new Error("Quote lock was not returned");
        }
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
      const resolvedBookingReference = holdData?.bookingReference ?? holdData?.bookingId ?? "";
      if (!resolvedBookingReference) {
        throw new Error("Booking reference was not returned");
      }

      setQuoteLockId(resolvedQuoteLockId);
      setBookingReference(resolvedBookingReference);
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

  const [isTheFormValid, setIsTheFormValid] = useState(false);

  useEffect(() => {
    // Validation: Check if all fields are filled
    const isValid =
      passFormData.firstName.trim() !== "" &&
      passFormData.lastName.trim() !== "" &&
      passFormData.email.trim() !== "" &&
      /\S+@\S+\.\S+/.test(passFormData.email) &&
      passFormData.phone.trim() !== "" &&
      /^\d+$/.test(passFormData.phone) &&
      passFormData.dateOfBirth.trim() !== "" &&
      passFormData.countryCode.trim() !== "";

    setIsTheFormValid(isValid);
  }, [passFormData]);

  const isFormValids = formData.agreement;

  const handleSubmit = async () => {
    try {
      setLoadingSubmit(true);
      const response = await transferService.createTransferPaymentIntent({
        quoteLockId,
        bookingReference,
        redirectUrl: `${window.location.origin}/transfers/payment-success`,
        customer: {
          name: `${passFormData.firstName} ${passFormData.lastName}`.trim(),
          email: passFormData.email,
          phone: passFormData.phone,
        },
      });

      const payload = response.data as { data?: { paymentLink?: string; nextAction?: { url?: string } } } | undefined;
      const paymentUrl = payload?.data?.paymentLink ?? payload?.data?.nextAction?.url;
      if (response.success && paymentUrl) {
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
        handleBlur={handleBlur}
        passFormData={passFormData}
        setPassFormData={setPassFormData}
        setIsTheFormValid={setIsTheFormValid}
        isTheFormValid={isTheFormValid}
        loadingSubmit={loadingSubmit}
        submitted={submitted}
      />

      <Footer />
    </div>
  );
};

export default Page;
