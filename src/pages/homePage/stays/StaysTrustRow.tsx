import { FaCheckCircle, FaMoneyBillWave, FaClock, FaHeadset } from "react-icons/fa";

const trustItems = [
  {
    icon: FaCheckCircle,
    title: "Verified properties",
    body: "Every listing is checked for accuracy before it goes live — what you see is what you get.",
  },
  {
    icon: FaMoneyBillWave,
    title: "Best price guarantee",
    body: "Find it cheaper elsewhere within 24 hours and we'll match it, no questions asked.",
  },
  {
    icon: FaClock,
    title: "Free cancellation",
    body: "Plans change. Most stays can be cancelled free up to 48 hours before check-in.",
  },
  {
    icon: FaHeadset,
    title: "24/7 support",
    body: "A real person is always one tap away, from booking to checkout.",
  },
];

const StaysTrustRow = () => {
  return (
    <div className="w-[90%] m-auto mt-[60px]">
      <p className="text-[24px] font-semibold font-inter text-[#181818] mb-8">Why book your stay with us</p>
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

export default StaysTrustRow;
