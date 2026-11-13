import { formatMoney } from "../../currency";
import { bestForBagsToken, fareRows, fareTagline, type FareRow } from "../../results/fareRows";
import { cabinLabel } from "../../search/searchDraft";
import type { FareOption, FlightOffer, Money } from "../../types";

export interface FareCardModel {
  key: string;
  option: FareOption | null;
  name: string;
  tagline: string;
  price: Money;
  difference: string;
  rows: FareRow[];
  selected: boolean;
  badge: string | null;
}

const brandOf = (offer: FlightOffer) => offer.itineraries[0].segments[0].brandedFare ?? cabinLabel(offer.itineraries[0].segments[0].cabin);

/** The fare families as cards (cheapest first), or the chosen fare alone when the airline offers none. */
export const buildFareCards = (
  options: FareOption[] | null,
  offer: FlightOffer,
  isChosen: (option: FareOption) => boolean
): FareCardModel[] => {
  if (!options || options.length === 0) {
    return [
      {
        key: offer.offerToken,
        option: null,
        name: brandOf(offer),
        tagline: "Your chosen fare",
        price: { amount: offer.price.amount, currency: offer.price.currency },
        difference: "",
        rows: fareRows(offer),
        selected: true,
        badge: null,
      },
    ];
  }
  const sorted = [...options].sort((a, b) => Number(a.price.amount) - Number(b.price.amount));
  const cheapest = sorted[0];
  const bestForBags = bestForBagsToken(sorted);
  return sorted.map((option) => ({
    key: option.offerToken,
    option,
    name: option.brandName,
    tagline: fareTagline(option, cheapest),
    price: option.price,
    difference: option.offerToken === cheapest.offerToken ? "included" : `+${formatMoney(option.priceDifference, option.price.currency)}`,
    rows: fareRows(option),
    selected: isChosen(option),
    badge: option.offerToken === bestForBags ? "Best value for bags" : null,
  }));
};

/** "Lagos ⇄ London · Royal Air Maroc · Eco Essential" (mock: PriceChanged). */
export const offerSummary = (offer: FlightOffer) => {
  const [out, back] = offer.itineraries;
  const from = out.segments[0].from.city;
  const to = out.segments[out.segments.length - 1].to.city;
  const route = offer.itineraries.length === 2 && back ? `${from} ⇄ ${to}` : `${from} → ${to}`;
  return `${route} · ${offer.validatingAirline.name} · ${brandOf(offer)}`;
};
