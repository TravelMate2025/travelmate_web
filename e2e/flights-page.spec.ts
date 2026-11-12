import { expect, test } from "@playwright/test";

// /flights landing page (features.md W1), on the recorded Amadeus data (mock mode).
const widths = [375, 768, 1280];

for (const width of widths) {
  test(`flights page at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/flights");

    await expect(page.getByRole("heading", { name: "Find your next flight" })).toBeVisible();
    await expect(page.getByRole("radiogroup", { name: "Trip type" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Search flights" })).toBeVisible();
    for (const heading of ["Travellers and cabin", "Browse by class", "Why book your flight with us", "Frequently asked questions"]) {
      await expect(page.getByRole("heading", { name: heading })).toBeAttached();
    }
    await expect(page.getByRole("button", { name: /^Passengers seated.*from \$386\.10 one-way/ })).toBeAttached();
    // The home page no longer has a second Stays/Flights/Transfers tab for flights
    await expect(page.getByRole("tab", { name: "Flights" })).toHaveCount(0);
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `test-results/flights-page-${width}.png`, fullPage: true });
  });
}

test("an empty search shows what's missing", async ({ page }) => {
  await page.goto("/flights");
  await page.getByRole("button", { name: "Search flights" }).click();
  await expect(page.getByText("Choose where you're flying from")).toBeVisible();
  await expect(page.getByText("Choose a return date")).toBeVisible();
});

test("a popular route fills From and To", async ({ page }) => {
  await page.goto("/flights");
  await page.getByRole("button", { name: /Lagos → London/ }).first().click();
  await expect(page.locator("#flight-from")).toHaveValue("Lagos (LOS)");
  await expect(page.locator("#flight-to")).toHaveValue("London (LON)");
});

test("the travellers panel updates the search card", async ({ page }) => {
  await page.goto("/flights");
  await page.getByRole("button", { name: "More adults" }).click();
  await page.getByRole("radio", { name: "Business" }).click();
  await expect(page.locator("#flight-travellers")).toHaveText("2 adults · Business");
});

test("a results link runs the search", async ({ page }) => {
  await page.goto("/flights/results?trip=RETURN&legs=LOS.LON.2026-12-15_LON.LOS.2026-12-28&adults=1&cabin=ECONOMY&currency=USD");
  await expect(page.getByRole("heading", { name: "Lagos ⇄ London" })).toBeVisible();
  await expect(page.getByText("60 flights found")).toBeVisible();
});

test("the nav's Flights link and old links open the flights page", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.getByRole("link", { name: "Flights", exact: true }).first().click();
  await expect(page).toHaveURL(/\/flights$/);
  await page.goto("/?tab=flights");
  await expect(page).toHaveURL(/\/flights$/);
});

test("multi-city follows the mock: numbered rows, add and remove", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/flights");
  await page.getByRole("radio", { name: "Multi-city" }).click();
  await expect(page.getByRole("group", { name: /^Flight \d$/ })).toHaveCount(2);
  await expect(page.getByRole("button", { name: "Remove flight 1" })).toBeDisabled();
  await page.getByRole("button", { name: /Add another flight/ }).click();
  await expect(page.getByRole("group", { name: /^Flight \d$/ })).toHaveCount(3);
  await expect(page.getByRole("button", { name: "Remove flight 3" })).toBeEnabled();
  await page.locator("#flight-search").screenshot({ path: "test-results/flights-multicity-1280.png" });
  await page.setViewportSize({ width: 375, height: 900 });
  await page.locator("#flight-search").screenshot({ path: "test-results/flights-multicity-375.png" });
});
