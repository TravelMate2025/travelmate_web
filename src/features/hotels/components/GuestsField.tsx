import { useState, type MouseEvent } from "react";
import { ClickAwayListener, Drawer, Paper, Popper, useMediaQuery } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import { summariseGuests, type GuestCounts } from "../guests";

type Props = {
  value: GuestCounts;
  onChange: (counts: GuestCounts) => void;
};

const ROWS = [
  { key: "adults", label: "Adults", hint: "Ages 16 and above", min: 1, max: 16 },
  { key: "children", label: "Children", hint: "Ages 0 - 15", min: 0, max: 10 },
  { key: "rooms", label: "Rooms", hint: "How many rooms you need", min: 1, max: 8 },
] as const;

/** The Guests field of the search card: adults, children and rooms steppers (same options as the Stays search). */
export function GuestsField({ value, onChange }: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const isPhone = useMediaQuery("(max-width:640px)");
  const open = Boolean(anchor);
  const close = () => setAnchor(null);

  const step = (key: keyof GuestCounts, delta: number, min: number, max: number) => {
    const next = Math.min(max, Math.max(min, value[key] + delta));
    if (next !== value[key]) onChange({ ...value, [key]: next });
  };

  const panel = (
    <div className="w-full p-4 font-inter sm:w-[340px]">
      {ROWS.map((row, index) => (
        <div key={row.key} className={index < ROWS.length - 1 ? "mb-3 border-b border-[#E1E6EE] pb-3" : ""}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[16px] font-semibold text-[#181818]">{row.label}</p>
              <p className="text-[14px] text-[#818489]">{row.hint}</p>
            </div>
            <div className="flex h-[36px] w-[104px] items-center justify-between rounded border border-[#0B3F8E] px-2">
              <button
                type="button"
                aria-label={`Fewer ${row.label.toLowerCase()}`}
                disabled={value[row.key] <= row.min}
                onClick={() => step(row.key, -1, row.min, row.max)}
                className="flex disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RemoveOutlinedIcon fontSize="small" />
              </button>
              <span aria-live="polite">{value[row.key]}</span>
              <button
                type="button"
                aria-label={`More ${row.label.toLowerCase()}`}
                disabled={value[row.key] >= row.max}
                onClick={() => step(row.key, 1, row.min, row.max)}
                className="flex disabled:cursor-not-allowed disabled:opacity-40"
              >
                <AddOutlinedIcon fontSize="small" />
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={close}
        className="mt-4 h-[48px] w-full rounded-md bg-[#0B3F8E] text-[16px] text-white hover:bg-[#072A63]"
      >
        Done
      </button>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="tmh-field tmh-field-btn is-last"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={(event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget)}
      >
        <span>Guests</span>
        <b>{summariseGuests(value)}</b>
      </button>

      {isPhone ? (
        <Drawer
          anchor="bottom"
          open={open}
          onClose={close}
          PaperProps={{ sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16 } }}
        >
          {panel}
        </Drawer>
      ) : (
        <Popper open={open} anchorEl={anchor} placement="bottom-start" style={{ zIndex: 1300 }}>
          <ClickAwayListener onClickAway={close}>
            <Paper elevation={3} className="mt-2 rounded-2xl">
              {panel}
            </Paper>
          </ClickAwayListener>
        </Popper>
      )}
    </>
  );
}
