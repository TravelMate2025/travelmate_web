import { flightBookingSteps } from "../bookingSteps";
import type { FlightStepKey } from "../../shared/booking/bookingFlowLabels";

// Mock: numbered step pills above each booking screen. Steps come from config
// (R1 has no Extras step).
export const BookingSteps = ({ current }: { current: FlightStepKey }) => {
  const steps = flightBookingSteps();
  return (
    <nav aria-label="Booking steps">
      <ol className="m-0 flex list-none flex-wrap gap-2 p-0 text-sm font-semibold">
        {steps.map((step, index) => {
          const active = step.key === current;
          return (
            <li
              key={step.key}
              aria-current={active ? "step" : undefined}
              className={`rounded-full px-3 py-1.5 ${active ? "bg-[#023E8A] text-white" : "border border-[#DEDFE1] bg-white text-[#4E4F52]"}`}
            >
              {index + 1} {step.label}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
