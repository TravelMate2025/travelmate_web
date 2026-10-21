import { FaShieldAlt, FaLock, FaMoneyBillWave, FaHeadset } from "react-icons/fa";

// Sits directly under the hero search card -- previously the only trust
// signal on the whole homepage was StaysTrustRow, several sections further
// down the page. A first-time visitor or evaluating partner deciding
// whether to trust the site with a booking shouldn't have to scroll past
// the search form to find out. Condensed, single-line claims (not the
// fuller StaysTrustRow cards) since this sits in a tighter space; same
// underlying claims as StaysTrustRow/StaysFAQ, just summarized, so nothing
// here contradicts what those sections already say.
const trustItems = [
  { icon: FaShieldAlt, label: "Verified listings & partners" },
  { icon: FaMoneyBillWave, label: "Best price guarantee" },
  { icon: FaLock, label: "Secure payments via Flutterwave" },
  { icon: FaHeadset, label: "24/7 support" },
];

const HeroTrustStrip = () => {
  return (
    <div className="w-[90%] max-w-[1280px] m-auto mt-4 md:mt-5">
      <div className="flex flex-wrap justify-center md:justify-between gap-x-6 gap-y-3">
        {trustItems.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon className="text-[#FF6F1E] flex-shrink-0" size={14} />
            <span className="text-[12px] md:text-[13px] font-inter text-[#4E4F52] whitespace-nowrap">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroTrustStrip;
