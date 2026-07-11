import { expect, test } from "@playwright/test";

const stayLocationResponse = {
  kind: "stays",
  locations: [
    {
      country: "Nigeria",
      adminLevel1: "Lagos",
      city: "Lekki",
      listingCount: 1,
      areas: ["Victoria Island"],
      displayName: "Lekki, Lagos, Nigeria",
    },
  ],
};

const staySearchResponse = {
  results: [
    {
      id: "tm-lagos-001",
      name: "Marina Residences",
      propertyType: "apartment",
      saleMode: "unit_level",
      country: "Nigeria",
      adminLevel1: "Lagos",
      city: "Lekki",
      address: "12 Marina Road, Lagos",
      description: "A private serviced apartment with two bedrooms and a city view.",
      priceFrom: 120000,
      ratingScore: 88,
      rooms: [
        {
          id: "tm-lagos-001-r1",
          name: "Entire apartment",
          occupancy: 4,
          baseRate: 120000,
          isBookable: true,
        },
      ],
      images: [
        { secureUrl: "https://images.travelmate.local/lagos-suite-1.jpg" },
      ],
      amenities: ["wifi", "kitchen", "parking"],
      destination: { code: "lekki", name: "Lekki" },
      available: true,
    },
  ],
};

const pricingResponse = {
  data: {
    currency: "NGN",
    baseRate: 120000,
    weekdayRate: 110000,
    weekendRate: 135000,
    cancellationOptions: [
      {
        optionId: "FREE_CANCELLATION",
        label: "Free cancellation",
        amount: 135000,
        currency: "NGN",
        cancelDeadlineHoursBeforeCheckIn: 24,
        policyCopy: "Free cancellation up to 24 hours before check-in.",
      },
    ],
    roomCancellationOptions: [],
    ratePlans: [],
    priceBreakdown: {
      currency: "NGN",
      base: { amount: 120000 },
      taxes: { amount: 0, inclusive: true },
      fees: { amount: 0, inclusive: true },
      total: { amount: 120000 },
      rateBands: {
        weekday: { amount: 110000 },
        weekend: { amount: 135000 },
      },
      previewOptionId: "FREE_CANCELLATION",
      notes: "Test fixture",
    },
  },
};

test("web stays flow renders results and detail from live-shaped responses", async ({
  page,
}) => {
  await page.route("**/api/v1/public/locations?kind=stays", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(stayLocationResponse),
    });
  });

  await page.route("**/api/v1/public/catalog/stays**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith("/pricing")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(pricingResponse),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(staySearchResponse),
    });
  });

  await page.goto("/stay-search?flow=partner");

  const destination = page.getByLabel("Destination");
  await destination.fill("Lekki");
  await page.getByRole("option", { name: "Lekki, Lagos, Nigeria" }).click();
  await page.getByRole("button", { name: "Show stay results" }).click();

  await expect(page).toHaveURL(/stay-results/);
  await expect(page.getByText("Marina Residences")).toBeVisible();
  await expect(page.getByText("NGN 120,000")).toBeVisible();

  await page.getByText("Marina Residences").click();

  await expect(page).toHaveURL(/stays-detail\/tm-lagos-001/);
  await expect(page.getByRole("heading", { name: "Stay details" })).toBeVisible();
  await expect(page.getByText("NGN 120,000")).toBeVisible();
  await expect(page.getByText("Weekday: NGN 110,000")).toBeVisible();
  await expect(page.getByText("Weekend: NGN 135,000")).toBeVisible();
});
