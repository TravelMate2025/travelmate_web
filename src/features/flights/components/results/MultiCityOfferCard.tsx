import { useState } from "react";
import { formatMoney } from "../../currency";
import { bagsLabel, offerNotes, perAdultAmount, seatsLabel, type NoteContext } from "../../results/offerFacts";
import type { FlightOffer } from "../../types";
import { FlightDetails } from "./FlightDetails";
import { ItineraryLine } from "./ItineraryLine";
import { AIRLINE_BADGE_CLASS, NOTE_CLASS, SELECT_BUTTON_CLASS, TAG_CLASS } from "./OfferCard";

// Mock (MultiCity card): airline, bags and a note on one line; one numbered
// line per flight; "whole trip, per adult" price and Select on the right.
interface MultiCityOfferCardProps {
  offer: FlightOffer;
  noteContext: NoteContext;
  onSelect: (offer: FlightOffer) => void;
}

export const MultiCityOfferCard = ({ offer, noteContext, onSelect }: MultiCityOfferCardProps) => {
  const [open, setOpen] = useState(false);
  const notes = offerNotes(offer, noteContext);
  const seats = seatsLabel(offer.seatsLeft);
  const detailsId = `details-${offer.offerToken}`;

  return (
    <article
      aria-label={`${offer.validatingAirline.name}, ${formatMoney(perAdultAmount(offer), offer.price.currency)}`}
      className="flex flex-wrap gap-5 rounded-2xl border border-[#DEDFE1] bg-white p-5"
    >
      <div className="flex min-w-0 flex-[999_1_35rem] flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className={AIRLINE_BADGE_CLASS} aria-hidden>
            {offer.validatingAirline.code}
          </span>
          <strong className="text-[#181818]">{offer.validatingAirline.name}</strong>
          <span className={TAG_CLASS}>{bagsLabel(offer)}</span>
          {notes.map((note) => (
            <span key={note} className={NOTE_CLASS}>
              {note}
            </span>
          ))}
        </div>
        {offer.itineraries.map((itinerary, index) => (
          <ItineraryLine key={index} itinerary={itinerary} number={index + 1} compact />
        ))}
      </div>
      <div className="flex flex-[1_1_11.25rem] flex-col items-end justify-between gap-3 border-0 border-l border-l-[#EBECED] pl-5">
        <div className="text-right">
          <div className="text-[1.625rem] font-extrabold leading-tight text-[#181818]">
            {formatMoney(perAdultAmount(offer), offer.price.currency)}
          </div>
          <div className="text-[0.8125rem] text-[#4E4F52]">whole trip, per adult</div>
          {seats && <div className="mt-1 text-[0.8125rem] text-[#4E4F52]">{seats}</div>}
        </div>
        <button type="button" onClick={() => onSelect(offer)} className={SELECT_BUTTON_CLASS}>
          Select
        </button>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={detailsId}
          onClick={() => setOpen((v) => !v)}
          className="min-h-11 cursor-pointer bg-transparent p-0 text-sm font-semibold text-[#023E8A]"
        >
          {open ? "Hide flight details" : "Flight details"}
        </button>
      </div>
      {open && (
        <div id={detailsId} className="basis-full">
          <FlightDetails offer={offer} />
        </div>
      )}
    </article>
  );
};
