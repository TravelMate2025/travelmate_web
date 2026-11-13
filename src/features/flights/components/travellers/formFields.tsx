import { useEffect, useState, type ReactNode } from "react";
import { ERROR, FIELD, FIELD_GROW, HINT, INCOMPLETE_DATE, INPUT, invalidProps } from "./formStyles";

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  /** Flex sizing; replaces the default (e.g. "flex-[0_1_9.375rem]" for a 150px field). */
  size?: string;
  children: ReactNode;
}

export const Field = ({ id, label, required, hint, error, size = FIELD_GROW, children }: FieldProps) => (
  <div className={`${FIELD} ${size}`}>
    <label htmlFor={id} className="text-sm font-semibold text-[#181818]">
      {label}
      {required && (
        <>
          {" "}
          <span className="text-[#B42318]" aria-hidden>
            *
          </span>
          <span className="sr-only">(required)</span>
        </>
      )}
    </label>
    {children}
    {error ? (
      <span id={`${id}-error`} className={ERROR}>
        {error}
      </span>
    ) : (
      hint && <span className={HINT}>{hint}</span>
    )}
  </div>
);


const toText = (iso: string) => (iso ? `${iso.slice(8, 10)} / ${iso.slice(5, 7)} / ${iso.slice(0, 4)}` : "");

/** Mock: "DD / MM / YYYY" typed date. Emits YYYY-MM-DD once complete, "" when cleared. */
export const DateInput = ({
  id,
  value,
  onChange,
  error,
}: {
  id: string;
  value: string;
  onChange: (iso: string) => void;
  error?: string;
}) => {
  const [text, setText] = useState(toText(value));
  // Follow outside changes (e.g. "Use my profile details"); half-typed dates stay as typed
  useEffect(() => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) setText(toText(value));
    else if (value === "") setText("");
  }, [value]);

  const handle = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
    setText(parts.join(" / "));
    if (digits.length === 8) onChange(`${digits.slice(4, 8)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`);
    else if (digits.length === 0) onChange("");
    // Unfinished: a value that fails the date check, so it's reported rather than ignored
    else onChange(INCOMPLETE_DATE);
  };

  return (
    <input
      id={id}
      inputMode="numeric"
      autoComplete="off"
      placeholder="DD / MM / YYYY"
      value={text}
      onChange={(e) => handle(e.target.value)}
      className={INPUT}
      {...invalidProps(id, error)}
    />
  );
};
