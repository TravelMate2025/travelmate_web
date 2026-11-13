// Field look from the approved mock (Travelers .f): 14px semibold label,
// 46px input, 10px corners, 14px side padding, 16px medium text, 13px hint,
// red star for required fields.
export const FIELD = "flex min-w-0 flex-col gap-1.5";
/** Default field width (mock .f: flex 1 1 240px); narrower fields pass their own. */
export const FIELD_GROW = "flex-[1_1_15rem]";
export const INPUT =
  "min-h-11.5 w-full rounded-[0.625rem] border bg-white px-3.5 text-base font-medium text-[#181818] aria-[invalid=true]:border-[#B42318] border-[#CDCED1]";
export const HINT = "text-[0.8125rem] text-[#4E4F52]";
export const ERROR = "text-[0.8125rem] font-medium text-[#B42318]";

/** Props that tie an input to its error message. */
export const invalidProps = (id: string, error?: string) =>
  error ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` } : { "aria-invalid": false as const };

/** Value for a half-typed date: fails the date check, so it's reported rather than ignored. */
export const INCOMPLETE_DATE = "incomplete";
