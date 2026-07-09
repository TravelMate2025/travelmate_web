import { expect, test } from "@playwright/test";

const COMPLETED_TRANSFER_REFERENCE = "BOOKREQ-TRANSFER-E2E-REVIEW-001";

const completedTransferDetailResponse = {
  id: "8c1f5bedf5ae4a11946ea8ba346f1382",
  reference: COMPLETED_TRANSFER_REFERENCE,
  booking_reference: COMPLETED_TRANSFER_REFERENCE,
  listing_name: "Lagos Airport — Victoria Island Executive Transfer",
  status: "COMPLETED",
  currency: "NGN",
  totalAmount: 4236,
  holder: {
    name: "Ada",
    surname: "Lovelace",
    email: "ada@example.com",
    phone: "0800000000",
  },
  supplier: { name: "Lagos Executive Transfers" },
  transfers: [
    {
      category: { name: "economy_sedan" },
      pickupInformation: {
        from: { description: "Murtala Muhammed International Airport (LOS)" },
        to: { description: "Oregun, Epe" },
        date: "2026-07-09T00:00:00.000Z",
        time: "19:16",
      },
      content: {
        transferDetailInfo: [
          { value: 60, description: "mins" },
          { value: "", description: "" },
          { value: 3, description: "Seats" },
          { value: 6, description: "Luggage" },
        ],
      },
      cancellationPolicies: [],
    },
  ],
};

test.beforeEach(async ({ page }) => {
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

  await page.route(`**/api/transfers/bookings/${COMPLETED_TRANSFER_REFERENCE}/**`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(completedTransferDetailResponse),
    });
  });
});

test("a completed transfer booking shows a Write a Review button, not Cancel Booking", async ({ page }) => {
  await page.goto(
    `/bookings/transfers-details/?session_id=session-1&booking_reference=${COMPLETED_TRANSFER_REFERENCE}&booking_status=completed`,
  );

  await expect(page.getByRole("heading", { name: "Booking Details" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Write a Review" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Cancel Booking" })).toHaveCount(0);
});

test("submitting a transfer review posts the real review payload to the booking reference", async ({ page }) => {
  let reviewRequestBody: unknown = null;

  await page.route(`**/api/v1/public/bookings/${COMPLETED_TRANSFER_REFERENCE}/review`, async (route) => {
    reviewRequestBody = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: { reviewId: "rv_e2e_1", status: "pending_moderation" } }),
    });
  });

  await page.goto(
    `/bookings/transfers-details/?session_id=session-1&booking_reference=${COMPLETED_TRANSFER_REFERENCE}&booking_status=completed`,
  );

  await page.getByRole("button", { name: "Write a Review" }).first().click();

  const modalHeading = page.getByRole("heading", { name: "Write a Review" });
  await expect(modalHeading).toBeVisible();

  const reviewForm = page.locator("form", { has: modalHeading });

  // Tap the 5th star of the "Overall rating" row.
  const overallRatingStars = reviewForm
    .locator("div", { hasText: "Overall rating" })
    .last()
    .locator("button");
  await overallRatingStars.nth(4).click();

  await reviewForm.getByPlaceholder("Write your review here...").fill("Great, punctual driver.");
  await reviewForm.getByRole("button", { name: "Submit" }).click();

  await expect(page.getByText("Review Added Successfully")).toBeVisible();

  expect(reviewRequestBody).toMatchObject({
    overallRating: 5,
    comment: "Great, punctual driver.",
  });
});
