import type { CarTransferOption } from "../types/booking";
import { X } from "lucide-react";

type Props = {
  closeDialog: () => void;
  car?: CarTransferOption;
};
const Complete = ({ closeDialog, car }: Props) => {
  const remarks = (car?.content?.transferRemarks ?? [])
    .map((remark) => remark.description?.trim())
    .filter((remark): remark is string => Boolean(remark));

  return (
    <div className="min-w-screen min-h-screen fixed top-0 left-0 z-[99] flex items-center justify-center bg-black bg-opacity-30">
      <div
        className="rounded-lg bg-white shadow-2xl w-full max-w-2xl lg:max-h-[90vh] max-h-screen overflow-y-auto p-8 mt-12"
        style={{ boxSizing: "border-box" }}
      >
        <div className="flex justify-normal items-center lg:gap-24 gap-6 my-5 w-full">
          <div className="p-[8px] bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px]">
            <X onClick={closeDialog} className="font-bold cursor-pointer" />
          </div>
          <h1 className="font-bold text-xl lg:text-2xl text-[#181818] text-center">
            Transfer information
          </h1>
        </div>
        <ul className="mt-4 list-disc pl-5 space-y-2 text-sm font-inter">
          <li>Your driver will wait up to 60 minutes after your taxi arrives.</li>
          <li>You'll get pickup instructions in your confirmation email.</li>
          {remarks.map((remark, index) => <li key={`${index}-${remark}`}>{remark}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default Complete;
