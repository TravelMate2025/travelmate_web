import { describe, expect, it } from "vitest";
import priceCheckFixture from "../mocks/fixtures/priceCheck.json";
import type { PriceCheckResult, TravelerInput } from "../types";
import { bagGroups, bagsText, bagsTotal, chooseBag, chosenIn, includedBagsText, lockedQuantity } from "./bags";

// The real Royal Air Maroc bag catalogue (Flight Offers Price with bags, test host, 12 Nov 2026)
const priced = priceCheckFixture as unknown as PriceCheckResult;
const adaeze: TravelerInput = {
  travelerId: "1",
  type: "ADULT",
  firstName: "ADAEZE",
  lastName: "OKAFOR",
  gender: "FEMALE",
  dateOfBirth: "1990-04-12",
  associatedAdultId: null,
  passport: null,
  frequentFlyer: null,
};

describe("extra bags", () => {
  const groups = bagGroups(priced.bagOptions, priced.offer, [adaeze], "USD");

  it("groups the options per direction like the mock", () => {
    expect(groups.map((g) => g.title)).toEqual(["Outbound · Tue 15 Dec", "Return · Mon 28 Dec"]);
    expect(groups[0].subtitle).toBe("Lagos → Casablanca → London Stansted · Adult 1, Adaeze Okafor");
    expect(groups[0].choices.map((c) => `${c.label} | ${c.detail} | ${c.price}`)).toEqual([
      "No extra bag | Keep your included bag | Free",
      "+1 bag | One extra bag | $210.00",
      "+2 bags | Two extra bags | $530.00",
    ]);
    expect(groups[1].choices.map((c) => c.price)).toEqual(["Free", "$235.20", "$593.60"]);
  });

  it("keeps the same number of extra bags each way for a traveller (airline rule)", () => {
    // bag-3 / bag-4 = outbound +1 / +2; bag-1 / bag-2 = return +1 / +2
    let chosen = chooseBag(groups[0], [], "bag-3", groups);
    expect(lockedQuantity(groups[1], groups, chosen)).toBe(1); // return: +1 or none
    chosen = chooseBag(groups[1], chosen, "bag-1", groups);
    expect(chosen).toEqual(["bag-3", "bag-1"]);
    // switching the outbound to +2 clears the return's +1 instead of failing at booking
    chosen = chooseBag(groups[0], chosen, "bag-4", groups);
    expect(chosen).toEqual(["bag-4"]);
    expect(lockedQuantity(groups[1], groups, chosen)).toBe(2);
    // one direction only is fine; clearing it frees the other
    expect(lockedQuantity(groups[1], groups, chooseBag(groups[0], chosen, null, groups))).toBeNull();
  });

  it("keeps one choice per direction and totals them", () => {
    let chosen = chooseBag(groups[0], [], "bag-3");
    chosen = chooseBag(groups[1], chosen, "bag-2");
    chosen = chooseBag(groups[0], chosen, "bag-4");
    expect(chosen).toEqual(["bag-2", "bag-4"]);
    expect(chosenIn(groups[0], chosen)).toBe("bag-4");
    expect(bagsTotal(priced.bagOptions, chosen, "USD")).toEqual({ amount: "1123.60", currency: "USD" });
    expect(chooseBag(groups[1], chosen, null)).toEqual(["bag-4"]);
  });

  it("describes bought and included bags", () => {
    const bought = priced.bagOptions.filter((b) => ["bag-3", "bag-2"].includes(b.id));
    expect(bagsText(bought, priced.offer)).toBe("+1 bag outbound, +2 bags return");
    expect(includedBagsText(priced.offer)).toEqual({ brand: "Eco Essential", text: "1 checked bag and 1 cabin bag per person, each way." });
  });
});
