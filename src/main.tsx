
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";

import { NotificationProvider } from "./features/account/components/notifications/NotificationProvider.tsx";
import ScrollToTop from "./ScrollToTop.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <GoogleOAuthProvider clientId="801961826535-5q7gufshvp0hd5jni2i5igdu949c7j54.apps.googleusercontent.com">
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
  // </StrictMode>
);
