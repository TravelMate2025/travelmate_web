import FlightsPersonalized from "./FlightsPersonalized";
import FlightsClassBrowse from "./FlightsClassBrowse";
import FlightsPopularRoutes from "./FlightsPopularRoutes";
import FlightsTrustRow from "./FlightsTrustRow";
import FlightsPromoBanner from "./FlightsPromoBanner";
import FlightsFAQ from "./FlightsFAQ";

// Everything the home page shows below the search widget when the Flights
// tab is active -- previously this space just kept rendering stays content
// regardless of which tab was selected. Same content-module family already
// shipped for Transfers (TransfersHomeContent), adapted for flights. See
// plan.md's "Flights on Home — Web Mock" entry.
const FlightsHomeContent = () => {
  return (
    <>
      <FlightsPersonalized />
      <FlightsClassBrowse />
      <FlightsPopularRoutes />
      <FlightsTrustRow />
      <FlightsPromoBanner />
      <FlightsFAQ />
    </>
  );
};

export default FlightsHomeContent;
