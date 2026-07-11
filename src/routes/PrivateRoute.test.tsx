import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
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

const renderApp = (isAuthenticated: boolean) => {
  const store = createStore(isAuthenticated);

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/secure"]}>
        <Routes>
          <Route
            path="/secure"
            element={
              <PrivateRoute>
                <div>secure content</div>
              </PrivateRoute>
            }
          />
          <Route path="/create-account" element={<div>create-account page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

afterEach(() => {
  cleanup();
  toastError.mockClear();
});

describe("PrivateRoute", () => {
  it("redirects unauthenticated users to create-account", async () => {
    renderApp(false);

    expect(await screen.findByText("create-account page")).toBeInTheDocument();
    expect(screen.queryByText("secure content")).not.toBeInTheDocument();
    expect(toastError).toHaveBeenCalledWith("You must be logged in to access that page.");
  });

  it("renders protected content for authenticated users", () => {
    renderApp(true);

    expect(screen.getByText("secure content")).toBeInTheDocument();
    expect(screen.queryByText("create-account page")).not.toBeInTheDocument();
  });
});
