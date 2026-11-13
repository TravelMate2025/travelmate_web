import { expect, test, type Page } from "@playwright/test";

// Phase W5: review and pay ("book, then pay"), on the recorded Amadeus data.
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

/** Search → cheapest → fare → travellers (profile) → review. `scenario` applies from the hold onwards. */
const toReview = async (page: Page, scenario?: string) => {
  await page.goto(RESULTS);
  await page.getByRole("tab", { name: /Cheapest/ }).click();
  await page.getByRole("article").first().getByRole("button", { name: "See fares" }).click();
  await page.getByRole("button", { name: "Continue to traveller details" }).click();
  await page.getByRole("button", { name: "Use my profile details" }).click();
  if (scenario) await page.evaluate((s) => window.sessionStorage.setItem("tm.flights.mockScenario", s), scenario);
  await page.getByRole("button", { name: "Continue to payment" }).click();
  await expect(page).toHaveURL(/\/flights\/review\?offer=mock-return_los_lon-1$/);
};

test("holds the seats, shows the review, and pays through Flutterwave", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await toReview(page);
  await expect(page.getByRole("timer", { name: "Time left to pay" })).toContainText(/Pay within 1[45]:\d\d/);
  await expect(page.getByRole("heading", { name: "Review and pay" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Booking steps" })).toContainText("3 Travellers ✓");
  await expect(page.getByText(/AT556 to Casablanca · AT808 to London Stansted · 12h 15m/)).toBeVisible();
  await expect(page.getByText(/you arrive at Stansted and return from Gatwick/)).toBeVisible();
  await expect(page.getByRole("region", { name: "Travellers" })).toContainText("Adaeze Okafor · Adult");
  await expect(page.getByText("Not refundable.")).toBeVisible();

  const summary = page.getByRole("complementary", { name: "Price summary" });
  await expect(summary).toContainText("$787.70");
  await expect(summary).toContainText(/Reservation: [A-Z0-9]{6} \(held, not yet ticketed\)/);

  const pay = page.getByRole("button", { name: /Pay .* securely/ });
  await expect(pay).toBeDisabled();
  await page.getByRole("radio", { name: /NGN/ }).click();
  await expect(page.getByText("Converted at today’s TravelMate rate, fixed for this booking.", { exact: false })).toBeVisible();
  await expect(pay).toContainText("₦");
  await expect(summary).toContainText("₦");
  await page.getByRole("radio", { name: /USD/ }).click();
  await page.screenshot({ path: "test-results/flights-pay-1280.png", fullPage: true });

  await page.getByLabel(/I've checked the traveller names/).check();
  await expect(pay).toBeEnabled();
  await pay.click();
  await expect(page).toHaveURL(/\/flights\/bookings\/mock-bk-[a-z0-9]+\/status$/);
});

test("a reload during payment keeps the same held booking (no second hold)", async ({ page }) => {
  await toReview(page);
  const summary = page.getByRole("complementary", { name: "Price summary" });
  const before = (await summary.textContent())?.match(/Reservation: ([A-Z0-9]{6})/)?.[1];
  expect(before).toBeTruthy();
  await page.reload();
  await expect(page).toHaveURL(/\/flights\/review\?offer=/);
  await expect(summary).toContainText(`Reservation: ${before}`);
  const holds = await page.evaluate(() => Object.keys(JSON.parse(window.sessionStorage.getItem("tm.flights.mockBookings") ?? "{}")).length);
  expect(holds).toBe(1);
});

test("releases the seats when the time to pay runs out", async ({ page }) => {
  await page.clock.install();
  await toReview(page, "hold-expired");
  await expect(page.getByRole("timer", { name: "Time left to pay" })).toContainText(/0:4\d/);
  await page.clock.fastForward(46_000);
  await expect(page.getByRole("heading", { name: "Your seats were released" })).toBeVisible();
  await expect(page.getByText(/was \$787\.70/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Check this flight again" })).toHaveAttribute("href", /\/flights\/fare\?offer=/);
  await page.screenshot({ path: "test-results/flights-hold-expired-1280.png", fullPage: true });
});

test("explains seats sold out while holding", async ({ page }) => {
  await toReview(page, "sold-out");
  await expect(page.getByRole("heading", { name: "These seats are no longer available" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Contact support" })).toHaveAttribute("href", "/chat-with-us");
});

test("asks before paying when the hold came back at a higher price", async ({ page }) => {
  await toReview(page, "price-up-at-hold");
  const dialog = page.getByRole("dialog", { name: "The airline changed the price" });
  await expect(dialog).toContainText("$787.70");
  await expect(dialog).toContainText("$819.21");
  await dialog.getByRole("button", { name: "Continue at the new price" }).click();
  await expect(page.getByRole("complementary", { name: "Price summary" })).toContainText("$819.21");
});

test("a cancelled payment offers to try again while the seats are held", async ({ page }) => {
  await toReview(page);
  const bookingId = await page.evaluate(() => {
    const raw = window.sessionStorage.getItem("tm.flights.mockBookings") ?? "{}";
    return Object.keys(JSON.parse(raw))[0];
  });
  await page.goto(`/flights/payment-return?status=cancelled&bookingId=${bookingId}`);
  await expect(page.getByRole("heading", { name: "Your payment wasn't completed" })).toBeVisible();
});

test("fits a phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await toReview(page);
  await expect(page.getByRole("heading", { name: "Review and pay" })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await page.screenshot({ path: "test-results/flights-pay-375.png", fullPage: true });
});
