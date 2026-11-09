/**
 * Joins a visitor's browsing on this site with their journey on the booking site (IMPT): the Growth
 * Booster tracking script gives every visitor an anonymous id, and we pass it on the "Check price"
 * link as `rr_sid`. No name, email or other personal data is added.
 */
declare global {
  interface Window {
    gbVisitorId?: () => string;
  }
}

const VISITOR_KEY = "gb_sid";

export const visitorId = (): string => {
  try {
    if (typeof window.gbVisitorId === "function") return window.gbVisitorId() || "";
    return window.localStorage.getItem(VISITOR_KEY) || "";
  } catch {
    return "";
  }
};

/** `book_url` with the visitor id added (unchanged when there is no id, or the link is not a valid URL). */
export const withVisitor = (bookUrl: string): string => {
  const id = visitorId();
  if (!id) return bookUrl;
  try {
    const url = new URL(bookUrl);
    if (!url.searchParams.has("rr_sid")) url.searchParams.set("rr_sid", id);
    return url.toString();
  } catch {
    return bookUrl;
  }
};

/** Click handler: re-reads the id at click time (the tracking script may load after the page rendered). */
export const refreshBookLink =
  (bookUrl: string) =>
  (e: { currentTarget: HTMLAnchorElement }): void => {
    e.currentTarget.href = withVisitor(bookUrl);
  };
