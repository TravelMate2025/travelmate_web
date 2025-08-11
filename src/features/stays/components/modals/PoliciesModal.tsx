import React, { useRef, useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface PoliciesModalProps {
  onClose: () => void;
}

const PoliciesModal: React.FC<PoliciesModalProps> = ({ onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const isRow = containerWidth > 768;

  const FlexSection = ({
    title,
    items,
  }: {
    title: string;
    items: string[];
  }) => (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: isRow ? "row" : "column",
        width: "100%",
        alignItems: "flex-start",
      }}
    >
      <p className="font-medium text-gray-700">{title}</p>
      <ul className="mt-4 ml-8 list-disc md:ml-40">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 bg-opacity-40 flex items-center justify-center p-2">
      <div className="bg-white w-full max-w-3xl h-[95vh] max-h-[100vh] overflow-y-auto rounded-lg shadow-xl p-4 md:p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-600 border border-gray-300 p-1 rounded-md hover:text-red-500"
        >
          <FaTimes size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-6">Policies</h2>

        {/* Policies */}
        <div className="space-y-6 border-t border-b md:border border-gray-300 md:rounded-lg p-6">
          <FlexSection
            title="Check In & Check Out"
            items={[
              "Valid ID card required at Check in time",
              "Check In time: 4:00pm",
              "Checkout Time: 6:00pm",
            ]}
          />
          <hr className="border-gray-300" />
          <FlexSection
            title="Reservation Policy"
            items={["All bookings are non refundable once committed"]}
          />
          <hr className="border-gray-300" />
          <FlexSection
            title="Pet Policy"
            items={["No Pets allowed on the premises"]}
          />
          <hr className="border-gray-300" />
          <FlexSection
            title="Children and Extra Beds"
            items={["Children are welcome", "Cribs not available"]}
          />
        </div>
      </div>
    </div>
  );
};

export default PoliciesModal;
