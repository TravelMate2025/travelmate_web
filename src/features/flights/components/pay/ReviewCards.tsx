import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fareRows, type FareRow } from "../../results/fareRows";
import { dayDifference, formatDuration, layoversOf, localDate, placeName, timeOf } from "../../results/offerFacts";
import { cabinLabel } from "../../search/searchDraft";
import { titleCase } from "../../travellers/names";
import type { ContactInput, FareRuleText, FlightOffer, TravelerSummary, TravelerType } from "../../types";

// Mock (Pay): white cards, 16px corners, 22px padding, 14px gaps; 19px titles.
export const CARD = "flex flex-col gap-3.5 rounded-2xl border border-[#DEDFE1] bg-white p-5.5";
const TITLE = "text-[1.1875rem] font-bold text-[#181818]";
const HINT = "text-[0.8125rem] text-[#4E4F52]";
const LINK = "text-sm font-semibold text-[#023E8A]";

// ---------------------------------------------------------------- flights

const directionLabel = (offer: FlightOffer, index: number) =>
  offer.itineraries.length === 2 ? (index === 0 ? "Outbound" : "Return") : offer.itineraries.length === 1 ? "Outbound" : `Flight ${index + 1}`;

/** "AT556 to Casablanca · AT808 to London Stansted · 12h 15m" (with "overnight" between flights when it is) */
const flightsLine = (offer: FlightOffer, index: number) => {
  const itinerary = offer.itineraries[index];
  const layovers = layoversOf(itinerary);
  const parts: string[] = [];
  itinerary.segments.forEach((s, i) => {
    if (i > 0 && layovers[i - 1].overnight) parts.push("overnight");
    parts.push(`${s.marketing.code}${s.marketing.number} to ${placeName(s.to)}`);
  });
  return [...parts, formatDuration(itinerary.durationMinutes)].join(" · ");
};

/** Mock "Heads up": arriving and returning through different airports of one city. */
const airportWarning = (offer: FlightOffer) => {
  if (offer.itineraries.length !== 2) return null;
  const [out, back] = offer.itineraries;
  const arrive = out.segments[out.segments.length - 1].to;
  const leave = back.segments[0].from;
  if (arrive.iata === leave.iata || arrive.city !== leave.city) return null;
  return `you arrive at ${arrive.airportName} and return from ${leave.airportName}, two different ${arrive.city} airports.`;
};

export const ReviewFlightsCard = ({ offer, changeTo }: { offer: FlightOffer; changeTo: string }) => {
  const warning = airportWarning(offer);
  return (
    <section aria-labelledby="review-flights-h" className={CARD}>
      <div className="flex flex-wrap justify-between gap-2">
        <h2 id="review-flights-h" className={TITLE}>
          Flights
        </h2>
        <Link to={changeTo} className={LINK}>
          Change flight
        </Link>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(16.25rem,1fr))] gap-4">
        {offer.itineraries.map((itinerary, index) => {
          const first = itinerary.segments[0];
          const last = itinerary.segments[itinerary.segments.length - 1];
          const plus = dayDifference(first.from.atLocal, last.to.atLocal);
          return (
            <div key={index} className="rounded-xl bg-[#F4F6FA] p-3.5">
              <div className={`${HINT} font-bold uppercase`}>
                {directionLabel(offer, index)} · {format(localDate(first.from.atLocal), "EEE d MMM")}
              </div>
              <div className="my-1 text-lg font-extrabold text-[#181818]">
                {timeOf(first.from.atLocal)} {first.from.iata} → {timeOf(last.to.atLocal)}
                {plus > 0 ? `+${plus}` : ""} {last.to.iata}
              </div>
              <div className={HINT}>{flightsLine(offer, index)}</div>
            </div>
          );
        })}
      </div>
      {warning && (
        <div className="rounded-xl bg-[#FFF1E8] px-3.5 py-3 text-sm text-[#7C2D12]">
          <strong>Heads up:</strong> {warning}
        </div>
      )}
    </section>
  );
};

// ---------------------------------------------------------------- travellers

const TYPE: Record<TravelerType, string> = { ADULT: "Adult", CHILD: "Child", HELD_INFANT: "Infant on lap", SEATED_INFANT: "Infant in own seat" };

/** "+234 801 234 5678" */
const phoneLine = (contact: ContactInput) => {
  const d = contact.phoneNumber;
  const grouped = d.length === 10 ? `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : d;
  return `${contact.phoneCountryCode} ${grouped}`;
};

export const ReviewTravellersCard = ({ travelers, contact, editTo }: { travelers: TravelerSummary[]; contact: ContactInput; editTo: string }) => (
  <section aria-labelledby="review-travellers-h" className={CARD}>
    <div className="flex flex-wrap justify-between gap-2">
      <h2 id="review-travellers-h" className={TITLE}>
        Travellers
      </h2>
      <Link to={editTo} className={LINK}>
        Edit
      </Link>
    </div>
    {travelers.map((t, i) => (
      <div key={t.travelerId} className="flex flex-wrap justify-between gap-3 text-[0.9375rem]">
        <span>
          <strong>
            {titleCase(t.firstName)} {titleCase(t.lastName)}
          </strong>{" "}
          · {TYPE[t.type]}
        </span>
        {i === 0 && (
          <span className={HINT}>
            {contact.email} · {phoneLine(contact)}
          </span>
        )}
      </div>
    ))}
  </section>
);

// ---------------------------------------------------------------- fare conditions

const rowFor = (rows: FareRow[], prefix: string) => rows.find((r) => r.text.startsWith(prefix));
/** "1 checked bag, 23 kg" -> "1 checked bag (23 kg)" */
const includedText = (text: string) => text.replace(/, (\d+ kg)( each)?$/, " ($1$2)").replace(/^Cabin bag/, "cabin bag").replace(/^Meal and drinks$/, "meal");

export const FareConditionsCard = ({ offer, rules }: { offer: FlightOffer; rules: FareRuleText[] }) => {
  const segment = offer.itineraries[0].segments[0];
  const brand = segment.brandedFare ?? cabinLabel(segment.cabin);
  const rows = fareRows(offer);
  const refunds = rowFor(rows, "Refunds");
  const changes = rowFor(rows, "Changes");
  const included = rows.filter((r) => r.state === "Included" && !/^(Refunds|Changes|Choose|Priority|\d+% miles)/.test(r.text));

  return (
    <section aria-labelledby="review-rules-h" className={CARD}>
      <h2 id="review-rules-h" className={TITLE}>
        Fare conditions · {brand}
      </h2>
      <ul className="m-0 flex flex-col gap-1.5 pl-5 text-[0.9375rem]">
        {refunds && (
          <li>
            {refunds.state === "No" ? (
              <>
                <strong>Not refundable.</strong> If you cancel, taxes may be refundable.
              </>
            ) : (
              <>
                <strong>Refundable</strong> {refunds.state === "Free" ? "free of charge" : "for a fee"}.
              </>
            )}
          </li>
        )}
        {changes && (
          <li>
            {changes.state === "No" ? (
              <strong>No changes allowed.</strong>
            ) : changes.state === "Free" ? (
              <>
                <strong>Free changes</strong>, plus any fare difference.
              </>
            ) : (
              <>
                <strong>Changes allowed for a fee</strong>, plus any fare difference.
              </>
            )}
          </li>
        )}
        {included.length > 0 && <li>Included: {included.map((r) => includedText(r.text)).join(", ")}.</li>}
      </ul>
      {rules.length > 0 && (
        <details>
          <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold text-[#023E8A]">Read full fare rules</summary>
          <div className="flex flex-col gap-2 pb-1 text-sm">
            {rules.map((rule) => (
              <div key={rule.category} className="flex flex-col gap-1">
                <strong>{rule.title}</strong>
                <div className="whitespace-pre-line rounded-[0.625rem] bg-[#F4F6FA] p-3 font-mono text-xs leading-normal text-[#4E4F52]">{rule.text}</div>
              </div>
            ))}
          </div>
        </details>
      )}
    </section>
  );
};
