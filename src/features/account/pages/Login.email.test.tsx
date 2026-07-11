import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import authReducer, { loginSuccess } from "../slices/authSlice";
import Login from "./Login";

vi.mock("../components/GoogleLoginButton", () => ({
  default: () => <div />,
}));
vi.mock("../../../AppErrorBoundary", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("../api/auth", () => ({
  loginUser: vi.fn(),
}));
vi.mock("../api/profile", () => ({
  fetchUserProfile: vi.fn(),
}));

const makeStore = (email = "") => {
  const store = configureStore({ reducer: { auth: authReducer } });
  if (email) {
    store.dispatch(
      loginSuccess({
        accessToken: "tok",
        refreshToken: "ref",
        registrationComplete: true,
        user: { id: 1, email, name: "Test" },
      })
    );
  }
  return store;
};

const renderLogin = (
  routeState: Record<string, string> | undefined,
  reduxEmail = "",
  localStorageEmail = ""
) => {
  if (localStorageEmail) {
    localStorage.setItem("email", localStorageEmail);
  } else {
    localStorage.removeItem("email");
  }
  localStorage.removeItem("verify_email");

  const store = makeStore(reduxEmail);

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/login", state: routeState }]}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("Login email resolution", () => {
  it("uses email from location state (password reset redirect)", () => {
    renderLogin({ email: "reset@example.com" }, "", "old@example.com");
    expect(screen.getByText("reset@example.com")).toBeInTheDocument();
  });

  it("falls back to Redux email when no location state", () => {
    renderLogin(undefined, "redux@example.com", "");
    expect(screen.getByText("redux@example.com")).toBeInTheDocument();
  });

  it("falls back to localStorage email when no state or Redux email", () => {
    renderLogin(undefined, "", "stored@example.com");
    expect(screen.getByText("stored@example.com")).toBeInTheDocument();
  });

  it("shows Not available when all sources are empty", () => {
    renderLogin(undefined, "", "");
    expect(screen.getByText("Not available")).toBeInTheDocument();
  });

  it("location state email takes priority over Redux and localStorage", () => {
    renderLogin({ email: "state@example.com" }, "redux@example.com", "storage@example.com");
    expect(screen.getByText("state@example.com")).toBeInTheDocument();
    expect(screen.queryByText("redux@example.com")).not.toBeInTheDocument();
    expect(screen.queryByText("storage@example.com")).not.toBeInTheDocument();
  });
});
