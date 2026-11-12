// Stands in for the flight search form while flights are rebuilt on Amadeus
// (features.md, phase W0). Phase W1 replaces it with the new search form.
export const FlightSearchPlaceholder = () => (
  <div className="flex flex-col gap-1 py-4 font-inter text-center md:text-left">
    <p className="text-[16px] font-semibold text-[#181818]">Flight search is being rebuilt</p>
    <p className="text-[14px] text-[#4E4F52]">New flight booking is coming soon.</p>
  </div>
);
