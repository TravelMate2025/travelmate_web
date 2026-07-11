import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import NotPreferenceContainer from "./NotPreferenceContainer";

const { mockGet, mockPost, mockPut, mockPresenter } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
  mockPut: vi.fn(),
  mockPresenter: vi.fn(),
}));

const createDeferred = () => {
  let resolve: (value: unknown) => void;
  let reject: (reason?: unknown) => void;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    promise,
    resolve: resolve!,
    reject: reject!,
  };
};

vi.mock("../../../api/services/api", () => ({
  default: {
    get: mockGet,
    post: mockPost,
    put: mockPut,
  },
}));

vi.mock("./NotPreferencePresenter", () => ({
  default: (props: {
    preferences: { id?: number; enabled_types: string[]; enabled_channels: string[] } | null;
    loading: boolean;
    saving: boolean;
    error: string;
    onSavePreference: (prefs: { enabled_types: string[]; enabled_channels: string[] }) => Promise<void>;
  }) => {
    mockPresenter(props);
    return (
      <div>
        <div data-testid="pref-state">
          {props.loading
            ? "loading"
            : props.saving
              ? "saving"
              : props.preferences
                ? props.preferences.enabled_types.join(",")
                : "none"}
        </div>
        <div data-testid="error-state">{props.error}</div>
        <button
          type="button"
          onClick={() =>
            props.onSavePreference({
              enabled_types: ["booking_update"],
              enabled_channels: ["push"],
            })
          }
        >
          save
        </button>
      </div>
    );
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("NotPreferenceContainer", () => {
  it("loads a singleton preference object, normalizes string arrays, and saves it via the detail route", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        id: 7,
        enabled_types: "booking_update, news_and_updates",
        enabled_channels: "email, push",
      },
    });
    const deferred = createDeferred();
    mockPut.mockReturnValueOnce(deferred.promise);

    render(<NotPreferenceContainer />);

    await waitFor(() => {
      expect(screen.getByTestId("pref-state")).toHaveTextContent("booking_update,news_and_updates");
    });

    fireEvent.click(screen.getByRole("button", { name: "save" }));

    await waitFor(() => {
      expect(screen.getByTestId("pref-state")).toHaveTextContent("saving");
    });

    deferred.resolve({
      data: {
        id: 7,
        enabled_types: ["booking_update"],
        enabled_channels: ["push"],
      },
    });

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith(
        expect.stringContaining("/notification-prefrence/7/"),
        {
          enabled_types: ["booking_update"],
          enabled_channels: ["push"],
        }
      );
    });

    expect(mockPost).not.toHaveBeenCalled();
  });
});
