import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import authReducer, { loginSuccess } from "../features/account/slices/authSlice";
import PrivateRoute from "./PrivateRoute";

const { toastError } = vi.hoisted(() => ({
  toastError: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    error: toastError,
  },
}));

const createStore = (isAuthenticated: boolean) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });

  if (isAuthenticated) {
    store.dispatch(
      loginSuccess({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        registrationComplete: true,
        user: {
          id: 7,
          email: "ada@example.com",
          name: "Ada Lovelace",
        },
      })
    );
  }

  return store;
};

const CreateAccountStub = () => {
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  return <div>create-account page, from={from}</div>;
};

const renderApp = (isAuthenticated: boolean, initialPath = "/secure") => {
  const store = createStore(isAuthenticated);

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route
            path="/secure"
            element={
              <PrivateRoute>
                <div>secure content</div>
              </PrivateRoute>
            }
          />
          <Route path="/create-account" element={<CreateAccountStub />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

afterEach(() => {
  cleanup();
  toastError.mockClear();
  localStorage.clear();
});

describe("PrivateRoute", () => {
  it("redirects unauthenticated users to create-account", async () => {
    renderApp(false);

    expect(await screen.findByText(/create-account page/)).toBeInTheDocument();
    expect(screen.queryByText("secure content")).not.toBeInTheDocument();
    expect(toastError).toHaveBeenCalledWith("You must be logged in to access that page.", { id: "auth-required" });
  });

  it("passes the requested page along so sign-in can return to it", async () => {
    renderApp(false, "/secure?tab=stays#top");

    expect(await screen.findByText("create-account page, from=/secure?tab=stays#top")).toBeInTheDocument();
  });

  it("stays quiet after a deliberate logout and clears the reason", async () => {
    localStorage.setItem("logout_reason", "logout");

    renderApp(false);

    expect(await screen.findByText(/create-account page/)).toBeInTheDocument();
    expect(toastError).not.toHaveBeenCalled();
    expect(localStorage.getItem("logout_reason")).toBeNull();
  });

  it("renders protected content for authenticated users", () => {
    renderApp(true);

    expect(screen.getByText("secure content")).toBeInTheDocument();
    expect(screen.queryByText(/create-account page/)).not.toBeInTheDocument();
  });
});
