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
});
