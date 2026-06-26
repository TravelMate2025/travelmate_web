import { cleanup, render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import CreateNewPassword from "./CreateNewPassword";

const { mockNavigate, mockSetNewPassword, toastSuccess, toastError } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockSetNewPassword: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../api/auth", () => ({
  setNewPassword: mockSetNewPassword,
}));

vi.mock("react-hot-toast", () => ({
  default: { success: toastSuccess, error: toastError },
}));

const VALID_PASSWORD = "Secure@123";

const renderWithEmail = (email: string | undefined) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: "/create-new-password", state: { email } }]}>
      <Routes>
        <Route path="/create-new-password" element={<CreateNewPassword />} />
      </Routes>
    </MemoryRouter>
  );

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe("CreateNewPassword", () => {
  it("navigates to /login with email in state after successful password reset", async () => {
    vi.useFakeTimers();
    mockSetNewPassword.mockResolvedValue({ success: true });

    renderWithEmail("user@example.com");

    const input = screen.getByPlaceholderText("Enter New Password");
    fireEvent.change(input, { target: { value: VALID_PASSWORD } });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    // Flush promise resolution from the mock
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(mockSetNewPassword).toHaveBeenCalledWith("user@example.com", VALID_PASSWORD);
    expect(mockNavigate).toHaveBeenCalledWith("/login", { state: { email: "user@example.com" } });
  });

  it("does not call API if email is missing from location state", () => {
    renderWithEmail(undefined);

    const input = screen.getByPlaceholderText("Enter New Password");
    fireEvent.change(input, { target: { value: VALID_PASSWORD } });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(mockSetNewPassword).not.toHaveBeenCalled();
  });

  it("shows error toast when setNewPassword throws", async () => {
    mockSetNewPassword.mockRejectedValue(new Error("Server error"));

    renderWithEmail("user@example.com");

    const input = screen.getByPlaceholderText("Enter New Password");
    fireEvent.change(input, { target: { value: VALID_PASSWORD } });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => expect(toastError).toHaveBeenCalledWith("Server error"));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("submit button is disabled until all password requirements are met", () => {
    renderWithEmail("user@example.com");

    const input = screen.getByPlaceholderText("Enter New Password");

    // Weak password — button shows "Create New Password" and is disabled
    fireEvent.change(input, { target: { value: "weak" } });
    expect(screen.getByRole("button", { name: /create new password/i })).toBeDisabled();

    // Valid password — button shows "Continue" and is enabled
    fireEvent.change(input, { target: { value: VALID_PASSWORD } });
    expect(screen.getByRole("button", { name: /continue/i })).not.toBeDisabled();
  });
});
