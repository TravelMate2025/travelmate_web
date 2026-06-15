import type { BookStaysResponse, Hotel, HotelSearchResponse, Destination, BookingStaysVerifyDetails, BookingDetailsVerifyData, StayPricing, StayPricingCancellationOption, StayPricingRatePlan } from "../stays/types";
import type { CarTransferOption } from "../car_rentals/types/booking";

export const usePartnerMockData = import.meta.env.VITE_USE_PARTNER_MOCKS !== "false";

export const mockStaySearchParams = {
  destination: "lagos",
  checkIn: "2026-07-01",
  checkOut: "2026-07-05",
  adults: 2,
  children: 1,
  rooms: 1,
};

export const mockStayLocationDetails = {
  name: "Lagos",
  country_name: "Nigeria",
  country_code: "NG",
  code: "lagos",
};

export const mockDestinations: Destination[] = [
  { code: "lagos", name: "Lagos", country_code: "NG", city_name: "Lagos" },
  { code: "abuja", name: "Abuja", country_code: "NG", city_name: "Abuja" },
  { code: "dubai", name: "Dubai", country_code: "AE", city_name: "Dubai" },
];

const mockHotelImages = [
  { secureUrl: "https://images.travelmate.local/lagos-suite-1.jpg", order: 1, spaceType: null as null, roomId: null as null },
  { secureUrl: "https://images.travelmate.local/lagos-suite-2.jpg", order: 2, spaceType: "interior" as string, roomId: null as null },
];

const mockUnitLevelHotel: Hotel = {
  id: "f24add04-0001-4d2c-b615-2de5b5b216ab",
  name: "Marina Residences",
  saleMode: "unit_level",
  propertyType: "apartment",
  status: "live",
  country: "Nigeria",
  adminLevel1: "Lagos",
  city: "Lekki",
  description: "A private serviced apartment with two bedrooms and a city view.",
  address: "12 Marina Road, Lagos",
  priceFrom: 120000,
  ratingScore: 88,
  checkInTime: "14:00",
  checkOutTime: "11:00",
  reviewsCount: 84,
  coordinates: { latitude: 6.448, longitude: 3.406 },
  destination: { code: "lagos", name: "Lagos" },
  amenities: ["wifi", "kitchen", "air_conditioning", "parking"],
  amenityDetails: [
    { code: "wifi", label: "Wi-Fi" },
    { code: "kitchen", label: "Kitchen" },
    { code: "air_conditioning", label: "Air Conditioning" },
    { code: "parking", label: "Parking" },
  ],
  images: mockHotelImages,
  available: true,
  rooms: [
    {
      id: "unit-room-001",
      name: "Master Bedroom",
      occupancy: 2,
      bedConfiguration: "1 King Bed",
      baseRate: 0,
    },
    {
      id: "unit-room-002",
      name: "Second Bedroom",
      occupancy: 2,
      bedConfiguration: "1 Queen Bed",
      baseRate: 0,
    },
  ],
};

const mockUnitLevelHotel2: Hotel = {
  id: "f24add04-0002-4d2c-b615-2de5b5b216ab",
  name: "Lagos Bay Suites",
  saleMode: "unit_level",
  propertyType: "apartment",
  status: "live",
  reviewsCount: 42,
  country: "Nigeria",
  adminLevel1: "Lagos",
  city: "Lekki",
  description: "Modern studio apartment with pool access and lagoon views.",
  address: "34 Admiralty Way, Lekki Phase 1, Lagos",
  priceFrom: 85000,
  ratingScore: 80,
  checkInTime: "14:00",
  checkOutTime: "11:00",
  coordinates: { latitude: 6.45, longitude: 3.41 },
  destination: { code: "lagos", name: "Lagos" },
  amenities: ["wifi", "pool", "air_conditioning", "security"],
  amenityDetails: [
    { code: "wifi", label: "Wi-Fi" },
    { code: "pool", label: "Pool" },
    { code: "air_conditioning", label: "Air Conditioning" },
    { code: "security", label: "Security" },
  ],
  images: mockHotelImages,
  available: true,
  rooms: [
    {
      id: "unit-room-003",
      name: "Studio suite",
      description: "Entire studio with pool access",
      occupancy: 2,
      bedConfiguration: "1 bedroom",
      baseRate: 0,
    },
  ],
};

const mockUnitLevelHotel3: Hotel = {
  id: "f24add04-0003-4d2c-b615-2de5b5b216ab",
  name: "Lekki Penthouse",
  saleMode: "unit_level",
  propertyType: "apartment",
  status: "live",
  reviewsCount: 67,
  country: "Nigeria",
  adminLevel1: "Lagos",
  city: "Lekki",
  description: "Luxury 3-bedroom penthouse with rooftop terrace and panoramic city views.",
  address: "8 Ozumba Mbadiwe, Lekki, Lagos",
  priceFrom: 180000,
  ratingScore: 92,
  checkInTime: "15:00",
  checkOutTime: "11:00",
  coordinates: { latitude: 6.446, longitude: 3.408 },
  destination: { code: "lagos", name: "Lagos" },
  amenities: ["wifi", "kitchen", "rooftop_terrace", "concierge", "gym"],
  amenityDetails: [
    { code: "wifi", label: "Wi-Fi" },
    { code: "kitchen", label: "Kitchen" },
    { code: "rooftop_terrace", label: "Rooftop Terrace" },
    { code: "concierge", label: "Concierge" },
    { code: "gym", label: "Gym" },
  ],
  images: mockHotelImages,
  available: true,
  rooms: [
    {
      id: "unit-room-005",
      name: "Master Bedroom",
      occupancy: 2,
      bedConfiguration: "1 King Bed",
      baseRate: 0,
    },
    {
      id: "unit-room-006",
      name: "Second Bedroom",
      occupancy: 2,
      bedConfiguration: "1 Queen Bed",
      baseRate: 0,
    },
    {
      id: "unit-room-007",
      name: "Third Bedroom",
      occupancy: 2,
      bedConfiguration: "2 Twin Beds",
      baseRate: 0,
    },
  ],
};

const mockRoomLevelHotel: Hotel = {
  id: "61b2e2a5-0001-492a-9820-d5a3a0bbfc97",
  name: "Riverside Hotel",
  saleMode: "room_level",
  propertyType: "guesthouse",
  status: "live",
  reviewsCount: 126,
  country: "Nigeria",
  adminLevel1: "Edo",
  city: "Egor",
  description: "Hotel stay with bookable rooms and rate-plan choices.",
  address: "48 Broad Street, Egor, Edo",
  priceFrom: 72000,
  ratingScore: 85,
  checkInTime: "13:00",
  checkOutTime: "11:00",
  coordinates: { latitude: 6.432, longitude: 3.409 },
  destination: { code: "benin", name: "Benin City" },
  amenities: ["breakfast", "pool", "wifi", "gym"],
  amenityDetails: [
    { code: "breakfast", label: "Breakfast" },
    { code: "pool", label: "Pool" },
    { code: "wifi", label: "Wi-Fi" },
    { code: "gym", label: "Gym" },
  ],
  images: mockHotelImages,
  available: true,
  rooms: [
    {
      id: "2fe66e1b-0001-4a51-bbc7-988f52c988d5",
      name: "Economy Room",
      occupancy: 2,
      bedConfiguration: "1 Double Bed",
      baseRate: 72000,
      isBookable: true,
      totalInventory: 3,
      maxPerBooking: 1,
    },
    {
      id: "d9922227-0001-47f1-8fb4-5acc43f14e5f",
      name: "Deluxe King Room",
      occupancy: 2,
      bedConfiguration: "1 King Bed",
      baseRate: 78000,
      isBookable: true,
      totalInventory: 2,
      maxPerBooking: 1,
    },
  ],
};

const mockRoomLevelHotel2: Hotel = {
  id: "61b2e2a5-0002-492a-9820-d5a3a0bbfc97",
  name: "Benin Royal Hotel",
  saleMode: "room_level",
  propertyType: "hotel",
  status: "live",
  reviewsCount: 91,
  country: "Nigeria",
  adminLevel1: "Edo",
  city: "Egor",
  description: "Full-service hotel near Benin City centre with conference facilities.",
  address: "15 Sapele Road, Egor, Edo",
  priceFrom: 48000,
  ratingScore: 90,
  checkInTime: "13:00",
  checkOutTime: "11:00",
  coordinates: { latitude: 6.338, longitude: 5.621 },
  destination: { code: "benin", name: "Benin City" },
  amenities: ["breakfast", "conference_room", "wifi", "parking"],
  amenityDetails: [
    { code: "breakfast", label: "Breakfast" },
    { code: "conference_room", label: "Conference Room" },
    { code: "wifi", label: "Wi-Fi" },
    { code: "parking", label: "Parking" },
  ],
  images: mockHotelImages,
  available: true,
  rooms: [
    {
      id: "2fe66e1b-0002-4a51-bbc7-988f52c988d5",
      name: "Standard Twin Room",
      occupancy: 2,
      bedConfiguration: "2 Twin Beds",
      baseRate: 55000,
      isBookable: true,
      totalInventory: 7,
      maxPerBooking: 2,
    },
    {
      id: "d9922227-0002-47f1-8fb4-5acc43f14e5f",
      name: "Executive Suite",
      occupancy: 3,
      bedConfiguration: "1 King Bed",
      baseRate: 95000,
      isBookable: true,
      totalInventory: 2,
      maxPerBooking: 1,
    },
  ],
};

const mockRoomLevelHotel3: Hotel = {
  id: "61b2e2a5-0003-492a-9820-d5a3a0bbfc97",
  name: "Midwest Inn",
  saleMode: "room_level",
  propertyType: "guesthouse",
  status: "live",
  reviewsCount: 38,
  country: "Nigeria",
  adminLevel1: "Edo",
  city: "Egor",
  description: "Comfortable budget hotel ideal for business and leisure travellers.",
  address: "22 Airport Road, Egor, Edo",
  priceFrom: 35000,
  ratingScore: 75,
  checkInTime: "12:00",
  checkOutTime: "10:00",
  coordinates: { latitude: 6.341, longitude: 5.618 },
  destination: { code: "benin", name: "Benin City" },
  amenities: ["wifi", "restaurant", "parking"],
  amenityDetails: [
    { code: "wifi", label: "Wi-Fi" },
    { code: "restaurant", label: "Restaurant" },
    { code: "parking", label: "Parking" },
  ],
  images: mockHotelImages,
  available: true,
  rooms: [
    {
      id: "2fe66e1b-0003-4a51-bbc7-988f52c988d5",
      name: "Classic Room",
      occupancy: 2,
      bedConfiguration: "Queen Bed",
      baseRate: 35000,
      isBookable: true,
      totalInventory: 5,
      maxPerBooking: 2,
    },
  ],
};

export const mockHotelSearchResponse: HotelSearchResponse = {
  count: 6,
  results: [
    mockUnitLevelHotel,
    mockUnitLevelHotel2,
    mockUnitLevelHotel3,
    mockRoomLevelHotel,
    mockRoomLevelHotel2,
    mockRoomLevelHotel3,
  ],
};

const allMockHotels = [
  mockUnitLevelHotel,
  mockUnitLevelHotel2,
  mockUnitLevelHotel3,
  mockRoomLevelHotel,
  mockRoomLevelHotel2,
  mockRoomLevelHotel3,
];

export function mockHotelDetails(hotelId: string): Hotel {
  return allMockHotels.find((h) => h.code === hotelId) ?? mockUnitLevelHotel;
}

export function mockHotelReviews(hotelId: string) {
  const hotel = mockHotelDetails(hotelId);
  return {
    hotel_name: hotel.name,
    user_reviews: [
      {
        id: 1,
        user: "Ada",
        rating: 5,
        title: "Excellent stay",
        comment: "Everything was smooth from search to checkout.",
        created_at: "2026-06-01",
      },
      {
        id: 2,
        user: "Tobi",
        rating: 4,
        title: "Great location",
        comment: "Very easy to reach and the room was clean.",
        created_at: "2026-06-02",
      },
    ],
    external_reviews: [],
  };
}

export function mockStayBookingResponse(): BookStaysResponse {
  return {
    success: true,
    checkout_url: "https://payments.travelmate.local/stays/checkout/mock-session",
  };
}

export function mockStayVerification(hotelId: string): BookingStaysVerifyDetails {
  const hotel = mockHotelDetails(hotelId);
  const data: BookingDetailsVerifyData = {
    id: 1001,
    reference: "TM-STAY-1001",
    hotel_code: hotelId,
    hotel_name: hotel.name,
    check_in: mockStaySearchParams.checkIn,
    check_out: mockStaySearchParams.checkOut,
    currency: "NGN",
    payment_status: "PAID",
    status: "CONFIRMED",
    total_price: String(stayPricingConfig[hotelId]?.baseRate ?? 120000),
    created_at: "2026-06-14T08:00:00Z",
    user: { id: 9001, email: "ada@example.com" },
    rooms_details: [],
    guest_details: {
      primary_guest: {
        name: "Ada",
        surname: "Okafor",
        email: "ada@example.com",
        phone: "+2348000000000",
        address: "12 Nabel Street",
        city: "Lagos",
        postal_code: "100001",
        country: "Nigeria",
      },
      additional_adults: [],
      children: [],
      special_requests: "High floor please",
    },
    hotel_location: {
      address: hotel.address,
      latitude: hotel.coordinates.latitude,
      longitude: hotel.coordinates.longitude,
      destination: {
        code: "lagos",
        name: "Lagos",
        city_name: "Lagos",
        country_name: "Nigeria",
      },
    },
  };

  return { success: true, data };
}

const mockTransferImages = [
  { url: "https://images.travelmate.local/transfer-1.jpg" },
  { url: "https://images.travelmate.local/transfer-2.jpg" },
];

const mockTransferOption = {
  id: 501,
  status: "available",
  maxPaxCapacity: 4,
  supplier: "TravelMate Partner",
  vehicle: { name: "Toyota Hiace", code: "TRF-VAN" },
  category: { name: "Airport Taxi" },
  price: { totalAmountWithFee: 18000, amount: 16500 },
  content: {
    images: mockTransferImages,
    transferDetailInfo: [
      { value: "45 min", description: "estimated time" },
      { value: "1", description: "bag" },
      { value: "4", description: "maximum seats" },
      { value: "2", description: "luggage" },
    ],
    transferRemarks: [{ description: "Driver meets guest at arrivals" }],
  },
  cancellationPolicies: [{ amount: 0 }],
  pickupInformation: {
    from: { description: "Murtala Muhammed International Airport" },
    to: { description: "Marina Residences, Lagos" },
    date: "2026-07-01",
    time: "14:30",
  },
  rateKey: "transfer-rate-001",
};

export function mockTransferSearchResults(): CarTransferOption[] {
  return [mockTransferOption as CarTransferOption];
}

export function mockTransferBookingConfirmation() {
  return {
    id: "bookreq_001",
    status: "hold",
    total_price: "16500",
    booking_id: "BOOKREQ-001",
    bookings: [
      {
        holder: {
          name: "Ada",
          surname: "Okafor",
          email: "ada@example.com",
          phone: "+2348000000000",
        },
        status: "hold",
        currency: "NGN",
        supplier: { name: "TravelMate Partner", vatNumber: "VAT-001" },
        reference: "BOOKREQ-001",
        transfers: [mockTransferOption],
      },
    ],
  };
}

export function mockTransferCheckoutSession() {
  return {
    checkout_url: "https://payments.travelmate.local/transfers/checkout/mock-session",
    success: true,
  };
}

type PricingConfig = {
  baseRate: number;
  weekdayRate: number;
  weekendRate: number;
  isRoomLevel: boolean;
  rooms: Array<{ id: string; nonRefRate: number; refRate: number }>;
};

const stayPricingConfig: Record<string, PricingConfig> = {
  "f24add04-0001-4d2c-b615-2de5b5b216ab": {
    baseRate: 120000, weekdayRate: 110000, weekendRate: 135000, isRoomLevel: false,
    rooms: [{ id: "f24add04-0001-4d2c-b615-2de5b5b216ab-r1", nonRefRate: 120000, refRate: 135000 }],
  },
  "f24add04-0002-4d2c-b615-2de5b5b216ab": {
    baseRate: 85000, weekdayRate: 78000, weekendRate: 95000, isRoomLevel: false,
    rooms: [{ id: "f24add04-0002-4d2c-b615-2de5b5b216ab-r1", nonRefRate: 85000, refRate: 95000 }],
  },
  "f24add04-0003-4d2c-b615-2de5b5b216ab": {
    baseRate: 180000, weekdayRate: 165000, weekendRate: 200000, isRoomLevel: false,
    rooms: [{ id: "f24add04-0003-4d2c-b615-2de5b5b216ab-r1", nonRefRate: 180000, refRate: 200000 }],
  },
  "61b2e2a5-0001-492a-9820-d5a3a0bbfc97": {
    baseRate: 78000, weekdayRate: 72000, weekendRate: 85000, isRoomLevel: true,
    rooms: [
      { id: "2fe66e1b-0001-4a51-bbc7-988f52c988d5", nonRefRate: 78000, refRate: 85000 },
      { id: "d9922227-0001-47f1-8fb4-5acc43f14e5f", nonRefRate: 92000, refRate: 102000 },
    ],
  },
  "61b2e2a5-0002-492a-9820-d5a3a0bbfc97": {
    baseRate: 55000, weekdayRate: 50000, weekendRate: 62000, isRoomLevel: true,
    rooms: [
      { id: "2fe66e1b-0002-4a51-bbc7-988f52c988d5", nonRefRate: 55000, refRate: 62000 },
      { id: "d9922227-0002-47f1-8fb4-5acc43f14e5f", nonRefRate: 95000, refRate: 105000 },
    ],
  },
  "61b2e2a5-0003-492a-9820-d5a3a0bbfc97": {
    baseRate: 35000, weekdayRate: 32000, weekendRate: 40000, isRoomLevel: true,
    rooms: [{ id: "2fe66e1b-0003-4a51-bbc7-988f52c988d5", nonRefRate: 35000, refRate: 40000 }],
  },
};

function makeCancellationOptions(nonRefRate: number, refRate: number): StayPricingCancellationOption[] {
  return [
    {
      optionId: "NON_CANCELLABLE",
      label: "Non-cancellable",
      amount: nonRefRate,
      currency: "NGN",
      cancelDeadlineHoursBeforeCheckIn: null,
      policyCopy: "Non-cancellable. No refund after booking.",
    },
    {
      optionId: "FREE_CANCELLATION",
      label: "Free cancellation",
      amount: refRate,
      currency: "NGN",
      cancelDeadlineHoursBeforeCheckIn: 24,
      policyCopy: "Free cancellation up to 24 hours before check-in.",
    },
  ];
}

export function mockStayPricing(stayId: string): StayPricing {
  const cfg = stayPricingConfig[stayId] ?? {
    baseRate: 120000, weekdayRate: 110000, weekendRate: 135000, isRoomLevel: false,
    rooms: [{ id: `${stayId}-r1`, nonRefRate: 120000, refRate: 135000 }],
  };
  const { baseRate, weekdayRate, weekendRate, rooms } = cfg;
  const cheapestRoom = rooms[0];

  const ratePlans: StayPricingRatePlan[] = rooms.flatMap((room) => [
    {
      id: `non-${room.id}`,
      roomId: room.id,
      code: `non_${room.id.slice(0, 8)}`,
      name: "Non-cancellable",
      planType: "non_refundable",
      isActive: true,
      nightlyRate: room.nonRefRate,
      policyVersion: 1,
      startsOn: null,
      endsOn: null,
      cancellationPolicy: {
        policyType: "non_refundable",
        penaltyType: "full_charge",
        cancelDeadlineHoursBeforeCheckIn: null,
        terms: null,
        penaltyAmount: null,
        penaltyPercent: null,
      },
    },
    {
      id: `flex-${room.id}`,
      roomId: room.id,
      code: `flex_${room.id.slice(0, 8)}`,
      name: "Free cancellation",
      planType: "refundable",
      isActive: true,
      nightlyRate: room.refRate,
      policyVersion: 1,
      startsOn: null,
      endsOn: null,
      cancellationPolicy: {
        policyType: "free_cancellation_until",
        penaltyType: "none",
        cancelDeadlineHoursBeforeCheckIn: 24,
        terms: null,
        penaltyAmount: null,
        penaltyPercent: null,
      },
    },
  ]);

  return {
    currency: "NGN",
    baseRate,
    weekdayRate,
    weekendRate,
    minStayNights: 1,
    maxStayNights: 30,
    seasonalOverrides: [],
    blackoutDates: [],
    ratePlans,
    cancellationOptions: makeCancellationOptions(cheapestRoom.nonRefRate, cheapestRoom.refRate),
    roomCancellationOptions: rooms.map((room) => ({
      roomId: room.id,
      cancellationOptions: makeCancellationOptions(room.nonRefRate, room.refRate),
    })),
    priceBreakdown: {
      currency: "NGN",
      base: { amount: cheapestRoom.nonRefRate },
      taxes: { amount: 0, inclusive: true },
      fees: { amount: 0, inclusive: true },
      total: { amount: cheapestRoom.nonRefRate },
      rateBands: {
        weekday: { amount: weekdayRate },
        weekend: { amount: weekendRate },
      },
      previewOptionId: "NON_CANCELLABLE",
      notes: "Tax and fee components are placeholder zero-values.",
    },
  };
}

export function mockTransferBookingBySession() {
  return {
    success: true,
    data: mockTransferBookingConfirmation(),
  };
}
