import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import authReducer, { loginSuccess } from "../slices/authSlice";
import UpdateEmailContainer from "./UpdateEmailContainer";

const { mockPost, mockToastSuccess } = vi.hoisted(() => ({
  mockPost: vi.fn(),
  mockToastSuccess: vi.fn(),
}));

vi.mock("../../../api/services/api", () => ({
  default: {
    post: mockPost,
  },
}));

vi.mock("../../../pages/homePage/Navbar", () => ({
  default: () => <div data-testid="navbar" />,
}));

vi.mock("../../../pages/homePage/TravelmateApp", () => ({
  default: () => <div data-testid="travelmate-app" />,
}));

vi.mock("../../../components/2Footer", () => ({
  default: () => <div data-testid="footer" />,
}));

vi.mock("../../../components/Breadcrumbs", () => ({
  default: () => <div data-testid="breadcrumbs" />,
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: mockToastSuccess,
    error: vi.fn(),
  },
}));

const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });

  store.dispatch(
    loginSuccess({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      registrationComplete: true,
      user: {
        id: 77,
        email: "current@example.com",
        name: "Travel Mate",
      },
    })
  );

  return store;
};

const renderPage = () => {
  const store = makeStore();

  render(
    <Provider store={store}>
      <MemoryRouter>
        <UpdateEmailContainer />
      </MemoryRouter>
    </Provider>
  );

  return { store };
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("UpdateEmailContainer", () => {
  it("walks through the mobile-style email update flow", async () => {
    mockPost.mockImplementation((url: string) => {
      if (url === "/users/reset_email/") {
        return Promise.resolve({ status: 204 });
      }

      if (url === "/users/validate-reset-token/") {
        return Promise.resolve({ status: 200 });
      }

      if (url === "/users/set_email/") {
        return Promise.resolve({ status: 200 });
      }

      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    const { store } = renderPage();

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(
        "/users/reset_email/",
        { email: "current@example.com" }
      );
    });

    const otpInputs = await screen.findAllByRole("textbox");
    fireEvent.change(otpInputs[0], { target: { value: "1" } });
    fireEvent.change(otpInputs[1], { target: { value: "2" } });
    fireEvent.change(otpInputs[2], { target: { value: "3" } });
    fireEvent.change(otpInputs[3], { target: { value: "4" } });

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/users/validate-reset-token/", {
        token: "1234",
        email: "current@example.com",
      });
    });

    const newEmailInput = await screen.findByPlaceholderText("name@mail.com");
    const passwordInput = screen.getByPlaceholderText("Enter current password");

    fireEvent.change(newEmailInput, { target: { value: "new@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "current-password" } });
    fireEvent.click(screen.getByRole("button", { name: "Save Email" }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/users/set_email/", {
        new_email: "new@example.com",
        current_password: "current-password",
      });
      expect(mockToastSuccess).toHaveBeenCalledWith("Email updated successfully.");
      expect(store.getState().auth.user?.email).toBe("new@example.com");
    });
  });

  it("shows backend validation errors from set_email", async () => {
    mockPost.mockImplementation((url: string) => {
      if (url === "/users/reset_email/") {
        return Promise.resolve({ status: 204 });
      }

      if (url === "/users/validate-reset-token/") {
        return Promise.resolve({ status: 200 });
      }

      if (url === "/users/set_email/") {
        return Promise.reject({
          isAxiosError: true,
          message: "Request failed with status code 400",
          response: {
            data: {
              current_password: ["Current password is incorrect."],
            },
          },
        });
      }

      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    renderPage();

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/users/reset_email/", {
        email: "current@example.com",
      });
    });

    const otpInputs = await screen.findAllByRole("textbox");
    fireEvent.change(otpInputs[0], { target: { value: "1" } });
    fireEvent.change(otpInputs[1], { target: { value: "2" } });
    fireEvent.change(otpInputs[2], { target: { value: "3" } });
    fireEvent.change(otpInputs[3], { target: { value: "4" } });

    const newEmailInput = await screen.findByPlaceholderText("name@mail.com");
    const passwordInput = screen.getByPlaceholderText("Enter current password");

    fireEvent.change(newEmailInput, { target: { value: "new@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrong-password" } });
    fireEvent.click(screen.getByRole("button", { name: "Save Email" }));

    await waitFor(() => {
      expect(screen.getByText("Current password is incorrect.")).toBeInTheDocument();
    });
  });
});
