import { expect, test } from "@playwright/test";

const transferDetailResponse = {
  reference: "BOOKREQ-TRANSFER-E2E-002",
  status: "CONFIRMED",
  currency: "NGN",
  totalAmount: 25000,
  holder: {
    name: "Ada",
    surname: "Lovelace",
    email: "ada@example.com",
    phone: "0800000000",
  },
  supplier: { name: "Partner Transport", vatNumber: "VAT-1" },
  transfers: [
    {
      category: { name: "Executive" },
      vehicle: { name: "Sedan" },
      pickupInformation: {
        from: { description: "Lagos Airport" },
        to: { description: "Hotel" },
        date: "2026-07-12T10:00:00.000Z",
        time: "10:00",
        pickup: {
          description: "Hotel Lobby",
        },
      },
      content: {
        transferDetailInfo: [
          { value: "45", description: "mins" },
          { value: "1", description: "stop" },
          { value: "4", description: "Seats" },
          { value: "2", description: "bags" },
        ],
      },
      cancellationPolicies: [
        {
          from: "2026-07-11T10:00:00.000Z",
          amount: 1200,
          currencyId: "NGN",
          isForceMajeure: false,
        },
      ],
    },
  ],
};

test("transfer booking details fall back to reference when session verification is stale", async ({ page }) => {
  await page.addInitScript(() => {
    const authState = {
      email: "ada@example.com",
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: {
        profileImage: "",
        id: 7,
        email: "ada@example.com",
        name: "Ada Lovelace",
      },
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

  await page.route("**/api/transfers/booking/confirmation/by-session/**", async (route) => {
    await route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({ error: "Transfer booking not found" }),
    });
  });

  await page.route("**/api/transfers/bookings/BOOKREQ-TRANSFER-E2E-002/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(transferDetailResponse),
    });
  });

  await page.goto(
    "/bookings/transfers-details/?session_id=session-stale-1&booking_reference=BOOKREQ-TRANSFER-E2E-002",
  );

  await expect(page.getByRole("heading", { name: "Booking Details" })).toBeVisible();
  await expect(page.getByText("BOOKREQ-TRANSFER-E2E-002")).toBeVisible();
  await expect(page.getByRole("button", { name: "Cancel Booking" })).toBeVisible();
  await expect(page.getByText("NotFound")).toHaveCount(0);
});
