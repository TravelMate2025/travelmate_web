import { useState, type MouseEvent } from "react";
import { ClickAwayListener, Drawer, Paper, Popper, useMediaQuery } from "@mui/material";
import { DateRange, type RangeKeyDict } from "react-date-range";
import { addDays, differenceInCalendarDays, format, startOfToday } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export type StayDates = { checkIn: Date | null; checkOut: Date | null };

type Props = {
  value: StayDates;
  onChange: (dates: StayDates) => void;
};

const show = (date: Date | null) => (date ? format(date, "EEE, d MMM yyyy") : "Add date");

/**
 * The Check in and Check out fields of the search card. Both open the same
 * calendar, so a guest picks the whole stay in one place (two clicks). The
 * dates update as they click; "Done" just closes it.
 */
export function DateRangeFields({ value, onChange }: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const isPhone = useMediaQuery("(max-width:640px)");
  const open = Boolean(anchor);

  const today = startOfToday();
  const start = value.checkIn ?? today;
  const end = value.checkOut ?? value.checkIn ?? addDays(today, 1);
  const nights =
    value.checkIn && value.checkOut ? differenceInCalendarDays(value.checkOut, value.checkIn) : 0;

  const openFrom = (event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget);
  const close = () => setAnchor(null);

  const handleChange = (ranges: RangeKeyDict) => {
    const picked = ranges.selection;
    if (!picked?.startDate) return;
    const from = picked.startDate;
    const to = picked.endDate ?? picked.startDate;
    // First click gives a one-day range: keep it as check-in only until the
    // check-out day is chosen (a stay needs at least one night).
    if (differenceInCalendarDays(to, from) < 1) {
      onChange({ checkIn: from, checkOut: null });
    } else {
      onChange({ checkIn: from, checkOut: to });
    }
  };

  const calendar = (
    <div className="flex flex-col items-center p-3 font-inter">
      <DateRange
        editableDateInputs={false}
        minDate={today}
        onChange={handleChange}
        moveRangeOnFirstSelection={false}
        ranges={[{ startDate: start, endDate: end, key: "selection" }]}
        rangeColors={["#0B3F8E"]}
        months={isPhone ? 1 : 2}
        direction={isPhone ? "vertical" : "horizontal"}
        showDateDisplay={false}
        showMonthAndYearPickers={false}
      />
      <div className="flex w-full items-center justify-between gap-4 border-t border-[#E1E6EE] px-2 pt-3">
        <p className="text-[14px] text-[#5D6880]">
          {nights > 0
            ? `${nights} night${nights === 1 ? "" : "s"}`
            : value.checkIn
              ? "Now pick your check-out day"
              : "Pick your check-in day"}
        </p>
        <div className="flex items-center gap-2">
          {value.checkIn && (
            <button
              type="button"
              onClick={() => onChange({ checkIn: null, checkOut: null })}
              className="rounded-full px-4 py-2 text-[14px] font-semibold text-[#5D6880] hover:bg-[#F4F6F9]"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={close}
            className="rounded-full bg-[#0B3F8E] px-5 py-2 text-[14px] font-semibold text-white hover:bg-[#072A63]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="tmh-field tmh-field-btn"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openFrom}
      >
        <span>Check in</span>
        <b className={value.checkIn ? "" : "is-empty"}>{show(value.checkIn)}</b>
      </button>
      <button
        type="button"
        className="tmh-field tmh-field-btn"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openFrom}
      >
        <span>Check out</span>
        <b className={value.checkOut ? "" : "is-empty"}>{show(value.checkOut)}</b>
      </button>

      {isPhone ? (
        <Drawer
          anchor="bottom"
          open={open}
          onClose={close}
          PaperProps={{ sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "92vh" } }}
        >
          {calendar}
        </Drawer>
      ) : (
        <Popper open={open} anchorEl={anchor} placement="bottom-start" style={{ zIndex: 1300 }}>
          <ClickAwayListener onClickAway={close}>
            <Paper elevation={3} className="mt-2 overflow-hidden rounded-2xl">
              {calendar}
            </Paper>
          </ClickAwayListener>
        </Popper>
      )}
    </>
  );
}
