import { X } from "lucide-react";

type Props = {
  closeDialog: () => void;
  car: any;
};
const Complete = ({ closeDialog, car }: Props) => {
  return (
    <div className="min-w-screen min-h-screen fixed top-0 left-0 z-[99] flex items-center justify-center bg-black bg-opacity-30">
      <div
        className="rounded-lg bg-white shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 mt-12"
        style={{ boxSizing: "border-box" }}
      >
        <div className="flex justify-normal items-center lg:gap-24 gap-6 my-5 w-full">
          <div className="p-[8px] bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px]">
            <X onClick={closeDialog} className="font-bold cursor-pointer" />
          </div>
          <h1 className="font-bold text-xl lg:text-2xl text-[#181818] text-center">
            Important Information
          </h1>
        </div>
        {car?.content?.transferRemarks?.[0]?.description && (
          <pre className="mt-4 whitespace-pre-wrap text-sm font-serif">
            {car.content.transferRemarks[0].description}
          </pre>
        )}
      </div>
    </div>
  );
};

export default Complete;
