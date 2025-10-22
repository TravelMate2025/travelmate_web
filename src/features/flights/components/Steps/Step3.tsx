

import { PriceSummary } from "./Step1";
import { useLocation,  } from "react-router-dom";

import { useStepContext } from "./StepLayout";

import { Icon } from "@iconify/react/dist/iconify.js";

const Step3 = () => {
 
  const { booking,  } = useStepContext();

  const location = useLocation();
  booking.checkoutUrl;
 

 

 
  // 🔹 Submit or confirm action
  const handleConfirm = async () => {
 

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
