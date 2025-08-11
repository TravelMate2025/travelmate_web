import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  email: string;
  accessToken: string | null;
  refreshToken: string | null;
  user: {
    profileImage: string;
    id: number;
    email: string;
    name: string;
    profileId?: number; 
  } | null;
  registrationComplete: boolean;
}

const initialState: AuthState = {
  email: "",
  accessToken: null,
  refreshToken: null,
  user: null,
  registrationComplete: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: { id: number; email: string; name: string, profileImage?: string };
        registrationComplete: boolean;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = {
        id: action.payload.user.id,
        email: action.payload.user.email,
        name: action.payload.user.name,
        profileImage: action.payload.user.profileImage || "",
      };
      state.email = action.payload.user.email;
      state.registrationComplete = action.payload.registrationComplete;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.email = "";
      state.registrationComplete = false;
    },
    updateUserName: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.name = action.payload;
      }
    },
    updateProfileId: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.profileId = action.payload;
      }
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
});

export const { loginSuccess, logout, updateToken, updateUserName, updateProfileId } = authSlice.actions;
export default authSlice.reducer;
