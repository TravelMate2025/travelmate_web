import { X } from "lucide-react";
import React from "react";

type Props = {
  closeDialog: () => void;
};
const Complete = ({ closeDialog }: Props) => {
  return (
      <div className="min-w-screen min-h-screen p-8 rounded-lg bg-white shadow-2xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  block z-[99] mt-12 ">
        <div className="flex justify-normal items-center gap-24 my-5 w-full">
          <div className=" p-[8px]  bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] ">
            <X onClick={closeDialog} className="font-bold " />
          </div>
          <h1 className="font-bold text-xl lg:text-2xl text-[#181818] text-center">
            Important Information
          </h1>
          </div>
          <ul className="list-disc pl-4 flex flex-col gap-2">
            <li>
              Your driver will wait up to 60 minutes after your taxi arrives
            </li>
            <li>You’ll get pickup instructions in your confirmation email.</li>
            <li>Your driver will hold a sign with your name - look for this at your terminal's designated meeting point</li>
          </ul>
        
      </div>
  );
};

export default Complete;
