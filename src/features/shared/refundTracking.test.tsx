import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { RefundPanel } from "./refundTracking";

describe("RefundPanel customer contract", () => {
  afterEach(cleanup);

  it.each([
    ["pending", "Refund under review"],
    ["processing", "Refund processing"],
    ["completed", "Refund completed"],
    ["failed", "Refund needs attention"],
    ["not_applicable", "No refund applies"],
  ])("renders the %s refund state", (status, label) => {
    render(
      <RefundPanel
        refund={{
          status,
          requested_amount: "600.00",
          settled_amount: status === "completed" ? "600.00" : null,
          currency: "NGN",
          refund_reference: "refund-001",
          failure_message: status === "failed" ? "Contact support." : null,
        }}
      />,
    );

    expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    if (status !== "not_applicable") {
      expect(screen.getAllByText(/NGN/).length).toBeGreaterThan(0);
    }
  });

  it("does not present a refund workflow for bookings without a refund", () => {
    render(<RefundPanel refund={{ status: "not_applicable" }} />);

    expect(screen.getAllByText("No refund applies").length).toBeGreaterThan(0);
    expect(screen.queryByText("Refund under review")).not.toBeInTheDocument();
  });

  it("exposes the support handoff for failed refunds", () => {
    render(
      <RefundPanel
        refund={{
          status: "failed",
          support_link: "/tickets?booking_reference=BK-1&refund_reference=RF-1",
          next_action: "Contact support so our team can review the refund.",
        }}
      />,
    );

    expect(screen.getByRole("link", { name: /contact support/i })).toHaveAttribute(
      "href",
      "/tickets?booking_reference=BK-1&refund_reference=RF-1",
    );
  });

  it("explains partial refunds against the original payment without exposing provider data", () => {
    render(
      <RefundPanel
        refund={{
          status: "processing",
          original_amount: "100000",
          requested_amount: "60000",
          refund_percent: 60,
          retained_amount: "40000",
          currency: "NGN",
        }}
      />,
    );

    expect(screen.getAllByText("Amount paid").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Expected refund").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Amount retained under policy").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/60%/).length).toBeGreaterThan(0);
  });
});
