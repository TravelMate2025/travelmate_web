import { useState } from "react";

// Copy written to match, not contradict, the real fare-dependent refund
// language already live on /refund-policy's Flights section.
const faqs = [
  {
    q: "How far in advance should I book my flight?",
    a: "Fares can change daily, so booking as soon as your dates are fixed usually gets the best price — but you can search and book any time up to departure, as long as seats are available.",
  },
  {
    q: "Can I change or cancel my flight?",
    a: "It depends on your fare type — some fares are fully refundable, others are partially refundable or non-refundable. The exact rules for your fare are shown before you pay, and again in your booking confirmation.",
  },
  {
    q: "Is baggage included in the price?",
    a: "Baggage allowance depends on the fare and airline you book — it's shown clearly on the fare details before you confirm your booking.",
  },
  {
    q: "How do I check in for my flight?",
    a: "Check-in is handled directly by the operating airline using the e-ticket details sent to your email after booking.",
  },
  {
    q: "How long do refunds take?",
    a: "Eligible refunds are issued back to your original payment method, processed securely through Flutterwave — timing depends on your bank or card issuer.",
  },
];

const FlightsFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-[90%] max-w-[760px] m-auto mt-[60px]">
      <p className="text-[24px] font-semibold font-inter text-[#181818] text-center mb-8">
        Frequently asked questions
      </p>
      <div>
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.q} className="border-b border-[#EBECED]">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-center gap-4 text-left py-[18px] cursor-pointer"
              >
                <span className="text-[15px] font-semibold font-inter text-[#181818]">{item.q}</span>
                <span className={`text-[#8A9096] text-[18px] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                  ⌄
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-40 opacity-100 pb-[18px]" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-[13.5px] font-inter text-[#4E4F52] leading-relaxed">{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlightsFAQ;
