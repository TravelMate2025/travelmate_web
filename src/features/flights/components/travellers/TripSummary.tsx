import { formatMoney } from "../../currency";
import { fareRows } from "../../results/fareRows";
import { dayDifference, localDate, timeOf } from "../../results/offerFacts";
import type { FlightOffer, TravelerType } from "../../types";
import { format } from "date-fns";
import { offerSummary } from "../fare/fareCards";

// Mock (Travelers aside, "Your trip"): route, airline and fare, the flights,
// the price by traveller type with fare and taxes, the total, and what's included.
const TYPE_LABEL: Record<TravelerType, [string, string]> = {
  ADULT: ["adult", "adults"],
  CHILD: ["child", "children"],
  HELD_INFANT: ["infant on lap", "infants on lap"],
  SEATED_INFANT: ["infant in own seat", "infants in own seat"],
};

const legLine = (offer: FlightOffer, index: number) => {
  const it = offer.itineraries[index];
  const first = it.segments[0];
  const last = it.segments[it.segments.length - 1];
  const plus = dayDifference(first.from.atLocal, last.to.atLocal);
  const label = offer.itineraries.length === 2 ? (index === 0 ? "Out" : "Back") : offer.itineraries.length === 1 ? "Out" : `Flight ${index + 1}`;
  return {
    label,
    text: `${format(localDate(first.from.atLocal), "EEE d MMM")} · ${timeOf(first.from.atLocal)} ${first.from.iata} → ${timeOf(last.to.atLocal)}${
      plus > 0 ? `+${plus}` : ""
    } ${last.to.iata}`,
  };
};

export const TripSummary = ({ offer }: { offer: FlightOffer }) => {
  const [route, airline, fare] = offerSummary(offer).split(" · ");
  const currency = offer.price.currency;
  const included = fareRows(offer)
    .filter((r) => r.tone === "yes" && !/miles/i.test(r.text))
    .map((r) => r.text.charAt(0).toLowerCase() + r.text.slice(1));

  return (
    <aside aria-label="Trip summary" className="flex flex-[1_1_18.75rem] flex-col gap-3.5 self-start rounded-2xl border border-[#DEDFE1] bg-white p-5">
      <h2 className="text-[1.0625rem] font-bold text-[#181818]">Your trip</h2>
      <div>
        <div className="font-bold text-[#181818]">{route}</div>
        <div className="text-[0.8125rem] text-[#4E4F52]">
          {airline} · {fare}
        </div>
      </div>
      <div className="text-sm leading-normal text-[#181818]">
        {offer.itineraries.map((_, i) => {
          const line = legLine(offer, i);
          return (
            <div key={i}>
              <strong>{line.label}</strong> {line.text}
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-1.5 border-0 border-t border-t-[#EBECED] pt-3 text-[0.9375rem]">
        {offer.price.perTraveler.map((t) => (
          <div key={t.type} className="flex justify-between">
            <span>
              {t.count} {TYPE_LABEL[t.type][t.count === 1 ? 0 : 1]}
            </span>
            <span>{formatMoney((Number(t.amount) * t.count).toFixed(2), currency)}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm text-[#4E4F52]">
          <span>Fare</span>
          <span>{formatMoney(offer.price.breakdown.base, currency)}</span>
        </div>
        <div className="flex justify-between text-sm text-[#4E4F52]">
          <span>Taxes and fees</span>
          <span>{formatMoney(offer.price.breakdown.taxesAndFees, currency)}</span>
        </div>
        <div className="flex justify-between border-0 border-t border-t-[#EBECED] pt-2 text-lg font-extrabold text-[#181818]">
          <span>Total</span>
          <span>{formatMoney(offer.price.amount, currency)}</span>
        </div>
      </div>
      {included.length > 0 && <p className="text-[0.8125rem] text-[#4E4F52]">Included: {included.join(", ")}.</p>}
    </aside>
  );
};
