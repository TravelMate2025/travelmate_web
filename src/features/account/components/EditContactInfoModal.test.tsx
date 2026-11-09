import { cleanup, render, screen, fireEvent, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { afterEach, describe, expect, it, vi } from "vitest";
import authReducer, { loginSuccess, updateProfileId } from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import EditContactInfoModal from "./EditContactInfoModal";
import type { UserProfile } from "../api/profile";

// ─── hoisted mocks ───────────────────────────────────────────────────────────
const { mockUpdateUserProfile, toastSuccess, toastError } = vi.hoisted(() => ({
  mockUpdateUserProfile: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("../api/profile", () => ({
  updateUserProfile: mockUpdateUserProfile,
}));

vi.mock("react-hot-toast", () => ({
  default: { success: toastSuccess, error: toastError },
}));

// ─── helpers ─────────────────────────────────────────────────────────────────
const BASE_PROFILE: UserProfile = {
  id: 1,
  email: "test@example.com",
  first_name: "Jane",
  last_name: "Doe",
  gender: "Female",
  date_of_birth: "1990-05-20",
  mobile_number: "08012345678",
  address: "123 Main St",
  profile_pics: null,
};

const makeStore = (withAuth = true, withProfileId = true) => {
  const store = configureStore({ reducer: { auth: authReducer, profile: profileReducer } });
  if (withAuth) {
    store.dispatch(
      loginSuccess({
        accessToken: "test-token",
        refreshToken: "refresh",
        registrationComplete: true,
        user: { id: 1, email: "test@example.com", name: "Jane Doe" },
      })
    );
    if (withProfileId) {
      store.dispatch(updateProfileId(1));
    }
  }
  return store;
};

const renderModal = (
  overrides: Partial<{
    isOpen: boolean;
    currentUserInfo: UserProfile | null;
    withAuth: boolean;
    withProfileId: boolean;
  }> = {}
) => {
  const {
    isOpen = true,
    currentUserInfo = BASE_PROFILE,
    withAuth = true,
    withProfileId = true,
  } = overrides;

  const onClose = vi.fn();
  const onUpdate = vi.fn();
  const store = makeStore(withAuth, withProfileId);

  render(
    <Provider store={store}>
      <EditContactInfoModal
        isOpen={isOpen}
        onClose={onClose}
        onUpdate={onUpdate}
        currentUserInfo={currentUserInfo}
      />
    </Provider>
  );

  return { onClose, onUpdate };
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// ─── tests ───────────────────────────────────────────────────────────────────
describe("EditContactInfoModal", () => {
  it("does not render when isOpen is false", () => {
    renderModal({ isOpen: false });
    expect(screen.queryByText("Edit Contact Information")).not.toBeInTheDocument();
  });

  it("renders pre-populated phone and address from currentUserInfo", () => {
    renderModal();
    expect(screen.getByDisplayValue("08012345678")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123 Main St")).toBeInTheDocument();
  });

  it("renders email as read-only — not editable", () => {
    const { container } = render(
      <Provider store={makeStore()}>
        <EditContactInfoModal
          isOpen={true}
          onClose={vi.fn()}
          onUpdate={vi.fn()}
          currentUserInfo={BASE_PROFILE}
        />
      </Provider>
    );
    const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;
    expect(emailInput).not.toBeNull();
    expect(emailInput).toHaveAttribute("readonly");
    expect(emailInput.value).toBe("test@example.com");
  });

  it("shows 'change via Security settings' hint", () => {
    renderModal();
    expect(
      screen.getByText("To change your email, go to Security settings.")
    ).toBeInTheDocument();
  });

  it("calls updateUserProfile without email in the payload", async () => {
    mockUpdateUserProfile.mockResolvedValue(BASE_PROFILE);
    renderModal();

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockUpdateUserProfile).toHaveBeenCalledWith(
        1,
        expect.not.objectContaining({ email: expect.anything() })
      );
    });
    expect(mockUpdateUserProfile).toHaveBeenCalledWith(1, {
      mobile_number: "08012345678",
      address: "123 Main St",
    });
  });

  it("calls onUpdate and onClose and shows success toast on save", async () => {
    mockUpdateUserProfile.mockResolvedValue(BASE_PROFILE);
    const { onClose, onUpdate } = renderModal();

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith(BASE_PROFILE);
      expect(onClose).toHaveBeenCalled();
      expect(toastSuccess).toHaveBeenCalledWith("Contact information updated successfully.");
    });
  });

  it("reflects user edits in the payload", async () => {
    mockUpdateUserProfile.mockResolvedValue(BASE_PROFILE);
    renderModal();

    fireEvent.change(screen.getByPlaceholderText("Enter phone number"), {
      target: { value: "07099887766" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter address"), {
      target: { value: "456 Oak Ave" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockUpdateUserProfile).toHaveBeenCalledWith(1, {
        mobile_number: "07099887766",
        address: "456 Oak Ave",
      });
    });
  });

  it("allows valid phone formats up to the backend limit", () => {
    renderModal();
    const phoneInput = screen.getByPlaceholderText("Enter phone number");

    fireEvent.change(phoneInput, { target: { value: "+234 801 234 5678" } });
    expect(phoneInput).toHaveDisplayValue("+234 801 234 56");

    // The field now accepts common international formats instead of stripping them.
    fireEvent.change(phoneInput, { target: { value: "07099887766" } });
    expect(phoneInput).toHaveDisplayValue("07099887766");
  });

  it("shows specific error message when API throws", async () => {
    mockUpdateUserProfile.mockRejectedValue(new Error("Network failure"));
    renderModal();

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText("Network failure")).toBeInTheDocument();
    });
    expect(toastSuccess).not.toHaveBeenCalled();
  });

  it("shows session-expired error when API throws Unauthorized", async () => {
    mockUpdateUserProfile.mockRejectedValue(new Error("Unauthorized"));
    renderModal();

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText("Session expired. Please login again.")).toBeInTheDocument();
    });
  });

  it("shows error and does not call API when accessToken is missing", async () => {
    renderModal({ withAuth: false });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText("Please login again to update your profile.")).toBeInTheDocument();
    });
    expect(mockUpdateUserProfile).not.toHaveBeenCalled();
  });

  it("shows error and does not call API when profileId is missing", async () => {
    renderModal({ withProfileId: false });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText("Profile not found. Please contact customer support.")).toBeInTheDocument();
    });
    expect(mockUpdateUserProfile).not.toHaveBeenCalled();
  });

  it("handles null currentUserInfo gracefully", () => {
    const onClose = vi.fn();
    const onUpdate = vi.fn();
    const { container } = render(
      <Provider store={makeStore()}>
        <EditContactInfoModal
          isOpen={true}
          onClose={onClose}
          onUpdate={onUpdate}
          currentUserInfo={null}
        />
      </Provider>
    );
    // email input (type="email") is read-only and shows empty value
    const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;
    expect(emailInput).not.toBeNull();
    expect(emailInput).toHaveAttribute("readonly");
    expect(emailInput.value).toBe("");
    expect(screen.getByPlaceholderText("Enter phone number")).toHaveDisplayValue("");
    expect(screen.getByPlaceholderText("Enter address")).toHaveDisplayValue("");
  });
});
