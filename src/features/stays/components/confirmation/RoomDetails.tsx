import { Bed } from "lucide-react";
import { BookingDetailsVerifyData } from "../../types";

interface props {
  booking: BookingDetailsVerifyData|undefined;
}

const RoomDetails = ({ booking }: props) => {
  if (!booking?.rooms_details?.length)
    return (
      <div className="bg-white">
        <h2 className="text-lg font-semibold mb-2 sm:mb-4">Room Details</h2>
        <div className="sm:p-6 rounded-lg sm:border border-gray-300">
          <p>{"No Information Availbale"}</p>
        </div>
      </div>
    );
  return (
    <div className="bg-white">
      <h2 className="text-lg font-semibold mb-2 sm:mb-4">Room Details</h2>
      <div className="sm:p-6 rounded-lg sm:border border-gray-300">
        {booking?.rooms_details.map((room) => (
          <div className="flex justify-normal gap-2">
            <Bed />
            <p className="capitalize">{room?.name.toLowerCase() || "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomDetails;
