import hotelimage from "../../../../assets/images/City-image.png";
import Bookings from "../../pages/Bookings";
export interface BookingsProps {
  bookings: Bookings[];
}
const Completed = ({ bookings }: BookingsProps) => {
  return (
    <div>
      {bookings.map((item) => (
        <div
          key={item.id}
          className="flex justify-between lg:max-w-3xl w-full items-start gap-2 border-[1px] border-neutral-300 p-4 rounded-xl mb-4"
        >
          <div className="flex justify-normal items-start gap-2">
            <img
              className="h-auto w-20 object-cover rounded-xl "
              src={item?.imageUrl || hotelimage}
              alt=""
            />
            <div>
              <h3 className="text-lg font-bold">
                {item.title || "Abaranje, Ikotun Lagos"}
              </h3>
              <p className="text-[#4E4F52] text-sm">
                {new Date(item?.checkInDate).toDateString()} -{" "}
                {new Date(item?.checkOutDate).toDateString()}
              </p>
              <p className="text-[#4E4F52] text-sm">
                ${item.totalAmount || "$100"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Completed;
