import { FaShieldAlt, FaCreditCard, FaClock, FaHeadset } from "react-icons/fa";

const trustItems = [
  {
    icon: FaShieldAlt,
    title: "Verified drivers",
    body: "Every driver is background-checked and rated by real travellers.",
  },
  {
    icon: FaCreditCard,
    title: "Transparent pricing",
    body: "The price you see is the price you pay — no surprise airport fees.",
  },
  {
    icon: FaClock,
    title: "Free cancellation",
    body: "Plans change. Cancel up to 24 hours before pickup at no cost.",
  },
  {
    icon: FaHeadset,
    title: "24/7 support",
    body: "A real person is always one tap away if anything changes.",
  },
];

const TransferTrustRow = () => {
  return (
    <div className="w-[90%] m-auto mt-[60px]">
      <p className="text-[24px] font-semibold font-inter text-[#181818] mb-8">Why book your transfer with us</p>
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

export default TransferTrustRow;
