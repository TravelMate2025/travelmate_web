import { expect, test } from "@playwright/test";

// Real TransferBooking pks are 32-char hex UUIDs, distinct from the shared
// booking_reference. Using a realistic, clearly-different id here (rather
// than reusing the reference) is what makes this test actually prove the
// fix: POST /transfers/booking/{id}/cancel/ must be called with THIS value,
// not the reference — see docs/BOOKING_API_CONTRACT.md §2.
const TRANSFER_BOOKING_ID = "a1b2c3d4e5f64708a9b0c1d2e3f4a5b6";

const transferBookingResponse = {
  bookings: [
    {
      id: TRANSFER_BOOKING_ID,
      reference: "BOOKREQ-TRANSFER-E2E-001",
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
    },
  ],
};

test("transfer cancellation flow completes in the browser", async ({ page }) => {
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

  await page.route(
    "**/api/transfers/booking/confirmation/by-session/**",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(transferBookingResponse),
      });
    },
  );

  // The buggy code cancelled by booking_reference — assert that path is
  // never hit, so a regression back to the old behavior fails this test.
  let referenceCancelCalled = false;
  await page.route(
    "**/api/transfers/booking/BOOKREQ-TRANSFER-E2E-001/cancel/**",
    async (route) => {
      referenceCancelCalled = true;
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ error: "Transfer booking not found or does not belong to you" }),
      });
    },
  );

  let cancelRequestBody: Record<string, unknown> | undefined;
  await page.route(`**/api/transfers/booking/${TRANSFER_BOOKING_ID}/cancel/**`, async (route) => {
    cancelRequestBody = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: "cancelled",
        reference: "BOOKREQ-TRANSFER-E2E-001",
      }),
    });
  });

  await page.goto("/bookings/transfers-details/?session_id=session-e2e-1");

  await expect(page.getByRole("heading", { name: "Booking Details" })).toBeVisible();
  await expect(page.getByText("Booking State")).toBeVisible();
  await expect(page.getByText("Confirmed")).toBeVisible();
  await expect(page.getByRole("button", { name: "Cancel Booking" })).toBeVisible();

  await page.getByRole("button", { name: "Cancel Booking" }).click();
  await expect(page.getByRole("heading", { name: "Cancel Booking" })).toBeVisible();

  // Pick a cancellation reason — proves the reason actually reaches the
  // request body, not just that cancellation succeeds.
  await page.getByLabel("Health/medical issues").check();
  await page.getByRole("button", { name: "Confirm Cancellation" }).click();

  await expect(page.getByText("Booking cancelled successfully")).toBeVisible();
  await expect(page.getByText("Cancellation Request has been submitted")).toBeVisible();
  await expect(page.getByText("This transfer has been cancelled")).toBeVisible();

  expect(referenceCancelCalled, "cancel must use the TransferBooking id, not booking_reference").toBe(false);
  expect(cancelRequestBody?.reason).toBe("Health/medical issues");
  await expect(page.getByRole("button", { name: "Cancel Booking" })).toHaveCount(0);
});
