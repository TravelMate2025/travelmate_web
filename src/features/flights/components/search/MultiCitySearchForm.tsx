import { useState } from "react";
import Popover from "@mui/material/Popover";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { flightAddLegLabel, flightSearchShortLabel } from "../../../shared/booking/bookingFlowLabels";
import { FLIGHT_SEARCH_ANCHOR_ID, useFlightSearchForm } from "../../hooks/useFlightSearchForm";
import { MAX_MULTI_CITY_LEGS, cabinLabel, passengersSummary } from "../../search/searchDraft";
import { FlightDateField } from "./FlightDateField";
import { ERROR_TEXT_CLASS } from "./fieldStyles";
import { PlaceField } from "./PlaceField";
import { TravellersCabinPanel } from "./TravellersCabin";
import { TripTypePills } from "./TripTypePills";

// The multi-city search form, from the approved web mock (MultiCity): a flat
// card (1px #DEDFE1 border, 20px corners, 22px padding, 12px gaps); one row per
// flight with a number, From, To, a 200px Date box and a 44px remove button;
// then "+ Add another flight" and, on the right, the travellers and Search.
export const MultiCitySearchForm = () => {
  const form = useFlightSearchForm("multi");
  const { draft, errors } = form;
  const [travellersAnchor, setTravellersAnchor] = useState<HTMLElement | null>(null);

  return (
    <form
      id={FLIGHT_SEARCH_ANCHOR_ID}
      aria-label="Multi-city search"
      onSubmit={form.submit}
      noValidate
      className="flex flex-col gap-3 rounded-[1.25rem] border border-[#DEDFE1] bg-white p-5.5"
    >
      <TripTypePills value="MULTI_CITY" onChange={form.setTripType} />

      {draft.legs.map((leg, index) => (
        <div key={index} role="group" aria-label={`Flight ${index + 1}`} className="flex flex-wrap items-stretch gap-2.5">
          <span
            aria-hidden
            className="inline-flex h-8.5 w-8.5 shrink-0 items-center justify-center self-center rounded-full bg-[#E8EEF7] font-extrabold text-[#023E8A]"
          >
            {index + 1}
          </span>
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
            onChange={(destination) => form.updateLeg(index, { destination })}
            error={errors[`leg${index}.destination`]}
            compact
          />
          <FlightDateField
            id={`flight-${index}-date`}
            label="Date"
            minDate={form.minDateForLeg(index)}
            value={leg.date}
            onChange={(date) => form.setDepartDate(index, date)}
            error={errors[`leg${index}.date`]}
            openKey={form.openDateKey(index)}
            className="grow-0 basis-50"
            compact
          />
          <button
            type="button"
            aria-label={`Remove flight ${index + 1}`}
            disabled={!form.canRemoveLeg}
            onClick={() => form.removeLeg(index)}
            className="flex w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#CDCED1] bg-white text-[#4E4F52] disabled:cursor-not-allowed disabled:text-[#CDCED1]"
          >
            <CloseOutlinedIcon className="!h-4 !w-4" />
          </button>
        </div>
      ))}

      <div className="flex flex-wrap items-center justify-between gap-3">
        {form.canAddLeg ? (
          <button
            type="button"
            onClick={form.addLeg}
            className="min-h-11 cursor-pointer rounded-xl border border-dashed border-[#023E8A] bg-white px-4 text-sm font-bold text-[#023E8A]"
          >
            + {flightAddLegLabel(MAX_MULTI_CITY_LEGS)}
          </button>
        ) : (
          <span />
        )}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={(event) => setTravellersAnchor(event.currentTarget)}
            className="cursor-pointer bg-transparent p-0 text-[0.9375rem] text-[#181818] underline-offset-4 hover:underline"
          >
            {passengersSummary(draft.passengers)} · {cabinLabel(draft.cabin)}
          </button>
          {errors.passengers && <span className={ERROR_TEXT_CLASS}>{errors.passengers}</span>}
          <button
            type="submit"
            className="min-h-12.5 cursor-pointer rounded-xl bg-[#FF6F1E] px-7 text-base font-extrabold text-[#181818] hover:bg-[#f2600b]"
          >
            {flightSearchShortLabel()}
          </button>
        </div>
      </div>

      <Popover
        open={Boolean(travellersAnchor)}
        anchorEl={travellersAnchor}
        onClose={() => setTravellersAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { className: "!rounded-2xl w-[26rem] max-w-[calc(100vw-2rem)]" } }}
      >
        <TravellersCabinPanel passengers={draft.passengers} cabin={draft.cabin} onChange={form.setTravellers} />
      </Popover>
    </form>
  );
};
