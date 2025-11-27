import hotelimage from "../../../../assets/images/City-image.png";
import Bookings from "../../pages/Bookings";
import EmptyState from "./EmptyState";
export interface BookingsProps {
  bookings: Bookings[];
}

const Cancelled = ({ bookings }: BookingsProps) => {
  return (
    <div>
      {" "}
      {bookings?.length === 0 ? (
        <EmptyState
          title="No Cancelled Bookings yet"
          content=" You haven't cancelled any bookings yet. When you do, they will appear here."
        />
      ) : (
        bookings.map((item) => (
          <div
            key={item?.id}
            className="flex justify-between lg:max-w-3xl w-full items-start gap-2 border-[1px] border-neutral-300 p-4 rounded-xl mb-4"
          >
            <div className="flex justify-normal items-start gap-2">
              <img
                className="h-auto w-20 object-cover rounded-xl "
                src={item?.imageUrl || hotelimage}
                alt={item?.hotel_name || "------------"}
              />
              <div>
                <h3 className="text-lg font-bold">
                  {item?.hotel_name || "------------"}
                </h3>
                <p className="text-[#4E4F52] text-sm">
                  {new Date(item?.check_in).toDateString()} -{" "}
                  {new Date(item?.check_out).toDateString()}
                </p>
                <p className="text-[#4E4F52] text-sm">
                  ${item?.total_price || "$100"}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Cancelled;
