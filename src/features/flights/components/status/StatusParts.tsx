import CheckIcon from "@mui/icons-material/Check";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { format } from "date-fns";
import { formatMoney } from "../../currency";
import type { ProgressStep } from "../../booking/bookingStatus";
import { dayDifference, layoversOf, localDate, timeOf } from "../../results/offerFacts";
import { titleCase } from "../../travellers/names";
import type { FlightBooking, TravelerType } from "../../types";

// Pieces of the booking status page (mock: Status).
const HINT = "text-[0.8125rem] text-[#4E4F52]";
const TYPE: Record<TravelerType, string> = { ADULT: "Adult", CHILD: "Child", HELD_INFANT: "Infant on lap", SEATED_INFANT: "Infant in own seat" };

interface HeroProps {
  tone: "blue" | "green";
  title: string;
  text: string;
}

/** Mock: 56px round icon (blue while issuing, green when done), 28px title. */
export const StatusHero = ({ tone, title, text }: HeroProps) => (
  <div className="flex items-center gap-4">
    <span
      aria-hidden
      className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white ${tone === "green" ? "bg-[#1F7A47]" : "bg-[#023E8A]"}`}
    >
      {tone === "green" ? <CheckIcon /> : <HourglassEmptyIcon />}
    </span>
    <div>
      <h1 className="mb-1 text-[1.75rem] font-bold text-[#181818]">{title}</h1>
      <p className="text-[0.9375rem] text-[#4E4F52]">{text}</p>
    </div>
  </div>
);

/** Mock: TravelMate booking · Airline reference · Paid. */
export const ReferenceBoxes = ({ booking }: { booking: FlightBooking }) => {
  const box = "rounded-xl bg-[#F4F6FA] p-3.5";
  const value = "text-lg font-extrabold text-[#181818]";
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))] gap-3">
      <div className={box}>
        <div className={HINT}>TravelMate booking</div>
        <div className={value}>{booking.reference}</div>
      </div>
      <div className={box}>
        <div className={HINT}>Airline reference ({booking.offer.validatingAirline.name})</div>
        <div className={value}>{booking.pnr ?? "Pending"}</div>
        <div className={HINT}>Use it on the airline's website</div>
      </div>
      {booking.payment && (
        <div className={box}>
          <div className={HINT}>{booking.payment.status === "PAID" ? "Paid" : "Payment"}</div>
          <div className={value}>{formatMoney(booking.payment.amount.amount, booking.payment.amount.currency)}</div>
          <div className={HINT}>Flutterwave</div>
        </div>
      )}
    </div>
  );
};

const dotClass = (state: ProgressStep["state"], size: "lg" | "sm") => {
  const base = size === "lg" ? "mt-0.5 h-4.5 w-4.5" : "mt-0.75 h-4 w-4";
  if (state === "done") return `${base} shrink-0 rounded-full bg-[#1F7A47]`;
  if (state === "now") return `${base} shrink-0 rounded-full border-4 border-[#FF6F1E] bg-white`;
  return `${base} shrink-0 rounded-full border-2 border-[#CDCED1] bg-white`;
};

/** Mock: vertical timeline, green done dots joined by a line, orange ring for "now". */
export const ProgressList = ({ steps, label, compact = false }: { steps: ProgressStep[]; label: string; compact?: boolean }) => (
  <ol aria-label={label} className={`m-0 flex list-none flex-col p-0 ${compact ? "gap-3 text-[0.9375rem]" : ""}`}>
    {steps.map((step, i) => (
      <li
        key={step.title}
        aria-current={step.state === "now" ? "step" : undefined}
        className={compact ? "flex items-start gap-3" : "flex min-h-16 gap-3.5"}
      >
        <div className="flex flex-col items-center">
          <span aria-hidden className={dotClass(step.state, compact ? "sm" : "lg")} />
          {!compact && i < steps.length - 1 && (
            <span aria-hidden className={`w-0.5 flex-1 ${step.state === "done" ? "bg-[#1F7A47]" : "bg-[#DEDFE1]"}`} />
          )}
        </div>
        <div className={compact ? "" : "pb-3.5"}>
          <div className={`font-bold ${step.state === "next" ? "text-[#4E4F52]" : "text-[#181818]"}`}>
            <span className="sr-only">{step.state === "done" ? "Done: " : step.state === "now" ? "In progress: " : "Next: "}</span>
            {step.title}
          </div>
          <div className={HINT}>{step.detail}</div>
        </div>
      </li>
    ))}
  </ol>
);

const directionLabel = (count: number, index: number) => (count === 2 ? (index === 0 ? "Outbound" : "Return") : count === 1 ? "Outbound" : `Flight ${index + 1}`);

/** Mock (Status, "Trip"): each direction, then each traveller with their e-ticket. */
export const TripCard = ({ booking }: { booking: FlightBooking }) => (
  <section aria-labelledby="status-trip-h" className="flex flex-col gap-3.5 rounded-[1.25rem] border border-[#DEDFE1] bg-white p-6">
    <h2 id="status-trip-h" className="text-[1.1875rem] font-bold text-[#181818]">
      Trip
    </h2>
    <div className="grid grid-cols-[repeat(auto-fit,minmax(16.25rem,1fr))] gap-3.5">
      {booking.offer.itineraries.map((it, index) => {
        const first = it.segments[0];
        const last = it.segments[it.segments.length - 1];
        const plus = dayDifference(first.from.atLocal, last.to.atLocal);
        const via = layoversOf(it).map((l) => l.city);
        return (
          <div key={index}>
            <div className={`${HINT} font-bold uppercase`}>
              {directionLabel(booking.offer.itineraries.length, index)} · {format(localDate(first.from.atLocal), "EEE d MMM")}
            </div>
            <div className="font-extrabold text-[#181818]">
              {timeOf(first.from.atLocal)} {first.from.iata} → {timeOf(last.to.atLocal)}
              {plus > 0 ? `+${plus}` : ""} {last.to.iata}
            </div>
            <div className={HINT}>
              {it.segments.map((s) => `${s.marketing.code}${s.marketing.number}`).join(" · ")}
              {via.length ? ` · via ${via.join(", ")}` : " · direct"}
            </div>
          </div>
        );
      })}
    </div>
    <div className="flex flex-col gap-2 border-0 border-t border-t-[#EBECED] pt-3">
      {booking.travelers.map((t) => (
        <div key={t.travelerId} className="flex flex-wrap justify-between gap-2">
          <div>
            <strong>
              {titleCase(t.firstName)} {titleCase(t.lastName)}
            </strong>{" "}
            · {TYPE[t.type]}
          </div>
          <div className={HINT}>
            E-ticket: <strong className="text-[#181818]">{t.ticketNumber ?? "Pending"}</strong>
          </div>
        </div>
      ))}
    </div>
  </section>
);
