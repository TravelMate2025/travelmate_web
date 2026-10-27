import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { SanitizedHtml } from "./SanitizedHtml";

describe("SanitizedHtml", () => {
  it("keeps ordinary CMS formatting", () => {
    const { container } = render(
      <SanitizedHtml html={'<h2>Privacy</h2><p>We <strong>never</strong> sell data. <a href="/contact">Contact us</a></p>'} />
    );

    expect(container.querySelector("h2")?.textContent).toBe("Privacy");
    expect(container.querySelector("strong")).not.toBeNull();
    expect(container.querySelector("a")?.getAttribute("href")).toBe("/contact");
  });

  it("strips scripts, event handlers and javascript: links", () => {
    const { container } = render(
      <SanitizedHtml
        html={
          '<p>Hi</p><script>alert(1)</script><img src="x" onerror="alert(2)"><a href="javascript:alert(3)">x</a>'
        }
      />
    );

    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("img")?.hasAttribute("onerror")).toBe(false);
    expect(container.querySelector("a")?.getAttribute("href")).toBeNull();
    expect(container.textContent).toContain("Hi");
  });
});
