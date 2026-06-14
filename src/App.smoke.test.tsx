import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import authReducer from "./features/account/slices/authSlice";
import staysReducer from "./features/stays/slice";

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

vi.mock("./pages/flights/FlightSearchComponent", () => ({
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

const createStore = (options?: { authenticated?: boolean }) =>
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
        hotels: [],
        loading: false,
        error: null,
        searchParams: null,
        locationDetails: null,
        selectedHotel: null,
        detailsLoading: false,
        detailsError: null,
        booking: {
          loading: false,
          error: null,
          booking: null,
        },
        guestInfo: null,
      },
    },
  });

const renderRoute = (path: string, options?: { authenticated?: boolean }) => {
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
  it("renders the login route", () => {
    localStorage.setItem("email", "ada@example.com");

    renderRoute("/login");

    expect(screen.getByRole("heading", { name: /enter your password/i })).toBeInTheDocument();
    expect(screen.getByText("auth nav")).toBeInTheDocument();
  });

  it("renders the stays search route", async () => {
    renderRoute("/stays-search-result");

    expect(await screen.findByText(/results/i)).toBeInTheDocument();
    expect(screen.getByText("update search filter")).toBeInTheDocument();
  });

  it("renders the booking progress route", async () => {
    renderRoute("/booking-progress", { authenticated: true });

    expect(await screen.findByRole("heading", { name: /booking overview/i })).toBeInTheDocument();
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
