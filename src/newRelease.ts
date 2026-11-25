/**
 * After a new release, a page that was already open still asks for the old release's code files
 * (their names change with every build, e.g. FlightResultsPage-3DUZXK6B.js), which no longer exist:
 * "Failed to fetch dynamically imported module". Reloading once loads the new release.
 *
 * At most one reload per RELOAD_WINDOW_MS, so a real outage shows the error screen instead of
 * reloading forever.
 */
const RELOAD_KEY = "tm-new-release-reload-at";
const RELOAD_WINDOW_MS = 10_000;

/** Browsers word it differently: Chrome, Firefox, Safari, and Vite's CSS preload. */
const STALE_CODE =
  /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Unable to preload CSS/i;

export const isStaleCodeError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  return STALE_CODE.test(message);
};

interface Deps {
  storage?: Pick<Storage, "getItem" | "setItem"> | null;
  now?: () => number;
  reload?: () => void;
}

const sessionStore = (): Pick<Storage, "getItem" | "setItem"> | null => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

/** Reloads the page unless it already did so moments ago. Returns whether it reloaded. */
export const reloadOnceForNewRelease = ({ storage = sessionStore(), now = Date.now, reload = () => window.location.reload() }: Deps = {}): boolean => {
  try {
    const last = Number(storage?.getItem(RELOAD_KEY) ?? 0);
    if (last && now() - last < RELOAD_WINDOW_MS) return false;
    storage?.setItem(RELOAD_KEY, String(now()));
  } catch {
    // storage blocked: still reload once; the browser then starts a fresh page
  }
  reload();
  return true;
};

/** Vite reports a page's code that couldn't load; reload instead of showing the error screen. */
export const listenForNewRelease = () => {
  window.addEventListener("vite:preloadError", (event) => {
    if (reloadOnceForNewRelease()) event.preventDefault();
  });
};
