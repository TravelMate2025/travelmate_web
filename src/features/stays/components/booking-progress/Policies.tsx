import React, { useState, useRef, useEffect, ReactNode } from "react";

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

  const isRow = containerWidth > 768;

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: isRow ? "row" : "column",
        width: "100%",
        alignItems: "flex-start",
        // justifyContent: "space-between",
      }}
    >
      {children}
    </div>
  );
};

const Policies: React.FC = () => {
  return (
    <div className="w-full space-y-4">
      {/* Title */}
      <h3 className="text-lg font-semibold ml-5 md:ml-0">Policies</h3>

      {/* Body */}
      <div className="border-t border-b md:border border-gray-300 md:rounded-lg p-6 space-y-6">
        {/* Check-in Policy */}
        <ResponsiveFlexContainer>
          <p className="font-medium text-gray-700">Check In & Check Out</p>
          <ul className="mt-4 ml-8 list-disc md:ml-40">
            <li>Valid ID card required at Check in time</li>
            <li>Check In time: 4:00pm</li>
            <li>Checkout Time: 6:00pm</li>
          </ul>
        </ResponsiveFlexContainer>

        <hr className="border-gray-300" />

        <ResponsiveFlexContainer>
          <p className="font-medium text-gray-700">Reservation Policy</p>
          <ul className="list-disc mt-4 ml-8 md:ml-47">
            <li>All bookings are non refundable once committed</li>
          </ul>
        </ResponsiveFlexContainer>

        <hr className="border-gray-300" />

        <ResponsiveFlexContainer>
          <p className="font-medium text-gray-700">Pet Policy</p>
          <ul className="list-disc mt-4 ml-8  xl:ml-49 ">
            <li>No Pets allowed on the premises</li>
          </ul>
        </ResponsiveFlexContainer>

        <hr className="border-gray-300" />

        <ResponsiveFlexContainer>
          <p className="font-medium text-gray-700">Children and Extra Beds</p>
          <ul className="list-disc mt-4 ml-8 md:ml-36 xl:ml-47">
            <li>Children are welcome</li>
            <li>Cribs not available</li>
          </ul>
        </ResponsiveFlexContainer>
      </div>
    </div>
  );
};

export default Policies;