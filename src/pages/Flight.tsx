import Footer from "../components/2Footer"
import FlightSearchComponent from "./flights/FlightSearchComponent"
import Navbar from "./homePage/Navbar"
import TravelmateApp from "./homePage/TravelmateApp"


const Flight = () => {
    return (
        <div>
            <Navbar />
            {/** Components */}
            <FlightSearchComponent/>
            <TravelmateApp />
            <Footer />
        </div>
    )
}

export default Flight