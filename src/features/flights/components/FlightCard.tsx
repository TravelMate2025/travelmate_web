// components/FlightCard.jsx
import { Divider, } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
// types/flight.ts
export interface Flight {
  id: string;
  planeName: string;
  class: string;
  spaceleft: string;
  image: string;
  line: string;
  timefrom: string;
  timeto: string;
  placefrom: string;
  placeto: string;
  duration: string;
  non: string;
  refundable: string;
  price: string;
  tax: string;
}

interface FlightCardProps {
  depart: Flight;
  onClick?: () => void;
}
export default function FlightCard({ depart, onClick }:FlightCardProps) {
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div
        className="w-full flex flex-col font-inter border mb-4 border-[#809EC4] min-h-[280px] 
        rounded-[7px] p-[16px] group-hover:bg-[#CCD8E81A] group-hover:border-[#023E8A] 
        group-hover:border-[1px] transition-all duration-300"
      >
        {/* Airline & Class */}
        <div className="flex gap-3 justify-between">
          <div className="flex gap-2">
            <div className="border p-[3px] border-[#DEDFE1] bg-white h-[40px] w-[40px] rounded-lg">
              <img src={depart.image} alt="Airline logo" />
            </div>
            <p className="mt-2">{depart.planeName}</p>
          </div>
          <div className="flex gap-[4px]">
            <p className="text-[#D72638]">{depart.spaceleft}</p>
            <CircleIcon
              className="text-[#4E4F52]"
              sx={{ width: 4, height: 4 }}
            />
            <div>{depart.class}</div>
          </div>
        </div>

        {/* Route Info */}
        <div className="flex justify-center items-center gap-6">
          <div>
            <p className="text-black">{depart.timefrom}</p>
            <p className="text-[#4E4F52]">{depart.placefrom}</p>
          </div>
          <img src={depart.line} alt="" />
          <div>
            <p className="text-center text-black">{depart.timeto}</p>
            <p className="text-[#4E4F52]">{depart.placeto}</p>
          </div>
        </div>

        {/* Duration */}
        <div className="space-x-1 py-2">
          <span>{depart.duration}</span>
          <CircleIcon sx={{ width: 4, height: 4, color: "#4E4F52" }} />
          <span>{depart.non}</span>
        </div>
        <Divider />

        {/* Price & Refund */}
        <div className="flex justify-between items-center flex-1">
          <p>{depart.refundable}</p>
          <div className="flex flex-col items-end">
            <p>{depart.price}</p>
            <p className="text-[#4E4F52]">Round trip per passenger</p>
            <p className="text-[#4E4F52]">{depart.tax}</p>
          </div>
        </div>
      </div>
    </div>
  );
}









