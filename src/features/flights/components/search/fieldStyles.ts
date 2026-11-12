import type { Place } from "../../types";

// Field boxes, sized to the approved web mock:
// - search card (.tm-field): padding 12/16, gap 6, label 12px/600 uppercase .04em,
//   value 17px/600, sub-line 13px  -> about 90px tall
// - multi-city rows (.fld): padding 10/14, gap 4, value 16px bold, no sub-line -> about 61px
const CELL_BASE = "relative flex min-w-0 flex-1 basis-44 flex-col rounded-xl border border-[#CDCED1] bg-white text-left";
export const cellClass = (compact = false) => `${CELL_BASE} ${compact ? "gap-1 px-3.5 py-2.5" : "gap-1.5 px-4 py-3"}`;
export const CELL_CLASS = cellClass();

export const CELL_LABEL_CLASS = "text-xs font-semibold uppercase leading-tight tracking-[0.04em] text-[#4E4F52]";
export const cellValueClass = (compact = false) =>
  `truncate leading-tight text-[#181818] ${compact ? "text-base font-bold" : "text-[1.0625rem] font-semibold"}`;
export const CELL_VALUE_CLASS = cellValueClass();
export const CELL_HINT_CLASS = "text-[0.8125rem] leading-tight text-[#4E4F52]";
export const ERROR_TEXT_CLASS = "text-[0.8125rem] font-medium leading-tight text-[#B42318]";

// MUI inputs inside a field box: no outline, underline or extra line height; the box is the field.
export const cellInputSx = (compact = false) =>
  ({
    // The input sits in an inline box that would otherwise take the page's 24px line height
    display: "flex",
    "& .MuiInputBase-root": {
      padding: 0,
      fontSize: compact ? "1rem" : "1.0625rem",
      fontWeight: compact ? 700 : 600,
      lineHeight: 1.25,
      height: "1.25em",
      color: "#181818",
    },
    "& .MuiInputBase-input": { padding: 0, height: "1.25em", textOverflow: "ellipsis" },
    // Autocomplete adds its own input padding with a more specific rule
    "& .MuiAutocomplete-inputRoot.MuiInput-root": { paddingBottom: 0 },
    "& .MuiAutocomplete-inputRoot.MuiInput-root .MuiAutocomplete-input": { padding: 0 },
    "& .MuiInputBase-input::placeholder": { color: "#8A9096", opacity: 1, fontWeight: 500 },
  }) as const;

export const placeLabel = (place: Place) => `${place.city} (${place.code})`;

export const placeHint = (place: Place | null) =>
  !place ? "" : place.type === "CITY" ? `All airports · ${place.country}` : place.name;
