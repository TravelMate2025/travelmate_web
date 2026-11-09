import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { HotelDetails, HotelSummary, HotelsPageResult } from "../types";

const api = vi.hoisted(() => ({ searchHotels: vi.fn(), searchAllHotels: vi.fn(), getHotel: vi.fn(), suggestPlaces: vi.fn() }));

vi.mock("../api/hotelsApi", () => ({
  searchHotels: api.searchHotels,
  searchAllHotels: api.searchAllHotels,
  getHotel: api.getHotel,
  suggestPlaces: api.suggestPlaces,
  HotelsApiError: class extends Error {
    constructor(
      message: string,
      readonly status: number,
    ) {
      super(message);
    }
  },
}));
vi.mock("../../../pages/homePage/Navbar", () => ({ default: () => <nav>site header</nav> }));
vi.mock("../../../components/2Footer", () => ({ default: () => <footer>site footer</footer> }));

import HotelsPage from "./HotelsPage";
import HotelResultsPage from "./HotelResultsPage";
import HotelDetailsPage from "./HotelDetailsPage";

const hotel = (id: string, name: string, extra: Partial<HotelSummary> = {}): HotelSummary => ({
  id,
  name,
  stars: 5,
  city: "Lisbon",
  country: "Portugal",
  address: "Rua 1",
  lat: 38.72,
  lng: -9.14,
  image: `https://img.example/${id}.jpg`,
  distance_km: 0.3,
  review: { score: 4.7, scale: 5, count: 3426 },
  facilities: ["Wifi", "Pool"],
  book_url: `https://app.impt.io/find-hotel-input?step=detail&hotelId=${id}&utm_source=travelmateglo.com`,
  ...extra,
});

const page = (hotels: HotelSummary[], over: Partial<HotelsPageResult> = {}): HotelsPageResult => ({
  place: { name: "Lisbon", lat: 38.72, lng: -9.14, results_url: "https://app.impt.io/find-hotel-input?step=results&utm_source=travelmateglo.com" },
  hotels,
  page: 1,
  pages: 3,
  total: hotels.length,
  page_size: 20,
  ...over,
});

const SEARCH = "lat=38.72&lng=-9.14&name=Lisbon&check_in=2027-01-10&check_out=2027-01-13&adults=2&rooms=1";

function Where() {
  const { pathname, search } = useLocation();
  return <output data-testid="where">{pathname + search}</output>;
}

const renderAt = (url: string) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/hotels/results" element={<HotelResultsPage />} />
        <Route path="/hotels/:hotelId" element={<HotelDetailsPage />} />
      </Routes>
      <Where />
    </MemoryRouter>,
  );

beforeEach(() => {
  window.scrollTo = vi.fn();
  api.suggestPlaces.mockResolvedValue([]);
  api.searchHotels.mockResolvedValue(page([]));
  api.searchAllHotels.mockResolvedValue(page([]));
});
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe("results page", () => {
  it("lists real hotels with a Check price link into IMPT and a details link on our site", async () => {
    api.searchAllHotels.mockResolvedValue(page([hotel("11", "Iberostar Lisboa"), hotel("12", "PortoBay Liberdade")], { total: 2 }));
    renderAt(`/hotels/results?${SEARCH}`);
    expect(await screen.findByText("2 places to stay near Lisbon")).toBeTruthy();
    expect(screen.getByText("Iberostar Lisboa")).toBeTruthy();
    const checkPrice = screen.getAllByRole("link", { name: "Check price" });
    expect(checkPrice[0].getAttribute("href")).toBe("https://app.impt.io/find-hotel-input?step=detail&hotelId=11&utm_source=travelmateglo.com");
    const details = screen.getAllByRole("link", { name: "View details" })[0].getAttribute("href") ?? "";
    expect(details.startsWith("/hotels/11?")).toBe(true);
    expect(details).toContain("check_in=2027-01-10");
    expect(screen.getAllByText("9.4")).toHaveLength(2); // 4.7 out of 5 shown out of 10, one per hotel
    expect(screen.getByRole("link", { name: "See live prices for all hotels" }).getAttribute("href")).toContain("step=results");
    expect(screen.getByText(/10 Jan – 13 Jan · 3 nights · 2 adults, 1 room/)).toBeTruthy();
    expect(api.searchAllHotels).toHaveBeenCalledTimes(1);
  });

  it("pages through the results", async () => {
    const many = Array.from({ length: 45 }, (_, i) => hotel(String(100 + i), `Hotel ${i + 1}`));
    api.searchAllHotels.mockResolvedValue(page(many, { pages: 1 }));
    renderAt(`/hotels/results?${SEARCH}`);
    await screen.findByText("Hotel 1");
    expect(screen.queryByText("Hotel 21")).toBeNull(); // 20 per page
    fireEvent.click(screen.getByRole("link", { name: "Next →" }));
    expect(await screen.findByText("Hotel 21")).toBeTruthy();
    expect(screen.getByTestId("where").textContent).toContain("page=2");
  });

  it("filters by stars, score and name, and sorts, with the choices kept in the address", async () => {
    api.searchAllHotels.mockResolvedValue(
      page(
        [
          hotel("1", "Grand Five", { stars: 5, review: { score: 4.8, scale: 5, count: 10 }, distance_km: 4 }),
          hotel("2", "Simple Three", { stars: 3, review: { score: 3.6, scale: 5, count: 10 }, distance_km: 1 }),
          hotel("3", "Middle Four", { stars: 4, review: { score: 4.2, scale: 5, count: 10 }, distance_km: 9 }),
        ],
        { pages: 1 },
      ),
    );
    renderAt(`/hotels/results?${SEARCH}`);
    await screen.findByText("Grand Five");
    expect(screen.getByText("3 hotels")).toBeTruthy();

    fireEvent.click(screen.getByRole("checkbox", { name: /3 star/ }));
    await waitFor(() => expect(screen.queryByText("Grand Five")).toBeNull());
    expect(screen.getByText("Simple Three")).toBeTruthy();
    expect(screen.getByTestId("where").textContent).toContain("stars=3");
    expect(screen.getByText("1 of 3 hotels")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Reset all" }));
    await screen.findByText("Grand Five");

    fireEvent.change(screen.getByLabelText("Sort by"), { target: { value: "distance" } });
    await waitFor(() => expect(screen.getByTestId("where").textContent).toContain("sort=distance"));
    const names = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(names.indexOf("Simple Three")).toBeLessThan(names.indexOf("Grand Five"));

    fireEvent.change(screen.getByLabelText("Hotel name"), { target: { value: "middle" } });
    await waitFor(() => expect(screen.queryByText("Grand Five")).toBeNull());
    expect(screen.getByText("Middle Four")).toBeTruthy();
  });

  it("shows empty, error (with retry) and no-place states", async () => {
    api.searchAllHotels.mockResolvedValueOnce(page([], { pages: 0 }));
    const first = renderAt(`/hotels/results?${SEARCH}`);
    expect(await screen.findByText("No hotels found near Lisbon")).toBeTruthy();
    first.unmount();

    api.searchAllHotels.mockRejectedValueOnce(Object.assign(new Error("Too many searches. Please wait a minute and try again."), { status: 429 }));
    renderAt(`/hotels/results?${SEARCH}`);
    expect(await screen.findByText("We could not load the hotels")).toBeTruthy();
    api.searchAllHotels.mockResolvedValueOnce(page([hotel("11", "Back again")]));
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Back again")).toBeTruthy();
  });

  it("asks for a place when the address has none and does not call the service", async () => {
    renderAt("/hotels/results");
    expect(screen.getByText("Where would you like to stay?")).toBeTruthy();
    expect(api.searchAllHotels).not.toHaveBeenCalled();
  });
});

describe("details page", () => {
  const details: HotelDetails = {
    ...hotel("11", "Iberostar Lisboa"),
    images: ["https://img.example/a.jpg", "https://img.example/b.jpg", "https://img.example/c.jpg"],
    full_address: "Rua Castilho 1, Lisbon",
    description: "A calm hotel near the park.",
    check_in_time: "15:00",
    check_out_time: "11:00",
    facilities: ["Wifi", "Pool", "Spa"],
  };

  it("shows the hotel and sends the guest to IMPT with Check price", async () => {
    api.getHotel.mockResolvedValue(details);
    renderAt(`/hotels/11?${SEARCH}`);
    expect(await screen.findByRole("heading", { name: "Iberostar Lisboa" })).toBeTruthy();
    expect(screen.getByText("A calm hotel near the park.")).toBeTruthy();
    expect(screen.getByText("Spa")).toBeTruthy();
    expect(screen.getByText(/Check-in from 15:00/)).toBeTruthy();
    const checks = screen.getAllByRole("link", { name: "Check price" });
    expect(checks.length).toBeGreaterThanOrEqual(2); // box, strip and the mobile bar all lead to IMPT
    checks.forEach((a) => expect(a.getAttribute("href")).toBe(details.book_url));
    expect(screen.getByRole("link", { name: "← Back to results" }).getAttribute("href")).toContain("/hotels/results?lat=38.72");
    expect(api.getHotel.mock.calls[0][0]).toBe("11");
  });

  it("shows the ready-made content: summary, grouped facilities, map, FAQ, nearby stays and hotel data for search engines", async () => {
    api.getHotel.mockResolvedValue({
      ...details,
      summary: "Iberostar Lisboa is a 4-star hotel in Lisbon, Portugal. It offers free Wi-Fi.",
      highlights: ["Free Wifi", "Pool"],
      facility_groups: [{ title: "Wellness and leisure", items: ["Pool", "Spa"] }, { title: "Rooms and comfort", items: ["Wifi"] }],
      faq: [{ q: "Does Iberostar Lisboa have free Wi-Fi?", a: "Yes, free Wi-Fi is listed." }],
      map: { lat: 38.72, lng: -9.14, embed_url: "https://www.openstreetmap.org/export/embed.html?bbox=1,2,3,4", link_url: "https://www.openstreetmap.org/?mlat=38.72&mlon=-9.14" },
      schema: { "@context": "https://schema.org", "@type": "Hotel", name: "Iberostar Lisboa" },
      nearby: [hotel("12", "Hotel Nearby")],
    });
    renderAt(`/hotels/11?${SEARCH}`);
    expect(await screen.findByText(/is a 4-star hotel in Lisbon/)).toBeTruthy();
    expect(screen.getByText("Free Wifi")).toBeTruthy();                 // key facilities show at once
    expect(screen.queryByRole("heading", { name: "Wellness and leisure" })).toBeNull();   // the full grouped list is collapsed
    fireEvent.click(screen.getByRole("button", { name: /Show all 3 facilities/ }));
    expect(screen.getByRole("heading", { name: "Wellness and leisure" })).toBeTruthy();
    expect(screen.getByTitle("Map of Iberostar Lisboa").getAttribute("src")).toContain("openstreetmap.org");
    expect(screen.getByText("Does Iberostar Lisboa have free Wi-Fi?")).toBeTruthy();
    expect(screen.getByText("Hotel Nearby")).toBeTruthy();
    const ld = document.getElementById("tmh-hotel-schema");
    expect(ld?.textContent).toContain('"@type":"Hotel"');
  });

  it("still works when the service sends no extras (older response)", async () => {
    api.getHotel.mockResolvedValue(details);
    renderAt(`/hotels/11?${SEARCH}`);
    expect(await screen.findByText("Spa")).toBeTruthy();
    expect(screen.queryByText("Where it is")).toBeNull();
    expect(screen.queryByText("Other stays nearby")).toBeNull();
  });

  it("says plainly when the hotel is not found", async () => {
    api.getHotel.mockRejectedValue(Object.assign(new Error("Hotel not found."), { status: 404 }));
    renderAt(`/hotels/999?${SEARCH}`);
    expect(await screen.findByRole("alert")).toBeTruthy();
  });
});

describe("landing page", () => {
  it("opens the results for a destination card straight away", async () => {
    api.searchHotels.mockResolvedValue(page([]));
    renderAt("/hotels");
    fireEvent.click(await screen.findByRole("button", { name: /Santorini/ }));
    await waitFor(() => expect(screen.getByTestId("where").textContent).toContain("/hotels/results?lat=36.42107&lng=25.43087&name=Santorini"));
  });

  it("asks for a place before searching", async () => {
    renderAt("/hotels");
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    expect(await screen.findByText("Type a city, region or hotel first.")).toBeTruthy();
    expect(screen.getByTestId("where").textContent).toBe("/hotels");
  });
});
