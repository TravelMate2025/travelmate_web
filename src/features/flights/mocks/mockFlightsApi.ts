// Fake flights API for building the UI before the backend exists. Serves real
// Amadeus test-host responses (recorded 12 Nov 2026, converted to the v2
// contract by the script noted in mocks/README.md) and imitates server
// behaviour: currency conversion, offers moved to the searched dates, holds
// that expire, payment -> ticketing progress, cancellations. Only loaded when
// VITE_FLIGHTS_API_MODE=mock.
import { bookingFlowRoutes, withQuery } from "../../shared/bookingFlowRoutes";
import type { FlightsApi } from "../api/contract";
import { FlightApiError } from "../api/errors";
import type {
  BagOption,
  BookingRequirements,
  CabinClass,
  CancellationPreview,
  CurrencyCode,
  FareOption,
  FareRuleText,
  FlightBooking,
  FlightOffer,
  FlightSearchCriteria,
  Money,
  PassengerCounts,
  Place,
  TravelerRequirements,
  TravelerType,
} from "../types";
import classFaresFixture from "./fixtures/classFares.json";
import fareOptionsFixture from "./fixtures/fareOptions.json";
import placesFixture from "./fixtures/places.json";
import priceCheckFixture from "./fixtures/priceCheck.json";
import searchesFixture from "./fixtures/searches.json";
import { currentMockScenario } from "./scenarios";
import {
  bagInCurrency,
  daysBetween,
  fareOptionInCurrency,
  moneyInCurrency,
  offerInCurrency,
  shiftOffer,
} from "./transform";

type RecordedSearch = { criteria: FlightSearchCriteria; offers: FlightOffer[] };
type RecordedFareOption = FareOption & { _offer: FlightOffer };

const places = placesFixture as Place[];
const searches = searchesFixture as unknown as Record<string, RecordedSearch>;
const recordedPrice = priceCheckFixture as unknown as {
  offerToken: string;
  requirements: BookingRequirements;
  bagOptions: BagOption[];
  fareRules: FareRuleText[];
};
const recordedFares = fareOptionsFixture as unknown as RecordedFareOption[];

const SEARCH_TTL_MS = 20 * 60_000;
const HOLD_MS = 15 * 60_000;
const SHORT_HOLD_MS = 45_000;

const wait = (ms = 350 + Math.random() * 450) => new Promise((resolve) => setTimeout(resolve, ms));
const isoIn = (ms: number) => new Date(Date.now() + ms).toISOString();

// ---------------------------------------------------------------- session state
// Kept in sessionStorage so a page reload mid-booking behaves like the server.

// `searched` is the offer as the search returned it: price changes are measured
// against it (like the server), so pricing twice never compounds a change.
type CachedOffer = { offer: FlightOffer; searched?: FlightOffer; passengers: PassengerCounts; dayOffsets: number[] };

const load = <T>(key: string, fallback: T): T => {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const save = (key: string, value: unknown) => {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked: the mock keeps working for this page view
  }
};

const OFFERS_KEY = "tm.flights.mockOffers";
const BOOKINGS_KEY = "tm.flights.mockBookings";
const offers: Record<string, CachedOffer> = load(OFFERS_KEY, {});
const bookings: Record<string, FlightBooking> = load(BOOKINGS_KEY, {});
const persist = () => {
  save(OFFERS_KEY, offers);
  save(BOOKINGS_KEY, bookings);
};

// ---------------------------------------------------------------- search

const cityOf = (code: string) => places.find((p) => p.code === code)?.cityCode ?? code;

// A specific airport (LHR) narrows results; a city code or an airport that is
// also its city's code (LOS) matches every airport in that city.
const airportFilter = (code: string) => {
  const place = places.find((p) => p.code === code);
  return place && place.type === "AIRPORT" && place.code !== place.cityCode ? code : null;
};

const sameRoute = (a: FlightSearchCriteria, b: FlightSearchCriteria) =>
  a.tripType === b.tripType &&
  a.legs.length === b.legs.length &&
  a.legs.every(
    (leg, i) => cityOf(leg.origin) === cityOf(b.legs[i].origin) && cityOf(leg.destination) === cityOf(b.legs[i].destination)
  );

const findRecording = (criteria: FlightSearchCriteria): RecordedSearch | null => {
  const matches = Object.values(searches).filter((s) => sameRoute(s.criteria, criteria));
  // Prefer the recording made with the same passenger mix (the family search)
  const samePassengers = matches.find(
    (s) => JSON.stringify(s.criteria.passengers) === JSON.stringify(criteria.passengers)
  );
  return samePassengers ?? matches[0] ?? null;
};

const matchesAirports = (offer: FlightOffer, criteria: FlightSearchCriteria) =>
  offer.itineraries.every((itinerary, i) => {
    const leg = criteria.legs[i];
    const from = airportFilter(leg.origin);
    const to = airportFilter(leg.destination);
    const segments = itinerary.segments;
    return (!from || segments[0].from.iata === from) && (!to || segments[segments.length - 1].to.iata === to);
  });

// ---------------------------------------------------------------- price check helpers

const TRAVELER_ORDER: [keyof PassengerCounts, TravelerType][] = [
  ["adults", "ADULT"],
  ["children", "CHILD"],
  ["heldInfants", "HELD_INFANT"],
  ["seatedInfants", "SEATED_INFANT"],
];

const travelerRequirements = (passengers: PassengerCounts, recorded: TravelerRequirements[]): TravelerRequirements[] => {
  const list: TravelerRequirements[] = [];
  TRAVELER_ORDER.forEach(([key, type]) => {
    for (let i = 0; i < passengers[key]; i += 1) {
      const travelerId = String(list.length + 1);
      const same = recorded.find((r) => r.type === type);
      list.push({
        travelerId,
        type,
        genderRequired: same?.genderRequired ?? false,
        dateOfBirthRequired: same?.dateOfBirthRequired ?? type !== "ADULT", // ages matter for children and infants
        passportRequired: same?.passportRequired ?? false,
        residenceRequired: same?.residenceRequired ?? false,
      });
    }
  });
  return list;
};

// Synthetic: the scenario needs a different price; real changes come from the airline.
const changedPrice = (offer: FlightOffer, factor: number): FlightOffer => {
  const scale = (amount: string) => (Number(amount) * factor).toFixed(2);
  return {
    ...offer,
    price: {
      ...offer.price,
      amount: scale(offer.price.amount),
      perTraveler: offer.price.perTraveler.map((t) => ({ ...t, amount: scale(t.amount) })),
      breakdown: { base: scale(offer.price.breakdown.base), taxesAndFees: offer.price.breakdown.taxesAndFees },
    },
  };
};

const cachedOffer = (offerToken: string) => {
  const cached = offers[offerToken];
  if (!cached) throw new FlightApiError("OFFER_EXPIRED", "This offer has expired. Please search again.");
  if (Date.parse(cached.offer.expiresAt) < Date.now()) {
    throw new FlightApiError("OFFER_EXPIRED", "This offer has expired. Please search again.");
  }
  return cached;
};

// ---------------------------------------------------------------- bookings

const randomCode = (length: number) =>
  Array.from({ length }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");

const sumMoney = (items: Money[], currency: CurrencyCode): Money => ({
  amount: items.reduce((total, m) => total + Number(m.amount), 0).toFixed(2),
  currency,
});

const PAID_TO_TICKETING_MS = 4_000;
const TICKETING_TO_TICKETED_MS = 10_000;

// Status moves on with time the way the server's sync job would move it.
const advance = (booking: FlightBooking): FlightBooking => {
  const scenario = currentMockScenario();
  const now = Date.now();

  if (booking.status === "HELD" && booking.holdExpiresAt && Date.parse(booking.holdExpiresAt) < now) {
    return { ...booking, status: "HOLD_EXPIRED", holdExpiresAt: null };
  }
  if (!booking.payment?.paidAt || !["PAID", "TICKETING"].includes(booking.status)) return booking;

  const sincePaid = now - Date.parse(booking.payment.paidAt);
  if (sincePaid < PAID_TO_TICKETING_MS) return booking;

  if (scenario === "failed-after-payment") {
    return {
      ...booking,
      status: "FAILED",
      failure: { stage: "AFTER_PAYMENT", reason: "The airline didn't confirm the booking." },
      refund: { status: "PROCESSING", amount: booking.payment.amount, startedAt: new Date().toISOString(), completedAt: null },
    };
  }
  if (sincePaid < TICKETING_TO_TICKETED_MS || scenario === "slow-ticketing") {
    return { ...booking, status: "TICKETING" };
  }

  // Synthetic ticket numbers in the real format: airline prefix + 10 digits
  const prefix = booking.offer.validatingAirline.code === "AT" ? "147" : "999";
  const ticketed: FlightBooking = {
    ...booking,
    status: "TICKETED",
    travelers: booking.travelers.map((t, i) => ({
      ...t,
      ticketNumber: `${prefix}-${String(2_400_000_000 + i).padStart(10, "0")}`,
    })),
  };
  if (scenario === "schedule-change") {
    const lastItinerary = booking.offer.itineraries[booking.offer.itineraries.length - 1];
    const segment = lastItinerary.segments[lastItinerary.segments.length - 1];
    ticketed.scheduleChanges = [
      {
        segmentId: segment.id,
        detectedAt: new Date().toISOString(),
        previousDepartureLocal: segment.from.atLocal,
        newDepartureLocal: segment.from.atLocal.replace(/T(\d\d)/, (_, h: string) => `T${String((Number(h) + 2) % 24).padStart(2, "0")}`),
        newArrivalLocal: segment.to.atLocal.replace(/T(\d\d)/, (_, h: string) => `T${String((Number(h) + 2) % 24).padStart(2, "0")}`),
      },
    ];
  }
  return ticketed;
};

const readBooking = (bookingId: string) => {
  const booking = bookings[bookingId];
  if (!booking) throw new FlightApiError("NOT_FOUND", "We couldn't find that booking.");
  const current = advance(booking);
  bookings[bookingId] = current;
  persist();
  return current;
};

const isBeforeTicketing = (booking: FlightBooking) => ["HELD", "PAID", "TICKETING"].includes(booking.status);

// ---------------------------------------------------------------- the API

export const mockFlightsApi: FlightsApi = {
  async searchPlaces(query) {
    await wait(150);
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return places
      .filter((p) => [p.code, p.name, p.city, p.country].some((v) => v.toLowerCase().includes(q)))
      .sort((a, b) => Number(b.code.toLowerCase() === q) - Number(a.code.toLowerCase() === q))
      .slice(0, 8);
  },

  async getPopularRoutes(countryCode, currency) {
    await wait(300);
    // Stand-in for the staff-configured list. "From" prices only where a
    // one-way search was recorded; otherwise null, as the server would send.
    const routesByCountry: Record<string, [string, string][]> = {
      NG: [["LOS", "LON"], ["LOS", "DXB"], ["LOS", "ABV"], ["ABV", "LON"]],
      GB: [["LON", "LOS"], ["LON", "DXB"], ["LON", "ABV"]],
      DEFAULT: [["LOS", "LON"], ["LON", "DXB"], ["LOS", "DXB"]],
    };
    const pairs = routesByCountry[countryCode ?? ""] ?? routesByCountry.DEFAULT;
    const placeFor = (code: string) => places.find((p) => p.code === code) as Place;
    return pairs.map(([origin, destination]) => {
      const recording = Object.values(searches).find(
        (s) => s.criteria.tripType === "ONE_WAY" && cityOf(s.criteria.legs[0].origin) === origin && cityOf(s.criteria.legs[0].destination) === destination
      );
      const cheapest = recording?.offers.reduce<FlightOffer | null>(
        (best, o) => (!best || Number(o.price.amount) < Number(best.price.amount) ? o : best),
        null
      );
      return {
        origin: placeFor(origin),
        destination: placeFor(destination),
        priceFrom: cheapest ? moneyInCurrency({ amount: cheapest.price.amount, currency: cheapest.price.currency }, currency) : null,
      };
    });
  },

  async getClassFares(_countryCode, currency) {
    await wait(300);
    // Recorded per-cabin search, Lagos -> London one-way (see fixtures/classFares.json)
    const placeFor = (code: string) => places.find((p) => p.code === code) as Place;
    return {
      origin: placeFor("LOS"),
      destination: placeFor("LON"),
      fares: (Object.entries(classFaresFixture.cabins) as [CabinClass, { cheapest: string | null }][]).map(([cabin, fare]) => ({
        cabin,
        priceFrom: fare.cheapest ? moneyInCurrency({ amount: fare.cheapest, currency: "USD" }, currency) : null,
      })),
    };
  },

  async getCampaign() {
    await wait(200);
    // Sample so the card can be designed; the live API returns null until staff set one
    return {
      label: "Sample campaign · mock data",
      headline: "Christmas in London",
      body: "A campaign set in the dashboard shows here, with its own route and dates.",
      ctaLabel: "See fares",
      route: { origin: "LOS", destination: "LON" },
    };
  },

  async search(criteria) {
    await wait(900);
    const scenario = currentMockScenario();
    if (scenario === "search-error") throw new FlightApiError("NETWORK", "We couldn't reach TravelMate. Check your connection.");

    const recording = scenario === "no-results" ? null : findRecording(criteria);
    const expiresAt = isoIn(SEARCH_TTL_MS);
    const searchId = `mock-search-${Date.now()}`;
    if (!recording || criteria.cabin !== "ECONOMY") {
      return { searchId, criteria, offers: [], expiresAt };
    }

    const dayOffsets = criteria.legs.map((leg, i) => daysBetween(recording.criteria.legs[i].date, leg.date));
    const results = recording.offers
      .map((offer) => ({ ...shiftOffer(offer, dayOffsets), expiresAt }))
      .filter((offer) => matchesAirports(offer, criteria))
      .filter((offer) => !criteria.nonStop || offer.itineraries.every((it) => it.segments.length === 1));

    results.forEach((offer) => {
      offers[offer.offerToken] = { offer, passengers: criteria.passengers, dayOffsets };
    });
    persist();
    return { searchId, criteria, offers: results.map((o) => offerInCurrency(o, criteria.currency)), expiresAt };
  },

  async getOffer(offerToken, currency) {
    await wait(200);
    return offerInCurrency(cachedOffer(offerToken).offer, currency);
  },

  async priceOffer(offerToken, { currency, includeBags }) {
    await wait(700);
    const scenario = currentMockScenario();
    if (scenario === "offer-expired") throw new FlightApiError("OFFER_EXPIRED", "This offer has expired. Please search again.");
    if (scenario === "sold-out") {
      throw new FlightApiError("OFFER_UNAVAILABLE", "The airline sold the last seats at this price.");
    }

    const cached = cachedOffer(offerToken);
    const recorded = offerToken === recordedPrice.offerToken || offerToken.startsWith("mock-fare-");
    let priced = cached.offer;
    let priceChange = null;
    if (scenario === "price-up" || scenario === "price-down") {
      const searched = cached.searched ?? cached.offer;
      priced = changedPrice(searched, scenario === "price-up" ? 1.05 : 0.97);
      priceChange = {
        previous: moneyInCurrency({ amount: searched.price.amount, currency: searched.price.currency }, currency),
        current: moneyInCurrency({ amount: priced.price.amount, currency: priced.price.currency }, currency),
        direction: scenario === "price-up" ? ("UP" as const) : ("DOWN" as const),
      };
      offers[offerToken] = { ...cached, searched, offer: priced };
      persist();
    }

    return {
      offer: offerInCurrency(priced, currency),
      priceChange,
      requirements: {
        emailRequired: recorded ? recordedPrice.requirements.emailRequired : true,
        mobileRequired: recorded ? recordedPrice.requirements.mobileRequired : true,
        travelers: travelerRequirements(cached.passengers, recorded ? recordedPrice.requirements.travelers : []),
      },
      // Bags and fare rule text were only recorded for the Royal Air Maroc offer
      bagOptions: recorded && includeBags ? recordedPrice.bagOptions.map((b) => bagInCurrency(b, currency)) : [],
      fareRules: recorded ? recordedPrice.fareRules : [],
    };
  },

  async getFareOptions(offerToken, currency) {
    await wait(600);
    const cached = cachedOffer(offerToken);
    if (offerToken !== recordedPrice.offerToken && !offerToken.startsWith("mock-fare-")) return [];

    const basePrice = Number(recordedFares[0].price.amount);
    return recordedFares.map(({ _offer, ...option }) => {
      const offer = { ...shiftOffer(_offer, cached.dayOffsets), expiresAt: cached.offer.expiresAt };
      offers[option.offerToken] = { offer, passengers: cached.passengers, dayOffsets: cached.dayOffsets };
      return fareOptionInCurrency(
        { ...option, priceDifference: (Number(option.price.amount) - basePrice).toFixed(2) },
        currency
      );
    });
  },

  async createBooking(input) {
    await wait(1200);
    const scenario = currentMockScenario();
    if (scenario === "sold-out") throw new FlightApiError("OFFER_UNAVAILABLE", "The airline sold the last seats at this price.");
    const cached = cachedOffer(input.offerToken);
    const offer = offerInCurrency(cached.offer, input.currency);
    const bags = input.bagOptionIds
      .map((id) => recordedPrice.bagOptions.find((b) => b.id === id))
      .filter((b): b is BagOption => Boolean(b))
      .map((b) => bagInCurrency(b, input.currency));

    const id = `mock-bk-${randomCode(8).toLowerCase()}`;
    const booking: FlightBooking = {
      id,
      reference: `TM-FL-${randomCode(6)}`,
      pnr: randomCode(6),
      status: "HELD",
      offer,
      travelers: input.travelers.map((t) => ({
        travelerId: t.travelerId,
        type: t.type,
        firstName: t.firstName,
        lastName: t.lastName,
        ticketNumber: null,
      })),
      contact: input.contact,
      bags,
      total: sumMoney([{ amount: offer.price.amount, currency: input.currency }, ...bags.map((b) => b.price)], input.currency),
      holdExpiresAt: isoIn(scenario === "hold-expired" ? SHORT_HOLD_MS : HOLD_MS),
      payment: null,
      failure: null,
      refund: null,
      scheduleChanges: [],
      createdAt: new Date().toISOString(),
    };
    bookings[id] = booking;
    persist();
    return booking;
  },

  async startCheckout(bookingId) {
    await wait(500);
    const booking = readBooking(bookingId);
    if (booking.status === "HOLD_EXPIRED") throw new FlightApiError("HOLD_EXPIRED", "The time to pay ran out.");
    if (booking.status !== "HELD") throw new FlightApiError("VALIDATION", "This booking can't be paid now.");
    // Stands in for Flutterwave: the payment succeeds and its webhook arrives at once
    bookings[bookingId] = {
      ...booking,
      status: "PAID",
      holdExpiresAt: null,
      payment: { status: "PAID", paidAt: new Date().toISOString(), amount: booking.total },
    };
    persist();
    return {
      checkoutUrl: withQuery(bookingFlowRoutes.flightPaymentReturn, {
        status: "successful",
        tx_ref: booking.reference,
        bookingId,
      }),
    };
  },

  async listBookings() {
    await wait(400);
    return Object.keys(bookings)
      .map(readBooking)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  },

  async getBooking(bookingId) {
    await wait(300);
    return readBooking(bookingId);
  },

  async getCancellationPreview(bookingId): Promise<CancellationPreview> {
    await wait(500);
    const booking = readBooking(bookingId);
    const paid = booking.payment?.amount ?? booking.total;
    if (isBeforeTicketing(booking)) {
      return { kind: "FULL_REFUND", paid, deduction: { amount: "0.00", currency: paid.currency }, refund: paid, requiresAirlineConfirmation: false };
    }
    if (booking.status !== "TICKETED") throw new FlightApiError("VALIDATION", "This booking can't be cancelled.");
    // Estimate from the fare: a non-refundable fare keeps the base, taxes may come back
    const refundable = booking.offer.fareConditions.refundable;
    const taxes = booking.offer.price.breakdown.taxesAndFees;
    return {
      kind: "AIRLINE_REFUND",
      paid,
      deduction: refundable ? null : { amount: booking.offer.price.breakdown.base, currency: paid.currency },
      refund: refundable ? null : { amount: taxes, currency: paid.currency },
      requiresAirlineConfirmation: true,
    };
  },

  async cancelBooking(bookingId) {
    await wait(900);
    const booking = readBooking(bookingId);
    const startedAt = new Date().toISOString();
    if (booking.status === "HELD") {
      bookings[bookingId] = { ...booking, status: "CANCELLED", holdExpiresAt: null };
    } else if (isBeforeTicketing(booking)) {
      const amount = booking.payment?.amount ?? booking.total;
      bookings[bookingId] = { ...booking, status: "CANCELLED", refund: { status: "PROCESSING", amount, startedAt, completedAt: null } };
    } else if (booking.status === "TICKETED") {
      const estimate = { amount: booking.offer.price.breakdown.taxesAndFees, currency: booking.total.currency };
      bookings[bookingId] = {
        ...booking,
        status: "CANCELLATION_REQUESTED",
        refund: { status: "PENDING", amount: estimate, startedAt, completedAt: null },
      };
    } else {
      throw new FlightApiError("VALIDATION", "This booking can't be cancelled.");
    }
    persist();
    return bookings[bookingId];
  },
};
