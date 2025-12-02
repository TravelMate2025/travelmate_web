import { BookingDetailsVerifyData } from "../../types";

type props = {
  getStatusColor: (data?: string) => string;
  confirmDetails?: BookingDetailsVerifyData;
};
const ConfirmationDetails = ({ getStatusColor, confirmDetails }: props) => {
  return (
    <div className="bg-white">
      <h2 className="text-lg font-semibold mb-2 text-left">
        Confirmation Details
      </h2>
      <div className="space-y-3 rounded-lg sm:p-6 sm:border border-gray-300">
        <p className="flex justify-between">
          <span className="font-medium">Confirmation Number</span>{" "}
          {confirmDetails?.reference}
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Hotel Code</span>{confirmDetails?.hotel_code}
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Payment Status</span>{" "}
          <span
            className={`${getStatusColor(
              confirmDetails?.payment_status
            )} font-semibold capitalize`}
          >
            {confirmDetails?.payment_status}
          </span>
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Booked on</span>{" "}
          {confirmDetails?.created_at
            ? new Date(confirmDetails?.created_at).toDateString()
            : "N/A"}
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Check-In Date</span>{" "}
          {confirmDetails?.check_in
            ? new Date(confirmDetails?.check_in).toDateString()
            : "N/A"}
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Check-Out Date</span>
          {confirmDetails?.check_out
            ? new Date(confirmDetails.check_out).toDateString()
            : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ConfirmationDetails;
