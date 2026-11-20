import { format } from "date-fns";
import { formatMoney } from "../currency";
import { localDate, placeName } from "../results/offerFacts";
import { cabinLabel } from "../search/searchDraft";
import { titleCase } from "../travellers/names";
import type { BagOption, CurrencyCode, FlightOffer, Money, TravelerInput, TravelerType } from "../types";

// Extras (mock: Extras): the airline's extra-bag options grouped per direction
// and traveller, the choice summary, and the "already included" line.

const directionLabel = (count: number, index: number) => (count === 2 ? (index === 0 ? "Outbound" : "Return") : count === 1 ? "Outbound" : `Flight ${index + 1}`);
const directionWord = (count: number, index: number) => (count === 2 ? (index === 0 ? "outbound" : "return") : count === 1 ? "" : `flight ${index + 1}`);

const TYPE: Record<TravelerType, string> = { ADULT: "Adult", CHILD: "Child", HELD_INFANT: "Infant on lap", SEATED_INFANT: "Infant in own seat" };

export interface BagChoice {
  /** Null = no extra bag. */
  id: string | null;
  /** Extra bags (0 for "No extra bag"). */
  quantity: number;
  label: string;
  detail: string;
  price: string;
}

export interface BagGroup {
  key: string;
  itineraryIndex: number;
  /** The travellers this group's bags are for ("1", or "1,2"). */
  travelerKey: string;
  /** "Outbound · Tue 15 Dec" */
  title: string;
  /** "Lagos → Casablanca → London Stansted · Adult 1, Adaeze Okafor" */
  subtitle: string;
  choices: BagChoice[];
}

const bagWords = (n: number) => (n === 1 ? "bag" : "bags");
const NUMBER_WORDS = ["No", "One", "Two", "Three", "Four"];

/** One group per direction and traveller(s), "No extra bag" first, then by quantity (mock order). */
export const bagGroups = (options: BagOption[], offer: FlightOffer, travelers: TravelerInput[], currency: CurrencyCode): BagGroup[] => {
  const count = offer.itineraries.length;
  const byKey = new Map<string, BagOption[]>();
  options.forEach((o) => {
    const key = `${o.itineraryIndex}|${o.travelerIds.join(",")}`;
    byKey.set(key, [...(byKey.get(key) ?? []), o]);
  });
  return [...byKey.entries()]
    .sort(([a], [b]) => Number(a.split("|")[0]) - Number(b.split("|")[0]))
    .map(([key, group]) => {
      const index = group[0].itineraryIndex;
      const it = offer.itineraries[index];
      const route = [placeName(it.segments[0].from), ...it.segments.map((s) => placeName(s.to))];
      const who = group[0].travelerIds
        .map((id) => {
          const t = travelers.find((x) => x.travelerId === id);
          if (!t) return null;
          const n = travelers.filter((x) => x.type === t.type).indexOf(t) + 1;
          return `${TYPE[t.type]} ${n}, ${titleCase(t.firstName)} ${titleCase(t.lastName)}`;
        })
        .filter(Boolean)
        .join(" · ");
      const choices: BagChoice[] = [
        { id: null, quantity: 0, label: "No extra bag", detail: "Keep your included bag", price: "Free" },
        ...[...group]
          .sort((a, b) => a.quantity - b.quantity)
          .map((o) => {
            const weight = o.weightKg ? ` ${o.weightKg} kg` : "";
            return {
              id: o.id,
              quantity: o.quantity,
              label: `+${o.quantity} ${bagWords(o.quantity)}`,
              detail: `${NUMBER_WORDS[o.quantity] ?? o.quantity} extra${weight} ${bagWords(o.quantity)}`,
              price: formatMoney(o.price.amount, currency),
            };
          }),
      ];
      return {
        key,
        itineraryIndex: index,
        travelerKey: group[0].travelerIds.join(","),
        title: `${directionLabel(count, index)} · ${format(localDate(it.segments[0].from.atLocal), "EEE d MMM")}`,
        subtitle: [route.join(" → "), who].filter(Boolean).join(" · "),
        choices,
      };
    });
};

/** The chosen option id in a group, or null. */
export const chosenIn = (group: BagGroup, chosenIds: string[]) => group.choices.find((c) => c.id && chosenIds.includes(c.id))?.id ?? null;

/**
 * The airline (Amadeus) can't book a different number of extra bags each way
 * for the same traveller: one direction only, or the same number both ways.
 * The quantity this group must match because of the traveller's other flights, or null.
 */
export const lockedQuantity = (group: BagGroup, groups: BagGroup[], chosenIds: string[]) => {
  for (const other of groups) {
    if (other.key === group.key || other.travelerKey !== group.travelerKey) continue;
    const picked = other.choices.find((c) => c.id && chosenIds.includes(c.id));
    if (picked) return picked.quantity;
  }
  return null;
};

/**
 * Picks one option in a group (null clears it), keeping the other groups'
 * choices, except the same traveller's choices on other flights that no
 * longer match (they're cleared rather than left to fail at booking).
 */
export const chooseBag = (group: BagGroup, chosenIds: string[], id: string | null, groups: BagGroup[] = []) => {
  const inGroup = new Set(group.choices.map((c) => c.id).filter(Boolean));
  const quantity = group.choices.find((c) => c.id === id)?.quantity ?? 0;
  const clash = new Set(
    groups
      .filter((g) => g.key !== group.key && g.travelerKey === group.travelerKey && id)
      .flatMap((g) => g.choices.filter((c) => c.id && c.quantity !== quantity).map((c) => c.id as string))
  );
  return [...chosenIds.filter((x) => !inGroup.has(x) && !clash.has(x)), ...(id ? [id] : [])];
};

export const bagsTotal = (options: BagOption[], chosenIds: string[], currency: CurrencyCode): Money => ({
  amount: options
    .filter((o) => chosenIds.includes(o.id))
    .reduce((n, o) => n + Number(o.price.amount), 0)
    .toFixed(2),
  currency,
});

/** "+1 bag outbound, +2 bags return" (Review, Status, Manage). Empty when none. */
export const bagsText = (bags: BagOption[], offer: FlightOffer) =>
  [...bags]
    .sort((a, b) => a.itineraryIndex - b.itineraryIndex)
    .map((b) => [`+${b.quantity}${b.weightKg ? ` × ${b.weightKg} kg` : ""} ${bagWords(b.quantity)}`, directionWord(offer.itineraries.length, b.itineraryIndex)].filter(Boolean).join(" "))
    .join(", ");

/** Mock: "Already included in Eco Essential: 1 checked bag (23 kg) and 1 cabin bag per person, each way." */
export const includedBagsText = (offer: FlightOffer) => {
  const segment = offer.itineraries[0].segments[0];
  const brand = segment.brandedFare ?? cabinLabel(segment.cabin);
  const { checked, cabin } = offer.baggage;
  const part = (q: number | null | undefined, kg: number | null | undefined, word: string) =>
    q ? `${q} ${word} ${bagWords(q)}${kg ? ` (${kg} kg)` : ""}` : null;
  const parts = [part(checked?.quantity, checked?.weightKg, "checked"), part(cabin?.quantity, cabin?.weightKg, "cabin")].filter(Boolean);
  const each = offer.itineraries.length > 1 ? ", each way" : "";
  return { brand, text: parts.length ? `${parts.join(" and ")} per person${each}.` : "No checked bag included." };
};
