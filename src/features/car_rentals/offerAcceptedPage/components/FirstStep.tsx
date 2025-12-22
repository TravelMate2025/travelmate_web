import { Divider } from "@mui/material";
import { ChevronRight, Dot } from "lucide-react";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import carImage from "../../../../assets/carImage.png";

type props = {
  car: any;
  departureInfo: any;
  setShowAllModal:(data:boolean)=> void
};
const FirstStep = ({ car, departureInfo, setShowAllModal }: props) => {
  const addDurationToTime = (pickupTime: string, durationStr: string) => {
    const [h, m] = pickupTime.split(":").map(Number);
    let totalMin = h * 60 + m;

    // Try to extract hours and minutes if specified
    const hourMatch = durationStr?.match(/(\d+)\s*hour(s)?/i);
    const minMatch = durationStr?.match(/(\d+)\s*min/i);

    if (hourMatch) totalMin += parseInt(hourMatch[1]) * 60;
    if (minMatch) totalMin += parseInt(minMatch[1]);

    // If only a plain number is provided (like "35"), treat as minutes
    if (!hourMatch && !minMatch && !isNaN(Number(durationStr))) {
      totalMin += Number(durationStr);
    }

    const newH = Math.floor(totalMin / 60) % 24;
    const newM = totalMin % 60;

    return `${newH.toString().padStart(2, "0")}:${newM
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div>
      <div className="flex items-center gap-4 p-6">
        <img
          src={car?.content?.images[0]?.url || carImage}
          alt=""
          className="w-28 h-28 p-2 object-contain bg-[#0000001A] rounded-lg"
        />
        <p className="text-[#67696D] text-[14px] ">
          {car?.vehicle.name} {car?.vehicle.code}
        </p>
      </div>

      <Divider
        sx={{ marginTop: "8px", marginBottom: "8px" }}
        className="lg:hidden"
      />

      <div className="mx-6  my-4 ">
        <p className="text-[16px] font-inter font-medium text-[#181818]">
          Trip Details
        </p>
        <div className="lg:border rounded-lg lg:p-5 mt-[10px] flex flex-col justify-normal items-start gap-4 border-[#CDCED1]">
          <div className="flex justify-normal gap-4 items-center">
            <div className="size-6 bg-[#023E8A] rounded-full" />
            <div>
              <p>{departureInfo.pickupLocaDescription}</p>
              <div className="flex items-center justify-normal gap-1 text-gray-500">
                <FaRegCalendarAlt />
                <p>{departureInfo.pickupDate}</p>
                <Dot fill="#4E4F52" />
                <FaRegClock />
                <p>{departureInfo.pickupTime}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-5 items-center ml-3">
            {" "}
            <div className="border-l-2 border-l-[#4E4F52] h-16" />{" "}
            <p className="text-[#4E4F52]">
              {car?.content?.transferDetailInfo[0]?.value}{" "}
              {car?.content?.transferDetailInfo[0]?.description}
            </p>{" "}
          </div>
          <div className="flex justify-normal gap-4 items-center">
            <div className="size-6 bg-[#D72638] rounded-full object-contain absolute" />
            <div className="relative left-10 text-wrap">
              <p>{departureInfo.dropoffLocation}</p>
              <div className="flex items-center justify-normal gap-1 text-gray-500 pt-3">
                <FaRegCalendarAlt />
                <p>{departureInfo.pickupDate}</p>
                <Dot fill="#4E4F52" />
                <FaRegClock />

                <p>
                  {addDurationToTime(
                    departureInfo.pickupTime,
                    car?.content?.transferDetailInfo[0]?.value
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Divider
        sx={{ marginTop: "8px", marginBottom: "8px" }}
        className="lg:hidden"
      />

      <div className="lg:px-6 px-3">
        <p className="text-[16px] font-inter font-medium text-[#181818] pl-3 lg:pl-0">
          Taxi Details
        </p>

        <div className="flex flex-col gap-2 items-center  mt-[10px] lg:border rounded-lg p-5 border-[#CDCED1]">
          <div className="flex justify-between items-center w-full">
            <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
              Type
            </p>

            <p className="text-[#181818] text-sm font-inter">
              {car?.category.name} Car
            </p>
          </div>

          <div className="flex justify-between w-full items-center">
            <p className="text-sm font-inter font-normal text-[#4E4F52]">
              Seats
            </p>

            <p className="text-sm text-[#181818]">
              {car?.maxPaxCapacity ||
                car?.content?.transferDetailInfo[2]?.description}{" "}
              {car?.maxPaxCapacity && `Seats`}
            </p>
          </div>

          <div className="flex justify-between items-start w-full text-right">
            <p className="text-sm font-inter font-normal text-[#4E4F52]">
              Bags
            </p>
            <p className="text-[#181818] text-sm font-inter">
              {car?.content?.transferDetailInfo[3]?.value}{" "}
              {car?.content?.transferDetailInfo[3]?.description}
            </p>
          </div>

          <div className="flex justify-between items-center w-full">
            <p className="text-sm font-inter font-normal text-[#4E4F52]">
              Provider
            </p>

            <p className="text-[#181818] text-[14px] font-inter">
              {car?.supplier || "Not Available"}
            </p>
          </div>
        </div>
      </div>
      <Divider
        sx={{ marginTop: "8px", marginBottom: "8px" }}
        className="lg:hidden"
      />

      <div className="lg:px-6 px-3">
        <p className="text-[16px] font-inter font-medium text-[#181818] pt-4 pl-3 lg:pl-0">
          Price Summary
        </p>
        <div className="flex  justify-between w-full itmes-center lg:border rounded-lg p-5 mt-[10px border-[#CDCED1]]">
          <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
            Total
          </p>

          <p className="text-[#181818] text-[14px] font-bold font-inter">
            {" "}
            €{car?.price?.totalAmountWithFee}
          </p>
        </div>
      </div>

      <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} />
      <div className="lg:px-6 px-3">
        <div className="flex w-full justify-between items-center p-4 pl-3 lg:pl-0">
          <p className="text-[16px] font-inter font-bold text-[#181818]">
            Important information
          </p>
          <div
            className="flex gap-1 items-center text-[#023E8A]"
            onClick={() => setShowAllModal(true)}
          >
            <p>Show all</p>
            <ChevronRight />
          </div>
        </div>
        <div className="lg:border rounded-lg lg:p-5 p-3 lg:mt-2 border-[#CDCED1]">
          <ul className="list-disc pl-4 flex flex-col gap-2">
            <li>
              Your driver will wait up to 60 minutes after your taxi arrives
            </li>
            <li>You’ll get pickup instructions in your confirmation email.</li>
          </ul>
        </div>
      </div>
      <Divider
        sx={{ marginTop: "8px", marginBottom: "8px" }}
        className="lg:hidden"
      />
      <div className="lg:px-6 px-3">
        <p className="text-[16px] font-inter font-bold text-[#181818] lg:p-4 p-3 lg:pl-0">
          Refunds and Cancellations
        </p>
        <div className="lg:border rounded-lg lg:p-5 p-3 lg:mt-2 border-[#CDCED1]">
          <ul className="list-disc pl-4 flex flex-col gap-2">
            <li>Cancellations allowed 24 hours before pick Up</li>
            <li>Full refund if cancelled 24 hours before pick up</li>
          </ul>
        </div>
      </div>

      <Divider sx={{ marginTop: "60px", marginBottom: "20px" }} />
    </div>
  );
};

export default FirstStep;
