import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { loginSuccess } from "../../features/account/slices/authSlice";
import api, { injectStore } from "./api";

const makeStore = () => {
  const store = configureStore({ reducer: { auth: authReducer } });
  store.dispatch(
    loginSuccess({
      accessToken: "old-access",
      refreshToken: "refresh-token",
      registrationComplete: true,
      user: { id: 1, email: "ada@example.com", name: "Ada" },
    })
  );
  injectStore(store);
  return store;
};

const respond = (config: InternalAxiosRequestConfig, status: number): AxiosResponse | never => {
  const response = { status, statusText: "", data: { ok: status < 400 }, headers: {}, config };
  if (status >= 400) {
    throw new AxiosError("Request failed", "ERR_BAD_REQUEST", config, null, response);
  }
  return response;
};

// Fake backend: only `validToken` is accepted; `publicPath` also works without any token
const fakeBackend = (validToken: string, publicPath?: string) => {
  const seenAuth: (string | undefined)[] = [];
  api.defaults.adapter = async (config) => {
    const auth = config.headers.Authorization as string | undefined;
    seenAuth.push(auth);
    if (auth === `Bearer ${validToken}`) return respond(config, 200);
    if (!auth && config.url === publicPath) return respond(config, 200);
    return respond(config, 401);
  };
  return seenAuth;
};

describe("api client", () => {
  const originalAdapter = api.defaults.adapter;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    api.defaults.adapter = originalAdapter;
  });

  it("attaches the access token from the store", async () => {
    makeStore();
    const seenAuth = fakeBackend("old-access");

    await api.get("/bookings/");

    expect(seenAuth).toEqual(["Bearer old-access"]);
  });

  it("refreshes once for parallel 401s, retries them, and updates the store", async () => {
    const store = makeStore();
    fakeBackend("new-access");
    const refresh = vi.spyOn(axios, "post").mockResolvedValue({ data: { access: "new-access" } });

    const results = await Promise.all([api.get("/a/"), api.get("/b/"), api.get("/c/")]);

    expect(results.map((r) => r.status)).toEqual([200, 200, 200]);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(refresh.mock.calls[0][1]).toEqual({ refresh: "refresh-token" });
    expect(store.getState().auth.accessToken).toBe("new-access");
  });

  it("logs out and retries public requests without a token when the refresh is rejected", async () => {
    const store = makeStore();
    const seenAuth = fakeBackend("never-valid", "/v1/public/catalog/stays");
    vi.spyOn(axios, "post").mockRejectedValue(
      new AxiosError("Revoked", "ERR_BAD_REQUEST", undefined, null, {
        status: 401,
        statusText: "",
        data: {},
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      })
    );

    const res = await api.get("/v1/public/catalog/stays");

    expect(res.status).toBe(200);
    expect(seenAuth).toEqual(["Bearer old-access", undefined]);
    expect(store.getState().auth.accessToken).toBeNull();
  });

  it("keeps the session when the refresh fails for a network reason", async () => {
    const store = makeStore();
    fakeBackend("never-valid");
    vi.spyOn(axios, "post").mockRejectedValue(new AxiosError("Network Error", "ERR_NETWORK"));

    await expect(api.get("/bookings/")).rejects.toMatchObject({ response: { status: 401 } });
    expect(store.getState().auth.accessToken).toBe("old-access");
  });
});
