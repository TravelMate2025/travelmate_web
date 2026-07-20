import { FaPlane } from "react-icons/fa";

// Static, clearly-illustrative shell per plan.md's design decisions ("New
// promotional/seasonal modules ship as static shells, not fabricated
// data"). No real discount or campaign data exists in the backend yet, so
// the eyebrow label says so explicitly. No route photography exists for
// flights (see FlightsPopularRoutes), so this uses the same gradient +
// plane treatment instead of a photo, matching TransferPromoBanner's
// position/labeling but not its photographic style.
const FlightsPromoBanner = () => {
  return (
    <div className="w-[90%] m-auto mt-[60px]">
      <div
        className="relative rounded-[20px] overflow-hidden shadow-[0_10px_24px_-12px_rgba(15,23,42,0.35)] min-h-[200px] flex items-center"
        style={{
          background:
            "linear-gradient(100deg, rgba(1,26,60,0.95) 15%, rgba(2,62,138,0.75) 55%, rgba(2,62,138,0.35) 100%)",
        }}
      >
        <FaPlane
          className="absolute right-5 -bottom-8 text-white/[0.06] rotate-[-15deg]"
          size={220}
        />
        <div className="relative px-8 py-10 sm:px-11 sm:py-12 max-w-[520px] text-white">
          <p className="text-[11.5px] font-bold font-inter tracking-wide uppercase text-[#FFD7BD] mb-2">
            Illustrative — not a live offer
          </p>
          <p className="text-[24px] sm:text-[26px] font-bold font-inter mb-2">
            Fly further this season
          </p>
          <p className="text-[14.5px] font-inter opacity-90 mb-5">
            Placeholder for a real seasonal fare campaign once promo data exists on the backend.
          </p>
          <button
            type="button"
            className="bg-white text-[#023E8A] font-inter font-extrabold text-[14px] rounded-[12px] px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightsPromoBanner;
