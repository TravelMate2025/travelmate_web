import * as React from "react";
import Box from "@mui/material/Box";


import { IconButton,  } from "@mui/material";

import { Icon } from "@iconify/react";
import CustomStepper from "./CustomStepper";
import { BookingResponse, Passenger } from "../../types";
import { useNavigate } from "react-router-dom";

const steps = ["Flight Overview", "Passenger Information", "Payment"];

interface StepContextType {
  activeStep: number;
  nextStep: () => void;
  prevStep: () => void;
  updateBooking: (booking: {
    id: string;
    checkoutUrl: string;
    booking?: BookingResponse;
    passengers?: Passenger[];
    contact?: {
      email: string;
      phone: string;
    };
  }) => void;
  goToStep: (step: number) => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  booking: {
    id: string;
    checkoutUrl: string;
    booking?: BookingResponse;
    passengers?: Passenger[];
    contact?: {
      email: string;
      phone: string;
    };
  };
}


const StepContext = React.createContext<StepContextType | undefined>(undefined);

export const useStepContext = () => {
  const ctx = React.useContext(StepContext);
  if (!ctx) throw new Error("useStepContext must be used inside StepLayout");
  return ctx;
};

export interface FormValues {
  flightNumber: string;
  passengerName: string;
  cardNumber: string;
}

// ✅ One global schema with all fields


interface StepLayoutProps {
  children: React.ReactNode;
}

export default function StepLayout({ children }: StepLayoutProps) {
  const [activeStep, setActiveStep] = React.useState(0);
  
const [booking, setBooking] = React.useState<{
  id: string;
  checkoutUrl: string;
  booking?: BookingResponse;
  passengers?: Passenger[];
  contact?: {
    email: string;
    phone: string;
  };
}>({ id: "", checkoutUrl: "" });

const navigate =  useNavigate()
  const nextStep = () =>
    setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));

  const prevStep = () => {
    if (activeStep === 0) {
      navigate(-1)
      return
    }
    setActiveStep((prev) => (prev > 0 ? prev - 1 : prev))
  };

  const updateBooking = (booking: {
    id: string;
    checkoutUrl: string;
    booking?: BookingResponse;
    passengers?: Passenger[];
    contact?: {
      email: string;
      phone: string;
    };
  }) => setBooking(booking);
  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setActiveStep(step);
    }
  };

  const value: StepContextType = {
    activeStep,
    nextStep,
    prevStep,
    goToStep,
    booking,
    updateBooking,
    isLastStep: activeStep === steps.length - 1,
    isFirstStep: activeStep === 0,
   
  };



  return (
    // <FormProvider {...methods}>
    <StepContext.Provider value={value}>
      <Box sx={{ width: "100%" }}>
        <div className="flex items-center mb-4">
          <IconButton
            sx={{
              borderRadius: 2,
              boxShadow: "0 0 6px rgba(0, 0, 0, 0.2)",
              display: {
                xs: "block",
                sm: "none",
              },
            }}
            onClick={prevStep}
          >
            <Icon
              icon="ic:outline-arrow-back-ios-new"
              width="24"
              color="black"
              height="24"
            />
          </IconButton>
          <div className="flex-1 ">
            <p className="font-semibold text-center md:hidden text-xl text-[#181818]">
              {steps[activeStep]}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <IconButton
            // disabled={activeStep === 0}
            onClick={prevStep}
            sx={{
              borderRadius: 2,
              boxShadow: "0 0 6px rgba(0, 0, 0, 0.2)",
              display: {
                xs: "none",
                md: "block",
              },
              color: activeStep === 0 ? "#9e9e9e" : "black", // greyed out when disabled
              cursor: activeStep === 0 ? "not-allowed" : "pointer", // optional UX tweak
              "&.Mui-disabled": {
                opacity: 0.5,
                boxShadow: "none", // remove shadow when disabled (optional)
              },
            }}
          >
            <Icon
              icon="ic:outline-arrow-back-ios-new"
              width="24"
              height="24"
              color={ "black"} // adjust icon color when disabled
            />
          </IconButton>

          <div className="flex-1 flex justify-center items-center">
            <CustomStepper
              steps={steps.map((step) => {
                return { label: step };
              })}
              activeStep={activeStep}
            />
          </div>
        </div>

        <Box sx={{ mt: 4 }}>{children}</Box>
      </Box>
    </StepContext.Provider>
    // </FormProvider>
  );
}
