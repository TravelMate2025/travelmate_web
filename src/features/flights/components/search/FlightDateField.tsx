import { useEffect, useRef, useState } from "react";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Drawer from "@mui/material/Drawer";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import useMediaQuery from "@mui/material/useMediaQuery";
import { flightDoneLabel } from "../../../shared/booking/bookingFlowLabels";
import { FLEXIBLE_DAY_OPTIONS } from "../../search/searchDraft";
import type { FlexibleDays } from "../../types";
import { CELL_CLASS, CELL_LABEL_CLASS, CELL_VALUE_CLASS, ERROR_TEXT_CLASS } from "./fieldStyles";

const BRAND = "#023E8A";

/** "2026-12-15" -> local Date (no timezone shift). */
const toDate = (value: string) => {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
};

interface FlightDateFieldProps {
  id: string;
  label: string;
  /** Earliest selectable date, YYYY-MM-DD (today, or the previous flight's date). */
  minDate: string;
  value: string | null;
  onChange: (date: string) => void;
  flexibleDays: FlexibleDays;
  onFlexibleDaysChange: (days: FlexibleDays) => void;
  error?: string;
  /** Opens the calendar whenever this changes (e.g. after a popular route prefilled the places). */
  openKey?: number;
}

export const FlightDateField = ({
  id,
  label,
  minDate,
  value,
  onChange,
  flexibleDays,
  onFlexibleDaysChange,
  error,
  openKey,
}: FlightDateFieldProps) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Date | null>(value ? toDate(value) : null);
  const isMobile = useMediaQuery("(max-width:640px)");

  useEffect(() => {
    if (openKey === undefined) return;
    setDraft(value ? toDate(value) : null);
    setOpen(true);
    // Only when asked to open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openKey]);

  const openPicker = () => {
    setDraft(value ? toDate(value) : null);
    setOpen(true);
  };

  const commit = () => {
    if (draft) onChange(format(draft, "yyyy-MM-dd"));
    setOpen(false);
  };

  const errorId = `${id}-error`;
  const minimum = toDate(minDate);

  const content = (
    <div className="flex flex-col gap-3 p-3">
      <p className="px-1 text-sm font-semibold text-[#181818]">{label}</p>
      <Calendar date={draft ?? minimum} onChange={(date: Date) => setDraft(date)} minDate={minimum} color={BRAND} />
      <button
        type="button"
        onClick={commit}
        disabled={!draft}
        className="h-12 w-full cursor-pointer rounded-xl bg-[#023E8A] font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {flightDoneLabel()}
      </button>
    </div>
  );

  return (
    <div className={CELL_CLASS} ref={anchorRef}>
      <label htmlFor={id} className={CELL_LABEL_CLASS}>
        {label}
      </label>
      <button
        id={id}
        type="button"
        onClick={openPicker}
        aria-haspopup="dialog"
        aria-describedby={error ? errorId : undefined}
        className={`cursor-pointer bg-transparent p-0 text-left ${CELL_VALUE_CLASS} ${value ? "" : "!font-medium !text-[#8A9096]"}`}
      >
        {value ? format(toDate(value), "EEE d MMM yyyy") : "Add date"}
      </button>
      {error ? (
        <span id={errorId} className={ERROR_TEXT_CLASS}>
          {error}
        </span>
      ) : (
        <select
          aria-label={`${label}: flexible dates`}
          value={flexibleDays}
          onChange={(event) => onFlexibleDaysChange(Number(event.target.value) as FlexibleDays)}
          className="w-fit cursor-pointer bg-transparent p-0 text-sm text-[#4E4F52]"
        >
          {FLEXIBLE_DAY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {isMobile ? (
        <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
          <div role="dialog" aria-label={label} className="flex justify-center">
            {content}
          </div>
        </Drawer>
      ) : (
        <Popper open={open} anchorEl={anchorRef.current} placement="bottom-start" className="z-[1300]">
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Paper elevation={6} role="dialog" aria-label={label}>
              {content}
            </Paper>
          </ClickAwayListener>
        </Popper>
      )}
    </div>
  );
};
