
import { Link, useLocation } from "react-router-dom";
import Divider from "@mui/material/Divider";
import FlightClassOutlinedIcon from "@mui/icons-material/FlightClassOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
import AirlineSeatReclineExtraOutlinedIcon from "@mui/icons-material/AirlineSeatReclineExtraOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { Icon } from "@iconify/react";
import planelogo from "../../../../assets/plane.svg"; // adjust path

import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import {
  Fee,
  FlightOffer,
  UpsellFlightOffer,

} from "../../types";
import dayjs from "dayjs";
import { PassengerCounts } from "../../hooks/useFlightBooking";
import { useStepContext } from "./StepLayout";
import { getCity } from "../../utils/functions";
export interface LocationState {
  pathname: string;
  search: string;
  hash: string;
  key: string;
  state: FlightReviewState;
}

export interface FlightReviewState {
  from: string;
  to: string;
  departureDate: string;
  passengers: PassengerCounts;
  departureUpsell: {id?:string, total: number; upsell: UpsellFlightOffer };
  returnUpsell: { total: number; upsell: UpsellFlightOffer };
  flightClass: string;
  tripType: "one-way" | "round-trip" | "multi-city";
  departureFlight: FlightOffer;
  departureCounts: PassengerCounts;
  departureFlightOption: string;
  returnFlight: FlightOffer;
  returnCounts: PassengerCounts;
  returnFlightOption: string;
  multiCitySelections: { flight: FlightOffer; upsell: UpsellFlightOffer }[];
}
// ✅ Reusable flight info card
const FlightCard = ({
  title,
  flight,
  index = 0,
}: {
  title: string;
  flight: FlightOffer;
  index?: number;
}) => {
  const itinerary = flight.itineraries?.[index]; // if you want return, pass second itinerary
  const firstSegment = itinerary?.segments?.[0];
  const lastSegment = itinerary?.segments?.[itinerary.segments.length - 1];
  const carrierCode = firstSegment?.carrierCode;
  const flightNumber = firstSegment?.number;
  const departureTime = firstSegment?.departure?.at;
  const arrivalTime = lastSegment?.arrival?.at;
  const origin = firstSegment?.departure?.iataCode;
  const destination = lastSegment?.arrival?.iataCode;
  const duration = itinerary?.duration?.replace("PT", "").toLowerCase(); // e.g. "2h30m"

  // baggage info
  const includedBags =
    flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]
      ?.includedCheckedBags;
  const bagText =
    includedBags?.quantity !== undefined
      ? `${includedBags.quantity} Checked Bag${
          includedBags.quantity > 1 ? "s" : ""
        }`
      : "Baggage info unavailable";

  return (
    <div>
      <p className="text-[20px] font-inter text-[#181818]">{title}</p>
      <div className="border border-[#CDCED1] rounded-[10px] p-5 mt-5">
        <div className="flex flex-col gap-2">
          {/* Route + Change option */}
          <div className="flex justify-between">
            <p className="text-[#181818] text-[16px]">
              {getCity(origin)?.municipality}({origin}) to{" "}
              {getCity(destination)?.municipality}({destination})
            </p>
            <Link
              to={index === 0 ? "/flight/departure" : "/flight/return"}
              className="text-[#023E8A] text-[14px] cursor-pointer"
            >
              Change Flight
            </Link>
          </div>

          {/* Airline */}
          <div className="flex gap-1 items-start">
            <img src={planelogo} alt="plane" className="w-5" />
            <div>
              <p className="text-[#4E4F52] text-[18px] font-normal">
                {carrierCode}
              </p>
              <p className="text-sm text-[#4E4F52]">Flight #{flightNumber}</p>
            </div>
          </div>

          {/* Details */}
          <p className="text-[#67696D] text-[16px] flex items-center gap-1">
            <FlightClassOutlinedIcon sx={{ width: 16 }} />{" "}
            {flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin}
          </p>
          <p className="text-[#67696D] text-[16px] flex items-center gap-1">
            <CalendarMonthOutlinedIcon sx={{ width: 16 }} />{" "}
            {index === 1
              ? dayjs(arrivalTime).format("MMM DD, YYYY")
              : dayjs(departureTime).format("MMM DD, YYYY")}
          </p>
          <p className="text-[#67696D] text-[16px] flex items-center gap-1">
            <Icon icon="ic:round-access-time" width="16" height="16" />
            {dayjs(departureTime).format("h:mma")} -{" "}
            {dayjs(arrivalTime).format("h:mma")} ({duration})
          </p>
          <p className="text-[#67696D] text-[16px] flex items-center gap-1">
            <LuggageOutlinedIcon sx={{ width: 16 }} /> 1 Carry-on + {bagText}
          </p>
          <p className="text-[#67696D] text-[16px] flex items-center gap-1">
            <AirlineSeatReclineExtraOutlinedIcon sx={{ width: 16 }} />
            Seat selection not allowed
          </p>
          <p className="text-[#67696D] text-[16px] flex items-center gap-1">
            <CloseOutlinedIcon sx={{ width: 16 }} />
            Non Refundable
          </p>
        </div>
      </div>
    </div>
  );
};

// ✅ Price summary component
export const PriceSummary = ({
  confirm = false,
  nextStep,
  state,
  final
}: {
  confirm?: boolean;
    nextStep?: () => void;
    final?:boolean
  state?:FlightReviewState
}) => {



  let baseFare = 0;
  let taxes = 0;
  let airlineFees = 0;
  let serviceFee = 0;
  let currency = "EUR"; // Default fallback currency

  // Determine currency based on trip type
  if (state?.tripType === "multi-city" && state?.multiCitySelections?.length) {
    // Use the first valid flight's currency from multiCitySelections
    currency = state?.multiCitySelections[0]?.flight?.price?.currency || "EUR";

    // Filter out duplicate flights based on flight.id to avoid double-counting
    const uniqueSelections = state?.multiCitySelections.reduce(
      (acc, selection) => {
        if (
          !acc.some(
            (item: { flight: FlightOffer }) =>
              item.flight.id === selection.flight.id
          )
        ) {
          acc.push(selection);
        }
        return acc;
      },
      [] as { flight: FlightOffer }[]
    );

    uniqueSelections.forEach((selection) => {
    
      
      const price = selection.flight?.price;
      if (!price) return;

      baseFare += parseFloat(price.grandTotal || "0");
      taxes += parseFloat(price.totalWithFee.toString() || "0") - parseFloat(price.grandTotal || "0");
      airlineFees += (price.fees || []).reduce(
        (acc, fee: Fee) => acc + parseFloat(fee.amount || "0"),
        0
      );

      if (price.totalWithFee) {
        serviceFee +=
          parseFloat(price.totalWithFee.toString()) -
          parseFloat(price.grandTotal || "0");
      }
    });
  } else {
    const departure = state?.departureFlight?.price;
    // const _departureUpsell = state?.departureUpsell?.total || 0;
    const returnFlight = state?.returnFlight;
    // const _returnUpsell = state?.returnUpsell?.total || 0;


    // Use departure flight currency if available, else fallback
    currency = departure?.currency || returnFlight?.price.currency || "EUR";

    const prices = [departure].filter(Boolean);
    prices.forEach((price) => {
      if (!price) return;
      baseFare += parseFloat(price.grandTotal || "0");
      taxes +=0
       
      // airlineFees += (price.fees || []).reduce(
      //   (acc, fee: Fee) => acc + parseFloat(fee.amount || "0"),
      //   0
      // );

      if (price.totalWithFee) {
        serviceFee +=
          parseFloat(price.totalWithFee.toString()) -
          parseFloat(price.grandTotal || "0");
      }
      airlineFees = serviceFee + taxes 
    });
  }

  const total = baseFare + taxes + airlineFees + serviceFee;



  return (
    <div className=" flex flex-col">
      <p className="text-[20px] font-inter text-[#181818]">Price Summary</p>

      <div className="border border-[#CDCED1] rounded-[10px] p-5 mt-5">
        <div className="flex flex-col gap-1">
          {/* Base Fare */}
          <div className="flex justify-between items-center">
            <div className="grid ">
              <p className="text-[18px] font-inter text-[#4E4F52] capitalize">
                {state?.tripType.split("-").join(" ")}
              </p>
              <p className="text-[18px] font-inter text-[#4E4F52] capitalize">
                {(state?.passengers?.adults || 0) +
                  (state?.passengers?.children || 0) +
                  (state?.passengers?.infants || 0)}{" "}
                Passengers
              </p>
            </div>
            <p className="text-[#181818] text-[16px]">
              {currency} {baseFare.toLocaleString()}
            </p>
          </div>

          {/* Taxes & Surcharges */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[18px] font-inter text-[#4E4F52]">
                Taxes & Surcharges
              </p>
              <p className="text-[18px] font-inter text-[#4E4F52] capitalize">
                {(state?.passengers?.adults || 0) +
                  (state?.passengers?.children || 0) +
                  (state?.passengers?.infants || 0)}{" "}
                Passengers
              </p>
            </div>
            <p className="text-[#181818] text-[16px]">
              {currency} {airlineFees.toLocaleString()}
            </p>
          </div>

          {/* Airline Fees */}
          {airlineFees > 0 && (
            <div className="flex justify-between">
              <p className="text-[18px] font-inter text-[#4E4F52]">
                Airline Fees
              </p>
              <p className="text-[#181818] text-[16px]">
                {currency} {airlineFees.toLocaleString()}
              </p>
            </div>
          )}

          {/* Service Fee */}
          {serviceFee > 0 && (
            <div className="flex justify-between">
              <p className="text-[18px] font-inter text-[#4E4F52]">
                Service Fee
              </p>
              <p className="text-[#181818] text-[16px]">
                {currency} {serviceFee.toLocaleString()}
              </p>
            </div>
          )}

          <Divider sx={{ my: "12px" }} />

          {/* Total */}
          <div className="flex justify-between">
            <p className="text-[18px] font-inter">Total</p>
            <p className="text-[#023E8A] text-[18px] font-semibold">
              {currency} {total.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto max-md:mt-10">
        {confirm && (
          <FormControlLabel
            control={<Checkbox />}
            label={
              <Typography color="#67696D">
                I agree to the{" "}
                <span className="text-[#023E8A]">booking conditions,</span>{" "}
                <span className="text-[#023E8A]">
                  TravelMate terms and conditions
                </span>{" "}
                and <span className="text-[#023E8A]">Privacy Policy.</span>
              </Typography>
            }
            sx={{ mb: 3 }}
          />
        )}

        {final && (
          <div className=" my-[16px]">
            <div>
              <p className="text-[20px] font-medium text-[#181818] mb-[16px]">
                Contacts
              </p>
            </div>

            <div>
              <div className="md:border border-[#CDCED1]  md:p-[24px] rounded-[12px]">
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <LocalPhoneOutlinedIcon />
                    <p className="text-[#4E4F52] md:text-lg text-sm">
                      Customer Support
                    </p>
                  </div>
                  <p className="text-[#181818] md:text-lg text-sm">
                    +234 800 123 4567
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        <button
          className="w-full mt-auto text-white h-[56px] rounded-[6px] bg-[#023E8A] cursor-pointer"
          onClick={nextStep}
        >
          {final ? "Back to Home" : "  Continue"}
        </button>
      </div>
    </div>
  );
};
// ✅ Main Step1
const Step1 = () => {
  const { nextStep } = useStepContext();
  const locationState: LocationState = useLocation() as LocationState;

  return (
    <div>
      <div className="w-full mt-10 mb-6 border  border-[#023E8A] bg-[#CCD8E81A] rounded-[6px]">
        {/* Trip Info */}
        <div className="p-2">
          <p className="text-[18px] text-[#181818] font-inter">
            {locationState.state.tripType === "one-way" && "One Way"}
            {locationState.state.tripType === "round-trip" && "Round Trip"}
            {locationState.state.tripType === "multi-city" && "Multi City"}
          </p>
          <p className="text-[15px] text-[#4E4F52]">
            {locationState.state.passengers.adults +
              locationState.state.passengers.children +
              locationState.state.passengers.infants}{" "}
            Passengers
          </p>
        </div>
      </div>

      <div className=" md:flex max-md:flex-col gap-4 w-full mb-10">
        <div className="grid  gap-4 flex-1">
          {/* Departure Card */}
          {locationState.state.tripType === "multi-city" ? (
            <>
              {locationState.state.multiCitySelections.map((fl, i) => {
                return (
                  <div className="order-1">
                    {fl.flight && (
                      <FlightCard
                        title={`Departure Flight ${i + 1}`}
                        flight={fl.flight}
                        index={i}

                      />
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <div className="order-1">
              <FlightCard
                title="Departure Flight"
                flight={locationState.state.departureFlight}
              />
            </div>
          )}

          {/* PriceSummary (desktop: stays in column 2, mobile: moves to bottom) */}

          {/* Return Card */}
          {locationState.state.returnFlight && (
            <div className="order-2 md:order-3 ">
              <FlightCard
                title="Return Flight"
                flight={locationState.state.returnFlight}
                index={1}
              />
            </div>
          )}
        </div>

        <div className="order-3 md:order-2 md:grid  flex-1  max-h-[400px] ">
          <PriceSummary nextStep={nextStep}  state={locationState.state}/>
        </div>
      </div>
    </div>
  );
};

export default Step1;
