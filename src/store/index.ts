import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/account/slices/authSlice";
import profileReducer from "../features/account/slices/profileSlice";
import staysReducer from "../features/stays/slice"; 
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistPartial } from "redux-persist/es/persistReducer";

// 1. Combine all your reducers
const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  stays: staysReducer,
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
    }),
});

// 5. Persistor
export const persistor = persistStore(store);

// 6. Types
export type RootState = ReturnType<typeof rootReducer> & PersistPartial;
export type AppDispatch = typeof store.dispatch;