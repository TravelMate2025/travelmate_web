import * as React from "react";
import Box from "@mui/material/Box";

import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IconButton, StepConnector, stepConnectorClasses, styled } from "@mui/material";

import { Icon } from "@iconify/react";
import CustomStepper from "./CustomStepper";
import { BookingResponse, Passenger } from "../../../types";

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
const validationSchema: yup.ObjectSchema<FormValues> = yup.object({
  flightNumber: yup.string().required("Flight number is required"),
  passengerName: yup.string().required("Passenger name is required"),
  cardNumber: yup
    .string()
    .required("Card number is required")
    .matches(/^\d{16}$/, "Card number must be 16 digits"),

});

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
  const methods = useForm<FormValues>({
    defaultValues: {
      flightNumber: "",
      passengerName: "",
      cardNumber: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const nextStep = () =>
    setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));

  const prevStep = () => setActiveStep((prev) => (prev > 0 ? prev - 1 : prev));

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

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("✅ Final Submission:", data);
    alert("Form submitted successfully!");
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
                  md: "none",
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
              sx={{
                borderRadius: 2,
                boxShadow: "0 0 6px rgba(0, 0, 0, 0.2)",
                display: {
                  xs: "none",
                  md: "block",
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
            <div className="flex-1 flex justify-center items-center">
              <CustomStepper
                steps={steps.map((step) => {
                  return { label: step };
                })}
                activeStep={activeStep}
              />
            </div>
          </div>

          <Box
       
            sx={{ mt: 4 }}
          
          >
            {children}
          </Box>
        </Box>
      </StepContext.Provider>
    // </FormProvider>
  );
}
