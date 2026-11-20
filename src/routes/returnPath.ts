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

// Route state is lost on the longer ways in: signing up (email code, then a
// password) and resetting a password (an emailed link). PrivateRoute also
// remembers the page for this browser tab, for up to an hour, so every way of
// signing in can come back to it.
const STORAGE_KEY = "tm.auth.returnPath";
const MAX_AGE_MS = 60 * 60 * 1000;

export const rememberReturnPath = (path: string, now = Date.now()) => {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ path, at: now }));
  } catch {
    // Storage blocked: route state still covers the short way in
  }
};

const rememberedReturnPath = (now: number): string | null => {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "null") as { path?: unknown; at?: unknown } | null;
    if (!saved || typeof saved.at !== "number" || now - saved.at > MAX_AGE_MS) return null;
    return getReturnPath({ from: saved.path });
  } catch {
    return null;
  }
};

/** Where to go after signing in: the route state's page, else the remembered one. Forgets it once used. */
export const takeReturnPath = (state: unknown, now = Date.now()): string | null => {
  const path = getReturnPath(state) ?? rememberedReturnPath(now);
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to forget
  }
  return path;
};
