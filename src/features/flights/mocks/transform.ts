import type {
  BagOption,
  CurrencyCode,
  FareOption,
  FlightOffer,
  Money,
  OfferPrice,
} from "../types";

// DEV ONLY. Recorded fares are in USD; these rates exist so NGN/GBP screens
// can be built before TravelMate's exchange-rate table exists. They are not
// TravelMate rates and never reach production (the live API prices on the server).
export const DEV_ONLY_RATES_FROM_USD: Record<CurrencyCode, number> = { USD: 1, NGN: 1550, GBP: 0.79 };

export const convertAmount = (usdAmount: string, currency: CurrencyCode) =>
  (Number(usdAmount) * DEV_ONLY_RATES_FROM_USD[currency]).toFixed(2);

const convertMoney = (money: Money, currency: CurrencyCode): Money =>
  money.currency === currency ? money : { amount: convertAmount(money.amount, currency), currency };

const convertPrice = (price: OfferPrice, currency: CurrencyCode): OfferPrice =>
  price.currency === currency
    ? price
    : {
        amount: convertAmount(price.amount, currency),
        currency,
        perTraveler: price.perTraveler.map((t) => ({ ...t, amount: convertAmount(t.amount, currency) })),
        breakdown: {
          base: convertAmount(price.breakdown.base, currency),
          taxesAndFees: convertAmount(price.breakdown.taxesAndFees, currency),
        },
      };

export const offerInCurrency = (offer: FlightOffer, currency: CurrencyCode): FlightOffer => ({
  ...offer,
  price: convertPrice(offer.price, currency),
  fareConditions: {
    ...offer.fareConditions,
    changePenalty: offer.fareConditions.changePenalty && convertMoney(offer.fareConditions.changePenalty, currency),
  },
});

export const bagInCurrency = (bag: BagOption, currency: CurrencyCode): BagOption => ({
  ...bag,
  price: convertMoney(bag.price, currency),
});

export const fareOptionInCurrency = (option: FareOption, currency: CurrencyCode): FareOption => ({
  ...option,
  price: convertMoney(option.price, currency),
  priceDifference: convertAmount(option.priceDifference, currency),
  fareConditions: {
    ...option.fareConditions,
    changePenalty: option.fareConditions.changePenalty && convertMoney(option.fareConditions.changePenalty, currency),
  },
});

export const moneyInCurrency = convertMoney;

// ---------------------------------------------------------------- dates

const DAY_MS = 86_400_000;

/** Whole days from `from` to `to`, both YYYY-MM-DD. */
export const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS);

/** Shifts a local "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ss" by whole days, keeping the format. */
export const shiftLocal = (local: string, days: number) => {
  if (days === 0) return local;
  const hasTime = local.includes("T");
  const shifted = new Date(Date.parse(hasTime ? `${local}Z` : `${local}T00:00:00Z`) + days * DAY_MS).toISOString();
  return hasTime ? shifted.slice(0, 19) : shifted.slice(0, 10);
};

/** Moves each itinerary by its own day offset (one per searched leg). */
export const shiftOffer = (offer: FlightOffer, dayOffsets: number[]): FlightOffer => ({
  ...offer,
  itineraries: offer.itineraries.map((itinerary, index) => {
    const days = dayOffsets[index] ?? 0;
    return {
      ...itinerary,
      segments: itinerary.segments.map((segment) => ({
        ...segment,
        from: { ...segment.from, atLocal: shiftLocal(segment.from.atLocal, days) },
        to: { ...segment.to, atLocal: shiftLocal(segment.to.atLocal, days) },
      })),
    };
  }),
  lastTicketingAt: offer.lastTicketingAt && shiftLocal(offer.lastTicketingAt, dayOffsets[0] ?? 0),
});
