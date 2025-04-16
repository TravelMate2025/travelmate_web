import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  email: string;
  accessToken: string | null;
  refreshToken: string | null;
  user: { email: string } | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  email: ""
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string;refreshToken: string; email: string }>) => {
      state.accessToken = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = { email: action.payload.email };
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    }
    
  },
});

export const { loginSuccess, logout, updateToken } = authSlice.actions;
export default authSlice.reducer;











// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: {
//     email: "elvis@gmail.com",
//   },
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       state.user = action.payload;
//     },
//   },
// });

// export const { setUser } = authSlice.actions;
// export default authSlice.reducer;



