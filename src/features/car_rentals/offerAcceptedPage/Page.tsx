import React, { useState, useEffect } from "react";
import Navbar from "../../../pages/homePage/Navbar";

import MobilePage from "./MobilePage";
import { useLocation, useNavigate } from "react-router";
import Footer from "../../../components/2Footer";
import { transferService } from "../services/transferService";
import toast from "react-hot-toast";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { resetForm } from "../carPaymentSlice";

export type DeskProps = {
  handleBack: () => void;
  handleNext: () => void;
  handleConfirm: () => void;
  steps: any[];
  activeStep: number;
  formData: {
    agreement: boolean;
  };

  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  state: {
    gilad: boolean;
    jason: boolean;
    antoine: boolean;
  };
  handleChangePayment: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  isFormValid: boolean;
  isFormValids: boolean | string;
  passFormData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    countryCode: string;
  };
  setPassFormData: (passFormData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    countryCode: string;
    [key: string]: any;
  }) => void;
  isTheFormValid: boolean;
  setIsTheFormValid: (isTheFormValid: boolean) => void;
  setState: (state: any) => void;
  loadingSubmit?: boolean;
  errors: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    countryCode: string;
  };
  submitted: boolean;
};

const Page = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmationId, setConfirmationId] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();

  const steps = ["Booking Overview", "Passenger Information", "Payment"];

  const [state, setState] = useState({
    gilad: true,
    jason: false,
    antoine: true,
  });
  const { search_id, departureInfo } = location.state;
  const rate_key = location.state?.car?.rateKey || "";
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const [formData, setFormData] = useState({
    agreement: false,
  });

  const handleBlur = () => {};
  const [passFormData, setPassFormData] = useState({
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
    const newErrors: any = {};
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
    try {
      setLoadingSubmit(true);
      const payload = {
        search_id,
        rate_key,
        first_name: passFormData.firstName,
        last_name: passFormData.lastName,
        dob: passFormData.dateOfBirth,
        email: passFormData.email,
        country_code: passFormData.countryCode,
        phone: passFormData.phone,
      };

      if (!accessToken) {
        toast.error("You must be logged in to continue.");
        setLoadingSubmit(false);
        return;
      }
      const result = await transferService.createBookingConfirmation(
        accessToken,
        payload
      );
      if (result.success) {
      } else {
        dispatch(resetForm());
        navigate("/", { replace: true });
        return;
      }
      setActiveStep(2);
      setConfirmationId(result?.data?.id ?? "");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.error("Booking failed:", error);
      toast.error(`${error?.response?.data?.detail[0]} Please search again`);
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
      const response = await transferService.createCheckoutSession(
        confirmationId
      );
      console.log(response);
      if (response.success && response.checkout_url) {
        window.location.href = response.checkout_url;
      } else {
        console.error("Payment failed or invalid response:", response);
      }
    } catch (error) {
      console.error("Error in payment:", error);
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
