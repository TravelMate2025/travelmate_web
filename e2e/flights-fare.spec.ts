import { expect, test, type Page } from "@playwright/test";

// Phase W3 (+ W8 fare families): the Fare step, on the recorded Amadeus data.
const RESULTS =
  "/flights/results?trip=RETURN&legs=LOS.LON.2026-12-15_LON.LOS.2026-12-28&adults=1&cabin=ECONOMY&currency=USD";

const openCheapestFare = async (page: Page, scenario?: string) => {
  await page.goto(scenario ? `${RESULTS}&mock=${scenario}` : RESULTS);
  await page.getByRole("tab", { name: /Cheapest/ }).click();
  await page.getByRole("article").first().getByRole("button", { name: "See fares" }).click();
  await expect(page).toHaveURL(/\/flights\/fare\?offer=mock-return_los_lon-1$/);
};

/** Travellers is signed-in only, so the hand-over to it needs a session. */
const signIn = (page: Page) =>
  page.addInitScript(() => {
    const auth = {
      email: "adaeze@example.com",
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: { profileImage: "", id: 7, email: "adaeze@example.com", name: "Adaeze Okafor" },
      registrationComplete: true,
    };
    window.localStorage.setItem(
      "persist:root",
      JSON.stringify({ auth: JSON.stringify(auth), profile: "null", stays: "null", cars: "null", _persist: JSON.stringify({ version: -1, rehydrated: true }) })
    );
  });

test("shows the selected flight, a confirmed price and the airline's fare families", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await signIn(page);
  await openCheapestFare(page);
  await expect(page.getByRole("navigation", { name: "Booking steps" })).toContainText("1 Flight ✓");
  await expect(page.getByRole("region", { name: "Selected flight" })).toContainText("Royal Air Maroc");
  await expect(page.getByText("Price confirmed with the airline")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Choose your fare" })).toBeVisible();

  const fares = page.getByRole("radiogroup", { name: "Fare options" });
  await expect(fares.getByRole("radio")).toHaveCount(3);
  await expect(fares.getByRole("radio", { name: "Eco Essential, selected" })).toBeVisible();
  await expect(fares).toContainText("Best value for bags");
  await expect(fares).toContainText("$840.20");
  await expect(fares).toContainText("+$52.50");
  await page.screenshot({ path: "test-results/flights-fare-1280.png", fullPage: true });

  await fares.getByRole("radio", { name: "Select Eco Classic" }).click();
  await expect(fares.getByRole("radio", { name: "Eco Classic, selected" })).toBeVisible();
  await expect(page.getByText(/^Selected: Eco Classic/)).toBeVisible();
  await expect(page.getByText("$840.20 total")).toBeVisible();

  await page.getByText("Full fare rules · Eco Classic").click();
  await expect(page.getByText("ANY TIME PER DIRECTION CHARGE EUR 130.00", { exact: false })).toBeVisible();

  await page.getByRole("button", { name: "Continue to traveller details" }).click();
  await expect(page).toHaveURL(/\/flights\/travellers\?offer=mock-fare-eclassic$/);
  await expect(page.getByRole("heading", { name: "Adult 1 · lead traveller" })).toBeVisible();
});

test("asks before continuing when the airline raised the price", async ({ page }) => {
  await openCheapestFare(page, "price-up");
  const dialog = page.getByRole("dialog", { name: "The airline changed the price" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("$787.70");
  await expect(dialog).toContainText("$827.09"); // synthetic +5% in the mock scenario
  await page.screenshot({ path: "test-results/flights-price-changed-1280.png" });
  await dialog.getByRole("button", { name: "Continue at the new price" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText("$827.09 total")).toBeVisible();
});

test("says so when the price went down", async ({ page }) => {
  await openCheapestFare(page, "price-down");
  await expect(page.getByText("Good news: the price went down")).toBeVisible();
});

test("explains sold-out and expired offers", async ({ page }) => {
  await openCheapestFare(page, "sold-out");
  await expect(page.getByRole("heading", { name: "These seats are no longer available" })).toBeVisible();
  await page.getByRole("button", { name: "See other flights" }).click();
  await expect(page).toHaveURL(/\/flights\/results\?/);

  await page.goto("/flights/fare?offer=never-searched&mock=off");
  await expect(page.getByRole("heading", { name: "This price has expired" })).toBeVisible();
});

test("an airline without fare families shows the chosen fare alone", async ({ page }) => {
  await page.goto(RESULTS);
  await page.getByRole("checkbox", { name: "Royal Air Maroc" }).uncheck();
  await page.getByRole("article").first().getByRole("button", { name: "See fares" }).click();
  const fares = page.getByRole("radiogroup", { name: "Fare options" });
  await expect(fares.getByRole("radio")).toHaveCount(1);
  await expect(fares).toContainText("Your chosen fare");
});

test("fits a phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await openCheapestFare(page);
  await expect(page.getByRole("radiogroup", { name: "Fare options" }).getByRole("radio")).toHaveCount(3);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await page.screenshot({ path: "test-results/flights-fare-375.png", fullPage: true });
});
