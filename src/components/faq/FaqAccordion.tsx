import React, { useState } from "react";

type Props = {
  faqs: {
    id: number;
    question: string;
    answer: string;
  }[];
};

const FaqAccordion: React.FC<Props> = ({ faqs }) => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full md:w-2/3 py-5 pl-4 md:border-r md:border-l pr-4 border-y border-gray-300 md:rounded-lg">
      {faqs.map((faq, index) => {
        const isLast = index === faqs.length - 1;
        const isOpen = openId === faq.id;

        return (
          <div
            key={faq.id}
            className={`mb-4 pb-2 transition-all duration-300 ease-in-out ${
              !isLast ? "border-b border-gray-300" : ""
            }`}
          >
            <button
              onClick={() => toggleAccordion(faq.id)}
              className="w-full flex justify-between items-center text-left text-lg font-medium focus:outline-none"
            >
              <span>{faq.question}</span>
              <span className="text-sm">
                {isOpen ? "▲" : "▼"}
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FaqAccordion;
