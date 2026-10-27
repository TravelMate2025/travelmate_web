import { beforeEach, describe, expect, it, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../../../store";
import { flightsApi } from "../../flights/api/flightApi";
import { loginSuccess } from "./authSlice";
import { setUserProfile, type UserProfile } from "./profileSlice";
import { setSearchParams } from "../../stays/slice";
import carsReducer, { setPersonalDetails } from "../../car_rentals/carPaymentSlice";
import { performLogout, USER_STORAGE_KEYS } from "./performLogout";
import { logoutUser } from "../api/auth";

vi.mock("../api/auth", () => ({ logoutUser: vi.fn() }));

const makeSignedInStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefault) => getDefault({ serializableCheck: false }).concat(flightsApi.middleware),
  });
  store.dispatch(
    loginSuccess({
      accessToken: "access",
      refreshToken: "refresh",
      registrationComplete: true,
      user: { id: 1, email: "ada@example.com", name: "Ada" },
    })
  );
  store.dispatch(setUserProfile({ first_name: "Ada" } as UserProfile));
  store.dispatch(setSearchParams({ destination: "Lagos", adults: 2 }));
  store.dispatch(setPersonalDetails({ firstName: "Ada" } as Parameters<typeof setPersonalDetails>[0]));
  return store;
};

describe("performLogout", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(logoutUser).mockReset().mockResolvedValue(undefined);
  });

  it("resets every user-scoped slice", async () => {
    const store = makeSignedInStore();

    await store.dispatch(performLogout());

    const state = store.getState();
    expect(logoutUser).toHaveBeenCalledWith("access");
    expect(state.auth.accessToken).toBeNull();
    expect(state.auth.user).toBeNull();
    expect(state.profile.profile).toBeNull();
    expect(state.stays.searchParams).toEqual(rootReducer(undefined, { type: "init" }).stays.searchParams);
    expect(state.cars).toEqual(carsReducer(undefined, { type: "init" }));
  });

  it("removes the user's browser data but keeps device-level data", async () => {
    const store = makeSignedInStore();
    USER_STORAGE_KEYS.forEach((key) => localStorage.setItem(key, "x"));
    localStorage.setItem("travelmate_recently_viewed", "[]");
    localStorage.setItem("selectedTab", "stays");

    await store.dispatch(performLogout());

    USER_STORAGE_KEYS.forEach((key) => expect(localStorage.getItem(key)).toBeNull());
    expect(localStorage.getItem("travelmate_recently_viewed")).toBe("[]");
    expect(localStorage.getItem("selectedTab")).toBe("stays");
    expect(localStorage.getItem("logout_reason")).toBe("logout");
  });

  it("still logs out locally when the server call fails", async () => {
    const store = makeSignedInStore();
    vi.mocked(logoutUser).mockRejectedValue(new Error("offline"));

    await store.dispatch(performLogout());

    expect(store.getState().auth.accessToken).toBeNull();
  });

  it("skips the server call after account deletion", async () => {
    const store = makeSignedInStore();

    await store.dispatch(performLogout({ reason: "account_deleted", revokeSession: false }));

    expect(logoutUser).not.toHaveBeenCalled();
    expect(store.getState().auth.accessToken).toBeNull();
    expect(localStorage.getItem("logout_reason")).toBe("account_deleted");
  });
});
