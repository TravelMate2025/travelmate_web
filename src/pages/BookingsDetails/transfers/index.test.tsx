import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

const mockVerifyTransfersBooking = vi.fn();
const mockSearchTransferBookingByReference = vi.fn();
const mockCancelTransferBookings = vi.fn();
const mockNavigate = vi.fn();

vi.mock("../../../features/stays/api", () => ({
  CancelTransferBookings: (...args: unknown[]) => mockCancelTransferBookings(...args),
  searchTransferBookingByReference: (...args: unknown[]) =>
    mockSearchTransferBookingByReference(...args),
  verifyTransfersBooking: (...args: unknown[]) => mockVerifyTransfersBooking(...args),
}));

vi.mock("../../../components/2Footer", () => ({
  default: () => <div data-testid="footer" />,
}));

vi.mock("../../../pages/homePage/Navbar", () => ({
  default: () => <div data-testid="navbar" />,
}));

vi.mock("../Skeleton", () => ({
  default: () => <div data-testid="skeleton" />,
}));

vi.mock("../../../features/stays/components/modals/ShareModal", () => ({
  default: () => <div data-testid="share-modal" />,
}));

vi.mock("../NotFound", () => ({
  default: () => <div data-testid="not-found" />,
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import BookingTransfersDetails from "./index";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  window.history.pushState({}, "", "/");
});

describe("BookingTransfersDetails", () => {
  it("opens the cancel modal and calls the web cancel API with the booking reference", async () => {
    mockVerifyTransfersBooking.mockResolvedValue({
      data: {
        bookings: [
          {
            reference: "BOOKREQ-TRANSFER-001",
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
      },
    });
    mockCancelTransferBookings.mockResolvedValue({ success: true });

    window.history.pushState({}, "", "/bookings/transfers-details/?session_id=session-1");

    render(
      <MemoryRouter initialEntries={["/bookings/transfers-details/?session_id=session-1"]}>
        <Routes>
          <Route path="/bookings/transfers-details/" element={<BookingTransfersDetails />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Booking Details")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel Booking" }));

    expect(await screen.findByText("Confirm Cancellation")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Confirm Cancellation" }));

    await waitFor(() => {
      expect(mockCancelTransferBookings).toHaveBeenCalledWith(
        "BOOKREQ-TRANSFER-001",
        expect.any(Function),
      );
    });
  });

  it("falls back to booking reference when session verification is unavailable", async () => {
    mockVerifyTransfersBooking.mockResolvedValue({
      success: false,
      data: {},
    });
    mockSearchTransferBookingByReference.mockResolvedValue({
      data: {
        reference: "BOOKREQ-TRANSFER-002",
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
    });

    window.history.pushState(
      {},
      "",
      "/bookings/transfers-details/?session_id=session-1&booking_reference=BOOKREQ-TRANSFER-002",
    );

    render(
      <MemoryRouter
        initialEntries={[
          "/bookings/transfers-details/?session_id=session-1&booking_reference=BOOKREQ-TRANSFER-002",
        ]}
      >
        <Routes>
          <Route path="/bookings/transfers-details/" element={<BookingTransfersDetails />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Booking Details")).toBeInTheDocument();
    expect(await screen.findByText("BOOKREQ-TRANSFER-002")).toBeInTheDocument();
    expect(mockSearchTransferBookingByReference).toHaveBeenCalledWith(
      "BOOKREQ-TRANSFER-002",
      { suppressToast: true },
    );
  });

  it("renders the detailed backend transfer contract instead of showing unavailable values", async () => {
    mockSearchTransferBookingByReference.mockResolvedValue({
      data: {
        booking_type: "transfers",
        booking: {
          id: "transfer-row-001",
          booking_reference: "BK-TRANSFER-DETAIL-001",
          booking_status: "confirmed",
          listing_name: "Airport to Victoria Island Executive Transfer",
          pickup_location: "Murtala Muhammed International Airport",
          pickup_location_label: "Lagos Airport Terminal 2",
          dropoff_location: "Victoria Island",
          dropoff_location_label: "Victoria Island, Lagos",
          transfer_type: "private",
          vehicle_class: "Executive Sedan",
          passenger_capacity: 3,
          luggage_capacity: 2,
          provider_name: "TravelMate Transfers",
          estimated_duration_minutes: 45,
          pickup_date: "2026-08-12",
          pickup_time: "10:30",
          first_name: "Ada",
          last_name: "Lovelace",
          email: "ada@example.com",
          contact_phone: "0800000000",
          total_amount: "25000.00",
          currency: "NGN",
          cancellation_policy: [
            { from: "2026-08-11T10:30:00Z", amount: "0.00", currency: "NGN" },
          ],
        },
      },
    });

    window.history.pushState({}, "", "/bookings/transfers-details/?booking_reference=BK-TRANSFER-DETAIL-001");

    render(
      <MemoryRouter initialEntries={["/bookings/transfers-details/?booking_reference=BK-TRANSFER-DETAIL-001"]}>
        <Routes>
          <Route path="/bookings/transfers-details/" element={<BookingTransfersDetails />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Lagos Airport Terminal 2")).toBeInTheDocument();
    expect(screen.getByText("Victoria Island, Lagos")).toBeInTheDocument();
    expect(screen.getByText("Executive Sedan Car")).toBeInTheDocument();
    expect(screen.getByText("TravelMate Transfers")).toBeInTheDocument();
    expect(screen.getByText("45 minutes")).toBeInTheDocument();
    expect(screen.getByText("3 Seats")).toBeInTheDocument();
    expect(screen.getByText("2 bags")).toBeInTheDocument();
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
  });
});
