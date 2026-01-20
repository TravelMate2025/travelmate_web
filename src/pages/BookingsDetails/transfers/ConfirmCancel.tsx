import carImage from "../../../assets/carImage.png";
import { Loader } from "lucide-react";
import { useState } from "react";
import { TransfersDetailsResponse } from "./type";
type props = {
  bookings: TransfersDetailsResponse | undefined;
  closeModal: () => void;
  handleCancel: (
    data: string | undefined,
    load: boolean,
    reason: string
  ) => void;
  loadCancel: boolean;
};
const ConfirmCancel = ({
  bookings,
  closeModal,
  handleCancel,
  loadCancel,
}: props) => {

  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 pb-3">
          <h2 className="text-lg font-semibold text-gray-900 text-center">
            Cancel Booking
          </h2>
          <button className="text-gray-500 hover:text-gray-700 text-xl" onClick={closeModal}>
            &times;
          </button>
        </div>

        {/* Hotel Info */}
        <div className="flex items-start gap-4">
          <img
            src={carImage}
            alt="Hotel"
            className="w-24 h-20 rounded-md object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-800">
              {bookings?.transfers[0].category.name}{" "}
              {bookings?.transfers[0].vehicle.name}
            </h3>
            <p className="text-gray-500 text-sm">
              {bookings?.transfers[0].pickupInformation.date &&
                new Date(
                  bookings?.transfers[0].pickupInformation.date
                ).toDateString()}{" "}
            </p>
            <p className="text-gray-800 font-medium text-sm">
              €{bookings?.totalAmount || "-----"}
            </p>
          </div>
        </div>

        {/* Refund Info */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Refunds & Cancellation
          </h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            <li>
              Fully refundable before{" "}
              {bookings?.transfers[0].cancellationPolicies[0].from}
            </li>
            <li>
              Cancellations after 11:59 on{" "}
              {bookings?.transfers[0].cancellationPolicies[0].from} or no-shows
              are subject to fee equal to 100% of amount paid.
            </li>
          </ul>
        </div>

        {/* Reason */}
        <div className="space-y-3">
          <p className="text-gray-900 font-semibold">Reason for Cancellation</p>
          <p className="text-sm text-gray-500">
            Please select a reason for cancellation
          </p>

          <div className="space-y-3">
            {[
              "Change in travel plans/dates",
              "Health/medical issues",
              "Booking was made by mistake",
              "I found an alternative option",
              "None of the Above",
            ].map((item) => (
              <label
                key={item}
                className="flex items-center gap-3 cursor-pointer text-sm text-gray-700"
              >
                <input
                  type="radio"
                  name="reason"
                  className="h-4 w-4"
                  value={item}
                  checked={reason === item}
                  onChange={(e) => {
                    setReason(e.target.value);
                  }}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            className="px-4 py-2 rounded-lg border border-[#023E8A] text-[#023E8A] text-sm md:text-base"
            onClick={closeModal}
          >
            Keep Booking
          </button>

          <button
            className="px-4 flex items-center gap-2 py-2 rounded-lg  bg-[#023E8A] text-white disabled:bg-gray-300 disabled:cursor-not-allowed text-sm md:text-base"
            onClick={() =>
              handleCancel(bookings?.reference, loadCancel, reason)
            }
            disabled={loadCancel}
          >
            Confirm Cancellation
            {loadCancel && <Loader className="animate-spin" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCancel;
