import Footer from "../components/2Footer"
import AirportTaxiBooking from "../features/car_rentals/airport-taxi/AirportTaxiBooking"
import Navbar from "./homePage/Navbar"
import TravelmateApp from "./homePage/TravelmateApp"


const AirportTaxi = () => {
  return (
    <div>
      <Navbar/>
      {/** Components */}
      <AirportTaxiBooking/>
      <TravelmateApp />
      <Footer/>
    </div>
  )
}

export default AirportTaxi