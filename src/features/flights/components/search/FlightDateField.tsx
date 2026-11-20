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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { flightDoneLabel } from "../../../shared/booking/bookingFlowLabels";
import { FLEXIBLE_DAY_OPTIONS } from "../../search/searchDraft";
import type { FlexibleDays } from "../../types";
import { CELL_HINT_CLASS, CELL_LABEL_CLASS, ERROR_TEXT_CLASS, cellClass, cellValueClass } from "./fieldStyles";

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
  /** Left out where the mock has no flexible dates (multi-city). */
  flexibleDays?: FlexibleDays;
  onFlexibleDaysChange?: (days: FlexibleDays) => void;
  error?: string;
  /** Opens the calendar whenever this changes (e.g. after a popular route prefilled the places). */
  openKey?: number;
  /** Extra classes, e.g. a narrower box in multi-city rows. */
  className?: string;
  /** Multi-city rows: smaller box, no sub-line (mock .fld). */
  compact?: boolean;
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
  className = "",
  compact = false,
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

  const flexibleSelect = onFlexibleDaysChange && (
    <span className="relative inline-flex w-fit items-center text-[#4E4F52]">
      <select
        aria-label={`${label}: flexible dates`}
        value={flexibleDays ?? 0}
        onChange={(event) => onFlexibleDaysChange(Number(event.target.value) as FlexibleDays)}
        className={`h-auto cursor-pointer appearance-none bg-transparent p-0 pr-4 ${CELL_HINT_CLASS}`}
      >
        {FLEXIBLE_DAY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ExpandMoreIcon aria-hidden className="pointer-events-none absolute right-0 !h-4 !w-4" />
    </span>
  );

  return (
    <div className={`${cellClass(compact)} ${className}`} ref={anchorRef}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className={CELL_LABEL_CLASS}>
          {label}
        </label>
      </div>
      <button
        id={id}
        type="button"
        onClick={openPicker}
        aria-haspopup="dialog"
        aria-describedby={error ? errorId : undefined}
        className={`cursor-pointer bg-transparent p-0 text-left ${cellValueClass(compact)} ${value ? "" : "!font-medium !text-[#8A9096]"}`}
      >
        {value ? format(toDate(value), compact ? "EEE d MMM" : "EEE d MMM yyyy") : "Add date"}
      </button>
      {error ? (
        <span id={errorId} className={ERROR_TEXT_CLASS}>
          {error}
        </span>
      ) : (
        flexibleSelect
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
