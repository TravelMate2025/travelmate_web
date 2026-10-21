import type { Location } from "react-router-dom";

// PrivateRoute stores the page the user was trying to reach in route state as
// `from`; the sign-in pages pass it along and return there afterwards.
export type ReturnPathState = { from?: string };

export const toReturnPath = (location: Pick<Location, "pathname" | "search" | "hash">) =>
  `${location.pathname}${location.search}${location.hash}`;

// Only same-app paths are accepted, so route state can never send the user off-site
export const getReturnPath = (state: unknown): string | null => {
  const from = (state as ReturnPathState | null)?.from;
  return typeof from === "string" && from.startsWith("/") && !from.startsWith("//") ? from : null;
};
