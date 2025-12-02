import React from "react";

interface PriceSummaryProps {
  roomType?: string;
  roomPrice?: number;
  nights?: number;
  taxes?: number;
  numberOfRooms?: number;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({
  roomPrice,
  nights,
  numberOfRooms,
  roomType,
}) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 ml-3">Price Summary</h2>
      <div className="bg-white px-4 py-2 sm:p-6 w-full h-50 border-t border-b md:border md:rounded-lg border-gray-300">
        <div className="space-y-3">
          <p className="flex justify-between">
            <span className="font-medium">{roomType}</span>N
            {roomPrice?.toLocaleString()}
          </p>
          <p className="text-gray-500 text-sm">
            {" "}
            {numberOfRooms} {numberOfRooms ?? 1 ? "Room" : "Rooms"} * {nights}{" "}
            Nights
          </p>

          <p className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-[#023E8A]">
              €{roomPrice?.toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceSummary;
