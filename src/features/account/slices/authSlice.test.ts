import { describe, expect, it } from "vitest";
import reducer, { loginSuccess, logout } from "./authSlice";

describe("authSlice", () => {
  it("stores normalized login data", () => {
    const state = reducer(
      undefined,
      loginSuccess({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        registrationComplete: true,
        user: {
          id: 7,
          email: "ada@example.com",
          name: "Ada Lovelace",
        },
      })
    );

    expect(state.accessToken).toBe("access-token");
    expect(state.refreshToken).toBe("refresh-token");
    expect(state.email).toBe("ada@example.com");
    expect(state.registrationComplete).toBe(true);
    expect(state.user).toEqual({
      id: 7,
      email: "ada@example.com",
      name: "Ada Lovelace",
      profileImage: "",
    });
  });

  it("clears auth state on logout", () => {
    const loggedInState = reducer(
      undefined,
      loginSuccess({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        registrationComplete: true,
        user: {
          id: 7,
          email: "ada@example.com",
          name: "Ada Lovelace",
          profileImage: "/avatar.png",
        },
      })
    );
    const state = reducer(loggedInState, logout());

    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.user).toBeNull();
    expect(state.email).toBe("");
    expect(state.registrationComplete).toBe(false);
  });
});
