import { useState } from "react";

const faqs = [
  {
    q: "How far in advance should I book my airport transfer?",
    a: "You can book anywhere from a few weeks ahead to right before you land — as long as a driver is available for your pickup time, your booking is confirmed immediately.",
  },
  {
    q: "What happens if my flight is delayed?",
    a: "Add your flight number at booking and your driver tracks it automatically, adjusting your pickup time so you're never left waiting.",
  },
  {
    q: "Can I cancel or change my pickup time?",
    a: "Yes — cancel for free up to 24 hours before your scheduled pickup. Changing the time is free any time before your driver is en route.",
  },
  {
    q: "Is the price shown the total price?",
    a: "Yes. The fare you see at booking includes the driver, fuel, and a free 15-minute wait — no extra fees added at pickup.",
  },
  {
    q: "How do I find my driver at pickup?",
    a: "You'll get your driver's name, photo, and vehicle details as soon as your booking is confirmed, plus a meeting point once you land.",
  },
];

const TransferFAQ = () => {
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

export default TransferFAQ;
