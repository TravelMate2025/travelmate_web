import { describe, expect, it } from "vitest";
import {
  mockDestinations,
  mockHotelSearchResponse,
  mockStayLocationDetails,
  mockStaySearchParams,
  mockTransferSearchResults,
} from "./partnerMockData";

describe("partnerMockData", () => {
  it("exposes stay fixtures for unit and room bookings", () => {
    expect(mockStaySearchParams.destination).toBe("lagos");
    expect(mockStayLocationDetails.name).toBe("Lagos");
    expect(mockHotelSearchResponse.results).toHaveLength(6);
    const types = mockHotelSearchResponse.results.map((h) => h.saleMode ?? h.accommodation_type);
    expect(types.filter((t) => t === "unit_level")).toHaveLength(3);
    expect(types.filter((t) => t === "room_level")).toHaveLength(3);
  });

  it("exposes transfer fixtures for airport taxi flows", () => {
    expect(mockDestinations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "lagos" }),
      ]),
    );
    expect(mockTransferSearchResults()).toHaveLength(1);
    expect(mockTransferSearchResults()[0].vehicle.name).toBe("Toyota Hiace");
  });
});
