import React from "react";
import { useFetchFlightDetailsQuery } from "../api/flightApi";
import { FlightOffer } from "../types";
import Line2 from "../../../assets/Line4.svg";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { getCity } from "../utils/functions";
const FlightDetails = ({
  flight,
  segment,
}: {
  flight: FlightOffer;
  segment: number;
}) => {
  const itinerary = flight.itineraries[segment];
  const location = useLocation()
  console.log(location.state);
  
  return (
    <>
      {itinerary.segments.map((seg, i) => {
        const depTime = dayjs(seg.departure.at).format("h:mm A");
        const arrTime = dayjs(seg.arrival.at).format("h:mm A");

        return (
          <div key={i} className="space-y-5">
            <p className="font-medium">
              Flight {i + 1} – {getCity(seg.departure.iataCode)?.municipality}(
              {seg.departure.iataCode}) to{" "}
              {getCity(seg.arrival.iataCode)?.municipality} (
              {seg.arrival.iataCode})
            </p>
            <p className="text-[#4E4F52] text-[1.07rem]">{seg.airline.name}</p>

            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold">{depTime}</p>
                <p className="text-[#67696D]">
                  {" "}
                  {getCity(seg.departure.iataCode)?.municipality} (
                  {seg.departure.iataCode})
                </p>
              </div>
              <img src={Line2} alt="line" />
              <div>
                <p className="font-semibold">{arrTime}</p>
                <p className="text-[#67696D]">
                  {" "}
                  {getCity(seg.arrival.iataCode)?.municipality} (
                  {seg.arrival.iataCode})
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="text-[#4E4F52]">Flight Number</p>
                <p className="text-[#181818] text-[18px]">
                  {seg.carrierCode} {seg.number}
                </p>
              </div>
              <div>
                <p className="text-[#4E4F52]">Duration</p>
                <p className="text-[#181818] text-[18px]">
                  {seg.duration.replace("PT", "").toLowerCase()}
                </p>
              </div>
              <div>
                <p className="text-[#4E4F52]">Class</p>
                <p className="text-[#181818] text-[18px]">
                  {flight.travelerPricings?.[0]?.fareDetailsBySegment?.find(
                    (f) => f.segmentId === seg.id
                  )?.cabin ?? "Economy"}
                </p>
              </div>
              <div>
                <p className="text-[#4E4F52]">Aircraft Type</p>
                <p className="text-[#181818] text-[18px]">
                  {seg.aircraft?.code ?? "N/A"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[#4E4F52]">Departs From</p>
              <p className="text-[#181818] text-[18px]">
                {getCity(seg.departure.iataCode)?.municipality} (
                {seg.departure.iataCode})
              </p>
            </div>
            <div>
              <p className="text-[#4E4F52]">Arrives At</p>
              <p className="text-[#181818] text-[18px]">
                {getCity(seg.arrival.iataCode)?.municipality} ({seg.arrival.iataCode})
              </p>
            </div>

            {/* Show layover if not last segment */}
            {i < itinerary.segments.length - 1 && (
              <div className="border-y border-[#CDCED1] py-2">
                <p className="text-[#4E4F52]">Layover Information</p>
                <p className="text-[#181818] text-[18px]">
                  {dayjs(itinerary.segments[i + 1].departure.at).diff(
                    dayjs(seg.arrival.at),
                    "hour"
                  )}
                  h{" "}
                  {dayjs(itinerary.segments[i + 1].departure.at).diff(
                    dayjs(seg.arrival.at),
                    "minute"
                  ) % 60}
                  m layover in {getCity(seg.arrival.iataCode)?.municipality}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default FlightDetails;
