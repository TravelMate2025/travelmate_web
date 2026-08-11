import type { CarTransferOption } from "../car_rentals/types/booking";

/** Test/preview fixture only. Production flows use the configured backend. */

const mockTransferImages = [
  { url: "https://images.travelmate.local/transfer-1.jpg" },
  { url: "https://images.travelmate.local/transfer-2.jpg" },
];

const mockTransferOption = {
  id: 501,
  status: "live",
  name: "Lagos Airport — Victoria Island Executive Transfer",
  description:
    "Professional airport pickup and drop-off service between MMIA and Victoria Island hotels and residences.",
  transferType: "airport",
  pickupPoint: "Murtala Muhammed International Airport (LOS)",
  dropoffPoint: "Victoria Island, Lagos",
  vehicleClass: "economy_sedan",
  maxPaxCapacity: 4,
  passengerCapacity: 3,
  luggageCapacity: 6,
  supplier: "TravelMate Partner",
  vehicle: { name: "Toyota Hiace", code: "TRF-VAN" },
  category: { name: "Airport Taxi" },
  features: ["AC", "Airport signage", "Meet and greet", "Water onboard"],
  price: { totalAmountWithFee: 18000, amount: 16500 },
  currency: "NGN",
  baseFare: 3500,
  nightSurcharge: 10000,
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
  route: {
    pickup: {
      rawText: "Murtala Muhammed International Airport (LOS)",
      area: "Murtala Muhammed International Airport (LOS)",
      subArea: null,
      nodeType: "area_only",
    },
    dropoff: {
      rawText: "Victoria Island, Lagos",
      area: "Lagos",
      subArea: "Victoria Island",
      nodeType: "area_subarea",
    },
    coverageAreas: ["Lagos", "Nigeria"],
    coverageAreaSlugs: ["lagos", "nigeria"],
  },
  routeMatch: { score: 0, level: "none" },
  operatingPolicy: {
    meetAndGreet: true,
    waitTimeMinutes: 15,
    gracePeriodMinutes: 15,
    flightTrackingEnabled: false,
    operationalNotes: "06:00-23:00",
  },
  vehicleCapabilities: {
    vehicleClass: "economy_sedan",
    passengerCapacity: 3,
    luggageCapacity: 6,
    features: ["ac", "airport signage", "meet and greet", "water onboard"],
    airConditioned: true,
    childSeatAvailable: false,
    wheelchairAccessible: false,
  },
  pickupInformation: {
    from: { description: "Murtala Muhammed International Airport" },
    to: { description: "Marina Residences, Lagos" },
    date: "2026-07-01",
    time: "14:30",
  },
  rateKey: "transfer-rate-001",
  bookingOptions: {
    cancellationOptions: [
      {
        optionId: "NON_CANCELLABLE",
        label: "Non-cancellable",
        amount: 3500,
        currency: "NGN",
        policyCopy: "Non-cancellable. No refund after booking.",
      },
      {
        optionId: "FREE_CANCELLATION",
        label: "Free cancellation",
        amount: 3850,
        currency: "NGN",
        cancelDeadlineHoursBeforeCheckIn: 24,
        policyCopy: "Free cancellation up to 24 hours before check-in/pickup.",
      },
    ],
  },
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

export function mockTransferBookingBySession() {
  return {
    success: true,
    data: mockTransferBookingConfirmation(),
  };
}
