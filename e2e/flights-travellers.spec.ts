import { expect, test, type Page } from "@playwright/test";

// Phase W4: traveller details, on the recorded Amadeus data (mock mode).
const RESULTS =
  "/flights/results?trip=RETURN&legs=LOS.LON.2026-12-15_LON.LOS.2026-12-28&adults=1&cabin=ECONOMY&currency=USD";
const FAMILY =
  "/flights/results?trip=RETURN&legs=LOS.DXB.2026-12-15_DXB.LOS.2026-12-28&adults=2&children=1&lapInfants=1&cabin=ECONOMY&currency=USD";

const signIn = async (page: Page) => {
  await page.addInitScript(() => {
    const auth = {
      email: "adaeze@example.com",
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: { profileImage: "", id: 7, email: "adaeze@example.com", name: "Adaeze Okafor" },
      registrationComplete: true,
    };
    const profile = {
      profile: {
        id: 7,
        email: "adaeze@example.com",
        first_name: "Adaeze",
        last_name: "Okafor",
        gender: "female",
        date_of_birth: "1990-04-12",
        address: null,
        mobile_number: "+2348012345678",
        profile_pics: null,
      },
    };
    window.localStorage.setItem(
      "persist:root",
      JSON.stringify({
        auth: JSON.stringify(auth),
        profile: JSON.stringify(profile),
        stays: "null",
        cars: "null",
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      })
    );
  });
};

const toTravellers = async (page: Page, results = RESULTS) => {
  await page.goto(results);
  await page.getByRole("tab", { name: /Cheapest/ }).click();
  await page.getByRole("article").first().getByRole("button", { name: "See fares" }).click();
  await page.getByRole("button", { name: "Continue to traveller details" }).click();
  await expect(page.getByRole("heading", { name: "Who's travelling?" })).toBeVisible();
};

test("signed-out visitors sign in first", async ({ page }) => {
  await page.goto("/flights/travellers?offer=mock-return_los_lon-1");
  await expect(page).toHaveURL(/\/create-account/);
});

test.describe("signed in", () => {
  test.beforeEach(async ({ page }) => signIn(page));

  test("collects the lead traveller and contact, then continues to extras", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await toTravellers(page);
    await expect(page.getByRole("navigation", { name: "Booking steps" })).toContainText("2 Fare ✓");
    await expect(page.getByText("Signed in as")).toContainText("Adaeze Okafor");
    await expect(page.getByRole("heading", { name: "Adult 1 · lead traveller" })).toBeVisible();

    // The trip summary uses the real fare and taxes from the price check
    const summary = page.getByRole("complementary", { name: "Trip summary" });
    await expect(summary).toContainText("$182.00");
    await expect(summary).toContainText("$605.70");
    await expect(summary).toContainText("$787.70");

    await page.getByRole("button", { name: "Continue to extras" }).click();
    await expect(page.getByText("Enter the first and middle names as on the passport")).toBeVisible();
    await expect(page.getByText("Enter an email for your e-ticket")).toBeVisible();
    await page.screenshot({ path: "test-results/flights-travellers-errors-1280.png", fullPage: true });

    await page.getByRole("button", { name: "Use my profile details" }).click();
    await expect(page.getByLabel(/First and middle names/)).toHaveValue("Adaeze");
    await expect(page.getByLabel(/Date of birth/)).toHaveValue("12 / 04 / 1990");
    await expect(page.getByLabel(/Mobile number/)).toHaveValue("8012345678");
    await expect(page.getByLabel(/Country code/)).toHaveValue("NG");
    await page.screenshot({ path: "test-results/flights-travellers-1280.png", fullPage: true });

    // Royal Air Maroc sells extra bags on this fare, so Extras comes next
    await page.getByRole("button", { name: "Continue to extras" }).click();
    await expect(page).toHaveURL(/\/flights\/extras\?offer=mock-return_los_lon-1$/);
  });

  test("a family: child and lap-infant ages, one lap per adult, names too long together", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await toTravellers(page, FAMILY);
    await expect(page.getByRole("heading", { name: "Infant on lap 1" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Child 1" })).toBeVisible();

    const lead = page.getByRole("region", { name: "Adult 1 · lead traveller" });
    await lead.getByLabel(/First and middle names/).fill("Oluwaseun Adebayo");
    await lead.getByLabel(/Last name/).fill("Ogunlesi-Adeyemi");
    const infant = page.getByRole("region", { name: "Infant on lap 1" });
    await infant.getByLabel(/First and middle names/).fill("Oluwatobi Ayomide");
    await infant.getByLabel(/Last name/).fill("Ogunlesi-Adeyemi");
    await infant.getByLabel(/Date of birth/).fill("20012026");
    await expect(infant.getByLabel(/Travels on the lap of/)).toHaveValue("1");
    const child = page.getByRole("region", { name: "Child 1" });
    await child.getByLabel(/Date of birth/).fill("01012026");

    await page.getByRole("button", { name: "Continue to payment" }).click();
    await expect(child.getByText("Children must be 2 to 11 when the trip starts")).toBeVisible();
    await expect(infant.getByText(/names are too long together/)).toBeVisible();
    await page.screenshot({ path: "test-results/flights-travellers-family-1280.png", fullPage: true });

    await infant.getByRole("button", { name: "Use the shortened names" }).click();
    await expect(lead.getByLabel(/First and middle names/)).toHaveValue("O");
    await expect(infant.getByText(/names are too long together/)).toBeHidden();
  });

  test("fits a phone", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await toTravellers(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await page.screenshot({ path: "test-results/flights-travellers-375.png", fullPage: true });
  });
});
