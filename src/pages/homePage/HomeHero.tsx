// The home screen previously went straight from the fixed navbar into a
// bordered search form -- no headline, no color, no moment establishing
// what the site is for before asking the user to fill in a form. This is
// that moment, styled after the same "dark band + oversized headline"
// pattern used by Booking.com/Expedia: full-bleed brand-navy background,
// bold headline, and the search card overlapping its bottom edge.
const HomeHero = () => {
  return (
    <div
      className="w-full pt-[104px] pb-[92px] md:pt-[128px] md:pb-[120px] relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #023E8A 0%, #012a5e 100%)",
      }}
    >
      {/* Soft brand-accent glow, kept subtle -- a color moment, not a graphic */}
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
          Where are you going?
        </h1>
        <p className="mt-2 md:mt-3 text-[14px] md:text-[17px] font-inter text-[#CBD8EE] max-w-[46ch]">
          Search stays, flights, and rides in one place — real prices, no detours.
        </p>
      </div>
    </div>
  );
};

export default HomeHero;
