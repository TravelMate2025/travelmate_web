import heroResort from "../../assets/images/stays/hero-resort.jpg";

// The home screen previously went straight from the fixed navbar into a
// bordered search form -- no headline, no color, no moment establishing
// what the site is for before asking the user to fill in a form. This is
// that moment, styled after the same "dark band + oversized headline"
// pattern used by Booking.com/Expedia: full-bleed photography, bold
// headline, and the search card overlapping its bottom edge. Shared above
// both the Stays and Transfers search widgets (tab switch happens below
// this component), so the photo is deliberately generic premium-travel
// rather than stay- or transfer-specific. Previously a flat navy gradient
// with no imagery -- see plan.md Phase 3.
const HomeHero = () => {
  return (
    <div className="w-full pt-[104px] pb-[92px] md:pt-[128px] md:pb-[120px] relative overflow-hidden">
      <img
        src={heroResort}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Navy gradient over the photo, strongest where the headline sits so
          text stays legible regardless of what's underneath it. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(1,26,60,0.94) 8%, rgba(2,42,94,0.82) 38%, rgba(2,62,138,0.5) 68%, rgba(2,62,138,0.28) 100%)",
        }}
      />
      <div className="w-[90%] max-w-[1280px] m-auto relative">
        <h1 className="text-[28px] md:text-[42px] font-bold font-inter text-white leading-tight tracking-tight text-wrap-balance">
          Where are you going?
        </h1>
        <p className="mt-2 md:mt-3 text-[14px] md:text-[17px] font-inter text-[#CBD8EE] max-w-[46ch]">
          Stays, flights, and airport transfers — all in one TravelMate account, with real prices and no detours.
        </p>
      </div>
    </div>
  );
};

export default HomeHero;
