import { useMemo, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { usePlaceSearch } from "../../hooks/usePlaces";
import type { Place } from "../../types";
import { CELL_CLASS, CELL_HINT_CLASS, CELL_LABEL_CLASS, ERROR_TEXT_CLASS, cellInputSx, placeHint, placeLabel } from "./fieldStyles";

interface PlaceFieldProps {
  id: string;
  label: string;
  value: Place | null;
  onChange: (place: Place | null) => void;
  error?: string;
  /** Extra classes, e.g. to join the From and To boxes. */
  className?: string;
}

export const PlaceField = ({ id, label, value, onChange, error, className = "" }: PlaceFieldProps) => {
  const [input, setInput] = useState("");
  const { options, loading } = usePlaceSearch(input);
  // Keep the chosen place in the list so MUI can show it while new results load
  const choices = useMemo(
    () => (value && !options.some((o) => o.code === value.code) ? [value, ...options] : options),
    [options, value]
  );
  const errorId = `${id}-error`;

  return (
    <div className={`${CELL_CLASS} ${className}`}>
      <label htmlFor={id} className={CELL_LABEL_CLASS}>
        {label}
      </label>
      <Autocomplete
        id={id}
        value={value}
        onChange={(_, next) => onChange(next)}
        inputValue={input}
        onInputChange={(_, next) => setInput(next)}
        options={choices}
        filterOptions={(all) => all}
        getOptionLabel={placeLabel}
        isOptionEqualToValue={(a, b) => a.code === b.code}
        loading={loading}
        forcePopupIcon={false}
        noOptionsText={input.trim().length < 2 ? "Type a city or airport" : "No matching airports"}
        sx={cellInputSx}
        slotProps={{ popper: { className: "min-w-80" } }}
        renderOption={(props, place) => {
          const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & { key?: React.Key };
          return (
            <li key={key} {...rest}>
              <span className="flex w-full items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="block font-semibold text-[#181818]">
                    {place.type === "CITY" ? `${place.city} (all airports)` : place.city}
                  </span>
                  <span className="block truncate text-xs text-[#4E4F52]">
                    {place.type === "CITY" ? place.country : `${place.name}, ${place.country}`}
                  </span>
                </span>
                <span className="text-sm font-bold text-[#023E8A]">{place.code}</span>
              </span>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="City or airport"
            error={Boolean(error)}
            inputProps={{ ...params.inputProps, "aria-describedby": error ? errorId : undefined }}
            InputProps={{ ...params.InputProps, disableUnderline: true }}
          />
        )}
      />
      {error ? (
        <span id={errorId} className={ERROR_TEXT_CLASS}>
          {error}
        </span>
      ) : (
        <span className={`truncate ${CELL_HINT_CLASS}`}>{placeHint(value) || " "}</span>
      )}
    </div>
  );
};
