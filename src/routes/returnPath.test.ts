import { describe, expect, it } from "vitest";
import { getReturnPath, toReturnPath } from "./returnPath";

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
