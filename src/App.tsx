
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
import DeparturePage from "./pages/departureFlight/DeparturePage";
import Home2 from "./pages/2Home";
import ReturnPage from "./pages/returnFlight/ReturnPage";
import FlightInfoPage from "./pages/flightInfo-review/FlightInfoPage";
import Profile from "./pages/Profile";
import ProfileInfo from "./pages/ProfileInfo";



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
      </Routes>

  );
}

export default App
