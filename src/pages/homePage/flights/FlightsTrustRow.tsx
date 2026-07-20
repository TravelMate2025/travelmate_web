import { FaShieldAlt, FaCreditCard, FaFileAlt, FaHeadset } from "react-icons/fa";

// Claims written to match, not contradict, the real fare-dependent refund
// language already live on /refund-policy -- no promise of free changes or
// universal baggage inclusion, since that's fare/airline-specific, unlike
// Stays/Transfers' flat cancellation windows.
const trustItems = [
  {
    icon: FaShieldAlt,
    title: "Verified airline partners",
    body: "Every fare is sourced from a real, verified airline booking partner.",
  },
  {
    icon: FaCreditCard,
    title: "Transparent fares",
    body: "The price you see at search is the price you pay at checkout — no hidden fees.",
  },
  {
    icon: FaFileAlt,
    title: "Clear fare rules",
    body: "Refund and change rules for your specific fare are shown before you pay.",
  },
  {
    icon: FaHeadset,
    title: "24/7 support",
    body: "A real person is always one tap away if your plans change.",
  },
];

const FlightsTrustRow = () => {
  return (
    <div className="w-[90%] m-auto mt-[60px]">
      <p className="text-[24px] font-semibold font-inter text-[#181818] mb-8">Why book your flight with us</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trustItems.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-3.5 items-start">
            <div className="w-[46px] h-[46px] rounded-[14px] bg-[#FFF1E8] flex items-center justify-center flex-shrink-0">
              <Icon className="text-[#FF6F1E]" size={19} />
            </div>
            <div>
              <p className="text-[15px] font-semibold font-inter text-[#181818] mb-1">{title}</p>
              <p className="text-[13px] font-inter text-[#4E4F52] leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightsTrustRow;
