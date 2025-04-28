import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import profileReducer from "../features/reduxslices/profileSlice";
import chatReducer from "../features/chat/chatSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistPartial } from "redux-persist/es/persistReducer"; // 👈 Add this import


// Combine all your reducers first
const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  chat: chatReducer,
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "profile"], 
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Persistor
export const persistor = persistStore(store);


export type RootState = {
  auth: ReturnType<typeof authReducer> & PersistPartial;
  profile: ReturnType<typeof profileReducer> & PersistPartial;
  chat: ReturnType<typeof chatReducer>;
};

export type AppDispatch = typeof store.dispatch;
