import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {
  flightAddLegLabel,
  flightSearchLabel,
} from "../../../shared/booking/bookingFlowLabels";
import {
  FLIGHT_SEARCH_ANCHOR_ID,
  useFlightSearchForm,
} from "../../hooks/useFlightSearchForm";
import { searchSubtitle } from "../../search/describeSearch";
import { routeTitle } from "../../search/recentSearches";
import {
  MAX_MULTI_CITY_LEGS,
  cabinLabel,
  passengersSummary,
} from "../../search/searchDraft";
import {
  SELLING_CURRENCIES,
  type CurrencyCode,
  type TripType,
} from "../../types";
import { FlightDateField } from "./FlightDateField";
import { PlaceField } from "./PlaceField";
import {
  TRAVELLERS_PANEL_ID,
  TravellersCabinCell,
  TravellersCabinPanel,
} from "./TravellersCabin";

// Layout and copy follow the approved web mock (Main): the search card, then
// the travellers panel beside recent searches and three promises.

const TRIP_TYPES: { value: TripType; label: string }[] = [
  { value: "RETURN", label: "Return" },
  { value: "ONE_WAY", label: "One-way" },
  { value: "MULTI_CITY", label: "Multi-city" },
];

const PROMISES = [
  {
    title: "See what's included",
    body: "Bags, seat choice, changes and refunds for every fare.",
  },
  {
    title: "Seats held while you pay",
    body: "Your price is locked during checkout.",
  },
  {
    title: "Pay your way",
    body: "NGN, USD or GBP, securely with Flutterwave.",
  },
];

const tripClass = (selected: boolean) =>
  `min-h-11 cursor-pointer rounded-full px-4 text-sm font-semibold ${selected ? "bg-[#023E8A] text-white" : "bg-transparent text-[#4E4F52]"}`;

const CHECKBOX_LABEL =
  "inline-flex min-h-11 cursor-pointer items-center gap-2 text-[#181818]";
const CHECKBOX = "h-4.5 w-4.5 accent-[#023E8A]";

interface PlacePairProps {
  idPrefix: string;
  index: number;
  form: ReturnType<typeof useFlightSearchForm>;
}

/** From and To joined, with the round swap button on the seam (mock). */
const PlacePair = ({ idPrefix, index, form }: PlacePairProps) => {
  const leg = form.draft.legs[index];
  return (
    <div className="relative flex min-w-0 flex-[2_1_26rem] flex-wrap">
      <PlaceField
        id={`${idPrefix}-from`}
        label="From"
        value={leg.origin}
        onChange={(origin) => form.updateLeg(index, { origin })}
        error={form.errors[`leg${index}.origin`]}
        className="sm:rounded-r-none"
      />
      <button
        type="button"
        aria-label="Swap origin and destination"
        onClick={() => form.swapPlaces(index)}
        className="absolute left-1/2 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#CDCED1] bg-white text-[#023E8A] sm:flex"
      >
        <SwapHorizIcon fontSize="small" />
      </button>
      <PlaceField
        id={`${idPrefix}-to`}
        label="To"
        value={leg.destination}
        onChange={(destination) => form.updateLeg(index, { destination })}
        error={form.errors[`leg${index}.destination`]}
        className="mt-3 sm:mt-0 sm:rounded-l-none sm:border-l-0 sm:pl-7"
      />
    </div>
  );
};

const SearchOptions = ({
  form,
}: {
  form: ReturnType<typeof useFlightSearchForm>;
}) => (
  <>
    <label className={CHECKBOX_LABEL}>
      <input
        type="checkbox"
        checked={form.draft.nonStop}
        onChange={(e) => form.setNonStop(e.target.checked)}
        className={CHECKBOX}
      />
      Direct flights only
    </label>
    <label className={CHECKBOX_LABEL}>
      <input
        type="checkbox"
        checked={form.draft.includeNearbyAirports}
        onChange={(e) => form.setNearby(e.target.checked)}
        className={CHECKBOX}
      />
      Include nearby airports
    </label>
  </>
);

const SearchButton = () => (
  <button
    type="submit"
    className="flex min-h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#FF6F1E] px-9 text-lg font-extrabold text-[#181818] hover:bg-[#f2600b] sm:w-auto"
  >
    <SearchIcon />
    {flightSearchLabel()}
  </button>
);

export const FlightSearchForm = () => {
  const form = useFlightSearchForm();
  const { draft, errors } = form;
  const first = draft.legs[0];
  const isMultiCity = draft.tripType === "MULTI_CITY";

  return (
    <div className="flex flex-col gap-7">
      <form
        id={FLIGHT_SEARCH_ANCHOR_ID}
        aria-label="Search flights"
        onSubmit={form.submit}
        noValidate
        className="flex scroll-mt-32 flex-col gap-5 rounded-3xl bg-white p-6 shadow-xl"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="radiogroup"
            aria-label="Trip type"
            className="flex flex-wrap gap-1.5 rounded-full bg-[#F4F6FA] p-1"
          >
            {TRIP_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={draft.tripType === t.value}
                onClick={() => form.setTripType(t.value)}
                className={tripClass(draft.tripType === t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <select
            aria-label="Currency"
            value={form.currency}
            onChange={(event) =>
              form.setCurrency(event.target.value as CurrencyCode)
            }
            className="min-h-11 cursor-pointer rounded-full border border-[#CDCED1] bg-white px-4 text-sm font-semibold text-[#181818]"
          >
            {SELLING_CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        {!isMultiCity && (
          <div className="flex flex-wrap items-stretch gap-3">
            <PlacePair idPrefix="flight" index={0} form={form} />
            <FlightDateField
              id="flight-depart"
              label="Depart"
              minDate={form.minDateForLeg(0)}
              value={first.date}
              onChange={(date) => form.setDepartDate(0, date)}
              flexibleDays={first.flexibleDays}
              onFlexibleDaysChange={(flexibleDays) =>
                form.updateLeg(0, { flexibleDays })
              }
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
                onFlexibleDaysChange={(returnFlexibleDays) =>
                  form.setReturn({ returnFlexibleDays })
                }
                error={errors.returnDate}
              />
            )}
            <TravellersCabinCell
              id="flight-travellers"
              passengers={draft.passengers}
              cabin={draft.cabin}
              error={errors.passengers}
            />
          </div>
        )}

        {isMultiCity && (
          // Mock (web MultiCity): one row per flight with a number, From, To,
          // Date and a remove button; add-flight, travellers and Search below.
          <div className="flex flex-col gap-3">
            {draft.legs.map((leg, index) => (
              <div
                key={index}
                role="group"
                aria-label={`Flight ${index + 1}`}
                className="flex items-stretch gap-2.5"
              >
                <span
                  aria-hidden
                  className="inline-flex h-8.5 w-8.5 shrink-0 items-center justify-center self-center rounded-full bg-[#E8EEF7] font-extrabold text-[#023E8A]"
                >
                  {index + 1}
                </span>
                <div className="flex min-w-0 flex-1 flex-wrap items-stretch gap-2.5">
                  <PlaceField
                    id={`flight-${index}-from`}
                    label="From"
                    value={leg.origin}
                    onChange={(origin) => form.updateLeg(index, { origin })}
                    error={errors[`leg${index}.origin`]}
                    compact
                  />
                  <PlaceField
                    id={`flight-${index}-to`}
                    label="To"
                    value={leg.destination}
                    onChange={(destination) =>
                      form.updateLeg(index, { destination })
                    }
                    error={errors[`leg${index}.destination`]}
                    compact
                  />
                  <FlightDateField
                    id={`flight-${index}-date`}
                    label="Date"
                    minDate={form.minDateForLeg(index)}
                    value={leg.date}
                    onChange={(date) => form.setDepartDate(index, date)}
                    flexibleDays={leg.flexibleDays}
                    onFlexibleDaysChange={(flexibleDays) =>
                      form.updateLeg(index, { flexibleDays })
                    }
                    error={errors[`leg${index}.date`]}
                    openKey={form.openDateKey(index)}
                    className="sm:grow-0 sm:basis-52"
                    compact
                  />
                </div>
                <button
                  type="button"
                  aria-label={`Remove flight ${index + 1}`}
                  disabled={!form.canRemoveLeg}
                  onClick={() => form.removeLeg(index)}
                  className="flex w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#CDCED1] bg-white text-[#4E4F52] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <CloseOutlinedIcon fontSize="small" />
                </button>
              </div>
            ))}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {form.canAddLeg && (
                  <button
                    type="button"
                    onClick={form.addLeg}
                    className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-dashed border-[#023E8A] bg-white px-4 text-sm font-bold text-[#023E8A]"
                  >
                    <AddOutlinedIcon fontSize="small" />
                    {flightAddLegLabel(MAX_MULTI_CITY_LEGS)}
                  </button>
                )}
                <SearchOptions form={form} />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(TRAVELLERS_PANEL_ID)
                      ?.scrollIntoView({ behavior: "smooth", block: "center" })
                  }
                  aria-controls={TRAVELLERS_PANEL_ID}
                  className="cursor-pointer bg-transparent text-[#181818] underline-offset-4 hover:underline"
                >
                  {passengersSummary(draft.passengers)} ·{" "}
                  {cabinLabel(draft.cabin)}
                </button>
                {errors.passengers && (
                  <span className="text-sm font-medium text-[#B42318]">
                    {errors.passengers}
                  </span>
                )}
                <SearchButton />
              </div>
            </div>
          </div>
        )}

        {!isMultiCity && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-5">
              <SearchOptions form={form} />
            </div>
            <SearchButton />
          </div>
        )}
      </form>

      <div className="flex flex-wrap items-start gap-6">
        <TravellersCabinPanel
          passengers={draft.passengers}
          cabin={draft.cabin}
          onChange={form.setTravellers}
        />
        <section
          aria-labelledby="flight-recent-title"
          className="flex flex-1 basis-96 flex-col gap-3.5"
        >
          {form.recent.length > 0 && (
            <>
              <h2
                id="flight-recent-title"
                className="text-lg font-bold text-[#181818]"
              >
                Recent searches
              </h2>
              {form.recent.slice(0, 2).map((entry) => (
                <button
                  key={entry.searchedAt}
                  type="button"
                  onClick={() => form.searchAgain(entry)}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-[#DEDFE1] bg-white px-4.5 py-4 text-left hover:border-[#023E8A]"
                >
                  <span>
                    <span className="block font-bold text-[#181818]">
                      {routeTitle(entry.criteria, entry.places)}
                    </span>
                    <span className="text-sm text-[#4E4F52]">
                      {searchSubtitle(entry.criteria)}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-bold text-[#023E8A]">
                    Search again
                  </span>
                </button>
              ))}
            </>
          )}
          <div className="mt-1.5 flex flex-wrap gap-2.5">
            {PROMISES.map((p) => (
              <div
                key={p.title}
                className="flex-1 basis-44 rounded-2xl bg-[#E8EEF7] px-4 py-3.5"
              >
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
