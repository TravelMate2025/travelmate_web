import React, { useState, useRef, useEffect, ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import RefundCancellationModal from "../modals/RefundCancellationModal";

interface RefundCancellationProps {
  formattedTime: string;
  formattedDate: string;
  refundableUntil: string;
}

const ResponsiveFlexContainer = ({ children }: { children: ReactNode }) => {
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

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
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
      {React.Children.map(children, (child, index) => {
        if (index === 1 && isRow) {
          return (
            <div
              style={{
                flex: 1,
                textAlign: "left",
                wordWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              {child}
            </div>
          );
        }
        return child;
      })}
    </div>
  );
};

const RefundCancellation: React.FC<RefundCancellationProps> = ({
  formattedTime,
  formattedDate,
  refundableUntil,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div className="w-full space-y-4">
      {/* Title and Mobile Show All Button */}
      <div className="flex justify-between items-center px-2 sm:px-0">
        <h3 className="text-lg font-semibold">Refund & Cancellations</h3>
        {isMobile && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-blue-600 font-medium flex items-center gap-1"
          >
            Show all <span className="text-xl">{">"}</span>
          </button>
        )}
      </div>

      {/* Refund & Cancellation Section */}
      <div className="sm:border border-gray-300 rounded-lg p-6 space-y-6">
        <ResponsiveFlexContainer>
          <p className="font-medium mb-4 md:mr-60 hidden md:block">Refunds</p>
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
              no-shows are subject to a fee equal to 100% of the amount paid
              for the reservation.
            </li>
          </ul>
        </ResponsiveFlexContainer>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <RefundCancellationModal
          onClose={() => setIsModalOpen(false)}
          formattedTime={formattedTime}
          formattedDate={formattedDate}
          refundableUntil={refundableUntil}
        />
      )}
    </div>
  );
};

export default RefundCancellation;


