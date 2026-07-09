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
    <div className="bg-white">
      <h2 className="text-lg font-semibold mb-2 text-left">
        Confirmation Details
      </h2>
      <div className="space-y-3 rounded-lg sm:p-6 sm:border border-gray-300">
        <p className="flex justify-between">
          <span className="font-medium">Confirmation Number</span>{" "}
          {confirmDetails?.reference ?? confirmDetails?.booking_reference ?? "N/A"}
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Booking State</span>{" "}
          <span className="font-semibold uppercase">
            {getBookingLifecycleLabel(bookingState)}
          </span>
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Payment State</span>{" "}
          <span className="font-semibold uppercase">
            {confirmDetails?.payment_state ?? "N/A"}
          </span>
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Payment Status</span>{" "}
          <span
            className={`${getStatusColor(
              confirmDetails?.payment_status?.toUpperCase()
            )} font-semibold uppercase`}
          >
            {confirmDetails?.payment_status || "N/A"}
          </span>
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Booked on</span>{" "}
          {formatDate(createdAt)}
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Check-In Date</span>{" "}
          {formatDate(checkIn)}
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Check-Out Date</span>
          {formatDate(checkOut)}
        </p>
      </div>
    </div>
  );
};

export default ConfirmationDetails;
