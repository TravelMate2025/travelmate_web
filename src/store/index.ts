import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/account/slices/authSlice";
import profileReducer from "../features/account/slices/profileSlice";
import staysReducer from "../features/stays/slice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistPartial } from "redux-persist/es/persistReducer";

import { flightsApi } from "../features/flights/api/flightApi";
import { nationsApi } from "../features/flights/api/nationalityApi";
import { locationApi } from "../features/flights/api/locationApi";
import carsReducer from "../features/car_rentals/carPaymentSlice";
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
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "profile", "stays"],
};

// 3. Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
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
