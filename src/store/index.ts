import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;

// Infer the `RootState` type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
