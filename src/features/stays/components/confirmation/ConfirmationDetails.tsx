import { BookingDetailsVerifyData } from "../../types";
import {
  getBookingLifecycleLabel,
  getBookingLifecycleStatus,
} from "../../../shared/bookingStatus";

type SnapshotRecord = Record<string, unknown>;

type props = {
  getStatusColor: (data?: string) => string;
  confirmDetails?: BookingDetailsVerifyData | undefined;
};

const formatDate = (value?: string | null) => {
  if (!value) return "N/A";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toDateString();
};

const ConfirmationDetails = ({ getStatusColor, confirmDetails }: props) => {
  const snapshot = (confirmDetails?.bookingSnapshot ?? confirmDetails?.booking_snapshot ?? {}) as SnapshotRecord;
  const bookingState = getBookingLifecycleStatus(
    confirmDetails?.status,
    confirmDetails?.check_out,
  );
  const createdAt =
    confirmDetails?.created_at ??
    (snapshot.created_at as string | undefined) ??
    (snapshot.createdAt as string | undefined) ??
    (snapshot.bookedOn as string | undefined) ??
    (snapshot.booked_on as string | undefined) ??
    (snapshot.paymentDate as string | undefined) ??
    (snapshot.payment_date as string | undefined);
  const checkIn =
    confirmDetails?.check_in ??
    (snapshot.checkIn as string | undefined) ??
    (snapshot.check_in as string | undefined);
  const checkOut =
    confirmDetails?.check_out ??
    (snapshot.checkOut as string | undefined) ??
    (snapshot.check_out as string | undefined);
  return (
    <section className="rounded-2xl border border-[#dfe7f0] bg-white p-5 shadow-[0_10px_30px_rgba(16,42,67,0.05)] sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#023E8A]">Booking overview</p><h2 className="mt-1 text-xl font-semibold text-[#18202b]">Confirmation details</h2></div>
        <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold capitalize text-[#023E8A]">{getBookingLifecycleLabel(bookingState)}</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Info label="Confirmation number" value={confirmDetails?.reference ?? confirmDetails?.booking_reference ?? "N/A"} />
        <Info label="Booked on" value={formatDate(createdAt)} />
        <Info label="Check-in" value={formatDate(checkIn)} />
        <Info label="Check-out" value={formatDate(checkOut)} />
        <Info label="Payment state" value={confirmDetails?.payment_state ?? "N/A"} />
        <Info label="Payment status" value={confirmDetails?.payment_status || "N/A"} tone={getStatusColor(confirmDetails?.payment_status?.toUpperCase())} />
      </div>
    </section>
  );
};

const Info = ({ label, value, tone }: { label: string; value: string; tone?: string }) => (
  <div className="rounded-xl border border-[#e7edf5] bg-[#fbfcfe] px-4 py-3"><p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#7b8491]">{label}</p><p className={`mt-1 break-words text-sm font-semibold ${tone || "text-[#18202b]"}`}>{value}</p></div>
);

export default ConfirmationDetails;
