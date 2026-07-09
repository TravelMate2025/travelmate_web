import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import hotelimage from "../../assets/images/City-image.png";
import carImage from "../../assets/carImage.svg";
import flightImage from "../../assets/airlogo.svg";
import EmptyState from "./EmptyState";
import { NormalizedBooking } from "../../pages/Bookings";
import {
  formatBookingAmount,
  getBookingAmount,
  getBookingCurrency,
  getBookingDateText,
  getBookingName,
} from "./utils";

export interface BookingsProps {
  bookings: NormalizedBooking[];
  onCancel?: (bookingId: string) => Promise<void>;
  cancelingId?: string | null;
}

const Ongoing = ({ bookings, onCancel, cancelingId }: BookingsProps) => {
  const navigate = useNavigate();
  const getDetails = (item: NormalizedBooking) => {
    const image =
      item.imageUrl ||
      (item.type === "stay"
        ? hotelimage
        : item.type === "transfer"
        ? carImage
        : flightImage);

    const name =
      getBookingName(item, "") ||
      String(item.originalData?.hotel_name || "") ||
      String(item.originalData?.dropoff_location_label || "") ||
      "Unknown Booking";
    const dateStr = getBookingDateText(item);
    const amount = getBookingAmount(item);
    const currency = getBookingCurrency(item, "NGN");
    const formattedAmount = formatBookingAmount(item, "NGN");

    return { image, name, dateStr, amount, currency, formattedAmount };
  };

  return (
    <div>
      {bookings.length === 0 ? (
        <EmptyState
        title="No confirmed bookings yet"
        content="You haven't made any confirmed bookings yet. When you do, they will appear here."
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
                  className="h-20 w-20 object-cover rounded-xl bg-gray-100"
                  src={image}
                  alt={name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = hotelimage;
                  }}
                />
                <div>
                  <h3 className="text-lg font-bold line-clamp-1">{name}</h3>
                  <p className="text-[#4E4F52] text-sm">{dateStr}</p>
                    <p className="text-[#4E4F52] text-sm font-medium">
                      {formattedAmount}
                    </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel?.(item.reference);
                }}
                disabled={cancelingId === item.reference}
                className="flex justify-end items-center cursor-pointer gap-1 group"
              >
                <X className="size-4 text-[#D72638] group-hover:text-[#ea6d79]" />
                <p className="text-[#D72638] group-hover:text-[#ea6d79] text-sm">
                  {cancelingId === item.reference ? "Cancelling..." : "Cancel"}
                </p>
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Ongoing;
