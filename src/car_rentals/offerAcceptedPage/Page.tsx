import React, { useState, useEffect } from "react";
import Navbar from "../../pages/homePage/Navbar";

import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import SpeedIcon from "@mui/icons-material/Speed";
import carImage from "../../assets/carImage.svg";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
import { useMediaQuery } from "react-responsive";


import DeskWeb from "./Desk-Web";
import MobilePage from "./MobilePage";
import { useNavigate } from "react-router";
import Footer from "../../components/2Footer";

const Page = () => {
        const navigate = useNavigate()
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const steps = [
    "Booking Overview",
    "Passenger Information",
    "Passenger Details",
  ];

  const carList = [
    {
      id: 1,
      image: carImage,
      seatLeft: <AirlineSeatReclineNormalIcon />,
      fuelIcon: <LuggageOutlinedIcon />,
      speed: <SpeedIcon />,
      spaceleft: "3 Seats",
      full: "4 Bags",
      refundable: "Full refund if cancelled 24 hours before pick up",
      noShows: "Cancellation allowed 24 hours before pick up",
      perDay: "Price",
      price: "₦14,000",
      button: "Select Car",
    },
  ];
  const value = 4.5;

  const [state, setState] = useState({
    gilad: true,
    jason: false,
    antoine: true,
  });

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

  const handleChangePayment = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, agreement: e.target.checked }));
  };

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(validateFields() && formData.agreement);
  }, [formData]);

  const handleSubmit = () => {
    if (isFormValid) {
      console.log("Form submitted successfully!");
    } else {
      console.log("Form has errors, please fix them.");
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
    } else{
      navigate('/cars-searchResults')
    }
  };

  const [passFormData, setPassFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
  });

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

  const isFormValids =
    formData.agreement

  return (
    <div>
      <Navbar />
      {/* {isMobile ? ( */}
        <MobilePage
          handleBack={handleBack}
          handleNext={handleNext}
          steps={steps}
          activeStep={activeStep}
          carList={carList}
          value={value}
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
        />
      {/* // ) : (
      //   <DeskWeb
      //     handleNext={handleNext}
      //     handleBack={handleBack}
      //     steps={steps}
      //     activeStep={activeStep}
      //     carList={carList}
      //     value={value}
      //     formData={formData}
      //     errors={errors}
      //     touched={touched}
      //     handleChange={handleChange}
      //     handleSubmit={handleSubmit}
      //     state={state}
      //     isFormValids={isFormValids}
      //     isFormValid={isFormValid}
      //     handleChangePayment={handleChangePayment}
      //     handleCheckboxChange={handleCheckboxChange}
      //     handleBlur={handleBlur}
      //     passFormData={passFormData}
      //     setPassFormData={setPassFormData}
      //     setIsTheFormValid={setIsTheFormValid}
      //     isTheFormValid={isTheFormValid}
      //   />
      // )} */}
      <Footer/>
    </div>
  );
};

export default Page;
