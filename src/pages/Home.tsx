
import Navbar from "./homePage/Navbar";
import WelcomePage from "./homePage/WelcomePage";
// import Footer from "./homePage/Footer"
import Updates from "./homePage/Updates";
import TravelmateApp from "./homePage/TravelmateApp";
import Destination from "./homePage/Destination";
import TopRatedStays from "./homePage/TopRatedStays";
import RecommendedStays from "./homePage/RecommendedStays";
import NearbyStays from "./homePage/NearbyStays";
import FavoritesChip from "./homePage/FavoritesChip";
import Footer from "../components/2Footer";

import FloatingChatButton from '../features/customer-management/components/FloatingChatButton';


export default function Home() {
  return (
    <div>
      <Navbar />
      <WelcomePage />
      <FloatingChatButton />
      <FavoritesChip />
      <TopRatedStays />
      <RecommendedStays />
      <NearbyStays />
      <Destination />
      <TravelmateApp />
      <Updates />
       <Footer />
    </div>
  );
}
