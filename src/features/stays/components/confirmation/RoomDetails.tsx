import { Bed } from "lucide-react";
import { BookingDetailsVerifyData } from "../../types";

interface props {
  booking: BookingDetailsVerifyData|undefined;
}

type RoomDetail = {
  name?: string;
  room_name?: string;
  description?: string;
  rate_key?: string;
  boardName?: string;
  board_name?: string;
  cancellationPolicy?: {
    policyType?: string;
    terms?: string;
  };
};

const RoomDetails = ({ booking }: props) => {
  const snapshot = booking?.bookingSnapshot ?? booking?.booking_snapshot ?? {};
  const roomEntries =
    booking?.rooms_details ??
    booking?.roomsDetails ??
    ((snapshot as Record<string, unknown>).roomSelections as unknown[] | undefined) ??
    [];

  if (!roomEntries.length)
    return (
      <div className="bg-white">
        <h2 className="text-lg font-semibold mb-2 sm:mb-4">Room Details</h2>
        <div className="sm:p-6 rounded-lg sm:border border-gray-300">
          <p>No information available</p>
        </div>
      </div>
    );
  return (
    <div className="bg-white">
      <h2 className="text-lg font-semibold mb-2 sm:mb-4">Room Details</h2>
      <div className="sm:p-6 rounded-lg sm:border border-gray-300">
        {roomEntries.map((room, index) => {
          const roomDetail = room as RoomDetail | undefined;
          const roomLabel =
            typeof room === "string" || typeof room === "number"
              ? String(room)
              : roomDetail?.name ?? roomDetail?.room_name ?? roomDetail?.description ?? "N/A";
          return (
            <div
              className="space-y-1 pb-3 last:pb-0"
              key={
                roomDetail?.name ??
                roomDetail?.room_name ??
                `${roomLabel}-${index}`
              }
              >
              <div className="flex justify-normal gap-2">
                <Bed />
                <p className="capitalize">{roomLabel}</p>
              </div>
              {roomDetail?.cancellationPolicy?.terms && (
                <p className="text-xs text-gray-500">
                  Policy: {roomDetail.cancellationPolicy.terms}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomDetails;
