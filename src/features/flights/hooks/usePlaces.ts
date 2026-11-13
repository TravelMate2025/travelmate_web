import { useEffect, useState } from "react";
import { flightsApi } from "../api";
import type { Place } from "../types";

const byCode = new Map<string, Promise<Place | null>>();

/** Turns an IATA code from a URL or saved search back into a place (cached). */
export const resolvePlace = (code: string): Promise<Place | null> => {
  const key = code.toUpperCase();
  let pending = byCode.get(key);
  if (!pending) {
    pending = flightsApi
      .searchPlaces(key)
      .then((results) => results.find((p) => p.code === key) ?? null)
      .catch(() => null);
    byCode.set(key, pending);
  }
  return pending;
};

/** Autocomplete options for what the user is typing (debounced). */
export const usePlaceSearch = (query: string) => {
  const [options, setOptions] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setOptions([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const timer = window.setTimeout(() => {
      flightsApi
        .searchPlaces(q)
        .then((results) => {
          if (!cancelled) setOptions(results);
        })
        .catch(() => {
          if (!cancelled) setOptions([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  return { options, loading };
};

/** Places for a set of codes, e.g. to show city names for a search in the URL. */
export const usePlaceNames = (codes: string[]) => {
  const [places, setPlaces] = useState<Record<string, Place>>({});
  const key = [...new Set(codes)].sort().join(",");

  useEffect(() => {
    let cancelled = false;
    const unique = key ? key.split(",") : [];
    Promise.all(unique.map(resolvePlace)).then((found) => {
      if (cancelled) return;
      setPlaces(Object.fromEntries(found.filter((p): p is Place => p !== null).map((p) => [p.code, p])));
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return places;
};
