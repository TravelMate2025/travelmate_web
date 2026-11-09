import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_SEARCH } from "../search";

const reply = (status: number, body: unknown) =>
  Promise.resolve({ ok: status >= 200 && status < 300, status, json: () => Promise.resolve(body) } as Response);

async function loadApi(key = "tmk_test") {
  vi.resetModules();
  vi.stubEnv("VITE_HOTELS_API_KEY", key);
  vi.stubEnv("VITE_HOTELS_API_BASE", "https://api.example/v1");
  return import("./hotelsApi");
}

describe("hotels api client", () => {
  const fetchMock = vi.fn();
  beforeEach(() => vi.stubGlobal("fetch", fetchMock));
  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("sends the key and the whole search, and returns the page", async () => {
    const api = await loadApi();
    fetchMock.mockReturnValue(reply(200, { ok: true, hotels: [], page: 2, pages: 5, total: 100, page_size: 20, place: null }));
    const search = { ...DEFAULT_SEARCH, lat: 38.7, lng: -9.1, name: "Lisbon", checkIn: "2027-01-10", checkOut: "2027-01-13", childAges: [5] };
    const result = await api.searchHotels(search, 2);
    expect(result.page).toBe(2);
    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.origin + url.pathname).toBe("https://api.example/v1/hotels");
    expect(url.searchParams.get("key")).toBe("tmk_test");
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.get("lat")).toBe("38.7");
    expect(url.searchParams.get("check_in")).toBe("2027-01-10");
    expect(url.searchParams.get("child_ages")).toBe("5");
  });

  it("asks for hotel details by id and sends dates and guests but not the place", async () => {
    const api = await loadApi();
    fetchMock.mockReturnValue(reply(200, { ok: true, hotel: { id: "42", name: "H" } }));
    const hotel = await api.getHotel("42", { ...DEFAULT_SEARCH, lat: 1, lng: 2, name: "X", checkIn: "2027-01-10", checkOut: "2027-01-13" });
    expect(hotel.id).toBe("42");
    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.pathname).toBe("/v1/hotels/42");
    expect(url.searchParams.get("check_in")).toBe("2027-01-10");
    expect(url.searchParams.has("lat")).toBe(false);
  });

  it("explains errors in plain words", async () => {
    const api = await loadApi();
    fetchMock.mockReturnValueOnce(reply(429, { ok: false, error: "Too many requests." }));
    await expect(api.suggestPlaces("lis")).rejects.toMatchObject({ status: 429, message: expect.stringContaining("wait a minute") });
    fetchMock.mockReturnValueOnce(reply(404, { ok: false, error: "Hotel not found." }));
    await expect(api.getHotel("9", DEFAULT_SEARCH)).rejects.toMatchObject({ status: 404, message: "Hotel not found." });
    fetchMock.mockRejectedValueOnce(new TypeError("network"));
    await expect(api.suggestPlaces("lis")).rejects.toMatchObject({ message: expect.stringContaining("could not reach") });
  });

  it("does not call out without a key", async () => {
    const api = await loadApi("");
    await expect(api.suggestPlaces("lis")).rejects.toMatchObject({ message: expect.stringContaining("not set up") });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
