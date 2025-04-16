

import { Routes, Route } from "react-router-dom";
import './App.css'    
import { Toaster } from "react-hot-toast";
import CreateAccount from "./pages/CreateAccount";
import VerifyPage from "./pages/VerifyPage";
import Home from "./pages/Home";
import CreatePassword from "./pages/CreatePassword";
import EmailResetLink from "./pages/EmailResetLink";
import ResetPassword from "./pages/ResetPassword";
import Login from "./pages/Login";
import StaysSearchResults from "./pages/StaysSearchResults";
import DeparturePage from "./pages/round-trip-container/departureFlight/DeparturePage";
import ReturnPage from "./pages/round-trip-container/returnFlight/ReturnPage";
import FlightInfoPage from "./pages/round-trip-container/flightInfo-review/FlightInfoPage";
import FlightConfirmationPage from "./pages/round-trip-container/flightConfirmation/FlightConfirmationPage";
import DeparturePageOneWay from "./pages/one-way-container/departureFlight-One-way/DeparturePageOneWay";
import FlightInfoPageOneWay from "./pages/one-way-container/flightInfo-review-one-way/FlightInfoPageOneWay"
import FlightConfirmPageOneWay from "./pages/one-way-container/flightConfirmation-one-way/FlightConfirmPageOneWay"
import DeparturePageMultiWay from "./pages/muti-flight-container/departureFlight-multi-way/DeparturePageMultiWay"
import SecondDepartureFlightPage from "./pages/muti-flight-container/secondDepartureFlight/SecondDepartureFlightPage"
import FlightInfoPageMultiWay from "./pages/muti-flight-container/flightInfo-review-multiway/FlightInfoPageMultiWay"
import FlightConfirmPageMultiWay from "./pages/muti-flight-container/flightConfirmationMultiWay/FlightConfirmPageMultiWay"
import ProfileInfo from "./pages/ProfileInfo";
import Profile from "./pages/Account";
import Page from "./pages/carsTab/carsFirstScreen/Page";
import DisplayCars from "./pages/carsTab/displayAllCars/DisplayCars";
import Pages from "./pages/carsTab/offerAcceptedPage/Page";
import CarPaidForPage from "./pages/carsTab/carPaidFor/CarPaidForPage";
import StaysDetail from "./pages/StaysDetail";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import BookingProgress from "./pages/BookingProgress";



function App() {
  return (

      <>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Profile />} />
          <Route path="/profile-info" element={<ProfileInfo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/verify-page" element={<VerifyPage />} />
          <Route path="/create-password" element={<CreatePassword />} />
          <Route path="/reset-email-link" element={<EmailResetLink />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/stays-search-result" element={<StaysSearchResults />} />
          <Route path="/booking-progress" element={<BookingProgress />} />
          <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
          <Route path="/stays-detail" element={<StaysDetail hotel={{ images: [],shareLink: "" }} />} />    

          {/* round-trip-section */}

          <Route path="/departure-flight" element={<DeparturePage departureInfo={[]} />} />
          <Route path="/return-flight" element={<ReturnPage departureInfo={[]} />} />
          <Route path="/flightInfo-review" element={<FlightInfoPage />} />
          <Route path="/flightInfo-confirmation" element={<FlightConfirmationPage />} />

          {/* one-way-trip-section */}

          <Route path="/departure-flight-one-way" element={<DeparturePageOneWay departureInfo={[]} />} />
          <Route path="/flightInfo-review-one-way" element={<FlightInfoPageOneWay  />} />
          <Route path="/flight-confirm-one-way" element={<FlightConfirmPageOneWay  />} />

        {/* multi-way-trip-section */}

          <Route path="/departure-flight-multi-way" element={<DeparturePageMultiWay departureInfo={[]} />} />
          <Route path="/second-departure-flight" element={<SecondDepartureFlightPage departureInfo={[]} />} />
          <Route path="/flightInfo-review-multi-way" element={<FlightInfoPageMultiWay />} />
          <Route path="/flight-confirm-multi-way" element={<FlightConfirmPageMultiWay />} />


          {/* Cars-Section */}

          <Route path="/display-cars" element={<DisplayCars />} />
          <Route path="/offer-accepted-page" element={<Pages />} />
          <Route path="/car-confirmation" element={<Page />} />
          <Route path="/car-payment-successful" element={<CarPaidForPage />} />
          
        </Routes>
      </>

  );
}

export default App
