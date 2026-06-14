import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { NotificationProvider } from "./features/account/components/notifications/NotificationProvider";
import ScrollToTop from "./ScrollToTop";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
if (!googleClientId) {
  // Log a dev-time warning so deploys include the env var
  console.warn("VITE_GOOGLE_CLIENT_ID is not set. Google OAuth will not function.");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NotificationProvider>
            <BrowserRouter>
              <ScrollToTop />
              <App />
            </BrowserRouter>
          </NotificationProvider>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
