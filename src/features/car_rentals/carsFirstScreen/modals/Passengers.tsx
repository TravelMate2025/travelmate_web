"use client";
import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";

type PassengerProps = {
  openPassengerModal: boolean;
  closeModal: () => void;
  initialValues: {
    adults: number;
    children: number;
    infant: number;
  };
  handlePassengersUpdate: (values: {
    adults: number;
    children: number;
    infant: number;
  }) => void;
};

const Passengers = ({
  closeModal,
  initialValues,
  handlePassengersUpdate,
}: PassengerProps) => {
  const [localPassengers, setLocalPassengers] = useState(initialValues);

  const handleChange = (
    type: "adults" | "children" | "infant",
    increment: boolean
  ) => {
    setLocalPassengers((prev) => {
      const updatedValue = increment
        ? prev[type] + 1
        : Math.max(0, prev[type] - 1);
      return { ...prev, [type]: updatedValue };
    });
  };

  const handleDone = () => {
    handlePassengersUpdate(localPassengers);
    closeModal();
  };

  return (
    <div className="inset-0 fixed z-50">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={closeModal} />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full lg:h-auto lg:w-auto lg:min-w-sm lg:max-w-sm bg-white lg:rounded-lg shadow-2xl z-[99] flex flex-col mt-6 lg:mt-0">
        <div className="p-6 pb-0">
          <div className="lg:hidden pt-12 pb-8">
            <div className="absolute left-6 p-2 size-10 bg-white lg:border-[0.5px] lg:border-[#EBECED] shadow-md rounded-sm cursor-pointer">
              <X onClick={closeModal} className="font-bold" />
            </div>
            <h2 className="text-lg font-bold text-center lg:hidden block">
              Passengers
            </h2>
          </div>
          <h2 className="border-b-1 border-b-gray-200 text-center lg:block hidden font-bold pb-4">
            Passengers
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto px-6">
          {["adults", "children", "infant"].map((type) => (
            <div
              key={type}
              className="flex justify-between items-center w-full gap-12 border-b-1 border-b-gray-200 py-2"
            >
              <div>
                <h3 className="lg:font-semibold capitalize">{type}</h3>
                <p>
                  {type === "adults"
                    ? "Ages 16 and above"
                    : type === "children"
                    ? "Ages 3 - 15"
                    : "Ages 0 - 2"}
                </p>
              </div>
              <div className="flex justify-center items-center gap-3 border-1 border-[#023E8A] rounded-md px-3">
                <Minus
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => handleChange(type as any, false)}
                />
                <p>{localPassengers[type as keyof typeof localPassengers]}</p>
                <Plus
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => handleChange(type as any, true)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 pt-3 mb-12 lg:mb-0">
          <button
            className="bg-[#023E8A] rounded-lg lg:p-2 p-3 w-full text-white cursor-pointer"
            onClick={handleDone}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Passengers;