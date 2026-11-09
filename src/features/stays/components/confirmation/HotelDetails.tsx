
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
  const image = booking?.hotel_image_url || String(booking?.images?.[0]?.secureUrl || booking?.images?.[0]?.url || "");

  return (
    <section className="overflow-hidden rounded-2xl border border-[#dfe7f0] bg-white shadow-[0_10px_30px_rgba(16,42,67,0.05)]">
      {image && <img src={image} alt="" className="h-32 w-full object-cover" />}
      <div className="p-5 sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#023E8A]">Property</p><h2 className="mt-1 text-xl font-semibold text-[#18202b]">{hotelName}</h2>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-start gap-3"><RiHotelLine className="mt-0.5 text-[#023E8A]" /><div><p className="text-xs text-[#8994a3]">Confirmation</p><p className="font-medium text-[#18202b]">{booking?.reference ?? booking?.booking_reference ?? "N/A"}</p></div></div>
          <div className="flex items-start gap-3"><IoLocationOutline className="mt-0.5 text-[#023E8A]" /><div><p className="text-xs text-[#8994a3]">Address</p><p className="font-medium leading-5 text-[#354052]">{[hotelAddress, cityName, countryName].filter(Boolean).join(", ") || "N/A"}</p></div></div>
        </div>
      </div>
    </section>
  );
};

export default HotelDetails;
