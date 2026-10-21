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
  board?: string;
  ratePlan?: string;
  rate_plan?: string;
  adults?: number;
  children?: number;
  quantity?: number;
  occupancy?: number;
  bedConfiguration?: string;
  bed_type?: string;
  amenities?: string[];
  price?: number | string;
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
      <section className="rounded-2xl border border-[#dfe7f0] bg-white p-5 shadow-[0_10px_30px_rgba(16,42,67,0.05)] sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#023E8A]">Accommodation</p><h2 className="mb-4 mt-1 text-xl font-semibold text-[#18202b]">Room details</h2>
        <div className="rounded-xl border border-dashed border-[#cfd9e5] bg-[#fbfcfe] p-4 text-sm text-[#687382]">
          Room information is not available for this booking.
        </div>
      </section>
    );
  return (
    <section className="rounded-2xl border border-[#dfe7f0] bg-white p-5 shadow-[0_10px_30px_rgba(16,42,67,0.05)] sm:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#023E8A]">Accommodation</p><h2 className="mb-5 mt-1 text-xl font-semibold text-[#18202b]">Room details</h2>
      <div className="space-y-3">
        {roomEntries.map((room, index) => {
          const roomDetail = room as RoomDetail | undefined;
          const roomLabel =
            typeof room === "string" || typeof room === "number"
              ? String(room)
              : roomDetail?.name ?? roomDetail?.room_name ?? roomDetail?.description ?? "N/A";
          const board = roomDetail?.boardName ?? roomDetail?.board_name ?? roomDetail?.board;
          const ratePlan = roomDetail?.ratePlan ?? roomDetail?.rate_plan;
          const guests = roomDetail?.adults != null || roomDetail?.children != null
            ? `${roomDetail?.adults ?? 0} adults · ${roomDetail?.children ?? 0} children`
            : roomDetail?.occupancy != null ? `${roomDetail.occupancy} guests` : null;
          const quantity = roomDetail?.quantity && roomDetail.quantity > 1 ? `${roomDetail.quantity} rooms` : null;
          const amenities = Array.isArray(roomDetail?.amenities) ? roomDetail.amenities.slice(0, 4) : [];
          return (
            <article
              className="rounded-xl border border-[#e7edf5] bg-[#fbfcfe] p-4"
              key={
                roomDetail?.name ??
                roomDetail?.room_name ??
                `${roomLabel}-${index}`
              }
              >
              <div className="flex items-start gap-3">
                <span className="rounded-lg bg-[#e8f1fb] p-2 text-[#023E8A]"><Bed size={18} /></span>
                <div className="min-w-0"><p className="font-semibold capitalize text-[#18202b]">{roomLabel}</p><p className="mt-1 text-xs text-[#687382]">{[quantity, guests, roomDetail?.bedConfiguration ?? roomDetail?.bed_type].filter(Boolean).join(" · ") || "Room selection"}</p></div>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-[#687382] sm:grid-cols-2">
                {board && <Detail label="Board" value={board} />}
                {ratePlan && <Detail label="Rate plan" value={ratePlan} />}
                {roomDetail?.price != null && <Detail label="Room price" value={String(roomDetail.price)} />}
                {roomDetail?.cancellationPolicy?.terms && <Detail label="Cancellation" value={roomDetail.cancellationPolicy.terms} />}
              </div>
              {amenities.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{amenities.map((amenity) => <span key={amenity} className="rounded-full bg-white px-2.5 py-1 text-[11px] text-[#687382] ring-1 ring-[#e2e8f0]">{amenity}</span>)}</div>}
            </article>
          );
        })}
      </div>
    </section>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-[#edf1f6]"><span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8b96a5]">{label}</span><span className="mt-1 block break-words font-medium text-[#354052]">{value}</span></div>;

export default RoomDetails;
