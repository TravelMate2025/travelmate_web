import { expect, test } from "@playwright/test";

// This page (offerAcceptedPage/Page.tsx, mounted at /transfer-review) reads
// its offer/search context from React Router's `location.state`, set by
// navigate() from the transfer detail page — there's no route-param fetch to
// mock instead. Reaching it directly means injecting the router's own
// history state the same way `history.pushState` (which React Router wraps)
// would, rather than clicking through the full search -> detail flow.
const routeState = {
  search_id: "search-e2e-1",
  departureInfo: {
    pickupLocaDescription: "Lagos Airport",
    pickupDate: "2026-08-01",
    pickupTime: "10:00",
    dropoffLocaDescription: "Victoria Island Hotel",
    selectedRide: "Shared Ride",
    priceRange: "",
  },
  car: {
    id: "transfer-e2e-1",
    vehicle: { name: "Sedan", code: "SDN" },
    category: { name: "Executive" },
    content: { images: [], transferDetailInfo: [], transferRemarks: [] },
    maxPaxCapacity: 4,
    passenger_capacity: 4,
    luggage_capacity: 2,
    transfer_type: "SHARED",
    supplier: { name: "Partner Transport" },
    price: { totalAmountWithFee: 25000 },
    rateKey: "rate-e2e-1",
  },
  quoteLockId: "",
  cancellationOptionId: "",
};

test("transfer hold request includes pickup/vehicle/capacity metadata", async ({ page }) => {
  await page.addInitScript(() => {
    const authState = {
      email: "ada@example.com",
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: { profileImage: "", id: 7, email: "ada@example.com", name: "Ada Lovelace" },
      registrationComplete: true,
    };
    window.localStorage.setItem("accessToken", "access-token");
    window.localStorage.setItem("refreshToken", "refresh-token");
    window.localStorage.setItem(
      "persist:root",
      JSON.stringify({
        auth: JSON.stringify(authState),
        profile: "null",
        stays: "null",
        cars: "null",
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      }),
    );
  });

  await page.route("**/transfers/booking/quote/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: { quoteLockId: "quote-e2e-1", pricing: { currency: "NGN", total: 25000 } },
      }),
    });
  });

  let holdRequestBody: Record<string, unknown> | undefined;
  await page.route("**/transfers/booking/holds/**", async (route) => {
    holdRequestBody = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: { bookingReference: "BOOKREQ-TRANSFER-E2E-HOLD" } }),
    });
  });

  // Land the app on a real, unrelated route first so React Router is
  // mounted (avoid "/" — Home has an unrelated pre-existing crash reading
  // Redux stays-search state), then push a history entry carrying `state`
  // the same way navigate() would, and let the router pick it up via
  // popstate.
  await page.goto("/about");
  await page.evaluate((state) => {
    window.history.pushState({ usr: state, key: "e2e", idx: 1 }, "", "/transfer-review");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, routeState);

  await expect(page.getByRole("button", { name: "Continue to guest details" })).toBeVisible();
  await page.getByRole("button", { name: "Continue to guest details" }).click();

  await page.getByLabel("First Name").fill("Ada");
  await page.getByLabel("Last Name").fill("Lovelace");
  await page.getByLabel("Email Address").fill("ada@example.com");
  await page.getByLabel("Phone Number").fill("+2348000000000");

  await page.getByRole("button", { name: "Continue" }).click();

  await expect.poll(() => holdRequestBody, { timeout: 10_000 }).toBeTruthy();

  expect(holdRequestBody?.pickupLocationLabel).toBe("Lagos Airport");
  expect(holdRequestBody?.destinationCity).toBe("Victoria Island Hotel");
  expect(holdRequestBody?.pickupAt).toContain("2026-08-01T10:00:00");
  expect(holdRequestBody?.rideType).toBe("shared");
  expect(holdRequestBody?.vehicleClass).toBe("Executive");
  expect(holdRequestBody?.passengerCapacity).toBe(4);
  expect(holdRequestBody?.luggageCapacity).toBe(2);
  expect(holdRequestBody?.providerName).toBe("Partner Transport");
});
