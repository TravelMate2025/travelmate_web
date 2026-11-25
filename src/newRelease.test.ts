import { describe, expect, it, vi } from "vitest";
import { isStaleCodeError, reloadOnceForNewRelease } from "./newRelease";

const memory = () => {
  const data = new Map<string, string>();
  return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) };
};

describe("new release", () => {
  it("recognises the browsers' 'old code file is gone' errors, and nothing else", () => {
    expect(isStaleCodeError(new TypeError("Failed to fetch dynamically imported module: https://testing.travelmateglo.com/assets/FlightResultsPage-3DUZXK6B.js"))).toBe(true);
    expect(isStaleCodeError(new TypeError("error loading dynamically imported module"))).toBe(true); // Firefox
    expect(isStaleCodeError(new TypeError("Importing a module script failed."))).toBe(true); // Safari
    expect(isStaleCodeError(new Error("Cannot read properties of undefined"))).toBe(false);
    expect(isStaleCodeError(undefined)).toBe(false);
  });

  it("reloads once, then not again within 10 seconds (a real outage shows the error)", () => {
    const storage = memory();
    const reload = vi.fn();
    let now = 1_000_000;
    expect(reloadOnceForNewRelease({ storage, now: () => now, reload })).toBe(true);
    now += 2_000;
    expect(reloadOnceForNewRelease({ storage, now: () => now, reload })).toBe(false);
    now += 20_000;
    expect(reloadOnceForNewRelease({ storage, now: () => now, reload })).toBe(true);
    expect(reload).toHaveBeenCalledTimes(2);
  });

  it("still reloads when storage is unavailable", () => {
    const reload = vi.fn();
    expect(reloadOnceForNewRelease({ storage: null, reload })).toBe(true);
    expect(reload).toHaveBeenCalledOnce();
  });
});
