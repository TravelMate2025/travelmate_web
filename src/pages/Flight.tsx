import Footer from "../components/2Footer"
import Navbar from "./homePage/Navbar"
import TravelmateApp from "./homePage/TravelmateApp"
import RoundTrip from "./homePage/Flight"

// Previously rendered FlightSearchComponent.tsx -- a disconnected decoy form
// (its "Search" button only console.log'd, no real location lookup, no
// navigation to results) with none of HomeHero's visual treatment. This
// reuses RoundTrip, the same real, working search form already used in the
// home page's Flights tab (real location/date/passenger/class selectors,
// submits into the real /flight/departure results flow), inside the same
// dark-hero + floating-card shell as the home page.
const Flight = () => {
    return (
        <div>
            <Navbar />
            <div
                className="w-full pt-[104px] pb-[92px] md:pt-[128px] md:pb-[120px] relative overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #023E8A 0%, #012a5e 100%)",
                }}
            >
                <div
                    aria-hidden
                    className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(255,111,30,0.28) 0%, rgba(255,111,30,0) 70%)",
                    }}
                />
                <div className="w-[90%] max-w-[1280px] m-auto relative">
                    <h1 className="text-[28px] md:text-[42px] font-bold font-inter text-white leading-tight tracking-tight text-wrap-balance">
                        Fly to your dream destinations
                    </h1>
                    <p className="mt-2 md:mt-3 text-[14px] md:text-[17px] font-inter text-[#CBD8EE] max-w-[46ch]">
                        Discover the best flight deals and book hassle-free.
                    </p>
                </div>
            </div>
            <div className="w-[90%] max-w-[1280px] m-auto">
                <div className="-mt-[76px] relative border border-[#E4E7EB] shadow-[0_20px_45px_-18px_rgba(2,62,138,0.35)] bg-white rounded-[10px] p-6">
                    <RoundTrip />
                </div>
            </div>
            <TravelmateApp />
            <Footer />
        </div>
    )
}

export default Flight
