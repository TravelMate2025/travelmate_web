import { expect, test, type Page } from "@playwright/test";

// Phase W11: schedule-change alerts (mock: Manage alert).
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

test("alerts on Manage and in My bookings when the airline re-times a flight", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.clock.install();
  // The fake airline moves the last return flight two hours later once ticketed
  await bookAndPay(page, "schedule-change");
  await page.clock.fastForward(11_000);
  await expect(page.getByRole("heading", { name: "You’re all set" })).toBeVisible();
  await page.getByRole("link", { name: "Manage booking" }).click();

  const alert = page.getByRole("alert").filter({ hasText: "Schedule change" });
  await expect(alert).toContainText("Schedule change on your return");
  await expect(alert).toContainText(/The airline changed flight AT557 Casablanca → Lagos to depart at \d\d:\d\d \(was \d\d:\d\d\)/);
  await expect(alert).toContainText("Your seat is still confirmed.");
  await expect(page.getByText("Ticketed · schedule changed")).toBeVisible();
  const itinerary = page.getByRole("region", { name: "Itinerary" });
  await expect(itinerary).toContainText("AT803 · AT557 · time changed");
  // The itinerary shows the new landing time from the alert
  const landing = (await alert.textContent())?.match(/landing at (\d\d:\d\d)/)?.[1];
  await expect(itinerary).toContainText(`→ ${landing}`);
  await expect(page.getByRole("region", { name: "Itinerary" })).toContainText("AT556 · AT808 · confirmed");
  await page.screenshot({ path: "test-results/flights-schedule-change-1280.png", fullPage: true });

  await page.goto("/bookings");
  await expect(page.getByText("Ticketed · schedule changed")).toBeVisible();
});
