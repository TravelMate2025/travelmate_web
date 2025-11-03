import { X } from "lucide-react";
import { MdInfoOutline } from "react-icons/md";
import { Rate, Room } from "../../types";
import { useState } from "react";

interface OptionsProps {
  closeDialog: () => void;
  rooms: Room[];
  roomId: string | null;
  onRateSelect: (data: Rate) => void;
}
const SelectOptions = ({
  closeDialog,
  rooms,
  roomId,
  onRateSelect,
}: OptionsProps) => {
  const availableRooomsRate = rooms?.find((item) => item?.code === roomId);
  console.log(availableRooomsRate?.rates);
  const [selectedRateKey, setSelectedRateKey] = useState<
    string | null | undefined
  >(
    availableRooomsRate?.rates
      ? availableRooomsRate.rates[0]?.rateKey ?? null
      : null
  );
  const handleSelect = () => {
    if (selectedRateKey) {
      // Find the full rate object corresponding to the selected key
      const selectedRate = availableRooomsRate?.rates?.find(
        (rate) => rate.rateKey === selectedRateKey
      );

      if (selectedRate) {
        // Pass the complete selected rate object back to the parent
        onRateSelect(selectedRate);
        closeDialog();
      }
    }
  };
  const isButtonEnabled = !!selectedRateKey;

  // Handle case where no room ID or no rates are found
  if (!roomId || availableRooomsRate?.rates.length === 0) {
    return (
      <div className="inset-0 fixed z-50">
        <div className="fixed inset-0 bg-black/20" onClick={closeDialog} />
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-10 bg-white rounded-lg shadow-2xl z-[99] text-center">
          <p className="font-semibold">No rates available for this room.</p>
          <button
            onClick={closeDialog}
            className="mt-4 bg-[#023E8A] text-white py-2 px-4 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="inset-0 fixed z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20" onClick={closeDialog} />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
      w-full h-full lg:h-[450px] lg:w-[500px] bg-white lg:rounded-lg shadow-2xl z-[99] 
      flex flex-col mt-6 lg:mt-0"
      >
        {/* Header */}
        <div className="lg:p-6 pb-3 lg:border-b border-b-gray-300 flex-shrink-0">
          <div className="relative lg:hidden pt-12 pb-5 border-b border-gray-200">
            <h2 className="text-lg font-bold text-center">More Options</h2>
            <div
              className="p-2 size-10 absolute right-6 bottom-5 bg-white shadow-md rounded-sm cursor-pointer"
              onClick={closeDialog}
            >
              <X className="font-bold" />
            </div>
          </div>
          <div className="relative lg:flex hidden items-center pl-2">
            <h2 className="flex-grow text-center font-bold">More Options</h2>
            <div
              className="p-2 size-10 bg-white lg:border-[0.5px] border-[#EBECED] shadow-md rounded-sm cursor-pointer"
              onClick={closeDialog}
            >
              <X className="font-bold" />
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto">
          <div className="px-4 py-3 flex flex-row items-start sm:items-center gap-3 w-full border-b border-b-gray-300 text-xs">
            <div className="pt-1">
              <MdInfoOutline className="text-lg sm:text-xl" />
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Prices below are per night
            </p>
          </div>

          {availableRooomsRate?.rates.map((option) => (
            <div
              key={option.rateKey}
              className="flex justify-between items-start w-full px-6 py-4 cursor-pointer hover:bg-gray-100 border-b border-b-gray-300"
            >
              <div className="flex gap-4 items-start">
                <input
                  type="radio"
                  className="size-5 accent-[#023E8A]"
                  name="roomOption"
                  id={option.rateKey}
                  value={option.rateKey}
                  checked={selectedRateKey === option.rateKey}
                  onChange={() => {
                    setSelectedRateKey(option?.rateKey);
                  }}
                />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">{option.boardName}</p>
                  <p className="text-sm text-[#181818]">
                    {option.paymentType === "AT_WEB"
                      ? "Pay Now"
                      : "Book Now, Pay at Property"}
                  </p>
                  <p className="text-sm text-[#181818]">Includes Breakfast</p>
                  {option?.cancellationPolicies?.[0]?.from ? (
                    <p className="text-sm text-[#181818]">
                      Free Cancellation until{" "}
                      {new Date(
                        option.cancellationPolicies[0].from
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  ) : (
                    <p className="text-sm text-[#181818]">
                      No free cancellation
                    </p>
                  )}
                </div>
              </div>

              <p className="font-bold">${option.price_with_commission}</p>
            </div>
          ))}
        </div>

        {/* Sticky Button at Bottom */}
        <div className=" bg-white p-4 flex-shrink-0 my-6">
          <button
            className="w-full bg-[#023E8A] text-white py-2 rounded-lg hover:bg-[#023E9E] transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
            onClick={handleSelect}
            disabled={!isButtonEnabled}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectOptions;
