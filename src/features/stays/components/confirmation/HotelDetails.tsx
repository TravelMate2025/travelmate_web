
import { BookingDetailsVerifyData } from "../../types";
import { RiHotelLine } from "react-icons/ri";
import { IoLocationOutline } from "react-icons/io5";
interface props {
  booking?: BookingDetailsVerifyData | undefined;
}

const HotelDetails = ({ booking }: props) => {
  return (
    <div className="bg-white">
      <h2 className="text-lg font-semibold mb-2 sm:mb-4">Hotel Details</h2>
      <div className="rounded-lg sm:border border-gray-300 sm:p-6">
        <div className="flex items-center gap-2">
          <RiHotelLine />
          <p>{booking?.hotel_name || "N/A"}</p>
        </div>
        <div className="flex items-center gap-2">
          <IoLocationOutline />
          <p>
            {booking?.hotel_location?.address || "N/A"}{" "}
            {booking?.hotel_location?.destination?.city_name}{" "}
            {booking?.hotel_location?.destination?.country_name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
