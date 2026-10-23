import { useState, type MouseEvent } from "react";
import { ClickAwayListener, Drawer, Paper, Popper, useMediaQuery } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import { DEFAULT_CHILD_AGE, summariseGuests, type GuestCounts } from "../guests";

type Props = {
  value: GuestCounts;
  onChange: (counts: GuestCounts) => void;
};

const ROWS = [
  { key: "adults", label: "Adults", hint: "Ages 16 and above", min: 1, max: 16 },
  { key: "children", label: "Children", hint: "Ages 0 - 15", min: 0, max: 10 },
  { key: "rooms", label: "Rooms", hint: "How many rooms you need", min: 1, max: 8 },
] as const;

type RowKey = (typeof ROWS)[number]["key"];

const AGES = Array.from({ length: 16 }, (_, age) => age);

/** The Guests field of the search card: adults, children and rooms steppers (same options as the Stays search). */
export function GuestsField({ value, onChange }: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const isPhone = useMediaQuery("(max-width:640px)");
  const open = Boolean(anchor);
  const close = () => setAnchor(null);

  const countOf = (key: RowKey) => (key === "children" ? value.childAges.length : value[key]);

  const step = (key: RowKey, delta: number, min: number, max: number) => {
    const next = Math.min(max, Math.max(min, countOf(key) + delta));
    if (next === countOf(key)) return;
    if (key === "children") {
      // one age per child: a new child starts at the default age, removing drops the last one
      const childAges = next > value.childAges.length ? [...value.childAges, DEFAULT_CHILD_AGE] : value.childAges.slice(0, next);
      onChange({ ...value, childAges });
    } else {
      onChange({ ...value, [key]: next });
    }
  };

  const setAge = (index: number, age: number) =>
    onChange({ ...value, childAges: value.childAges.map((a, i) => (i === index ? age : a)) });

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
                disabled={countOf(row.key) <= row.min}
                onClick={() => step(row.key, -1, row.min, row.max)}
                className="flex disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RemoveOutlinedIcon fontSize="small" />
              </button>
              <span aria-live="polite">{countOf(row.key)}</span>
              <button
                type="button"
                aria-label={`More ${row.label.toLowerCase()}`}
                disabled={countOf(row.key) >= row.max}
                onClick={() => step(row.key, 1, row.min, row.max)}
                className="flex disabled:cursor-not-allowed disabled:opacity-40"
              >
                <AddOutlinedIcon fontSize="small" />
              </button>
            </div>
          </div>
          {row.key === "children" && value.childAges.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {value.childAges.map((age, index) => (
                <label key={index} className="flex flex-col gap-1 text-[13px] text-[#5D6880]">
                  Child {index + 1} age
                  <select
                    value={age}
                    onChange={(event) => setAge(index, Number(event.target.value))}
                    className="h-[36px] rounded border border-[#CBD3E1] bg-white px-2 text-[14px] text-[#181818]"
                  >
                    {AGES.map((a) => (
                      <option key={a} value={a}>
                        {a === 0 ? "Under 1" : a}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          )}
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
