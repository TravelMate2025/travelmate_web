import hotelimage from "../../assets/images/City-image.png";
import carImage from "../../assets/carImage.svg";
import flightImage from "../../assets/airlogo.svg";
import { NormalizedBooking } from "../../pages/Bookings";
import EmptyState from "./EmptyState";
import { useNavigate } from "react-router-dom";

export interface BookingsProps {
  bookings: NormalizedBooking[];
}

const Failed = ({ bookings }: BookingsProps) => {
  const navigate = useNavigate();
  const getDetails = (item: NormalizedBooking) => {
   const image =
      item.imageUrl ||
      (item.type === "stay"
        ? hotelimage
        : item.type === "transfer"
        ? carImage
        : flightImage);

    const name = item.name || "Unknown Booking";
    let dateStr = "";
   if (item.type === "stay" || item.type === "flight") {
      const start = item.date || item.originalData?.check_in;
      const end = item.date_to || item.originalData?.check_out;
      if (start && end) {
        dateStr = `${new Date(start).toDateString()} - ${new Date(
          end
        ).toDateString()}`;
      } else if (start) {
        dateStr = new Date(start).toDateString();
      }
    } else {
      dateStr = item.date ? new Date(item.date).toDateString() : "Date N/A";
    }

    const amount = item.amount || 0;
    const currency = item.currency || "NGN";

    return { image, name, dateStr, amount, currency };
  };

  return (
    <div>
      {bookings?.length === 0 ? (
        <EmptyState
          title="No Failed Bookings"
          content="You haven't made any failed bookings yet. When you do, they will appear here."
        />
      ) : (
        bookings.map((item) => {
          const { image, name, dateStr, amount, currency } = getDetails(item);

          return (
            <div
              key={item.id}
              className="flex justify-between lg:max-w-3xl w-full items-start gap-2 border-[1px] border-neutral-300 p-4 rounded-xl mb-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                item.type === "stay"
                  ? navigate(
                      `/bookings/stays-details/?session_id=${item.session_id}`
                    )
                  : item.type === "transfer"
                  ? navigate(`/bookings/transfers-details/?session_id=${item.session_id}`)
                  : navigate(`bookings/flight-details/?session_id=${item.session_id}`);
              }}
            
            >
              <div className="flex justify-normal items-start gap-3">
                <img
                  className="h-20 w-20 object-cover rounded-xl bg-gray-100 opacity-80"
                  src={image}
                  alt={name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = hotelimage;
                  }}
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{name}</h3>
                  <p className="text-[#4E4F52] text-sm">{dateStr}</p>
                  <p className="text-[#4E4F52] text-sm font-medium">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: currency,
                    }).format(amount)}
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

export default Failed;
