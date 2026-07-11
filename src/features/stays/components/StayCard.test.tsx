import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import StayCard from "./StayCard";
import type { Hotel } from "../types";

const { mockAddOrRemoveFavorite, mockSuccess, mockError } = vi.hoisted(() => ({
  mockAddOrRemoveFavorite: vi.fn(),
  mockSuccess: vi.fn(),
  mockError: vi.fn(),
}));

vi.mock("react-redux", () => ({
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({
      stays: {
        searchParams: {
          destination: "Lagos",
        },
      },
    }),
}));

vi.mock("../api", () => ({
  addOrRemoveFavorite: mockAddOrRemoveFavorite,
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: mockSuccess,
    error: mockError,
  },
}));

const hotel: Hotel = {
  id: "stay-uuid-1",
  name: "Riverside Hotel",
  address: "1 River Road",
  category: "4 STARS",
  available: true,
  currency: "NGN",
  priceFrom: 78000,
  reviewsCount: 14,
  images: [{ url: "https://example.com/hotel.jpg" }],
  rooms: [],
  is_favorite: false,
};

describe("StayCard", () => {
  afterEach(() => {
    mockAddOrRemoveFavorite.mockReset();
    mockSuccess.mockReset();
    mockError.mockReset();
  });

  it("syncs favorite state from props and toggles with the stay id", async () => {
    mockAddOrRemoveFavorite.mockResolvedValue("Added to favorites");

    const { rerender } = render(
      <MemoryRouter>
        <StayCard hotel={hotel} isFavorited={false} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: "Add to favorites" })
    ).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <StayCard hotel={{ ...hotel, is_favorite: true }} isFavorited={false} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: "Remove from favorites" })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Remove from favorites" })
    );

    await waitFor(() =>
      expect(mockAddOrRemoveFavorite).toHaveBeenCalledWith("stay-uuid-1")
    );
    expect(mockSuccess).toHaveBeenCalledWith("Added to favorites");
  });
});
