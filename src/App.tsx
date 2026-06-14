import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./routes/PrivateRoute";

// Eagerly loaded — lightweight, always needed on first paint
import Home from "./pages/Home";
import Login from "./features/account/pages/Login";
import CreateAccount from "./features/account/pages/CreateAccount";

// Account pages (lazy)
const VerifyPage = lazy(() => import("./features/account/pages/VerifyPage"));
const CreatePassword = lazy(() => import("./features/account/pages/CreatePassword"));
const ResetPassword = lazy(() => import("./features/account/pages/ResetPassword"));
const ProfileInfo = lazy(() => import("./features/account/pages/ProfileInfo"));
const Profile = lazy(() => import("./features/account/pages/Account"));
const Security = lazy(() => import("./features/account/pages/Security"));
const UpdateEmailContainer = lazy(() => import("./features/account/pages/UpdateEmailContainer"));
const UpdatePasswordContainer = lazy(() => import("./features/account/pages/UpdatePasswordContainer"));
const NotificationContainer = lazy(() => import("./features/account/pages/NotificationContainer"));
const NotPreferenceContainer = lazy(() => import("./features/account/pages/NotPreferenceContainer"));
const CreateNewPassword = lazy(() => import("./features/account/pages/CreateNewPassword"));
const VerifyEmailForPasswordReset = lazy(() => import("./features/account/pages/VerifyEmailForPasswordReset"));
const ReviewDetails = lazy(() => import("./features/account/pages/ReviewDetails").then(m => ({ default: m.ReviewDetails })));

// Stays pages (lazy)
const StaysSearchResults = lazy(() => import("./features/stays/pages/StaysSearchResults"));
const StaysDetail = lazy(() => import("./features/stays/pages/StaysDetail"));
const BookingConfirmationPage = lazy(() => import("./features/stays/pages/BookingConfirmationPage"));
const BookingProgress = lazy(() => import("./features/stays/pages/BookingProgress"));
const DownloadStaysPage = lazy(() => import("./features/stays/components/confirmation/Download"));

// Flights pages (lazy)
const DeparturePage = lazy(() => import("./pages/flights/departureFlight/DeparturePage"));
const ReturnPage = lazy(() => import("./pages/flights/returnFlight/ReturnPage"));
const FlightInfoPage = lazy(() => import("./pages/flights/flightInfo-review/FlightInfoPage"));
const FlightConfirmationPage = lazy(() => import("./pages/flights/flightConfirmation/FlightConfirmationPage"));
const PaymentFailed = lazy(() => import("./features/flights/components/PaymentFailed"));

// Car rental pages (lazy)
const CarConfirmPage = lazy(() => import("./features/car_rentals/carsFirstScreen/Page"));
const DisplayCars = lazy(() => import("./features/car_rentals/displayAllCars/DisplayCars"));
const CarOfferPage = lazy(() => import("./features/car_rentals/offerAcceptedPage/Page"));
const CarPaidForPage = lazy(() => import("./features/car_rentals/carPaidFor/CarPaidForPage"));
const DownloadPage = lazy(() => import("./features/car_rentals/carPaidFor/DownloadPage"));
const CarFailedPayment = lazy(() => import("./features/car_rentals/carPaidFor/CarFailedPayment"));

// Other pages (lazy)
const AirportTaxi = lazy(() => import("./pages/AirportTaxi"));
const FaqPage = lazy(() => import("./features/customer-management/pages/faq"));
const ChatPage = lazy(() => import("./features/customer-management/pages/ChatPage"));
const TicketsPage = lazy(() => import("./features/customer-management/pages/TicketsPage"));
const TicketDetailPage = lazy(() => import("./features/customer-management/pages/TicketDetailPage"));
const BookingStaysDetailsPage = lazy(() => import("./pages/BookingsDetails/stays"));
const BookingTransfersDetails = lazy(() => import("./pages/BookingsDetails/transfers"));
const Bookings = lazy(() => import("./pages/Bookings"));
const Favorites = lazy(() => import("./pages/Favorites"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicy").then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfUsePage = lazy(() => import("./pages/TermsOfUse").then(m => ({ default: m.TermsOfUsePage })));
const Flight = lazy(() => import("./pages/Flight"));
const AboutPage = lazy(() => import("./pages/About").then(m => ({ default: m.AboutPage })));
const PaymentMethodSettingsPage = lazy(() => import("./pages/settings/PaymentMethod").then(m => ({ default: m.PaymentMethodSettingsPage })));
const ReviewsSettingsPage = lazy(() => import("./pages/settings/ReviewsPage").then(m => ({ default: m.ReviewsSettingsPage })));
const ProfilePage = lazy(() => import("./pages/settings/ProfilePage").then(m => ({ default: m.ProfilePage })));

function App() {
  return (
    <>
      <Toaster />
      <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" /></div>}>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-use" element={<TermsOfUsePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/verify-page" element={<VerifyPage />} />
        <Route
          path="/reset-email-link"
          element={<VerifyEmailForPasswordReset />}
        />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/create-new-password" element={<CreateNewPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Stays */}
        <Route path="/stays-search-result" element={<StaysSearchResults />} />
        <Route path="/booking-progress" element={<BookingProgress />} />
        <Route path="/stays-detail/:hotelId" element={<StaysDetail />} />
        <Route path="/stays-paid/download" element={<DownloadStaysPage />} />
        <Route
          path="/booking-confirmation"
          element={
            <PrivateRoute>
              <BookingConfirmationPage />
            </PrivateRoute>
          }
        />

        {/* FAQ & Customer Support */}
        <Route path="/faqs" element={<FaqPage />} />
        <Route path="/chat-with-us" element={<ChatPage />} />
        <Route
          path="/tickets"
          element={
            <PrivateRoute>
              <TicketsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <PrivateRoute>
              <TicketDetailPage />
            </PrivateRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile-info"
          element={
            <PrivateRoute>
              <ProfileInfo />
            </PrivateRoute>
          }
        />
        <Route
          path="/reviews/:hotel_id"
          element={
            <PrivateRoute>
              <ReviewDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="/account/security"
          element={
            <PrivateRoute>
              <Security />
            </PrivateRoute>
          }
        />
        <Route
          path="/account/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        /> 
        <Route
          path="/account/payment-method"
          element={
            <PrivateRoute>
              <PaymentMethodSettingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/account/reviews"
          element={
            <PrivateRoute>
              <ReviewsSettingsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/account/update-email"
          element={
            <PrivateRoute>
              <UpdateEmailContainer />
            </PrivateRoute>
          }
        />

        <Route
          path="/account/update-password"
          element={
            <PrivateRoute>
              <UpdatePasswordContainer />
            </PrivateRoute>
          }
        />

        <Route
          path="/account/notifications"
          element={
            <PrivateRoute>
              <NotPreferenceContainer />
            </PrivateRoute>
          }
        />

        <Route
          path="/notification"
          element={
            <PrivateRoute>
              <NotificationContainer />
            </PrivateRoute>
          }
        />

        <Route
          path="/booking/success"
          element={
            <PrivateRoute>
              <BookingConfirmationPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <Favorites />
            </PrivateRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <PrivateRoute>
              <Bookings />
            </PrivateRoute>
          }
        />
        <Route
          path="/bookings/stays-details"
          element={
            <PrivateRoute>
              <BookingStaysDetailsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/bookings/transfers-details"
          element={
            <PrivateRoute>
              <BookingTransfersDetails />
            </PrivateRoute>
          }
        />

        {/* Flights */}
        <Route path="/flights" element={<Flight />} />
        <Route
          path="/flight/departure"
          element={<DeparturePage departureInfo={[]} />}
        />
        <Route
          path="/flight/return"
          element={<ReturnPage departureInfo={[]} />}
        />
        <Route path="/flight/review" element={<FlightInfoPage />} />
        <Route
          path="/flights/payment-success"
          element={<FlightConfirmationPage />}
        />
        <Route path="/flights/payment-cancelled" element={<PaymentFailed />} />

        {/* Cars */}
        <Route path="/cars-searchResults" element={<DisplayCars />} />
        <Route path="/cars-booking" element={<CarOfferPage />} />
        <Route
          path="/car-confirmation"
          element={
            <PrivateRoute>
              <CarConfirmPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/transfers/payment-success"
          element={
            <PrivateRoute>
              <CarPaidForPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/transfers/payment-failure"
          element={
            <PrivateRoute>
              <CarFailedPayment />
            </PrivateRoute>
          }
        />
        <Route path="/offer-accepted-page" element={<CarOfferPage />} />
        <Route
          path="/car-paid/download"
          element={
            <PrivateRoute>
              <DownloadPage />
            </PrivateRoute>
          }
        />

        {/* Airport Taxi */}
        <Route path="/airport-taxi" element={<AirportTaxi />} />
      </Routes>
      </Suspense>
    </>
  );
}

export default App;
