import { afterEach, describe, expect, it } from "vitest";

import { refreshBookLink, visitorId, withVisitor } from "./visitor";

const BOOK = "https://app.impt.io/find-hotel-input?step=detail&hotelId=1&utm_source=travelmateglo.com";

afterEach(() => {
  delete window.gbVisitorId;
  window.localStorage.clear();
});

describe("visitor id on the Check price link", () => {
  it("leaves the link alone when there is no visitor id", () => {
    expect(visitorId()).toBe("");
    expect(withVisitor(BOOK)).toBe(BOOK);
  });

  it("adds rr_sid from the tracking script", () => {
    window.gbVisitorId = () => "abc123";
    expect(new URL(withVisitor(BOOK)).searchParams.get("rr_sid")).toBe("abc123");
    expect(new URL(withVisitor(BOOK)).searchParams.get("utm_source")).toBe("travelmateglo.com");
  });

  it("falls back to the stored id and never doubles the parameter", () => {
    window.localStorage.setItem("gb_sid", "stored9");
    const once = withVisitor(BOOK);
    expect(new URL(once).searchParams.get("rr_sid")).toBe("stored9");
    expect(withVisitor(once)).toBe(once);
  });

  it("keeps a broken link as it was", () => {
    window.gbVisitorId = () => "abc123";
    expect(withVisitor("not a url")).toBe("not a url");
  });

  it("re-reads the id at click time", () => {
    const a = document.createElement("a");
    a.href = BOOK;
    window.gbVisitorId = () => "late1";
    refreshBookLink(BOOK)({ currentTarget: a });
    expect(new URL(a.href).searchParams.get("rr_sid")).toBe("late1");
  });
});
