import { useEffect, useState, type SyntheticEvent } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./homePage/Navbar";
import WelcomePage from "./homePage/WelcomePage";
// import Footer from "./homePage/Footer"
import Updates from "./homePage/Updates";
import TravelmateApp from "./homePage/TravelmateApp";
import Destination from "./homePage/Destination";
import TopRatedStays from "./homePage/TopRatedStays";
import RecommendedStays from "./homePage/RecommendedStays";
import RecentlyViewed from "./homePage/RecentlyViewed";
import NearbyStays from "./homePage/NearbyStays";
import FavoritesChip from "./homePage/FavoritesChip";
import TransfersHomeContent from "./homePage/transfers/TransfersHomeContent";
import Footer from "../components/2Footer";

import FloatingChatButton from '../features/customer-management/components/FloatingChatButton';

const tabFromSearch = (search: string): string | null => {
  const params = new URLSearchParams(search);
  const tab = params.get("tab");
  if (tab === "transfers") return "3";
  if (tab === "flights") return "2";
  if (tab === "stays") return "1";
  return null;
};

export default function Home() {
  const location = useLocation();
  const [activeVertical, setActiveVertical] = useState<string>(
    () => tabFromSearch(location.search) ?? localStorage.getItem("selectedTab") ?? "1"
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
          <TopRatedStays />
          <Destination />
        </>
      )}
      <TravelmateApp />
      <Updates />
       <Footer />
    </div>
  );
}
