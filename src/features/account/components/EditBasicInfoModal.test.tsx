import { cleanup, render, screen, fireEvent, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { afterEach, describe, expect, it, vi } from "vitest";
import authReducer, { loginSuccess, updateProfileId } from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import EditBasicInfoModal from "./EditBasicInfoModal";
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

const DEFAULT_INFO = {
  firstName: "Jane",
  lastName: "Doe",
  gender: "Female",
  dob: "1990-05-20",
};

const renderModal = (
  overrides: Partial<{
    isOpen: boolean;
    currentUserInfo: typeof DEFAULT_INFO;
    withAuth: boolean;
    withProfileId: boolean;
  }> = {}
) => {
  const {
    isOpen = true,
    currentUserInfo = DEFAULT_INFO,
    withAuth = true,
    withProfileId = true,
  } = overrides;

  const onClose = vi.fn();
  const onUpdate = vi.fn();
  const store = makeStore(withAuth, withProfileId);

  render(
    <Provider store={store}>
      <EditBasicInfoModal
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
describe("EditBasicInfoModal", () => {
  it("does not render when isOpen is false", () => {
    renderModal({ isOpen: false });
    expect(screen.queryByText("Edit Basic Information")).not.toBeInTheDocument();
  });

  it("renders pre-populated fields from currentUserInfo", () => {
    renderModal();
    expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1990-05-20")).toBeInTheDocument();
    const femaleRadio = screen.getByRole("radio", { name: /female/i });
    expect(femaleRadio).toBeChecked();
  });

  it("calls updateUserProfile with correct PATCH payload on save", async () => {
    mockUpdateUserProfile.mockResolvedValue(BASE_PROFILE);
    const { onClose, onUpdate } = renderModal();

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockUpdateUserProfile).toHaveBeenCalledWith(1, {
        first_name: "Jane",
        last_name: "Doe",
        gender: "Female",
        date_of_birth: "1990-05-20",
      });
    });
    expect(onUpdate).toHaveBeenCalledWith(BASE_PROFILE);
    expect(onClose).toHaveBeenCalled();
    expect(toastSuccess).toHaveBeenCalledWith("Basic information updated successfully.");
  });

  it("omits empty gender and dob from payload to avoid backend 400", async () => {
    mockUpdateUserProfile.mockResolvedValue(BASE_PROFILE);
    renderModal({
      currentUserInfo: { firstName: "Jane", lastName: "Doe", gender: "", dob: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      const payload = mockUpdateUserProfile.mock.calls[0][1] as Record<string, unknown>;
      expect(payload).not.toHaveProperty("gender");
      expect(payload).not.toHaveProperty("date_of_birth");
      expect(payload).toMatchObject({ first_name: "Jane", last_name: "Doe" });
    });
  });

  it("reflects user edits in the payload", async () => {
    mockUpdateUserProfile.mockResolvedValue(BASE_PROFILE);
    renderModal();

    fireEvent.change(screen.getByPlaceholderText("Enter first name"), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), {
      target: { value: "Smith" },
    });
    fireEvent.click(screen.getByRole("radio", { name: "Male" }));
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockUpdateUserProfile).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ first_name: "Alice", last_name: "Smith", gender: "Male" })
      );
    });
  });

  it("shows specific error message when API throws", async () => {
    mockUpdateUserProfile.mockRejectedValue(new Error("Server unavailable"));
    renderModal();

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText("Server unavailable")).toBeInTheDocument();
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

  it("syncs fields when currentUserInfo prop changes", () => {
    const { rerender } = render(
      <Provider store={makeStore()}>
        <EditBasicInfoModal
          isOpen={true}
          onClose={vi.fn()}
          onUpdate={vi.fn()}
          currentUserInfo={{ firstName: "Jane", lastName: "Doe", gender: "Female", dob: "1990-05-20" }}
        />
      </Provider>
    );

    expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();

    rerender(
      <Provider store={makeStore()}>
        <EditBasicInfoModal
          isOpen={true}
          onClose={vi.fn()}
          onUpdate={vi.fn()}
          currentUserInfo={{ firstName: "Alice", lastName: "Smith", gender: "Male", dob: "1985-01-01" }}
        />
      </Provider>
    );

    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Smith")).toBeInTheDocument();
  });
});
