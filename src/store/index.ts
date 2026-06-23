import { configureStore, combineReducers, type Reducer } from "@reduxjs/toolkit";
import authReducer from "../features/account/slices/authSlice";
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
const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  stays: staysReducer,
  [flightsApi.reducerPath]: flightsApi.reducer,
  [nationsApi.reducerPath]: nationsApi.reducer,
  [locationApi.reducerPath]: locationApi.reducer,
  cars: carsReducer,
});

// 2. Persist config
// Transform to remove sensitive fields (e.g., tokens) from the `auth` slice before persisting
type RootReducerState = ReturnType<typeof rootReducer>;
const persistStorage = (storage as typeof storage & { default?: typeof storage }).default ?? storage;

const removeSensitiveTransform = createTransform<AuthState, AuthState, RootReducerState, RootReducerState>(
  // inbound: state being persisted
  (inboundState, key) => {
    if (key === "auth" && inboundState) {
      return {
        ...inboundState,
        accessToken: null,
        refreshToken: null,
      };
    }
    return inboundState;
  },
  // outbound: state being rehydrated (we keep as-is)
  (outboundState, key) => {
    if (key === "auth" && outboundState) {
      const storedAccessToken =
        typeof window !== "undefined" ? window.localStorage.getItem("accessToken") : null;
      const storedRefreshToken =
        typeof window !== "undefined" ? window.localStorage.getItem("refreshToken") : null;
      return {
        ...outboundState,
        accessToken: outboundState.accessToken || storedAccessToken,
        refreshToken: outboundState.refreshToken || storedRefreshToken,
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
  transforms: [removeSensitiveTransform],
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
