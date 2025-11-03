import React from "react";

interface PriceSummaryProps {
  roomPrice?: number;
  nights?: number;
  roomType?: string;
  numberOfRooms?: number;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({
  roomPrice,
  nights,
  roomType,
  numberOfRooms ,
}) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 ml-3">Price Summary</h2>
      <div className="bg-white px-4 py-2  w-full h-50 lg:border-t border-b md:border md:rounded-lg border-gray-300">
        <div className="space-y-3">
          <p className="flex justify-between">
            <span className="font-medium capitalize">
              {roomType?.toLocaleLowerCase()}
            </span>
            €{roomPrice?.toLocaleString()}
          </p>
          <p className="text-gray-500 text-sm">
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
