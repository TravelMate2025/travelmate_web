import { useEffect, useState, type SyntheticEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";
import Navbar from "./homePage/Navbar";
import WelcomePage from "./homePage/WelcomePage";
// import Footer from "./homePage/Footer"
import Updates from "./homePage/Updates";
import TravelmateApp from "./homePage/TravelmateApp";
import Destination from "./homePage/Destination";
import SegmentedStayCarousels from "./homePage/stays/SegmentedStayCarousels";
import StaysTrustRow from "./homePage/stays/StaysTrustRow";
import StaysFAQ from "./homePage/stays/StaysFAQ";
import RecommendedStays from "./homePage/RecommendedStays";
import RecentlyViewed from "./homePage/RecentlyViewed";
import NearbyStays from "./homePage/NearbyStays";
import FavoritesChip from "./homePage/FavoritesChip";
import TransfersHomeContent from "./homePage/transfers/TransfersHomeContent";
import Footer from "../components/2Footer";
import { bookingFlowRoutes } from "../features/shared/bookingFlowRoutes";

import FloatingChatButton from '../features/customer-management/components/FloatingChatButton';

const tabFromSearch = (search: string): string | null => {
  const params = new URLSearchParams(search);
  const tab = params.get("tab");
  if (tab === "transfers") return "3";
  if (tab === "stays") return "1";
  return null;
};

export default function Home() {
  const location = useLocation();
  const [activeVertical, setActiveVertical] = useState<string>(
    // "2" was the Flights tab before flights moved to /flights
    () => tabFromSearch(location.search) ?? (localStorage.getItem("selectedTab") === "3" ? "3" : "1")
  );

  useEffect(() => {
    const tab = tabFromSearch(location.search);
    if (tab) setActiveVertical(tab);
  }, [location.search]);

  const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
    setActiveVertical(newValue);
    localStorage.setItem("selectedTab", newValue);
  };

  const isTransfers = activeVertical === "3";

  usePageMeta(
    isTransfers
      ? {
          title: "Airport Transfers | TravelMate",
          description:
            "Book reliable airport transfers with TravelMate — verified drivers, transparent pricing, and free cancellation on most rides.",
        }
      : {
          title: "TravelMate — Book Stays, Flights & Airport Transfers in One Place",
          description:
            "TravelMate is a travel booking platform for stays, flights, and airport transfers — one account, real prices, secure checkout.",
        }
  );

  // Old links to the home Flights tab
  if (new URLSearchParams(location.search).get("tab") === "flights") {
    return <Navigate to={bookingFlowRoutes.flightsLanding} replace />;
  }

  return (
    <div>
      <Navbar />
      <WelcomePage value={activeVertical} onChange={handleTabChange} />
      <FloatingChatButton />
      <FavoritesChip />
      {isTransfers ? (
        <TransfersHomeContent />
      ) : (
        <>
          <RecentlyViewed />
          <RecommendedStays />
          <NearbyStays />
          <SegmentedStayCarousels />
          <Destination />
          <StaysTrustRow />
          <StaysFAQ />
        </>
      )}
      <TravelmateApp />
      <Updates />
       <Footer />
    </div>
  );
}
