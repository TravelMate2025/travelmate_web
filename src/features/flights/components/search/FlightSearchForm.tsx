import SearchIcon from "@mui/icons-material/Search";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { flightSearchLabel } from "../../../shared/booking/bookingFlowLabels";
import { FLIGHT_SEARCH_ANCHOR_ID, useFlightSearchForm } from "../../hooks/useFlightSearchForm";
import { searchSubtitle } from "../../search/describeSearch";
import { routeTitle } from "../../search/recentSearches";
import { SELLING_CURRENCIES, type CurrencyCode } from "../../types";
import { FlightDateField } from "./FlightDateField";
import { PlaceField } from "./PlaceField";
import { TravellersCabinCell, TravellersCabinPanel } from "./TravellersCabin";
import { TripTypePills } from "./TripTypePills";

// The /flights search card, from the approved web mock (Main): white card
// (20px corners, 24px padding, 18px gaps), field boxes, options and the orange
// Search button; then the travellers panel beside recent searches and three
// promises. "Multi-city" opens its own page (mock: MultiCity).

const PROMISES = [
  { title: "See what's included", body: "Bags, seat choice, changes and refunds for every fare." },
  { title: "Seats held while you pay", body: "Your price is locked during checkout." },
  { title: "Pay your way", body: "NGN, USD or GBP, securely with Flutterwave." },
];

const CHECKBOX_LABEL = "inline-flex min-h-11 cursor-pointer items-center gap-2 text-[0.9375rem] text-[#181818]";
const CHECKBOX = "h-4.5 w-4.5 accent-[#023E8A]";

export const FlightSearchForm = () => {
  const form = useFlightSearchForm("single");
  const { draft, errors } = form;
  const first = draft.legs[0];

  return (
    <div className="flex flex-col gap-7">
      <form
        id={FLIGHT_SEARCH_ANCHOR_ID}
        aria-label="Search flights"
        onSubmit={form.submit}
        noValidate
        className="flex scroll-mt-32 flex-col gap-4.5 rounded-[1.25rem] bg-white p-6 shadow-[0_12px_32px_rgba(1,42,93,0.14)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TripTypePills value={draft.tripType} onChange={form.setTripType} />
          <select
            aria-label="Currency"
            value={form.currency}
            onChange={(event) => form.setCurrency(event.target.value as CurrencyCode)}
            className="min-h-11 cursor-pointer rounded-full border border-[#CDCED1] bg-white px-3.5 text-sm font-semibold text-[#181818]"
          >
            {SELLING_CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-stretch gap-3">
          {/* From and To joined, with the round swap button on the seam */}
          <div className="relative flex min-w-0 flex-[2_1_26rem] flex-wrap">
            <PlaceField
              id="flight-from"
              label="From"
              value={first.origin}
              onChange={(origin) => form.updateLeg(0, { origin })}
              error={errors["leg0.origin"]}
              className="sm:rounded-r-none"
            />
            <button
              type="button"
              aria-label="Swap origin and destination"
              onClick={() => form.swapPlaces(0)}
              className="absolute left-1/2 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#CDCED1] bg-white text-[#023E8A] sm:flex"
            >
              <SwapHorizIcon fontSize="small" />
            </button>
            <PlaceField
              id="flight-to"
              label="To"
              value={first.destination}
              onChange={(destination) => form.updateLeg(0, { destination })}
              error={errors["leg0.destination"]}
              className="mt-3 sm:mt-0 sm:rounded-l-none sm:border-l-0 sm:pl-7"
            />
          </div>
          <FlightDateField
            id="flight-depart"
            label="Depart"
            minDate={form.minDateForLeg(0)}
            value={first.date}
            onChange={(date) => form.setDepartDate(0, date)}
            flexibleDays={first.flexibleDays}
            onFlexibleDaysChange={(flexibleDays) => form.updateLeg(0, { flexibleDays })}
            error={errors["leg0.date"]}
            openKey={form.openDateKey(0)}
          />
          {draft.tripType === "RETURN" && (
            <FlightDateField
              id="flight-return"
              label="Return"
              minDate={first.date ?? form.minDateForLeg(0)}
              value={draft.returnDate}
              onChange={(returnDate) => form.setReturn({ returnDate })}
              flexibleDays={draft.returnFlexibleDays}
              onFlexibleDaysChange={(returnFlexibleDays) => form.setReturn({ returnFlexibleDays })}
              error={errors.returnDate}
            />
          )}
          <TravellersCabinCell id="flight-travellers" passengers={draft.passengers} cabin={draft.cabin} error={errors.passengers} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4.5">
            <label className={CHECKBOX_LABEL}>
              <input type="checkbox" checked={draft.nonStop} onChange={(e) => form.setNonStop(e.target.checked)} className={CHECKBOX} />
              Direct flights only
            </label>
            <label className={CHECKBOX_LABEL}>
              <input
                type="checkbox"
                checked={draft.includeNearbyAirports}
                onChange={(e) => form.setNearby(e.target.checked)}
                className={CHECKBOX}
              />
              Include nearby airports
            </label>
          </div>
          <button
            type="submit"
            className="flex min-h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#FF6F1E] px-9 text-[1.0625rem] font-extrabold text-[#181818] hover:bg-[#f2600b] sm:w-auto"
          >
            <SearchIcon fontSize="small" />
            {flightSearchLabel()}
          </button>
        </div>
      </form>

      <div className="flex flex-wrap items-start gap-6">
        <TravellersCabinPanel passengers={draft.passengers} cabin={draft.cabin} onChange={form.setTravellers} />
        <section aria-labelledby="flight-recent-title" className="flex flex-1 basis-96 flex-col gap-3.5">
          {form.recent.length > 0 && (
            <>
              <h2 id="flight-recent-title" className="text-lg font-bold text-[#181818]">
                Recent searches
              </h2>
              {form.recent.slice(0, 2).map((entry) => (
                <button
                  key={entry.searchedAt}
                  type="button"
                  onClick={() => form.searchAgain(entry)}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-[0.875rem] border border-[#DEDFE1] bg-white px-4.5 py-4 text-left hover:border-[#023E8A]"
                >
                  <span>
                    <span className="block font-bold text-[#181818]">{routeTitle(entry.criteria, entry.places)}</span>
                    <span className="text-sm text-[#4E4F52]">{searchSubtitle(entry.criteria)}</span>
                  </span>
                  <span className="shrink-0 text-sm font-bold text-[#023E8A]">Search again</span>
                </button>
              ))}
            </>
          )}
          <div className="mt-1.5 flex flex-wrap gap-2.5">
            {PROMISES.map((p) => (
              <div key={p.title} className="flex-1 basis-44 rounded-[0.875rem] bg-[#E8EEF7] px-4 py-3.5">
                <p className="font-bold text-[#012A5D]">{p.title}</p>
                <p className="mt-1 text-sm text-[#4E4F52]">{p.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
