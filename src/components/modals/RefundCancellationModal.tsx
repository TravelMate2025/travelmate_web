import React, { useRef, useEffect, ReactNode } from "react";
import { FaTimes } from "react-icons/fa";

interface RefundCancellationModalProps {
  onClose: () => void;
  formattedTime: string;
  formattedDate: string;
  refundableUntil: string;
}

const ResponsiveFlexContainer = ({ children }: { children: ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

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

  const isRow = containerWidth > 640;

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: isRow ? "row" : "column",
        width: "100%",
        justifyContent: isRow ? "flex-start" : "space-between",
        alignItems: "flex-start",
      }}
    >
      {children}
    </div>
  );
};

const RefundCancellationModal: React.FC<RefundCancellationModalProps> = ({
  onClose,
  formattedTime,
  formattedDate,
  refundableUntil,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl h-[80vh] max-h-[100vh] overflow-y-auto rounded-lg shadow-xl p-4 md:p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-600 border border-gray-300 rounded-md p-1 hover:text-red-500"
        >
          <FaTimes size={20} />
        </button>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold ml-15">Refund & Cancellations</h2>
        </div>

        <div className="space-y-6 border-t border-b md:border border-gray-300 md:rounded-lg p-6">
          <ResponsiveFlexContainer>
            <p className="font-medium mb-4 md:mr-60">Refunds</p>
            <ul className="text-gray-700 ml-4 list-disc">
              <li>Fully Refundable before {refundableUntil}</li>
            </ul>
          </ResponsiveFlexContainer>

          <hr className="border-gray-300" />

          <ResponsiveFlexContainer>
            <p className="font-medium mb-4 md:mr-50">Cancellations</p>
            <ul className="text-gray-700 ml-4 list-disc">
              <li>
                Cancellations made after {formattedTime} on {formattedDate} or
                no-shows are subject to a fee equal to 100% of the amount paid.
              </li>
            </ul>
          </ResponsiveFlexContainer>
        </div>
      </div>
    </div>
  );
};

export default RefundCancellationModal;
