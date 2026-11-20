import { MAX_SEATED_TRAVELLERS, seatedTravellers, type SearchDraft } from "./searchDraft";

/**
 * Field keys: `leg{i}.origin`, `leg{i}.destination`, `leg{i}.date`, `returnDate`,
 * `passengers`. Empty object = valid. `today` is the user's local date (YYYY-MM-DD).
 */
export type SearchErrors = Partial<Record<string, string>>;

export const validateSearch = (draft: SearchDraft, today: string): SearchErrors => {
  const errors: SearchErrors = {};
  const legs = draft.tripType === "MULTI_CITY" ? draft.legs : draft.legs.slice(0, 1);

  legs.forEach((leg, i) => {
    if (!leg.origin) errors[`leg${i}.origin`] = "Choose where you're flying from";
    if (!leg.destination) errors[`leg${i}.destination`] = "Choose where you're flying to";
    if (leg.origin && leg.destination && leg.origin.cityCode === leg.destination.cityCode) {
      errors[`leg${i}.destination`] = "From and To can't be the same city";
    }
    if (!leg.date) {
      errors[`leg${i}.date`] = "Choose a date";
    } else if (leg.date < today) {
      errors[`leg${i}.date`] = "This date has passed";
    } else if (i > 0) {
      const previous = legs[i - 1].date;
      if (previous && leg.date < previous) errors[`leg${i}.date`] = "Can't be before the previous flight";
    }
  });

  if (draft.tripType === "RETURN") {
    const departure = draft.legs[0]?.date;
    if (!draft.returnDate) errors.returnDate = "Choose a return date";
    else if (departure && draft.returnDate < departure) errors.returnDate = "Return can't be before departure";
  }

  const p = draft.passengers;
  if (p.adults < 1) errors.passengers = "At least one adult must travel";
  else if (seatedTravellers(p) > MAX_SEATED_TRAVELLERS) errors.passengers = `Up to ${MAX_SEATED_TRAVELLERS} travellers with a seat per booking`;
  else if (p.heldInfants > p.adults) errors.passengers = "Each infant on a lap needs their own adult";

  return errors;
};
