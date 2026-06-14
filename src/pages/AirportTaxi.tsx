import Footer from "../components/2Footer"
// import AirportTaxiBooking from "../features/car_rentals/airport-taxi/AirportTaxiBooking"
import CarBookingFirstScreen from "../features/car_rentals/carsFirstScreen/CarBookingFirstScreen"
import Navbar from "./homePage/Navbar"
import TravelmateApp from "./homePage/TravelmateApp"


const AirportTaxi = () => {
  return (
    <div>
      <Navbar/>
      {/** Components */}
      {/* <AirportTaxiBooking/> */}
      <div className="mt-[60px] lg:mt-[120px]">
         <CarBookingFirstScreen/>
      </div>
      <TravelmateApp />
      <Footer/>
    </div>
  )
}

export default AirportTaxi
