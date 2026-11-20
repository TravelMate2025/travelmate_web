import { describe, expect, it } from "vitest";
import fareOptionsFixture from "../mocks/fixtures/fareOptions.json";
import type { FareOption } from "../types";
import { bestForBagsToken, fareRows, fareTagline } from "./fareRows";

// Real Royal Air Maroc fare families from the test host (Branded Fares Upsell)
const [essential, classic, flex] = fareOptionsFixture as unknown as FareOption[];
const asText = (option: FareOption) => fareRows(option).map((r) => `${r.state}: ${r.text}`);

describe("fare rows (mock: Fares)", () => {
  it("Eco Essential", () => {
    expect(asText(essential)).toEqual([
      "Included: 1 checked bag, 23 kg",
      "Included: Cabin bag, 10 kg",
      "Included: Meal and drinks",
      "For a fee: Choose your seat",
      "For a fee: Changes before and after departure",
      "No: Refunds",
      "For a fee: Priority check-in and boarding",
      "Included: 50% miles earned",
    ]);
  });

  it("Eco Classic", () => {
    expect(asText(classic)).toEqual([
      "Included: 2 checked bags, 23 kg each",
      "Included: Cabin bag, 10 kg",
      "Included: Meal and drinks",
      "Included: Choose your seat",
      "For a fee: Changes before and after departure",
      "For a fee: Refunds before and after departure",
      "For a fee: Priority check-in and boarding",
      "Included: 100% miles earned",
    ]);
  });

  it("Eco Flex", () => {
    expect(asText(flex)).toEqual([
      "Included: 2 checked bags, 23 kg each",
      "Included: Cabin bag, 10 kg",
      "Included: Meal and drinks",
      "Included: Choose your seat",
      "Free: Changes before and after departure",
      "Free: Refunds before and after departure",
      "Included: Priority check-in and boarding",
      "Included: 150% miles earned",
    ]);
  });

  it("taglines and the bags badge match the mock", () => {
    expect(fareTagline(essential, essential)).toBe("Lowest price");
    expect(fareTagline(classic, essential)).toBe("More bags, free seat choice");
    expect(fareTagline(flex, essential)).toBe("Change or cancel freely");
    expect(bestForBagsToken([essential, classic, flex])).toBe(classic.offerToken);
    expect(bestForBagsToken([essential])).toBeNull();
  });

  it("falls back to fare conditions when the airline lists no amenities", () => {
    const plain = fareRows({
      baggage: { checked: null, cabin: null },
      amenities: [],
      fareConditions: { refundable: true, changeable: true, changePenalty: { amount: "50.00", currency: "USD" } },
    });
    expect(plain.map((r) => `${r.state}: ${r.text}`)).toEqual(["No: Checked bag", "For a fee: Changes", "Included: Refunds"]);
  });
});
