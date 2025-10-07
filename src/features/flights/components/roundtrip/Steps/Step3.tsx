import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { CreditCardIcon } from "lucide-react";
import React, { useState } from "react";
import master from "../../../../../assets/images/mastercard-logo.png";
import visa from "../../../../../assets/images/visa-logo.png";
import { PriceSummary } from "./Step1";
import { useLocation, useNavigate } from "react-router-dom";
import { DateSelector } from "../../DateSelector";
import { format } from "date-fns";
import { useStepContext } from "./StepLayout";
import { useCreateCheckoutSessionMutation } from "../../../api/flightApi";
import { Icon } from "@iconify/react/dist/iconify.js";

const Step3 = () => {
  const navigate = useNavigate();
  const { booking, updateBooking } = useStepContext();
  const [createSession, { data }] = useCreateCheckoutSessionMutation();
  const location = useLocation();
  booking.checkoutUrl;
  // 🔹 State for form inputs
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: new Date(), // from DateSelector
    cvv: "",
    defaultPayment: false,
  });

  // 🔹 Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🔹 Handle expiry date (from DateSelector)
  const handleExpiryDateChange = (date: Date) => {
    setFormData((prev) => ({ ...prev, expiryDate: date }));
  };

  // 🔹 Submit or confirm action
  const handleConfirm = async () => {
    console.log(booking);

    // window.open(booking.checkoutUrl);
    window.location.href = booking.checkoutUrl;

    // console.log("Payment Data:", formData);
    // navigate("/flightInfo-confirmation");
  };

  return (
    <div className="grid gap-2">
      <div className="border border-[#CDCED1] p-4 rounded-lg">
        <div className="flex items-center">
          <img src="/paypal.png" alt="ds" className="size-14" />
          <p className="text-xl">Paypal</p>
        </div>

        <div className="bg-[#FAFAFA] grid gap-3 place-content-center h-[174px]">
          <Icon
            icon="mynaui:arrow-right"
            className="size-10 inline-block mx-auto"
          />
          <p className="text-[#4E4F52]">
            You'll be redirected to PayPal to complete your secure payment
          </p>
        </div>
      </div>

      {/* Price Summary Section */}
      <div className="max-h-[521px] h-full grid">
        <PriceSummary confirm nextStep={handleConfirm} state={location.state} />
      </div>
    </div>
  );
};
export default Step3;
