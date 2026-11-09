import { configureStore, combineReducers, type Reducer, type UnknownAction } from "@reduxjs/toolkit";
import authReducer, { logout } from "../features/account/slices/authSlice";
import profileReducer from "../features/account/slices/profileSlice";
import staysReducer from "../features/stays/slice";
import {
  persistStore,
  persistReducer,
  createTransform,
  type PersistConfig,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistPartial } from "redux-persist/es/persistReducer";

import { flightsApi } from "../features/flights/api/flightApi";
import { nationsApi } from "../features/flights/api/nationalityApi";
import { locationApi } from "../features/flights/api/locationApi";
import carsReducer from "../features/car_rentals/carPaymentSlice";
import type { AuthState } from "../features/account/slices/authSlice";
// 1. Combine all your reducers
const appReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  stays: staysReducer,
  [flightsApi.reducerPath]: flightsApi.reducer,
  [nationsApi.reducerPath]: nationsApi.reducer,
  [locationApi.reducerPath]: locationApi.reducer,
  cars: carsReducer,
});

// Logging out (by the user, or by the API client when a session can't be
// refreshed) returns every user-scoped slice to its initial state, so the next
// person on this browser never sees the previous user's data. RTK Query caches
// are reset separately by performLogout.
export const rootReducer = (state: Parameters<typeof appReducer>[0], action: UnknownAction) => {
  if (action.type === logout.type && state) {
    return appReducer({ ...state, auth: undefined, profile: undefined, stays: undefined, cars: undefined }, action);
  }
  return appReducer(state, action);
};

// 2. Persist config
// Tokens are persisted with the rest of `auth` -- redux-persist is their only home.
type RootReducerState = ReturnType<typeof rootReducer>;
const persistStorage = (storage as typeof storage & { default?: typeof storage }).default ?? storage;

// Older builds kept tokens in separate `accessToken`/`refreshToken` localStorage keys
// and stripped them from the persisted slice. Adopt those once so existing sessions
// survive the upgrade, then remove the legacy keys.
const legacyTokenMigration = createTransform<AuthState, AuthState, RootReducerState, RootReducerState>(
  (inboundState) => inboundState,
  (outboundState, key) => {
    if (key === "auth" && outboundState && typeof window !== "undefined") {
      const legacyAccessToken = window.localStorage.getItem("accessToken");
      const legacyRefreshToken = window.localStorage.getItem("refreshToken");
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("refreshToken");
      return {
        ...outboundState,
        accessToken: outboundState.accessToken ?? legacyAccessToken,
        refreshToken: outboundState.refreshToken ?? legacyRefreshToken,
      };
    }
    return outboundState;
  },
  { whitelist: ["auth"] }
);

const persistConfig: PersistConfig<RootReducerState, RootReducerState, AuthState, AuthState> = {
  key: "root",
  storage: persistStorage,
  whitelist: ["auth", "profile", "stays", "cars"],
  transforms: [legacyTokenMigration],
};

// 3. Persisted reducer — type assertion needed due to redux-persist + RTK strict TypeScript compatibility
const persistedReducer = persistReducer<RootReducerState>(persistConfig, rootReducer as Reducer<RootReducerState>);

// 4. Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/FLUSH', 'persist/REGISTER'],
      },
    })
      .concat(flightsApi.middleware)
      .concat(nationsApi.middleware)
      .concat(locationApi.middleware),
});

// 5. Persistor
export const persistor = persistStore(store);

// 6. Types
export type RootState = ReturnType<typeof rootReducer> & PersistPartial;
export type AppDispatch = typeof store.dispatch;
