import { useState } from "react";

const faqs = [
  {
    q: "What time is check-in and check-out?",
    a: "Standard check-in is from 2:00 PM and check-out is by 11:00 AM, though this varies by property — exact times are always shown on the stay's detail page before you book.",
  },
  {
    q: "Can I cancel or change my booking?",
    a: "Most stays offer free cancellation up to 48 hours before check-in. The exact policy for each property is shown clearly before you confirm your booking.",
  },
  {
    q: "Is the price shown the total price?",
    a: "Yes — the price you see at search includes taxes and fees for your selected dates and guest count, with no surprises at checkout.",
  },
  {
    q: 'How are "Top Rated" and "Trending" stays chosen?',
    a: "Top Rated reflects real guest review scores, Budget-Friendly sorts by price, and Trending highlights stays with the most bookings and views recently — all pulled from the same live catalog, not separate lists.",
  },
  {
    q: "What payment methods are accepted?",
    a: "Card and bank transfer via Flutterwave, processed securely at checkout — the same payment flow used across TravelMate.",
  },
];

const StaysFAQ = () => {
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

export default StaysFAQ;
