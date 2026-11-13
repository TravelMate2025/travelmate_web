import Footer from "../../../components/2Footer";
import { usePageMeta } from "../../../hooks/usePageMeta";
import Navbar from "../../../pages/homePage/Navbar";
import { CampaignCard } from "../components/landing/CampaignCard";
import { ClassBrowse } from "../components/landing/ClassBrowse";
import { FlightsFaq } from "../components/landing/FlightsFaq";
import { FlightsHero } from "../components/landing/FlightsHero";
import { PopularRoutes } from "../components/landing/PopularRoutes";
import { WhyBook } from "../components/landing/WhyBook";
import { FlightSearchForm } from "../components/search/FlightSearchForm";
import { useFlightsLanding } from "../hooks/useFlightsLanding";
import "../flights.css";

// /flights: the Flights landing page, reached from the top nav (like /hotels).
// Structure and copy follow the approved web mock (Main).
const FlightsPage = () => {
  usePageMeta({
    title: "Cheap Flights & Airline Tickets | TravelMate",
    description:
      "Compare fares from full-service airlines, see what each fare includes, and pay in naira, dollars or pounds with TravelMate.",
  });
  const landing = useFlightsLanding();

  return (
    <>
      <Navbar />
      <div className="bg-[#F4F6FA] font-onest text-[#181818]">
        <FlightsHero />
        <main className="relative z-10 mx-auto -mt-24 max-w-7xl px-4 pb-16 sm:px-6">
          <FlightSearchForm />
          <ClassBrowse classFares={landing.classFares} />
          <PopularRoutes
            routes={landing.popularRoutes}
            loading={landing.loading}
            country={landing.country}
            onCountryChange={landing.setCountry}
          />
          <WhyBook />
          <CampaignCard campaign={landing.campaign} />
          <FlightsFaq />
        </main>
      </div>
      <Footer />
    </>
  );
};

// Default export for React.lazy in App.tsx
export default FlightsPage;
