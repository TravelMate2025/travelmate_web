import type { Place } from "../../types";

// Field boxes from the approved web mock (Main): 1px #CDCED1 border, 12px
// corners, an uppercase label, a large value and a sub-line underneath.
export const CELL_CLASS = "relative flex min-w-0 flex-1 basis-44 flex-col gap-1.5 rounded-xl border border-[#CDCED1] bg-white px-4 py-3 text-left";
export const CELL_LABEL_CLASS = "text-xs font-semibold uppercase tracking-wide text-[#4E4F52]";
export const CELL_VALUE_CLASS = "truncate text-lg font-semibold text-[#181818]";
export const CELL_HINT_CLASS = "text-sm text-[#4E4F52]";
export const ERROR_TEXT_CLASS = "text-sm font-medium text-[#B42318]";

// MUI inputs inside a field box: no outline or underline, the box is the field.
export const cellInputSx = {
  "& .MuiInputBase-root": { padding: 0, fontSize: "1.0625rem", fontWeight: 600, color: "#181818" },
  "& .MuiInputBase-input": { padding: 0, textOverflow: "ellipsis" },
  "& .MuiInputBase-input::placeholder": { color: "#8A9096", opacity: 1, fontWeight: 500 },
} as const;

export const placeLabel = (place: Place) => `${place.city} (${place.code})`;

export const placeHint = (place: Place | null) =>
  !place ? "" : place.type === "CITY" ? `All airports · ${place.country}` : place.name;
