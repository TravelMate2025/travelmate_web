import type { Amenity, BaggageAllowance, FareConditions, FareOption, FlightOffer } from "../types";

// The rows on a fare card (mock: Fares): "Included 1 checked bag, 23 kg",
// "For a fee Choose your seat", "No Refunds", ... Built from the airline's
// amenities (branded fares), falling back to the fare conditions.

export type RowTone = "yes" | "fee" | "no";
export interface FareRow {
  state: "Included" | "For a fee" | "Free" | "No";
  tone: RowTone;
  text: string;
}

export interface FareFacts {
  baggage: BaggageAllowance;
  amenities: Amenity[];
  fareConditions: FareConditions;
}

const kg = (description: string) => description.match(/(\d+)\s*kgs?\b/i)?.[1] ?? null;
const has = (amenities: Amenity[], pattern: RegExp) => amenities.filter((a) => pattern.test(a.description));
const included = (text: string): FareRow => ({ state: "Included", tone: "yes", text });
const fee = (text: string): FareRow => ({ state: "For a fee", tone: "fee", text });

/** "before and after departure" when the airline lists both with the same terms. */
const timing = (list: Amenity[]) => {
  const before = list.some((a) => /before/i.test(a.description));
  const after = list.some((a) => /after/i.test(a.description));
  return before && after ? " before and after departure" : before ? " before departure" : after ? " after departure" : "";
};

export const fareRows = ({ baggage, amenities, fareConditions }: FareFacts): FareRow[] => {
  const rows: FareRow[] = [];

  const checked = baggage.checked?.quantity ?? 0;
  const checkedKg = baggage.checked?.weightKg ?? kg(has(amenities, /checked bag/i)[0]?.description ?? "");
  if (checked > 0) {
    const weight = checkedKg ? (checked === 1 ? `, ${checkedKg} kg` : `, ${checkedKg} kg each`) : "";
    rows.push(included(`${checked} checked ${checked === 1 ? "bag" : "bags"}${weight}`));
  } else {
    rows.push({ state: "No", tone: "no", text: "Checked bag" });
  }

  if (baggage.cabin?.quantity) {
    const cabinKg = baggage.cabin.weightKg ?? kg(has(amenities, /carry on|cabin|hand baggage/i)[0]?.description ?? "");
    rows.push(included(cabinKg ? `Cabin bag, ${cabinKg} kg` : "Cabin bag"));
  }

  const meal = amenities.find((a) => a.kind === "MEAL");
  if (meal) rows.push(meal.chargeable ? fee("Meal and drinks") : included("Meal and drinks"));

  const seat = amenities.find((a) => a.kind === "SEAT");
  if (seat) rows.push(seat.chargeable ? fee("Choose your seat") : included("Choose your seat"));

  const changes = has(amenities, /^change/i);
  if (changes.length) {
    const free = changes.every((a) => !a.chargeable);
    rows.push({ state: free ? "Free" : "For a fee", tone: free ? "yes" : "fee", text: `Changes${timing(changes)}` });
  } else {
    const { changeable, changePenalty } = fareConditions;
    rows.push(!changeable ? { state: "No", tone: "no", text: "Changes" } : changePenalty ? fee("Changes") : { state: "Free", tone: "yes", text: "Changes" });
  }

  const refunds = has(amenities, /^refund/i);
  if (refunds.length) {
    const free = refunds.every((a) => !a.chargeable);
    rows.push({ state: free ? "Free" : "For a fee", tone: free ? "yes" : "fee", text: `Refunds${timing(refunds)}` });
  } else {
    rows.push(fareConditions.refundable ? included("Refunds") : { state: "No", tone: "no", text: "Refunds" });
  }

  const priority = has(amenities, /priority/i);
  if (priority.length) {
    const what = ["check-in", "boarding"].filter((w) => priority.some((a) => a.description.toLowerCase().replace(" ", "").includes(w.replace("-", ""))));
    const text = `Priority ${what.length ? what.join(" and ") : "service"}`;
    rows.push(priority.every((a) => !a.chargeable) ? included(text) : fee(text));
  }

  const miles = amenities.find((a) => a.kind === "MILES");
  const percent = miles?.description.match(/(\d+)\s*percent/i)?.[1];
  if (miles) rows.push(included(percent ? `${percent}% miles earned` : miles.description));

  return rows;
};

export const rowsForOffer = (offer: FlightOffer) => fareRows(offer);

// ---------------------------------------------------------------- comparing fare options

const freeOf = (rows: FareRow[], prefix: string) => rows.some((r) => r.text.startsWith(prefix) && r.tone === "yes");
const bagCount = (o: FareOption) => o.baggage.checked?.quantity ?? 0;

/** Mock taglines: "Lowest price", "More bags, free seat choice", "Change or cancel freely". */
export const fareTagline = (option: FareOption, cheapest: FareOption) => {
  if (option.offerToken === cheapest.offerToken) return "Lowest price";
  const rows = fareRows(option);
  const base = fareRows(cheapest);
  if (freeOf(rows, "Changes") && freeOf(rows, "Refunds")) return "Change or cancel freely";
  const gains = [
    bagCount(option) > bagCount(cheapest) ? "more bags" : null,
    freeOf(rows, "Choose your seat") && !freeOf(base, "Choose your seat") ? "free seat choice" : null,
    freeOf(rows, "Changes") && !freeOf(base, "Changes") ? "free changes" : null,
  ].filter((g): g is string => g !== null);
  const text = gains.length ? gains.join(", ") : "More included";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/** Mock badge "Best value for bags": the cheapest option with more checked bags than the lowest fare. */
export const bestForBagsToken = (options: FareOption[]) => {
  if (options.length < 2) return null;
  const sorted = [...options].sort((a, b) => Number(a.price.amount) - Number(b.price.amount));
  const cheapest = sorted[0];
  return sorted.find((o) => bagCount(o) > bagCount(cheapest))?.offerToken ?? null;
};
