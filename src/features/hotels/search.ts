import { summariseGuests } from "./guests";
import type { SearchState } from "./types";

export const DEFAULT_SEARCH: SearchState = {
  q: "",
  lat: null,
  lng: null,
  name: "",
  checkIn: "",
  checkOut: "",
  adults: 2,
  rooms: 1,
  childAges: [],
};

const ISO = /^\d{4}-\d{2}-\d{2}$/;

const toInt = (value: string | null, min: number, max: number, fallback: number) => {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) && n >= min && n <= max ? n : fallback;
};

const toCoord = (value: string | null, limit: number) => {
  if (value === null || value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && Math.abs(n) <= limit ? n : null;
};

/** Reads the visitor's search out of a page address; anything odd falls back to a safe default. */
export function parseSearch(params: URLSearchParams): SearchState {
  const checkIn = params.get("check_in") ?? "";
  const checkOut = params.get("check_out") ?? "";
  const datesOk = ISO.test(checkIn) && ISO.test(checkOut) && checkOut > checkIn;
  const ages = (params.get("child_ages") ?? "")
    .split(",")
    .map((a) => Number.parseInt(a, 10))
    .filter((a) => Number.isFinite(a) && a >= 0 && a <= 15)
    .slice(0, 10);
  return {
    q: (params.get("q") ?? "").slice(0, 60),
    lat: toCoord(params.get("lat"), 90),
    lng: toCoord(params.get("lng"), 180),
    name: (params.get("name") ?? "").slice(0, 80),
    checkIn: datesOk ? checkIn : "",
    checkOut: datesOk ? checkOut : "",
    adults: toInt(params.get("adults"), 1, 16, DEFAULT_SEARCH.adults),
    rooms: toInt(params.get("rooms"), 1, 8, DEFAULT_SEARCH.rooms),
    childAges: ages,
  };
}

/** The reverse: the query string for our own pages (and for the API, which uses the same names). */
export function buildSearchParams(state: SearchState, extra: Record<string, string> = {}): URLSearchParams {
  const p = new URLSearchParams();
  if (state.lat !== null && state.lng !== null) {
    p.set("lat", String(state.lat));
    p.set("lng", String(state.lng));
    if (state.name) p.set("name", state.name);
  } else if (state.q.trim()) {
    p.set("q", state.q.trim());
  }
  if (state.checkIn && state.checkOut) {
    p.set("check_in", state.checkIn);
    p.set("check_out", state.checkOut);
  }
  p.set("adults", String(state.adults));
  p.set("rooms", String(state.rooms));
  if (state.childAges.length) p.set("child_ages", state.childAges.join(","));
  for (const [k, v] of Object.entries(extra)) p.set(k, v);
  return p;
}

export const hasPlace = (state: SearchState) =>
  (state.lat !== null && state.lng !== null) || state.q.trim().length >= 2;

/** Date <-> YYYY-MM-DD in the visitor's own calendar (no time-zone shifts). */
export const toIsoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const fromIsoDate = (s: string): Date | null => {
  if (!ISO.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const nightsBetween = (checkIn: string, checkOut: string) => {
  const a = fromIsoDate(checkIn);
  const b = fromIsoDate(checkOut);
  if (!a || !b) return 0;
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86_400_000));
};

const shortDate = (iso: string) =>
  fromIsoDate(iso)?.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) ?? "";

/** "12 Dec – 15 Dec · 3 nights · 2 adults, 1 room" (or a nudge to add dates). */
export function stayLine(search: SearchState) {
  const nights = nightsBetween(search.checkIn, search.checkOut);
  const when =
    nights > 0
      ? `${shortDate(search.checkIn)} – ${shortDate(search.checkOut)} · ${nights} night${nights === 1 ? "" : "s"}`
      : "Add your dates for live prices";
  return `${when} · ${summariseGuests({ adults: search.adults, rooms: search.rooms, childAges: search.childAges })}`;
}
