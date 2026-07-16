import promoDriver from "../../../assets/images/transfers/promo-driver.jpg";

// Matches the approved mockup's promo/seasonal module -- ships as a static,
// clearly-illustrative shell per plan.md's design decisions ("New
// promotional/seasonal modules ship as static shells, not fabricated
// data"). No real discount or campaign data exists in the backend yet, so
// the eyebrow label says so explicitly rather than presenting invented
// numbers as a real offer.
const TransferPromoBanner = () => {
  return (
    <div className="w-[90%] m-auto mt-[60px]">
      <div className="relative rounded-[20px] overflow-hidden shadow-[0_10px_24px_-12px_rgba(15,23,42,0.35)] min-h-[220px] flex items-center">
        <img
          src={promoDriver}
          alt="Driver at sunset"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(2,42,94,0.92) 20%, rgba(2,62,138,0.55) 55%, rgba(2,62,138,0.15) 100%)",
          }}
        />
        <div className="relative px-8 py-10 sm:px-11 sm:py-12 max-w-[520px] text-white">
          <p className="text-[11.5px] font-bold font-inter tracking-wide uppercase text-[#FFD7BD] mb-2">
            Illustrative — not a live offer
          </p>
          <p className="text-[24px] sm:text-[26px] font-bold font-inter mb-2">
            Weekend transfers, extra smooth
          </p>
          <p className="text-[14.5px] font-inter opacity-90 mb-5">
            Placeholder for a real seasonal campaign once promo data exists on the backend.
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

export default TransferPromoBanner;
