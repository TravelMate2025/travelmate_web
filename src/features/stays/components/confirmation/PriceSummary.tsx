import React from "react";
import { BookingDetailsVerifyData } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

interface PriceSummaryProps {
  booking: BookingDetailsVerifyData;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({ booking }) => {
  const { searchParams } = useSelector((state: RootState) => state.stays);

  const numberOfRooms = searchParams?.rooms;
  const nights =
    searchParams?.checkIn && searchParams?.checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(searchParams.checkOut).getTime() -
              new Date(searchParams.checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 1;
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 ">Price Summary</h2>
      <div className="bg-white py-2  w-full lg:border-t border-b md:border md:rounded-lg border-gray-300 md:p-3">
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <p className="">
                {numberOfRooms} {numberOfRooms ?? 1 ? "Room" : "Rooms"} *{" "}
                {nights} Nights
              </p>
              <p className="text-gray-500 text-sm">
                €{(Number(booking?.total_price) / nights).toFixed(2)} per night
              </p>
            </div>
            €{booking?.total_price?.toLocaleString()}
          </div>

          <p className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-[#023E8A]">
              €{booking?.total_price?.toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceSummary;
