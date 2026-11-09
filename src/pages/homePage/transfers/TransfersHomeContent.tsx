import PersonalizedTransfer from "./PersonalizedTransfer";
import VehicleClassCards from "./VehicleClassCards";
import PopularTransferRoutes from "./PopularTransferRoutes";
import TransferTrustRow from "./TransferTrustRow";
import TransferPromoBanner from "./TransferPromoBanner";
import TransferFAQ from "./TransferFAQ";

// Everything the home page shows below the search widget when the
// Transfers tab is active -- previously this space just kept rendering
// stays content (Recently Viewed/Top Rated Stays/Popular Destinations)
// regardless of which tab was selected. See plan.md, Phase 2.
const TransfersHomeContent = () => {
  return (
    <>
      <PersonalizedTransfer />
      <VehicleClassCards />
      <PopularTransferRoutes />
      <TransferTrustRow />
      <TransferPromoBanner />
      <TransferFAQ />
    </>
  );
};

export default TransfersHomeContent;
