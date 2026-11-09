import { expect, test } from "@playwright/test";

// Shaped exactly like StayBookingAdminSerializer's real response (see
// docs/BOOKING_API_CONTRACT.md and core/applications/bookings/serializers.py)
// — the endpoint the stay detail page actually uses when navigated to via a
// booking_reference query param (the common case from the bookings list).
// Field names here are deliberately the *admin* serializer's own names
// (`reference`, `booking_status`, `total_amount`, `customer_details`), not
// the differently-named `/api/hotels/` StayBookingSerializer fields.
const STAY_BOOKING_REFERENCE = "BOOKREQ-STAY-E2E-001";

const stayBookingResponse = {
  booking_type: "stays",
  found_by: "booking_reference",
  booking: {
    id: "d4c3b2a1e5f64708a9b0c1d2e3f4a5b6",
    reference: STAY_BOOKING_REFERENCE,
    hotel_code: "hotel-e2e-1",
    hotel_name: "Abuja Central Guest House",
    check_in: "2026-08-01",
    check_out: "2026-08-05",
    rooms: [{ name: "Standard Room", roomId: "room-1", quantity: 1, occupancy: 2 }],
    customer_details: {
      name: "Ada",
      surname: "Lovelace",
      email: "ada@example.com",
      phone: "0800000000",
    },
    currency: "NGN",
    last_synced_at: null,
    sync_status: "synced",
    sync_error: null,
    booking_status: "confirmed",
    payment_status: "succeeded",
    payment_reference: "pi_e2e_test",
    payment_transaction_id: "pi_e2e_test",
    total_amount: "150000.00",
    raw_response: {},
    cancellation_policy: [],
  },
};

test("stay booking detail shows real price/status and cancels with a reason", async ({ page }) => {
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

  await page.route(`**/api/bookings/my/search/${STAY_BOOKING_REFERENCE}/**`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(stayBookingResponse),
    });
  });

  let cancelRequestBody: Record<string, unknown> | undefined;
  await page.route(
    `**/api/hotels/${STAY_BOOKING_REFERENCE}/cancel-booking/**`,
    async (route) => {
      cancelRequestBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ status: "cancelled", cancelled_at: new Date().toISOString() }),
      });
    },
  );

  await page.goto(`/bookings/stays-details/?booking_reference=${STAY_BOOKING_REFERENCE}`);

  await expect(page.getByRole("heading", { name: "Booking Details" })).toBeVisible();

  // Price: total_amount is the only amount field this endpoint returns —
  // must not render as N/A / -- / blank.
  await expect(page.getByText("NGN 150,000", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("--")).toHaveCount(0);

  await expect(page.getByRole("button", { name: "Cancel Booking" })).toBeVisible();

  await page.getByRole("button", { name: "Cancel Booking" }).click();
  await expect(page.getByRole("heading", { name: "Cancel Booking" })).toBeVisible();
  await page.getByLabel("I found an alternative option").check();
  await page.getByRole("button", { name: "Confirm Cancellation" }).click();

  await expect(page.getByText("Cancellation Request has been submitted")).toBeVisible();
  expect(cancelRequestBody?.reason).toBe("I found an alternative option");
});

test("already-cancelled stay booking shows cancelled state, not the confirmed default", async ({ page }) => {
  // `getBookingLifecycleStatus(undefined, ...)` itself defaults unknown
  // status to "confirmed" — so a booking that's actually CONFIRMED can't
  // distinguish "correctly read" from "field missing, silently defaulted".
  // A CANCELLED booking can: if `booking_status` isn't being read at all,
  // this renders as confirmed (wrong) instead of cancelled.
  await page.addInitScript(() => {
    window.localStorage.setItem("accessToken", "access-token");
    window.localStorage.setItem("refreshToken", "refresh-token");
    window.localStorage.setItem(
      "persist:root",
      JSON.stringify({
        auth: JSON.stringify({
          email: "ada@example.com",
          accessToken: "access-token",
          refreshToken: "refresh-token",
          user: { profileImage: "", id: 7, email: "ada@example.com", name: "Ada Lovelace" },
          registrationComplete: true,
        }),
        profile: "null",
        stays: "null",
        cars: "null",
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      }),
    );
  });

  const reference = "BOOKREQ-STAY-E2E-002";
  await page.route(`**/api/bookings/my/search/${reference}/**`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        booking_type: "stays",
        found_by: "booking_reference",
        booking: {
          ...stayBookingResponse.booking,
          reference,
          booking_status: "cancelled",
          cancelled_at: "2026-07-08T10:00:00.000Z",
        },
      }),
    });
  });

  await page.goto(`/bookings/stays-details/?booking_reference=${reference}`);

  await expect(page.getByRole("heading", { name: "Booking Details" })).toBeVisible();
  await expect(page.getByText("This Stays Bookings has been cancelled")).toBeVisible();
  await expect(page.getByRole("button", { name: "Cancel Booking" })).toHaveCount(0);
});
