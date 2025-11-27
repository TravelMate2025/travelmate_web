import hotelimage from "../../../../assets/images/City-image.png";
import { X } from "lucide-react";
import Bookings from "../../pages/Bookings";
import EmptyState from "./EmptyState";
export interface BookingsProps {
  bookings: Bookings[];
  onCancel?: (bookingId: string) => Promise<void>;
  cancelingId?: string | null;
}
const Ongoing = ({ bookings, onCancel, cancelingId }: BookingsProps) => {
  return (
    <div>
      {bookings?.length === 0 ? (
        <EmptyState
          title="No Ongoing Bookings yet"
          content=" You haven't made any pending bookings yet. When you do, they will appear here."
        />
      ) : (
        bookings?.map((item) => (
          <div
            key={item?.id}
            className="flex justify-between lg:max-w-3xl w-full items-start gap-2 border-[1px] border-neutral-300 p-4 rounded-xl mb-4"
          >
            <div className="flex justify-normal items-start gap-2">
              <img
                className="h-auto w-20 object-cover rounded-xl "
                src={item?.imageUrl || hotelimage}
                alt={item?.hotel_name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = hotelimage;
                }}
              />
              <div>
                <h3 className="text-lg font-bold">
                  {item?.hotel_name || "------"}
                </h3>
                <p className="text-[#4E4F52] text-sm">
                  {new Date(item?.check_in).toDateString()} -{" "}
                  {new Date(item?.check_out).toDateString()}
                </p>
                <p className="text-[#4E4F52] text-sm">
                  ${item?.total_price || "------"}
                </p>
              </div>
            </div>
            <button
              onClick={() => onCancel?.(item?.reference)}
              disabled={cancelingId === item?.reference}
              className="flex justify-end items-center cursor-pointer gap-1"
            >
              <X className="size-4" stroke="#D72638" />
              <p className="text-[#D72638] hover:text-[#ea6d79]">
                {" "}
                {cancelingId === item?.reference ? "Cancelling..." : "Cancel"}
              </p>
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Ongoing;
