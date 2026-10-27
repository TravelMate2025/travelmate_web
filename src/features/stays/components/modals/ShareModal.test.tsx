import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import ShareModal from "./ShareModal";

const { toastSuccess, toastError } = vi.hoisted(() => ({ toastSuccess: vi.fn(), toastError: vi.fn() }));
vi.mock("react-hot-toast", () => ({ default: { success: toastSuccess, error: toastError } }));

const absoluteLink = `${window.location.origin}/stay-details/123`;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ShareModal", () => {
  it("shares an absolute URL, not the in-app path", () => {
    render(<ShareModal onClose={() => {}} shareLink="/stay-details/123" />);

    expect(screen.getByText("WhatsApp").closest("a")?.getAttribute("href")).toBe(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(absoluteLink)}`
    );
    expect(screen.getByText("Email").closest("a")?.getAttribute("href")).toContain(encodeURIComponent(absoluteLink));
  });

  it("copies the absolute URL and confirms with a toast", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<ShareModal onClose={() => {}} shareLink="/stay-details/123" />);

    fireEvent.click(screen.getByText("Copy Link"));

    expect(writeText).toHaveBeenCalledWith(absoluteLink);
    await waitFor(() => expect(toastSuccess).toHaveBeenCalled());
  });

  it("reports a failed copy", async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } });
    render(<ShareModal onClose={() => {}} shareLink="/stay-details/123" />);

    fireEvent.click(screen.getByText("Copy Link"));

    await waitFor(() => expect(toastError).toHaveBeenCalled());
  });
});
