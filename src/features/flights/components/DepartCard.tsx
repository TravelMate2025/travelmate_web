import React from "react";
import Divider from "@mui/material/Divider";
import CircleIcon from "@mui/icons-material/Circle";
import { FlightOffer } from "../types";

interface DepartCardProps {
  depart: FlightOffer;
  onClick: (depart: FlightOffer) => void;
  segment?:number
}

function formatDuration(duration: string): string {
  // Example input: "PT4H15M"
  const hoursMatch = duration.match(/(\d+)H/);
  const minutesMatch = duration.match(/(\d+)M/);

  const hours = hoursMatch ? `${hoursMatch[1]}h` : "";
  const minutes = minutesMatch ? ` ${minutesMatch[1]}m` : "";

  return `${hours}${minutes}`.trim();
}
import Line from "../../../assets/arrow.svg";
import Line2 from "../../../assets/arrow2dots.svg";


import { getCity } from "../utils/functions";
const DepartCard: React.FC<DepartCardProps> = ({ depart, onClick , segment = 0}) => {
  // Example: Get first itinerary and its first + last segment
  const firstItinerary = depart.itineraries[segment];
  const firstSegment = firstItinerary.segments[0];
  const lastSegment =
    firstItinerary.segments[firstItinerary.segments.length - 1];



  

  return (
    <div key={depart.id} className="group" onClick={() => onClick(depart)}>
      <div
        className="w-full flex flex-col font-inter border mb-4 border-[#809EC4] min-h-[280px] rounded-[7px] pt-[16px] px-[16px] 
        group-hover:bg-[#CCD8E81A] group-hover:border-[#023E8A] group-hover:border-[1px] transition-all duration-300"
      >
        {/* Top Section */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <div className="border p-[3px] border-[#DEDFE1] bg-white h-[40px] w-[40px] rounded-lg flex items-center justify-center">
              {/* Airline code as placeholder since no image in JSON */}
              <span className="font-bold">{firstSegment.carrierCode}</span>
            </div>
            <div>
              <p className="font-medium">{firstSegment.airline.name}</p>
              <p className="text-sm text-gray-500">
                {firstSegment.airline.code}
              </p>
            </div>
          </div>
          <div className="flex gap-[4px] items-center text-sm">
            <p className="text-[#D72638]">
              {depart.numberOfBookableSeats} seats left
            </p>
            <CircleIcon
              sx={{ width: "4px", height: "4px" }}
              className="text-[#4E4F52]"
            />
            <span>{depart.pricingOptions.fareType[0]}</span>
          </div>
        </div>

        {/* Flight Times */}
        <div>
          <div className="flex justify-center items-center gap-6 py-3">
            <div className="text-center">
              <p className="text-black font-semibold">
                {/* {new Date(firstSegment.departure.at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })} */}

                {new Intl.DateTimeFormat("en-Us", {hour:"2-digit", minute:"2-digit"}).format(
                  new Date(firstSegment.departure.at)
                )}
              </p>
              <p className="text-[#4E4F52]">
                {/* {firstSegment.departure.terminal} */}
                {getCity(firstSegment.departure.iataCode)?.municipality} (
                {firstSegment.departure.iataCode})
              </p>
            </div>

            <div className="flex flex-col items-center">
              <img
                src={firstItinerary.segments.length > 1 ? Line2 : Line}
                alt=""
              />
            </div>

            <div className="text-center">
              <p className="text-black font-semibold">
                {new Date(lastSegment.arrival.at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-[#4E4F52]">
                {" "}
                {getCity(lastSegment.arrival.iataCode)?.municipality} (
                {lastSegment.arrival.iataCode})
              </p>
            </div>
          </div>

          <div className="space-x-2 text-[#4E4F52]">
            <span className="text-sm">
              {formatDuration(firstItinerary.duration)}
            </span>
            <CircleIcon sx={{ width: 7 }} />

            <span className="text-sm">
              {firstItinerary.segments.length <= 1
                ? "Non-stop"
                : `${firstItinerary.segments.length - 1} stop(s)`}
            </span>
          </div>
        </div>

        <Divider />

        {/* Price Section */}
        <div className="flex justify-between items-center py-3">
          <div className="font-semibold text-sm">
            <p>{depart.travelerPricings[0].fareOption}</p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-lg font-bold">
              {depart.price.currency}{" "}
              {Number(depart.price.totalWithFee).toLocaleString()}
            </p>
            <p className="text-[#4E4F52] text-sm">Round trip per passenger</p>
            <p className="text-[#4E4F52] text-sm">including taxes and fees</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartCard;
