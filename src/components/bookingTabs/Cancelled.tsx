import hotelimage from "../../assets/images/City-image.png";
import carImage from "../../assets/carImage.svg";
import flightImage from "../../assets/airlogo.svg";
import { NormalizedBooking } from "../../pages/Bookings";
import EmptyState from "./EmptyState";
import { useNavigate } from "react-router-dom";
import {
  formatBookingAmount,
  getBookingAmount,
  getBookingCurrency,
  getBookingDateText,
  getBookingName,
} from "./utils";

export interface BookingsProps {
  bookings: NormalizedBooking[];
}

const Cancelled = ({ bookings }: BookingsProps) => {
  const navigate = useNavigate();
  const getDetails = (item: NormalizedBooking) => {
    const image =
      item.imageUrl ||
      (item.type === "stay"
        ? hotelimage
        : item.type === "transfer"
          ? carImage
          : flightImage);
    const name = getBookingName(item, "Unknown Booking");
    const dateStr = getBookingDateText(item);
    const amount = getBookingAmount(item);
    const currency = getBookingCurrency(item, "USD");
    const formattedAmount = formatBookingAmount(item, "USD");

    return { image, name, dateStr, amount, currency, formattedAmount };
  };

  return (
    <div>
      {bookings?.length === 0 ? (
        <EmptyState
          title="No Cancelled Bookings yet"
          content="You haven't cancelled any bookings yet. When you do, they will appear here."
        />
      ) : (
        bookings.map((item) => {
          const { image, name, dateStr, formattedAmount } = getDetails(item);

          return (
            <div
              key={item.id}
              className="flex justify-between lg:max-w-3xl w-full items-start gap-2 border-[1px] border-neutral-300 p-4 rounded-xl mb-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                if (item.type === "stay") {
                  navigate(
                    `/bookings/stays-details/?booking_reference=${encodeURIComponent(item.reference)}&session_id=${encodeURIComponent(item.session_id)}`,
                  );
                } else if (item.type === "transfer") {
                  navigate(
                    `/bookings/transfers-details/?session_id=${encodeURIComponent(item.session_id)}&booking_reference=${encodeURIComponent(item.reference)}`,
                  );
                } else {
                  navigate(`/bookings/flight-details/?session_id=${item.session_id}`);
                }
              }}
            >
              <div className="flex justify-normal items-start gap-3">
                <img
                  className="h-20 w-20 object-cover rounded-xl bg-gray-200 grayscale"
                  src={image}
                  alt={name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = hotelimage;
                  }}
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-700">{name}</h3>
                  <p className="text-[#4E4F52] text-sm">{dateStr}</p>
                  <p className="text-[#4E4F52] text-sm font-medium">
                    {formattedAmount}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Cancelled;
