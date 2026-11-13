import { beforeEach, describe, expect, it } from "vitest";
import { getReturnPath, rememberReturnPath, takeReturnPath, toReturnPath } from "./returnPath";

describe("returnPath", () => {
  it("builds the full in-app path", () => {
    expect(toReturnPath({ pathname: "/bookings", search: "?tab=stays", hash: "#top" })).toBe("/bookings?tab=stays#top");
  });

  it("accepts same-app paths", () => {
    expect(getReturnPath({ from: "/account/security" })).toBe("/account/security");
  });

  it.each([
    ["missing state", null],
    ["no from", { email: "ada@example.com" }],
    ["absolute URL", { from: "https://evil.example.com" }],
    ["protocol-relative URL", { from: "//evil.example.com" }],
    ["non-string", { from: 42 }],
  ])("rejects %s", (_label, state) => {
    expect(getReturnPath(state)).toBeNull();
  });
});

describe("remembered return path (sign-up and password reset lose route state)", () => {
  beforeEach(() => window.sessionStorage.clear());
  const at = Date.parse("2026-11-13T12:00:00Z");

  it("comes back to the remembered page once, then forgets it", () => {
    rememberReturnPath("/flights/travellers?offer=abc", at);
    expect(takeReturnPath(null, at + 5 * 60_000)).toBe("/flights/travellers?offer=abc");
    expect(takeReturnPath(null, at + 6 * 60_000)).toBeNull();
  });

  it("prefers route state, and forgets the remembered page too", () => {
    rememberReturnPath("/bookings", at);
    expect(takeReturnPath({ from: "/account/security" }, at)).toBe("/account/security");
    expect(takeReturnPath(null, at)).toBeNull();
  });

  it("ignores a page remembered over an hour ago, or one that isn't in the app", () => {
    rememberReturnPath("/bookings", at);
    expect(takeReturnPath(null, at + 61 * 60_000)).toBeNull();
    rememberReturnPath("https://evil.example.com", at);
    expect(takeReturnPath(null, at)).toBeNull();
  });
});
