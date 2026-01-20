import { Checkbox, Divider, FormControlLabel } from "@mui/material";
import { ArrowRight } from "lucide-react";
import Paypal from "../../../../assets/images/stripe.png";
import { DeskProps } from "../Page";

type PaymentMethodProps = {
  car: any;
} & DeskProps;


const PaymentMethod = ({
  car,
  formData,
  handleCheckboxChange,
}: PaymentMethodProps) => {

  return (
    <div className="lg:px-6 px-4 mt-12">
      <div className="border-[#CDCED1] lg:border rounded-lg p-5">
        <div className="flex items-center gap-1 mb-4">
          <img
            src={Paypal}
            alt="stripe icon"
            className="lg:w-24 w-16 h-6 lg:h-10 object-cover bg-white rounded-lg p-2 border-1 border-[#CDCED1]"
          />
          <p className="font-bold text-lg">Stripe</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-4 bg-[#FAFAFA] rounded-lg lg:p-26 p-12 ">
          <ArrowRight className="font-bold lg:w-12 lg:h-12 h-8 w-8" />
          <p className="text-[#4E4F52]">
            You'll be redirected to Stripe to complete your secure payment
          </p>
        </div>
      </div>

      <p className="text-[14px] font-inter  text-[#181818] py-3 font-bold text-lg lg:text-xl">
        Price Summary
      </p>
      <div className="px-6  border-[#CDCED1] lg:border rounded-lg p-5 flex justify-between items-center w-full">
        <p className="font-bold text-[#4E4F52]">Total</p>
        <p className="font-bold">€{car?.price.totalAmountWithFee}</p>
      </div>

      <Divider
        sx={{ marginTop: "8px", marginBottom: "8px" }}
        className="lg:hidden"
      />

      <div className="px-6 mt-5">
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.agreement}
              onChange={handleCheckboxChange}
            />
          }
          label={
            <p className="text-[11px]">
              I agree to the{" "}
              <span className="text-[#023E8A]">
                booking conditions, TravelMate terms and conditions, and Privacy
                Policy.
              </span>
            </p>
          }
        />
      </div>
    </div>
  );
};

export default PaymentMethod;
