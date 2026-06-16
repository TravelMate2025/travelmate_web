import Footer from "../components/2Footer";
import Navbar from "./homePage/Navbar";
import TravelmateApp from "./homePage/TravelmateApp";
import AirportTaxiBooking from "../features/car_rentals/airport-taxi/AirportTaxiBooking";

const TransferFlow = () => {
  return (
    <div>
      <Navbar />
      <div className="mt-[60px] lg:mt-[120px]">
        <AirportTaxiBooking />
      </div>
      <TravelmateApp />
      <Footer />
    </div>
  );
};

export default TransferFlow;
