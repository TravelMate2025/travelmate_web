import { bookingFlowRoutes } from "../shared/bookingFlowRoutes";
import { flightStepLabel, flightStepTitle, type FlightStepKey } from "../shared/booking/bookingFlowLabels";

export interface FlightBookingStep {
  key: FlightStepKey;
  label: string;
  title: string;
  path: string;
}

// Which optional steps are on. Extras (paid bags, R2) is switched on with
// VITE_FLIGHTS_EXTRAS=on once the backend sells bags (F-phase "bags"); seats are
// R3 and not a step yet.
export const FLIGHT_FEATURES = {
  extras: import.meta.env.VITE_FLIGHTS_EXTRAS === "on",
} as const;

/** Extras is a step only when it's switched on and the airline sells bags for this offer. */
export const hasExtrasStep = (bagOptions: readonly unknown[] | null | undefined) => FLIGHT_FEATURES.extras && (bagOptions?.length ?? 0) > 0;

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
