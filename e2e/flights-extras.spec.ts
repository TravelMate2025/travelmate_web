import { expect, test, type Page } from "@playwright/test";

// Phase W9: paid extra bags (mock: Extras), on the real Royal Air Maroc bag prices.
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

/** Search → cheapest → fare → travellers (profile) → Extras. */
const toExtras = async (page: Page) => {
  await page.goto(RESULTS);
  await page.getByRole("tab", { name: /Cheapest/ }).click();
  await page.getByRole("article").first().getByRole("button", { name: "See fares" }).click();
  await page.getByRole("button", { name: "Continue to traveller details" }).click();
  await page.getByRole("button", { name: "Use my profile details" }).click();
  await page.getByRole("button", { name: "Continue to extras" }).click();
  await expect(page).toHaveURL(/\/flights\/extras\?offer=mock-return_los_lon-1$/);
};

test("adds bags per direction, and they carry through to payment and the booking", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await toExtras(page);
  await expect(page.getByRole("heading", { level: 1, name: "Add extra bags" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Booking steps" })).toContainText("3 Travellers ✓");
  await expect(page.getByRole("navigation", { name: "Booking steps" })).toContainText("4 Extras");
  await expect(page.getByText("Already included in Eco Essential:")).toBeVisible();

  const outbound = page.getByRole("radiogroup", { name: "Outbound · Tue 15 Dec extra bags" });
  const back = page.getByRole("radiogroup", { name: "Return · Mon 28 Dec extra bags" });
  await expect(outbound.getByRole("radio", { name: /No extra bag/ })).toHaveAttribute("aria-checked", "true");
  await outbound.getByRole("radio", { name: /\+1 bag/ }).click();
  // Keyboard: arrows move the choice within a direction
  await back.getByRole("radio", { name: /No extra bag/ }).focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect(back.getByRole("radio", { name: /\+2 bags/ })).toHaveAttribute("aria-checked", "true");

  const summary = page.getByRole("complementary", { name: "Price summary" });
  await expect(summary).toContainText("Extra bags$803.60");
  await expect(summary).toContainText("Total$1,591.30");
  await page.screenshot({ path: "test-results/flights-extras-1280.png", fullPage: true });

  await page.getByRole("button", { name: "Continue to payment" }).click();
  await expect(page).toHaveURL(/\/flights\/review\?offer=mock-return_los_lon-1$/);
  const pay = page.getByRole("complementary", { name: "Price summary" });
  await expect(pay).toContainText("Extra bags · +1 bag outbound, +2 bags return$803.60");
  await expect(pay).toContainText("Total$1,591.30");
  await expect(page.getByRole("navigation", { name: "Booking steps" })).toContainText("4 Extras ✓");

  await page.getByLabel(/I've checked the traveller names/).check();
  await page.getByRole("button", { name: /Pay .* securely/ }).click();
  await expect(page).toHaveURL(/\/flights\/bookings\/mock-bk-[a-z0-9]+\/status$/);
  await expect(page.getByRole("region", { name: "Trip" })).toContainText("Extra bags: +1 bag outbound, +2 bags return");
});

test("fits a phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await toExtras(page);
  await expect(page.getByRole("heading", { level: 1, name: "Add extra bags" })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await page.screenshot({ path: "test-results/flights-extras-375.png", fullPage: true });
});
