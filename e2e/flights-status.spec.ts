import { expect, test, type Page } from "@playwright/test";

// Phase W6: booking status after payment, on the recorded Amadeus data.
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
  await page.getByRole("button", { name: "Continue to extras" }).click();
  await page.getByRole("button", { name: "Continue to payment" }).click();
  await page.getByLabel(/I've checked the traveller names/).check();
  if (scenario) await page.evaluate((s) => window.sessionStorage.setItem("tm.flights.mockScenario", s), scenario);
  await page.getByRole("button", { name: /Pay .* securely/ }).click();
  await expect(page).toHaveURL(/\/flights\/bookings\/mock-bk-[a-z0-9]+\/status$/);
};

test("shows the ticket on its way, then ticketed", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.clock.install();
  await bookAndPay(page);

  await expect(page.getByRole("heading", { name: "Booking confirmed, ticket on the way" })).toBeVisible();
  const status = page.getByRole("region", { name: "Booking status" });
  await expect(status).toContainText(/TM-FL-[A-Z0-9]{6}/);
  await expect(status).toContainText("Airline reference (Royal Air Maroc)");
  await expect(status).toContainText("$787.70");
  const progress = page.getByRole("list", { name: "Booking progress" });
  await expect(progress).toContainText("Done: Payment received");
  await expect(progress).toContainText("Your seats are confirmed on all 4 flights.");
  await expect(progress).toContainText(/In progress: Issuing your ticket/);
  await expect(page.getByRole("region", { name: "Trip" })).toContainText("E-ticket: Pending");
  await page.screenshot({ path: "test-results/flights-status-issuing-1280.png", fullPage: true });

  // The page keeps asking the server; ticketing finishes ~10 s after payment in the fake API
  await page.clock.fastForward(11_000);
  await expect(page.getByRole("heading", { name: "You’re all set" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Trip" })).toContainText(/E-ticket: 147-\d{10}/);
  await expect(progress).toContainText("Sent to adaeze@example.com.");
  await page.screenshot({ path: "test-results/flights-status-ticketed-1280.png", fullPage: true });

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Add to calendar" }).click();
  expect((await download).suggestedFilename()).toMatch(/^travelmate-TM-FL-[A-Z0-9]{6}\.ics$/);

  // Safe to leave and come back
  await page.reload();
  await expect(page.getByRole("heading", { name: "You’re all set" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Manage booking" })).toHaveAttribute("href", /\/flights\/bookings\/mock-bk-[a-z0-9]+$/);
});

test("refunds in full when the airline doesn't confirm after payment", async ({ page }) => {
  await page.clock.install();
  await bookAndPay(page, "failed-after-payment");
  await page.clock.fastForward(5_000);
  await expect(page.getByRole("heading", { name: "We couldn’t complete your booking" })).toBeVisible();
  const refund = page.getByRole("region", { name: "Refund" });
  await expect(refund).toContainText("Full refund");
  await expect(refund).toContainText("$787.70");
  await expect(page.getByRole("list", { name: "Refund progress" })).toContainText(/In progress: Processing with Flutterwave/);
  await page.screenshot({ path: "test-results/flights-failed-after-payment-1280.png", fullPage: true });
});

test("fits a phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await bookAndPay(page);
  await expect(page.getByRole("heading", { name: /Booking confirmed|You’re all set/ })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
