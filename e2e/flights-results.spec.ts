import { expect, test } from "@playwright/test";

// Phase W2: results on the recorded Amadeus data (mock mode).
const RESULTS =
  "/flights/results?trip=RETURN&legs=LOS.LON.2026-12-15_LON.LOS.2026-12-28&adults=1&cabin=ECONOMY&currency=USD";
const cards = (page: import("@playwright/test").Page) => page.getByRole("article");

test("shows the mock's results layout with real offers", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(RESULTS);
  await expect(page.getByRole("navigation", { name: "Booking steps" })).toContainText("1 Flight");
  await expect(page.getByRole("tab", { name: /Best/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tab", { name: /Cheapest/ })).toContainText("$787.70");
  await expect(page.getByRole("tab", { name: /Fastest/ })).toContainText("19h 10m total");
  await expect(cards(page)).toHaveCount(10);

  await page.getByRole("tab", { name: /Cheapest/ }).click();
  const first = cards(page).first();
  await expect(first).toContainText("Royal Air Maroc");
  await expect(first).toContainText("$787.70");
  await expect(first).toContainText("Arrive Stansted, return from Gatwick");
  await expect(first).toContainText("Overnight stop in Casablanca on return");
  await expect(first).toContainText("3 seats left at this price");

  await first.getByRole("button", { name: "Flight details" }).click();
  await expect(first).toContainText("AT556 · Royal Air Maroc · Boeing 737 MAX 8 · 4h 45m · Economy");
  await expect(first).toContainText("Overnight stop in Casablanca · 17h 05m");
  await page.screenshot({ path: "test-results/flights-results-1280.png", fullPage: true });

  await page.getByRole("button", { name: "Show more flights" }).click();
  await expect(cards(page)).toHaveCount(20);
});

test("filters narrow the list and can be reset", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(RESULTS);
  await page.getByLabel("Refundable").check();
  await expect(page.getByText(/^1 of 60 flights match your filters/)).toBeVisible();
  await expect(cards(page)).toHaveCount(1);
  await page.getByLabel("Free changes").check();
  await expect(page.getByText("No flights match these filters")).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.getByText(/^60 flights ·/)).toBeVisible();
  await page.getByRole("checkbox", { name: "Royal Air Maroc" }).uncheck();
  await expect(page.getByText(/^25 of 60 flights/)).toBeVisible();
});

test("on a phone the filters open from a button", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto(RESULTS);
  await expect(page.getByRole("complementary", { name: "Filters" })).toBeHidden();
  await page.getByRole("button", { name: "Filters" }).click();
  await expect(page.getByRole("complementary", { name: "Filters" })).toBeVisible();
  await page.screenshot({ path: "test-results/flights-results-375.png", fullPage: true });
});

test("changing currency searches again in that currency", async ({ page }) => {
  await page.goto(RESULTS);
  await expect(page.getByRole("tab", { name: /Cheapest/ })).toContainText("$787.70");
  await page.getByLabel("Currency").selectOption("GBP");
  await expect(page).toHaveURL(/currency=GBP/);
  await expect(page.getByRole("tab", { name: /Cheapest/ })).toContainText("£");
});

test("See fares remembers the offer and opens the Fare step", async ({ page }) => {
  await page.goto(RESULTS);
  await cards(page).first().getByRole("button", { name: "See fares" }).click();
  await expect(page).toHaveURL(/\/flights\/fare\?offer=mock-return_los_lon-/);
});

test("multi-city results list one price for the whole trip", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/flights/multi-city?trip=MULTI_CITY&legs=LOS.LON.2026-12-15_LON.DXB.2026-12-20_DXB.LOS.2026-12-28&adults=1&cabin=ECONOMY&currency=USD");
  await expect(page.getByRole("heading", { name: "20 options for your 3 flights" })).toBeVisible();
  const first = cards(page).first();
  await expect(first).toContainText("Emirates");
  await expect(first).toContainText("$1,299.60");
  await expect(first).toContainText("whole trip, per adult");
  await expect(first.getByRole("button", { name: "Select" })).toBeVisible();
  await page.screenshot({ path: "test-results/flights-multicity-results-1280.png", fullPage: true });
});
