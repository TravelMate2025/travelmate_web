import { Link } from "react-router-dom";
import { flightBookingSteps } from "../bookingSteps";
import type { FlightStepKey } from "../../shared/booking/bookingFlowLabels";

// Mock: numbered step pills. Done steps link back with a tick ("1 Flight ✓"),
// the current one is solid blue, later ones are outlined. Steps come from
// config (R1 has no Extras step).
const PILL = "rounded-full px-3 py-1.5";

interface BookingStepsProps {
  current: FlightStepKey;
  /** Where each done step goes back to (e.g. the results page). */
  backTo?: Partial<Record<FlightStepKey, string>>;
}

export const BookingSteps = ({ current, backTo = {} }: BookingStepsProps) => {
  const steps = flightBookingSteps();
  const currentIndex = steps.findIndex((s) => s.key === current);
  return (
    <nav aria-label="Booking steps">
      <ol className="m-0 flex list-none flex-wrap gap-2 p-0 text-sm font-semibold">
        {steps.map((step, index) => {
          const label = `${index + 1} ${step.label}`;
          if (index < currentIndex) {
            const to = backTo[step.key];
            const doneClass = `${PILL} bg-[#E8EEF7] text-[#023E8A] no-underline`;
            return (
              <li key={step.key}>
                {to ? (
                  <Link to={to} className={doneClass}>
                    {label} ✓
                  </Link>
                ) : (
                  <span className={doneClass}>{label} ✓</span>
                )}
              </li>
            );
          }
          return (
            <li
              key={step.key}
              aria-current={index === currentIndex ? "step" : undefined}
              className={`${PILL} ${index === currentIndex ? "bg-[#023E8A] text-white" : "border border-[#DEDFE1] bg-white text-[#4E4F52]"}`}
            >
              {label}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
