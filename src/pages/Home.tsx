
import Navbar from "./homePage/Navbar";
import WelcomePage from "./homePage/WelcomePage";
// import Footer from "./homePage/Footer"
import Updates from "./homePage/Updates";
import TravelmateApp from "./homePage/TravelmateApp";
import Destination from "./homePage/Destination";
import Footer from "../components/2Footer";


export default function Home() {
  return (
    <div>
      <Navbar />
      <WelcomePage />
      <Destination />
      <TravelmateApp />
      <Updates />
       <Footer />
    </div>
  );
}
