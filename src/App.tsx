import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";

// Account pages
import CreateAccount from "./features/account/pages/CreateAccount";
import VerifyPage from "./features/account/pages/VerifyPage";
import CreatePassword from "./features/account/pages/CreatePassword";
import ResetPassword from "./features/account/pages/ResetPassword";
import Login from "./features/account/pages/Login";
import ProfileInfo from "./features/account/pages/ProfileInfo";
import Profile from "./features/account/pages/Account";
import Security from "./features/account/pages/Security";
import UpdateEmailContainer from "./features/account/pages/UpdateEmailContainer";
import UpdatePasswordContainer from "./features/account/pages/UpdatePasswordContainer";
import NotificationContainer from "./features/account/pages/NotificationContainer";
import NotPreferenceContainer from "./features/account/pages/NotPreferenceContainer";
import CreateNewPassword from "./features/account/pages/CreateNewPassword";
import VerifyEmailForPasswordReset from "./features/account/pages/VerifyEmailForPasswordReset";

// Stays pages
import StaysSearchResults from "./features/stays/pages/StaysSearchResults";
import StaysDetail from "./features/stays/pages/StaysDetail";
import BookingConfirmationPage from "./features/stays/pages/BookingConfirmationPage";
import BookingProgress from "./features/stays/pages/BookingProgress";
import DownloadStaysPage from "./features/stays/components/confirmation/Download";

// Flights pages
import DeparturePage from "./pages/flights/departureFlight/DeparturePage";
import ReturnPage from "./pages/flights/returnFlight/ReturnPage";
import FlightInfoPage from "./pages/flights/flightInfo-review/FlightInfoPage";
import FlightConfirmationPage from "./pages/flights/flightConfirmation/FlightConfirmationPage";
import PaymentFailed from "./features/flights/components/PaymentFailed";

// Car rental pages
import Page from "./features/car_rentals/carsFirstScreen/Page";
import DisplayCars from "./features/car_rentals/displayAllCars/DisplayCars";
import Pages from "./features/car_rentals/offerAcceptedPage/Page";
import CarPaidForPage from "./features/car_rentals/carPaidFor/CarPaidForPage";
import DownloadPage from "./features/car_rentals/carPaidFor/DownloadPage";
import CarFailedPayment from "./features/car_rentals/carPaidFor/CarFailedPayment";

// Airport taxi
import AirportTaxi from "./pages/AirportTaxi";

// Customer management
import FaqPage from "./features/customer-management/pages/faq";
import ChatPage from "./features/customer-management/pages/ChatPage";
import TicketsPage from "./features/customer-management/pages/TicketsPage";
import TicketDetailPage from "./features/customer-management/pages/TicketDetailPage";

// Bookings & favorites
import BookingStaysDetailsPage from "./pages/BookingsDetails/stays";
import BookingTransfersDetails from "./pages/BookingsDetails/transfers";
import Bookings from "./pages/Bookings";
import Favorites from "./pages/Favorites";

// Routing
import PrivateRoute from "../src/routes/PrivateRoute";

// Home page
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/verify-page" element={<VerifyPage />} />
        <Route path="/reset-email-link" element={<VerifyEmailForPasswordReset />} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/create-new-password" element={<CreateNewPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Stays */}
        <Route path="/stays-search-result" element={<StaysSearchResults />} />
        <Route path="/booking-progress" element={<BookingProgress />} />
        <Route path="/stays-detail/:hotelId" element={<StaysDetail />} />
        <Route path="/stays-paid/download" element={<DownloadStaysPage />} />
        <Route path="/booking-confirmation" element={
          <PrivateRoute>
            <BookingConfirmationPage />
          </PrivateRoute>
        } />

        {/* FAQ & Customer Support */}
        <Route path="/faqs" element={<FaqPage />} />
        <Route path="/chat-with-us" element={<ChatPage />} />
        <Route path="/tickets" element={
          <PrivateRoute>
            <TicketsPage />
          </PrivateRoute>
        } />
        <Route path="/tickets/:id" element={
          <PrivateRoute>
            <TicketDetailPage />
          </PrivateRoute>
        } />

        {/* Account & Protected Pages */}
        <Route path="/account" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/profile-info" element={
          <PrivateRoute>
            <ProfileInfo />
          </PrivateRoute>
        } />
        <Route path="/account/security" element={
          <PrivateRoute>
            <Security />
          </PrivateRoute>
        } />
        <Route path="/account/update-email" element={
          <PrivateRoute>
            <UpdateEmailContainer />
          </PrivateRoute>
        } />
        <Route path="/account/update-password" element={
          <PrivateRoute>
            <UpdatePasswordContainer />
          </PrivateRoute>
        } />
        <Route path="/account/notifications" element={
          <PrivateRoute>
            <NotPreferenceContainer />
          </PrivateRoute>
        } />
        <Route path="/notification" element={
          <PrivateRoute>
            <NotificationContainer />
          </PrivateRoute>
        } />

        {/* Bookings & Favorites */}
        <Route path="/favorites" element={
          <PrivateRoute>
            <Favorites />
          </PrivateRoute>
        } />
        <Route path="/bookings" element={
          <PrivateRoute>
            <Bookings />
          </PrivateRoute>
        } />
        <Route path="/bookings/stays-details" element={
          <PrivateRoute>
            <BookingStaysDetailsPage />
          </PrivateRoute>
        } />
        <Route path="/bookings/transfers-details" element={
          <PrivateRoute>
            <BookingTransfersDetails />
          </PrivateRoute>
        } />

        {/* Flights */}
        <Route path="/flight/departure" element={<DeparturePage departureInfo={[]} />} />
        <Route path="/flight/return" element={<ReturnPage departureInfo={[]} />} />
        <Route path="/flight/review" element={<FlightInfoPage />} />
        <Route path="/flights/payment-success" element={<FlightConfirmationPage />} />
        <Route path="/flights/payment-cancelled" element={<PaymentFailed />} />

        {/* Cars */}
        <Route path="/cars-searchResults" element={<DisplayCars />} />
        <Route path="/cars-booking" element={<Pages />} />
        <Route path="/car-confirmation" element={
          <PrivateRoute>
            <Page />
          </PrivateRoute>
        } />
        <Route path="/transfers/payment-success" element={
          <PrivateRoute>
            <CarPaidForPage />
          </PrivateRoute>
        } />
        <Route path="/transfers/payment-failure" element={
          <PrivateRoute>
            <CarFailedPayment />
          </PrivateRoute>
        } />
        <Route path="/offer-accepted-page" element={<Pages />} />
        <Route path="/car-paid/download" element={
          <PrivateRoute>
            <DownloadPage />
          </PrivateRoute>
        } />

        {/* Airport Taxi */}
        <Route path="/airport-taxi" element={<AirportTaxi />} />
      </Routes>
    </>
  );
}

export default App;
