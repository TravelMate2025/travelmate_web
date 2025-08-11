"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Minus, Plus } from "lucide-react";

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
  openPassengerModal,
  closeModal,
  initialValues,
  handlePassengersUpdate,
}: PassengerProps) => {
  const [localPassengers, setLocalPassengers] = useState(initialValues);

  const handleChange = (type: "adults" | "children" | "infant", increment: boolean) => {
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
    <Dialog
      className="lg:min-w-md"
      open={openPassengerModal}
      onClose={closeModal}
      keepMounted
      sx={{
        "& .MuiBackdrop-root": { backgroundColor: "rgba(0, 0, 0, 0.3)" },
        "& .MuiPaper-root": {
          backgroundColor: "white",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle className="border-b-1 border-b-gray-200 text-center">
        Passengers
      </DialogTitle>
      <DialogContent>
        {["adults", "children", "infant"].map((type) => (
          <div
            key={type}
            className="flex justify-between items-center w-full gap-12 border-b-1 border-b-gray-200 py-2"
          >
            <div>
              <h3 className="font-semibold capitalize">{type}</h3>
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
        <button
          className="bg-[#023E8A] rounded-lg p-2 w-full text-white mt-3 cursor-pointer"
          onClick={handleDone}
        >
          Done
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default Passengers;
