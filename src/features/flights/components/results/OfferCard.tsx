import { useState } from "react";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
import { formatMoney } from "../../currency";
import { bagsLabel, offerNotes, perAdultAmount, seatsLabel, travellerCount, type NoteContext } from "../../results/offerFacts";
import { cabinLabel } from "../../search/searchDraft";
import type { FlightOffer } from "../../types";
import { FlightDetails } from "./FlightDetails";
import { ItineraryLine } from "./ItineraryLine";

// Mock (Results card): white, 16px corners, 20px padding. Left: airline,
// fare brand, one line per direction, bags and orange notes. Right (bordered):
// price per adult, seats, "See fares" and "Flight details".
export const TAG_CLASS = "inline-flex items-center gap-1.5 rounded-full bg-[#F4F6FA] px-2.5 py-1 text-[0.8125rem] font-semibold text-[#4E4F52]";
export const NOTE_CLASS = "inline-flex rounded-full bg-[#FFF1E8] px-2.5 py-1 text-[0.8125rem] font-semibold text-[#9A3412]";
export const AIRLINE_BADGE_CLASS =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.625rem] bg-[#E8EEF7] text-[0.8125rem] font-extrabold text-[#023E8A]";
export const SELECT_BUTTON_CLASS =
  "inline-flex min-h-11.5 cursor-pointer items-center justify-center self-stretch rounded-xl bg-[#023E8A] px-5.5 font-bold text-white hover:bg-[#012A5D]";

interface OfferCardProps {
  offer: FlightOffer;
  noteContext: NoteContext;
  onSelect: (offer: FlightOffer) => void;
}

export const OfferCard = ({ offer, noteContext, onSelect }: OfferCardProps) => {
  const [open, setOpen] = useState(false);
  const firstSegment = offer.itineraries[0].segments[0];
  const brand = firstSegment.brandedFare ?? cabinLabel(firstSegment.cabin);
  const notes = offerNotes(offer, noteContext);
  const trip = offer.itineraries.length === 2 ? "round trip" : "one-way";
  const travellers = travellerCount(offer);
  const seats = seatsLabel(offer.seatsLeft);
  const detailsId = `details-${offer.offerToken}`;

  return (
    <article
      aria-label={`${offer.validatingAirline.name}, ${formatMoney(perAdultAmount(offer), offer.price.currency)}`}
      className="flex flex-wrap gap-5 rounded-2xl border border-[#DEDFE1] bg-white p-5"
    >
      <div className="flex min-w-0 flex-[999_1_30rem] flex-col gap-3.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className={AIRLINE_BADGE_CLASS} aria-hidden>
            {offer.validatingAirline.code}
          </span>
          <strong className="text-base text-[#181818]">{offer.validatingAirline.name}</strong>
          <span className={TAG_CLASS}>{brand}</span>
        </div>
        {offer.itineraries.map((itinerary, index) => (
          <ItineraryLine key={index} itinerary={itinerary} />
        ))}
        <div className="flex flex-wrap gap-2">
          <span className={TAG_CLASS}>
            <LuggageOutlinedIcon aria-hidden className="!h-3.5 !w-3.5" />
            {bagsLabel(offer)}
          </span>
          {notes.map((note) => (
            <span key={note} className={NOTE_CLASS}>
              {note}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-[1_1_11.25rem] flex-col items-end justify-between gap-3 border-0 border-l border-l-[#EBECED] pl-5">
        <div className="text-right">
          <div className="text-[1.625rem] font-extrabold leading-tight text-[#181818]">
            {formatMoney(perAdultAmount(offer), offer.price.currency)}
          </div>
          <div className="text-[0.8125rem] text-[#4E4F52]">per adult, {trip}</div>
          {travellers > 1 && (
            <div className="text-[0.8125rem] text-[#4E4F52]">
              {formatMoney(offer.price.amount, offer.price.currency)} total for {travellers} travellers
            </div>
          )}
          {seats && <div className="mt-1 text-[0.8125rem] text-[#4E4F52]">{seats}</div>}
        </div>
        <button type="button" onClick={() => onSelect(offer)} className={SELECT_BUTTON_CLASS}>
          See fares
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
