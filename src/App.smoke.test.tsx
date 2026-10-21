import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import authReducer from "./features/account/slices/authSlice";
import staysReducer from "./features/stays/slice";
import type { Hotel } from "./features/stays/types";

const { mockGoogleLogin } = vi.hoisted(() => ({
  mockGoogleLogin: vi.fn(),
}));

vi.mock("./pages/Home", () => ({
  default: () => <div>home page</div>,
}));

vi.mock("./features/account/pages/CreateAccount", () => ({
  default: () => <div>create account page</div>,
}));

vi.mock("./features/account/components/AuthNavbar", () => ({
  default: () => <div>auth nav</div>,
}));

vi.mock("./features/account/components/Spinner", () => ({
  default: () => <div>spinner</div>,
}));

vi.mock("@react-oauth/google", () => ({
  useGoogleLogin: () => mockGoogleLogin,
}));

vi.mock("./pages/homePage/Navbar", () => ({
  default: () => <div>navbar</div>,
}));

vi.mock("./components/2Footer", () => ({
  default: () => <div>footer</div>,
}));

vi.mock("./pages/homePage/TravelmateApp", () => ({
  default: () => <div>travelmate app</div>,
}));

vi.mock("./components/Breadcrumbs", () => ({
  default: () => <div>breadcrumbs</div>,
}));

vi.mock("./features/stays/components/StayList", () => ({
  default: () => <div>stay list</div>,
}));

vi.mock("./features/stays/components/UpdateSearchFilter", () => ({
  default: () => <div>update search filter</div>,
}));

vi.mock("./features/stays/pages/PartnerStaySearchPage", () => ({
  default: () => (
    <div>
      <h1>Find a destination</h1>
      <input aria-label="Destination" />
      <button>Show stay results</button>
      <div>Benin City, Edo, Nigeria</div>
    </div>
  ),
}));

vi.mock("./features/stays/pages/StaysSearchResults", () => ({
  default: () => <div>stay results</div>,
}));

vi.mock("./pages/Flight", () => ({
  default: () => <div>flight search</div>,
}));

vi.mock("./features/stays/api", () => ({
  getReviews: vi.fn().mockResolvedValue([]),
  searchStays: vi.fn().mockResolvedValue({ count: 0, results: [] }),
  searchHotels: vi.fn().mockResolvedValue({ count: 0, results: [] }),
  createCheckoutSession: vi.fn().mockResolvedValue({
    success: true,
    checkout_url: "https://example.com/mock-checkout",
  }),
  fetchDestinations: vi.fn().mockResolvedValue([]),
  getHotelDetails: vi.fn().mockResolvedValue({
    reviewsCount: 0,
    code: "hotel-1",
    name: "Hotel One",
    address: "1 Test Street",
    coordinates: { latitude: 6.5244, longitude: 3.3792 },
    destination: { name: "Lagos", code: "lag" },
    amenities: [],
    images: [],
    accommodation_type: "unit_level",
    rooms: [],
  }),
  verifyHotelBooking: vi.fn().mockResolvedValue({ success: true, data: {} }),
  verifyTransfersBooking: vi.fn().mockResolvedValue({ success: true, data: {} }),
}));

vi.mock("./features/shared/partnerLocationsService", () => ({
  fetchPartnerStayLocations: vi.fn().mockResolvedValue({
    kind: "stays",
    locations: [
      {
        country: "Nigeria",
        adminLevel1: "Edo",
        city: "Benin City",
        listingCount: 1,
        areas: [],
        displayName: "Benin City, Edo, Nigeria",
      },
    ],
  }),
  fetchPartnerTransferLocations: vi.fn().mockResolvedValue({
    kind: "transfers",
    pickups: [],
    destinations: [],
  }),
}));

vi.mock("./features/stays/pages/StaysDetail", () => ({
  default: () => (
    <div>
      <h1>Stay details</h1>
      <span>unit stay</span>
      <span>pricing source</span>
    </div>
  ),
}));

vi.mock("./features/stays/pages/BookingProgress", () => ({
  default: () => (
    <div>
      <h1>Booking review</h1>
      <div>booking progress hotel card</div>
    </div>
  ),
}));

vi.mock("./features/stays/components/modals/SortModal", () => ({
  default: () => null,
}));

vi.mock("./features/stays/components/modals/FilterModal", () => ({
  default: () => null,
}));

vi.mock("./features/stays/components/BookingProgressHotelCard", () => ({
  default: () => <div>booking progress hotel card</div>,
}));

vi.mock("./features/stays/components/booking-progress/GuestInformation", () => ({
  default: () => <div>guest information</div>,
}));

vi.mock("./features/stays/components/booking-progress/PriceSummary", () => ({
  default: () => <div>price summary</div>,
}));

vi.mock("./features/stays/components/booking-progress/BookingDetails", () => ({
  default: () => <div>booking details</div>,
}));

vi.mock("./features/stays/components/booking-progress/PaymentMethod", () => ({
  default: () => <div>payment method</div>,
}));

vi.mock("./features/stays/components/booking-progress/RefundCancellation", () => ({
  default: () => <div>refund cancellation</div>,
}));

vi.mock("./features/stays/components/booking-progress/Policies", () => ({
  default: () => <div>policies</div>,
}));

vi.mock("./pages/homePage/Flight", () => ({
  default: () => <div>flight search</div>,
}));

vi.mock("./features/account/components/UserData", () => ({
  default: () => <div>user data</div>,
}));

vi.mock("./features/account/components/UserOptions", () => ({
  default: () => <div>user options</div>,
}));

vi.mock("./features/account/api/auth", () => ({
  loginUser: vi.fn(),
  socialGoogleLogin: vi.fn(),
}));

vi.mock("./features/account/api/profile", () => ({
  fetchUserProfile: vi.fn(),
}));

import App from "./App";
import { bookingFlowRoutes } from "./features/shared/bookingFlowRoutes";

const createStore = (options?: {
  authenticated?: boolean;
  hotels?: Hotel[];
  searchParams?: {
    destination?: string;
    country?: string;
    adminLevel1?: string;
    city?: string;
    stayType?: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    rooms: number;
  } | null;
  locationDetails?: {
    name: string;
    country_name: string;
    country_code: string;
    code: string;
    adminLevel1?: string;
    city?: string;
  } | null;
}) =>
  configureStore({
    reducer: {
      auth: authReducer,
      stays: staysReducer,
    },
    preloadedState: {
      auth: options?.authenticated
        ? {
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
          }
        : {
            email: "",
            accessToken: null,
            refreshToken: null,
            user: null,
            registrationComplete: false,
          },
      stays: {
        hotels: options?.hotels ?? [],
        loading: false,
        error: null,
        searchParams: options?.searchParams ?? null,
        locationDetails: options?.locationDetails ?? null,
        selectedHotel: null,
        detailsLoading: false,
        detailsError: null,
        booking: {
          loading: false,
          error: null,
          booking: null,
        },
        guestInfo: null,
      } as any,
    },
  });

const renderRoute = (
  path: string,
  options?: {
    authenticated?: boolean;
    hotels?: Hotel[];
    searchParams?: {
      destination?: string;
      country?: string;
      adminLevel1?: string;
      city?: string;
      stayType?: string;
      checkIn: string;
      checkOut: string;
      adults: number;
      children: number;
      rooms: number;
    } | null;
    locationDetails?: {
      name: string;
      country_name: string;
      country_code: string;
      code: string;
      adminLevel1?: string;
      city?: string;
    } | null;
  },
) => {
  const store = createStore(options);

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
};

beforeEach(() => {
  localStorage.clear();
  mockGoogleLogin.mockReset();
});

afterEach(() => {
  cleanup();
});

describe("App route smoke coverage", () => {
  it("renders the public home route for signed-out visitors", () => {
    renderRoute("/");

    expect(screen.getByText("home page")).toBeInTheDocument();
  });

  it("renders the login route", () => {
    localStorage.setItem("email", "ada@example.com");

    renderRoute("/login");

    expect(screen.getByRole("heading", { name: /enter your password/i })).toBeInTheDocument();
    expect(screen.getByText("auth nav")).toBeInTheDocument();
  });

  it("renders the stays search route", async () => {
    renderRoute(`${bookingFlowRoutes.staySearch}?flow=partner`);

    expect(
      await screen.findByText(/find a destination/i, {}, { timeout: 15000 }),
    ).toBeInTheDocument();
    expect(screen.getByText("Benin City, Edo, Nigeria")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /show stay results/i })).toBeEnabled();
  }, 20000);

  it("renders the stay results route", async () => {
    renderRoute(`${bookingFlowRoutes.stayResults}?flow=partner`, {
      hotels: [
        {
          code: "tm-room-001",
          name: "Riverside Hotel",
          reviewsCount: 126,
          address: "48 Broad Street, Lagos",
          coordinates: { latitude: 6.432, longitude: 3.409 },
          destination: { name: "Lagos", code: "lag" },
          country: "Nigeria",
          adminLevel1: "Edo",
          city: "Egor",
          amenities: [],
          images: [],
          accommodation_type: "room_level",
          rooms: [],
        },
      ],
      searchParams: {
        country: "Nigeria",
        adminLevel1: "Edo",
        city: "Egor",
        stayType: "room_level",
        checkIn: "2026-07-01",
        checkOut: "2026-07-05",
        adults: 2,
        children: 1,
        rooms: 1,
      },
      locationDetails: {
        name: "Egor",
        country_name: "Nigeria",
        country_code: "NG",
        code: "egor",
        adminLevel1: "Edo",
        city: "Egor",
      },
    });

    expect(
      await screen.findByText(/stay results/i, {}, { timeout: 5000 }),
    ).toBeInTheDocument();
  });

  it("renders the stay detail route", async () => {
    renderRoute(`${bookingFlowRoutes.stayDetail}/hotel-1`, {
      hotels: [
        {
          code: "hotel-1",
          name: "Hotel One",
          reviewsCount: 0,
          address: "1 Test Street",
          coordinates: { latitude: 6.5244, longitude: 3.3792 },
          destination: { name: "Lagos", code: "lag" },
          amenities: [],
          images: [],
          accommodation_type: "unit_level",
          rooms: [],
        },
      ],
    });

    expect(await screen.findByRole("heading", { name: /stay details/i })).toBeInTheDocument();
    expect(await screen.findByText(/unit stay/i)).toBeInTheDocument();
    expect(await screen.findByText(/pricing source/i)).toBeInTheDocument();
  });

  it("renders the booking progress route", async () => {
    renderRoute(bookingFlowRoutes.stayBookingReview, { authenticated: true });

    expect(await screen.findByRole("heading", { name: /booking review/i })).toBeInTheDocument();
    expect(await screen.findByText("booking progress hotel card")).toBeInTheDocument();
  });

  it("renders the flights route", async () => {
    renderRoute("/flights");

    expect(await screen.findByText("flight search")).toBeInTheDocument();
  });

  it("renders the account route for signed-in users", async () => {
    renderRoute("/account", { authenticated: true });

    expect(await screen.findByText("user data")).toBeInTheDocument();
    expect(await screen.findByText("user options")).toBeInTheDocument();
  });
});
