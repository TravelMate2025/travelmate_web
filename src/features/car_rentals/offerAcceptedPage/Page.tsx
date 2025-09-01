import React, { useState, useEffect } from "react";
import Navbar from "../../../pages/homePage/Navbar";

import MobilePage from "./MobilePage";
import { useLocation, useNavigate } from "react-router";
import Footer from "../../../components/2Footer";
import { transferService } from "../services/transferService";

export type DeskProps = {
  handleBack: () => void;
  handleNext: () => void;
  handleConfirm: () => void;
  steps: any[];
  activeStep: number;
  formData: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
    agreement: boolean;
  };
  errors: {
    cardNumber: boolean;
    cardHolder: boolean;
    expiryDate: boolean;
    cvv: boolean;
  };
  touched: {
    cardNumber: boolean;
    cardHolder: boolean;
    expiryDate: boolean;
    cvv: boolean;
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
    phoneNumber: string;
    dateOfBirth: string;
    countryCode: string;
  };
  setPassFormData: (passFormData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    countryCode: string;
    [key: string]: any;
  }) => void;
  isTheFormValid: boolean;
  setIsTheFormValid: (isTheFormValid: boolean) => void;
  setState: (state: any) => void;
  loadingSubmit?: boolean;
};

const Page = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmationId, setConfirmationId] = useState<string | undefined>("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const steps = ["Booking Overview", "Passenger Information", "Payment"];

  const [state, setState] = useState({
    gilad: true,
    jason: false,
    antoine: true,
  });
  const { search_id } = location.state;
  const rate_key = location.state?.car?.rateKey || "";
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    agreement: false,
  });

  const [touched, setTouched] = useState({
    cardNumber: false,
    cardHolder: false,
    expiryDate: false,
    cvv: false,
  });

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const [errors, setErrors] = useState({
    cardNumber: false,
    cardHolder: false,
    expiryDate: false,
    cvv: false,
  });

  const validateFields = () => {
    const newErrors = {
      cardNumber: formData.cardNumber.length !== 16,
      cardHolder: formData.cardHolder.trim() === "",
      expiryDate: formData.expiryDate === "",
      cvv: formData.cvv.length !== 3,
    };

    setErrors(newErrors);

    return !Object.values(newErrors).includes(true);
  };
  const [passFormData, setPassFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    countryCode: "",
  });
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
    setIsFormValid(validateFields() && formData.agreement);
  }, [formData]);

  const handleConfirm = async () => {
    if (!isTheFormValid) {
      return;
    }

    try {
      const payload = {
        search_id,
        rate_key,
        first_name: passFormData.firstName,
        last_name: passFormData.lastName,
        dob: passFormData.dateOfBirth,
        email: passFormData.email,
        country_code: passFormData.countryCode,
        phone: passFormData.phoneNumber,
      };

      const result = await transferService.createBookingConfirmation(payload);
      setActiveStep(2);
      console.log(payload);
      setConfirmationId(result?.data?.booking_id);
      if (result.success) {
        console.log("Booking confirmed!", result.data);
      } else {
        console.error("Booking failed:", result.error);
      }
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    } else {
      navigate("/cars-searchResults");
    }
  };

  const [isTheFormValid, setIsTheFormValid] = useState(false);

  useEffect(() => {
    // Validation: Check if all fields are filled
    const isValid =
      passFormData.firstName.trim() !== "" &&
      passFormData.lastName.trim() !== "" &&
      passFormData.email.trim() !== "" &&
      /\S+@\S+\.\S+/.test(passFormData.email) && // Email validation
      passFormData.phoneNumber.trim() !== "" &&
      /^\d+$/.test(passFormData.phoneNumber) && // Ensures phone is numbers only
      passFormData.dateOfBirth.trim() !== "";

    setIsTheFormValid(isValid);
  }, [passFormData]);

  const isFormValids = formData.agreement;
  const handleSubmit = async () => {
    try {
      setLoadingSubmit(true);
      await transferService.createCheckoutSession(confirmationId);
      navigate("/car-payment-successful", {
        state: {
          confirmationId,
          car: location.state?.car,
          passFormData,
        },
      });
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
        formData={formData}
        errors={errors}
        touched={touched}
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
      />
  
      <Footer />
    </div>
  );
};

export default Page;
