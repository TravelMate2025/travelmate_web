
import { BookingDetailsVerifyData } from "../../types";
import { RiHotelLine } from "react-icons/ri";
import { IoLocationOutline } from "react-icons/io5";
interface props {
  booking?: BookingDetailsVerifyData | undefined;
}

const HotelDetails = ({ booking }: props) => {
  const snapshot = booking?.bookingSnapshot ?? booking?.booking_snapshot ?? {};
  const hotelName =
    booking?.hotel_name ||
    booking?.hotelName ||
    (snapshot as Record<string, unknown>).hotelName?.toString() ||
    (snapshot as Record<string, unknown>).hotel_name?.toString() ||
    "N/A";
  const hotelAddress =
    booking?.hotel_location?.address ||
    booking?.hotelLocation?.address ||
    (snapshot as Record<string, unknown>).hotelAddress?.toString() ||
    (snapshot as Record<string, unknown>).hotel_address?.toString() ||
    (snapshot as Record<string, unknown>).address?.toString() ||
    "N/A";
  const cityName =
    booking?.hotel_location?.destination?.city_name ||
    booking?.hotelLocation?.destination?.city_name ||
    (snapshot as Record<string, unknown>).city?.toString() ||
    "";
  const countryName =
    booking?.hotel_location?.destination?.country_name ||
    booking?.hotelLocation?.destination?.country_name ||
    (snapshot as Record<string, unknown>).country?.toString() ||
    "";

  return (
    <div className="bg-white">
      <h2 className="text-lg font-semibold mb-2 sm:mb-4">Hotel Details</h2>
      <div className="rounded-lg sm:border border-gray-300 sm:p-6">
        <div className="flex items-center gap-2">
          <RiHotelLine />
          <p>{hotelName}</p>
        </div>
        <div className="flex items-center gap-2">
          <RiHotelLine />
          <p className="text-sm text-gray-500">
            {booking?.reference ?? booking?.booking_reference ?? "N/A"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <IoLocationOutline />
          <p>
            {hotelAddress} {cityName} {countryName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
