import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import Favorites from "./Favorites";

const { mockNavigate, mockFetchFavorites } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockFetchFavorites: vi.fn(),
}));

vi.mock("../pages/homePage/Navbar", () => ({
  default: () => <div>navbar</div>,
}));

vi.mock("../components/Breadcrumbs", () => ({
  default: () => <div>breadcrumbs</div>,
}));

vi.mock("../features/stays/components/EmptyFavorite", () => ({
  default: () => <div>empty favorites</div>,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../features/stays/api", () => ({
  fetchFavorites: mockFetchFavorites,
}));

describe("Favorites page", () => {
  afterEach(() => {
    mockNavigate.mockReset();
    mockFetchFavorites.mockReset();
  });

  it("fetches favorites once and navigates with hotel_code", async () => {
    mockFetchFavorites.mockResolvedValue([
      {
        id: 12,
        hotel_code: "tm-hotel-123",
        hotel_name: "Marina Suites",
        address: "12 Admiralty Way",
        category: "4 STARS",
        rating: 4.4,
        reviews_count: 18,
        created_at: "2026-07-09T10:00:00Z",
        images: [],
      },
    ]);

    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    );

    expect(await screen.findByText("Marina Suites")).toBeInTheDocument();
    await waitFor(() => expect(mockFetchFavorites).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByText("Marina Suites"));

    expect(mockNavigate).toHaveBeenCalledWith("/stay-details/tm-hotel-123");
  });
});
