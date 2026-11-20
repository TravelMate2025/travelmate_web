import { expect, test, type Page } from "@playwright/test";

// Phase W10: cancelling after the ticket is issued (mock: Manage, 'After ticket issued').
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

/** Book, pay, wait for the ticket, open Manage and the cancel section. Needs page.clock installed. */
const toTicketedCancel = async (page: Page, scenario?: string) => {
  await bookAndPay(page, scenario);
  await page.clock.fastForward(11_000);
  await expect(page.getByRole("heading", { name: "You’re all set" })).toBeVisible();
  await page.getByRole("link", { name: "Manage booking" }).click();
  await expect(page.getByText("Ticketed", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Cancel booking" }).click();
  return page.getByRole("region", { name: "Cancel this booking" });
};

test("requests the cancellation, then follows the airline's confirmation and the refund", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.clock.install();
  const cancel = await toTicketedCancel(page);
  // Eco Essential is not refundable: the fare ($182.00) stays, taxes ($605.70) may come back
  await expect(cancel).toContainText("this fare is not refundable");
  await expect(cancel).toContainText("Not refundable (fare)$182.00");
  await expect(cancel).toContainText("Estimated refund (taxes)$605.70");
  await expect(cancel).toContainText("The airline confirms the refundable amount. This can take several days.");
  await page.screenshot({ path: "test-results/flights-cancel-ticketed-1280.png", fullPage: true });
  await page.getByRole("button", { name: "Request cancellation" }).click();

  await expect(page.getByText("Cancellation requested", { exact: true })).toBeVisible();
  const refund = page.getByRole("region", { name: "Refund" });
  await expect(refund).toContainText("Estimated refund");
  await expect(refund).toContainText("$605.70");
  const progress = page.getByRole("list", { name: "Refund progress" });
  await expect(progress).toContainText("Done: Cancellation sent to the airline");
  await expect(progress).toContainText("In progress: Airline confirms the refundable amount");
  await page.screenshot({ path: "test-results/flights-cancel-requested-1280.png", fullPage: true });

  // The page keeps asking; the fake airline confirms after ~8 s and the refund settles after ~16 s
  await page.clock.fastForward(10_000);
  await expect(progress).toContainText("Done: Airline confirmed the refund");
  await expect(progress).toContainText("In progress: Processing with Flutterwave");
  await expect(page.getByText("Cancelled · refund in progress")).toBeVisible();
  await page.clock.fastForward(10_000);
  await expect(page.getByText("Cancelled · refunded")).toBeVisible();
  await expect(progress).toContainText("Done: Refund completed");
});

test("inside the void window it's a full refund", async ({ page }) => {
  await page.clock.install();
  const cancel = await toTicketedCancel(page, "void-window");
  await expect(cancel).toContainText("the airline still lets us void it");
  await expect(cancel).toContainText("You get back$787.70");
  await page.getByRole("button", { name: "Cancel and get full refund" }).click();
  await expect(page.getByText("Cancelled · refund in progress")).toBeVisible();
  await expect(page.getByRole("region", { name: "Refund" })).toContainText("$787.70");
  await expect(page.getByRole("list", { name: "Refund progress" })).toContainText("Done: Refund started");
});

test("My bookings → Cancel on a ticketed booking opens the request", async ({ page }) => {
  await page.clock.install();
  await bookAndPay(page);
  await page.clock.fastForward(11_000);
  await expect(page.getByRole("heading", { name: "You’re all set" })).toBeVisible();
  await page.goto("/bookings");
  await expect(page.getByText("Ticketed", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByRole("button", { name: "Request cancellation" })).toBeVisible();
});

test("fits a phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.clock.install();
  const cancel = await toTicketedCancel(page);
  await expect(cancel).toContainText("Estimated refund (taxes)");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
