import { bookingFlowRoutes } from "../shared/bookingFlowRoutes";
import { flightStepLabel, flightStepTitle, type FlightStepKey } from "../shared/booking/bookingFlowLabels";

export interface FlightBookingStep {
  key: FlightStepKey;
  label: string;
  title: string;
  path: string;
}

// Which optional steps are on. R1 ships without Extras (paid bags arrive in R2,
// phase W9); seats are R3 and not a step yet.
export const FLIGHT_FEATURES = {
  extras: false,
} as const;

export const flightBookingSteps = (features: { extras: boolean } = FLIGHT_FEATURES): FlightBookingStep[] => {
  const steps: [FlightStepKey, string][] = [
    ["flight", bookingFlowRoutes.flightResults],
    ["fare", bookingFlowRoutes.flightFare],
    ["travellers", bookingFlowRoutes.flightTravellers],
    ...(features.extras ? ([["extras", bookingFlowRoutes.flightExtras]] as [FlightStepKey, string][]) : []),
    ["pay", bookingFlowRoutes.flightReviewAndPay],
  ];
  return steps.map(([key, path]) => ({ key, label: flightStepLabel(key), title: flightStepTitle(key), path }));
};
