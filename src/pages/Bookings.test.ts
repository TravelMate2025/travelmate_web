import { describe, expect, it } from "vitest";
import { getTransferBookingName } from "./Bookings";

describe("getTransferBookingName", () => {
  it("prefers listing_name over pickup/dropoff labels", () => {
    // Real shape from TransferBookingListSerializer (the /bookings/my/
    // endpoint the web "My Bookings" page reads) for a real synced
    // transfer booking.
    const name = getTransferBookingName({
      listing_name: "Lagos Airport — Victoria Island Executive Transfer",
      pickup_location_label: "Murtala Muhammed International Airport (LOS)",
      dropoff_location_label: "Oregun, Epe",
    });

    expect(name).toBe("Lagos Airport — Victoria Island Executive Transfer");
  });

  it("falls back to dropoff_location_label when listing_name has not backfilled yet", () => {
    const name = getTransferBookingName({
      listing_name: "",
      pickup_location_label: "Murtala Muhammed International Airport (LOS)",
      dropoff_location_label: "Oregun, Epe",
    });

    expect(name).toBe("Oregun, Epe");
  });

  it("falls back to pickup_location_label when neither name nor dropoff are set", () => {
    const name = getTransferBookingName({
      listing_name: "",
      pickup_location_label: "Murtala Muhammed International Airport (LOS)",
      dropoff_location_label: "",
    });

    expect(name).toBe("Murtala Muhammed International Airport (LOS)");
  });
});
