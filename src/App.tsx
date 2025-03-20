
import { Routes, Route } from "react-router-dom";
import './App.css'    
import CreateAccount from "./pages/CreateAccount";
import VerifyPage from "./pages/VerifyPage";
import Home from "./pages/Home";
import CreatePassword from "./pages/CreatePassword";
import EmailResetLink from "./pages/EmailResetLink";
import ResetPassword from "./pages/ResetPassword";
import Login from "./pages/Login";
import StaysSearchResults from "./pages/StaysSearchResults";
import DeparturePage from "./pages/round-trip-container/departureFlight/DeparturePage";
import Home2 from "./pages/2Home";
import ReturnPage from "./pages/round-trip-container/returnFlight/ReturnPage";
import FlightInfoPage from "./pages/round-trip-container/flightInfo-review/FlightInfoPage";
import FlightConfirmationPage from "./pages/round-trip-container/flightConfirmation/FlightConfirmationPage";
import DeparturePageOneWay from "./pages/one-way-container/departureFlight-One-way/DeparturePageOneWay";
import FlightInfoPageOneWay from "./pages/one-way-container/flightInfo-review-one-way/FlightInfoPageOneWay"
import FlightConfirmPageOneWay from "./pages/one-way-container/flightConfirmation-one-way/FlightConfirmPageOneWay"
import DeparturePageMultiWay from "./pages/muti-flight-container/departureFlight-multi-way/DeparturePageMultiWay"
import ProfileInfo from "./pages/ProfileInfo";
import Profile from "./pages/Profile";


function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home2 />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-info" element={<ProfileInfo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/verify-page" element={<VerifyPage />} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/reset-email-link" element={<EmailResetLink />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/stays-search-result" element={<StaysSearchResults />} />
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






      </Routes>

  );
}

export default App
