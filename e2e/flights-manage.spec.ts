import { expect, test, type Page } from "@playwright/test";

// Phase W7: My bookings and Manage (mock: Manage), on the recorded Amadeus data.
const RESULTS =
  "/flights/results?trip=RETURN&legs=LOS.LON.2026-12-15_LON.LOS.2026-12-28&adults=1&cabin=ECONOMY&currency=USD";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const auth = {
      email: "adaeze@example.com",
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: { profileImage: "", id: 7, email: "adaeze@example.com", name: "Adaeze Okafor" },
      registrationComplete: true,
    };
    const profile = {
      profile: { id: 7, email: "adaeze@example.com", first_name: "Adaeze", last_name: "Okafor", gender: "female", date_of_birth: "1990-04-12", address: null, mobile_number: "+2348012345678", profile_pics: null },
    };
    window.localStorage.setItem(
      "persist:root",
      JSON.stringify({ auth: JSON.stringify(auth), profile: JSON.stringify(profile), stays: "null", cars: "null", _persist: JSON.stringify({ version: -1, rehydrated: true }) })
    );
  });
});

/** Book and pay; `scenario` applies from payment onwards. Lands on the status page. */
const bookAndPay = async (page: Page, scenario?: string) => {
  await page.goto(RESULTS);
  await page.getByRole("tab", { name: /Cheapest/ }).click();
  await page.getByRole("article").first().getByRole("button", { name: "See fares" }).click();
  await page.getByRole("button", { name: "Continue to traveller details" }).click();
  await page.getByRole("button", { name: "Use my profile details" }).click();
  await page.getByRole("button", { name: "Continue to payment" }).click();
  await page.getByLabel(/I've checked the traveller names/).check();
  if (scenario) await page.evaluate((s) => window.sessionStorage.setItem("tm.flights.mockScenario", s), scenario);
  await page.getByRole("button", { name: /Pay .* securely/ }).click();
  await expect(page).toHaveURL(/\/flights\/bookings\/mock-bk-[a-z0-9]+\/status$/);
};

test("manages the booking and cancels before the ticket is issued", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await bookAndPay(page, "slow-ticketing");
  await page.getByRole("link", { name: "Manage booking" }).click();
  await expect(page).toHaveURL(/\/flights\/bookings\/mock-bk-[a-z0-9]+$/);

  await expect(page.getByRole("heading", { level: 1, name: "Lagos ⇄ London" })).toBeVisible();
  await expect(page.getByText("15 – 29 Dec 2026 · 1 adult · Royal Air Maroc")).toBeVisible();
  await expect(page.getByText("Booked · ticket being issued")).toBeVisible();
  const itinerary = page.getByRole("region", { name: "Itinerary" });
  await expect(itinerary).toContainText(/TM-FL-[A-Z0-9]{6}/);
  await expect(itinerary).toContainText("E-ticket · Adaeze Okafor");
  await expect(itinerary).toContainText("AT556 · AT808 · confirmed");
  const fare = page.getByRole("complementary", { name: "Fare conditions" });
  await expect(fare).toContainText("Your fare · Eco Essential");
  await expect(fare).toContainText("Checked bags");

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download itinerary (PDF)" }).click();
  expect((await download).suggestedFilename()).toMatch(/^travelmate-TM-FL-[A-Z0-9]{6}-itinerary\.pdf$/);

  await page.getByRole("button", { name: "Cancel booking" }).click();
  const cancel = page.getByRole("region", { name: "Cancel this booking" });
  await expect(cancel).toContainText("You get back$787.70");
  await expect(cancel).toContainText("We refund $787.70 to your original payment method.");
  await page.screenshot({ path: "test-results/flights-manage-cancel-1280.png", fullPage: true });
  await page.getByLabel("Reason (optional)").selectOption("Found another option");
  await page.getByRole("button", { name: "Cancel and get full refund" }).click();

  await expect(page.getByText("Cancelled · refund in progress")).toBeVisible();
  await expect(page.getByRole("region", { name: "Refund" })).toContainText("$787.70");
  await expect(page.getByRole("list", { name: "Refund progress" })).toContainText("When you cancelled.");
  await expect(itinerary).toContainText("AT556 · AT808 · cancelled");
  await expect(page.getByRole("button", { name: "Cancel booking" })).toHaveCount(0);
  await page.screenshot({ path: "test-results/flights-manage-cancelled-1280.png", fullPage: true });

  // My bookings: under Cancelled with its badge
  await page.getByRole("link", { name: "← All trips" }).click();
  await page.goto("/bookings?tab=cancelled");
  await expect(page.getByText("Lagos ⇄ London")).toBeVisible();
  await expect(page.getByText("Cancelled · refund in progress")).toBeVisible();
});

test("lists the flight in My bookings, and Cancel opens Manage ready to cancel", async ({ page }) => {
  await bookAndPay(page, "slow-ticketing");
  await page.goto("/bookings");
  await expect(page.getByText("Lagos ⇄ London")).toBeVisible();
  await expect(page.getByText("Booked · ticket being issued")).toBeVisible();
  await page.screenshot({ path: "test-results/flights-my-bookings-1280.png", fullPage: true });

  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page).toHaveURL(/\/flights\/bookings\/mock-bk-[a-z0-9]+\?cancel=1$/);
  await expect(page.getByRole("region", { name: "Cancel this booking" })).toContainText("You get back$787.70");
  await page.getByRole("button", { name: "Keep my booking" }).click();
  await expect(page.getByRole("region", { name: "Cancel this booking" })).toHaveCount(0);
  await expect(page.getByText("Booked · ticket being issued")).toBeVisible();
});

test("ticketed bookings show their e-tickets and no full-refund cancel", async ({ page }) => {
  await page.clock.install();
  await bookAndPay(page);
  await page.clock.fastForward(11_000);
  await expect(page.getByRole("heading", { name: "You’re all set" })).toBeVisible();
  await page.getByRole("link", { name: "Manage booking" }).click();
  await expect(page.getByText("Ticketed", { exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Itinerary" })).toContainText(/147-\d{10}/);
  await expect(page.getByRole("button", { name: "Cancel booking" })).toHaveCount(0);
});

test("fits a phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await bookAndPay(page, "slow-ticketing");
  await page.getByRole("link", { name: "Manage booking" }).click();
  await page.getByRole("button", { name: "Cancel booking" }).click();
  await expect(page.getByRole("region", { name: "Cancel this booking" })).toContainText("You get back");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await page.screenshot({ path: "test-results/flights-manage-375.png", fullPage: true });
});
