// import { useState,useEffect } from 'react';
import Navbar from "../../homePage/Navbar";
import { IconButton } from "@mui/material";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CheckIcon from "@mui/icons-material/Check";
import { Divider } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import airlogo from "../../../assets/airlogo.svg";
import line3 from "../../../assets/arrow2.svg";
import line4 from "../../../assets/line3.svg";
import Footer from "../../../components/2Footer";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { useMediaQuery } from "react-responsive";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { useFetchBookingByIdQuery } from "../../../features/flights/api/flightApi";
import dayjs from "dayjs";
import { useAppSelector } from "../../../hooks/redux";
import { PriceSummary } from "../../../features/flights/components/roundtrip/Steps/Step1";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const FlightCard = ({
  title,
  flight,
  ticketNumber,
}: {
  title: string;
  flight: any;
  ticketNumber?: string;
}) => {
  if (!flight) return null;

  const departure = flight.itineraries?.[0]?.segments?.[0];
  const arrival = flight.itineraries?.[0]?.segments?.slice(-1)[0];


 
  

  return (
    <div className="mt-[16px]">
      <div>
        <p className="text-[20px] font-medium text-[#181818] mb-[16px]">
          {title}
        </p>
      </div>

      <div className="md:border border-[#CDCED1] md:p-[24px] rounded-[12px]">
        {/* Airline */}
        <div className="flex gap-[4px] mb-[10px]">
          <img src={flight.validatingAirlineLogo || "/airline.png"} alt="" />
          <p className="text-[#181818] md:text-lg text-sm mt-[5px]">
            {departure.operating.airline.name || "Unknown Airline"}
          </p>
        </div>

        {/* Departure & Arrival Time */}
        <div className="flex justify-between mb-[10px]">
          <p className="text-[#4E4F52] md:text-lg text-sm font-medium">
            {dayjs(departure?.departure?.at).format("hh:mma")}
          </p>

          <img src={line3} alt="" className="mx-auto inline-block" />

          <p className="text-[#181818] md:text-lg text-sm font-medium">
            {dayjs(arrival?.arrival?.at).format("hh:mma")}
          </p>
        </div>

        {/* Airports */}
        <div className="flex justify-between mb-[10px]">
          <p className="text-[#4E4F52] md:text-lg text-sm">
            {departure?.departure?.iataCode}
          </p>
          <p className="text-[#181818] md:text-lg text-sm">
            {arrival?.arrival?.iataCode}
          </p>
        </div>

        {/* Ticket Number */}
        {ticketNumber && (
          <div className="flex justify-between mb-[10px]">
            <p className="text-[#4E4F52] md:text-lg text-sm">E-ticket Number</p>
            <p className="text-[#181818] md:text-lg text-sm">{ticketNumber}</p>
          </div>
        )}

        {/* Date */}
        <div className="flex justify-between mb-[10px]">
          <p className="text-[#4E4F52] md:text-lg text-sm">Date</p>
          <p className="text-[#181818] md:text-lg text-sm">
            {dayjs(departure?.departure?.at).format("MMM DD, YYYY")}
          </p>
        </div>

        {/* Flight Number */}
        <div className="flex justify-between mb-[10px]">
          <p className="text-[#4E4F52] md:text-lg text-sm">Flight</p>
          <p className="text-[#181818] md:text-lg text-sm">
            {departure?.carrierCode} {departure?.number}
          </p>
        </div>

        {/* Duration */}
        <div className="flex justify-between mb-[10px]">
          <p className="text-[#4E4F52] md:text-lg text-sm">Duration</p>
          <p className="text-[#181818] md:text-lg text-sm">
            {flight.itineraries?.[0]?.duration || "-"}
          </p>
        </div>

        {/* Class */}
        <div className="flex justify-between mb-[10px]">
          <p className="text-[#4E4F52] md:text-lg text-sm">Class</p>
          <p className="text-[#181818] md:text-lg text-sm">
            {flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin ||
              "-"}
          </p>
        </div>

        {/* Baggage */}
        <div className="flex justify-between mb-[10px]">
          <p className="text-[#4E4F52] md:text-lg text-sm">Baggage</p>
          <p className="text-[#181818] md:text-lg text-sm">
            {flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]
              ?.includedCheckedBags?.quantity
              ? `${flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity} Checked bag(s)`
              : "No Checked bag"}
          </p>
        </div>

        {/* Seat Selection */}
        <div className="flex justify-between mb-[10px]">
          <p className="text-[#4E4F52] md:text-lg text-sm">Seat selection</p>
          <p className="text-[#181818] md:text-lg text-sm">Not Allowed</p>
        </div>

        {/* Refund Policy */}
        <div className="flex justify-between mb-[10px]">
          <p className="text-[#4E4F52] md:text-lg text-sm">Refund Policy</p>
          <p className="text-[#181818] md:text-lg text-sm">Non refundable</p>
        </div>
      </div>
    </div>
  );
};
const FlightConfirmationPage = () => {

  const handleDownload = async () => {
    const element = document.body; // or a specific div like document.getElementById("confirmation-section")

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`flight-confirmation-${bookingId || "ticket"}.pdf`);
  };


 const { user } = useAppSelector((state) => state.auth);

 // Get booking from localStorage
 const savedBooking = JSON.parse(localStorage.getItem("bookingData") || "null");
 const bookingId = savedBooking?.id;


 // Fetch booking by id from localStorage
 const { data } = useFetchBookingByIdQuery(bookingId, {
   skip: !bookingId,
 });

  
  console.log(data);
  
  
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "text-[#2D9C5E]"; // green
      case "pending":
        return "text-[#F2994A]"; // orange
      case "cancelled":
        return "text-[#EB5757]"; // red
      default:
        return "text-[#4E4F52]"; // gray
    }
  };

  
  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div className="mt-[85px]  ">
        <div className="w-[90%] m-auto mt-[90px] max-md:flex hidden justify-between">
          <Link to="/">
            <p className="text-[14px] mt-[5px] font-medium font-inter">Done</p>
          </Link>
          <p className="text-[20px] font-semibold font-inter">
            Flight Confirmation
          </p>
          <div>
            <div className="mb-6 ">
              <div className="w-[35px] mt-[-5px] h-[35px] p-[4px]  bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] ">
                <FileDownloadOutlinedIcon className="font-bold " />
              </div>
            </div>
          </div>
        </div>
        <Link to="/" className="max-md:hidden block ">
          <div className="w-[90%] m-auto mb-[14px]">
            <div className="flex gap-2 ">
              <IconButton>
                <ArrowBackIosNewOutlinedIcon className="w-[32px] h-[32px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-[0px_4px_4px_rgba(0,0,0,0.06)] rounded-[4px]" />
              </IconButton>

              <div>
                {" "}
                <p className="mt-2 ">Back to home</p>
              </div>
            </div>
          </div>
        </Link>

        <Divider sx={{ marginBottom: "24px" }} />

        <div className="w-[90%] m-auto">
          <div className="md:flex hidden justify-between mb-[32px]">
            <div>
              <p className="text-[28px] font-bold text-[#181818]">
                Flight Confirmation
              </p>
            </div>

            <div className="flex gap-3">
              <button className="border-1 border-[#ACAEB3] p-[8px] rounded-[4px] flex">
                <IosShareOutlinedIcon className="w-[30%]" />
                <span>Share</span>
              </button>
              <button className="border-1 border-[#ACAEB3]  p-[8px] rounded-[4px] flex">
                <FileDownloadOutlinedIcon className="w-[30%]" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="mb-[32px]">
            <div className="border-1 border-[#2D9C5E] w-full bg-[#D5EBDF4D] pt-[16px] pb-[16px] pr-[12px] pl-[12px] rounded-[8px]">
              <div className="flex gap-2">
                <div>
                  <div className="border-[#2D9C5E] h-[20px]  w-[20px] border-2  rounded-full flex justify-center">
                    <CheckIcon
                      sx={{
                        width: "15px",
                        position: "relative",
                        top: "-3px",
                        color: "#2D9C5E",
                      }}
                    />
                  </div>
                </div>
                <div className="max-md:text-xs ">
                  Payment Successful and Your flight is{" "}
                  {data?.booking?.status.toLowerCase()}. E-ticket has been sent
                  to {user?.email}
                </div>
              </div>
            </div>
          </div>

          <div className="flex max-md:flex-col gap-[40px]">
            <div className="flex-1">
              <div>
                <div>
                  <p className="text-[20px] font-medium text-[#181818] mb-[16px]">
                    Confirmation Details
                  </p>
                </div>

                <div>
                  <div className="md:border border-[#CDCED1] md:p-[24px] rounded-[12px]">
                    <div className="flex justify-between mb-[10px]">
                      <p className="text-[#4E4F52] md:text-lg text-sm">
                        Booking Reference
                      </p>
                      <p className="text-[#181818] md:text-lg text-sm">
                        {data?.booking_reference}
                      </p>
                    </div>
                    <div className="flex justify-between mb-[10px]">
                      <p className="text-[#4E4F52] md:text-lg text-sm">
                        E-ticket Number
                      </p>
                      <p className="text-[#181818] md:text-lg text-sm">-</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-[#4E4F52] md:text-lg text-sm">
                        Payment Status
                      </p>
                      <p
                        className={`${getStatusColor(
                          data?.booking?.status?.toLowerCase()
                        )} md:text-lg text-sm capitalize`}
                      >
                        {data?.booking?.status?.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Divider sx={{ my: 3 }} />
              <div className="mt-[16px]">
                <div>
                  <p className="text-[20px] font-medium text-[#181818] mb-[16px]">
                    Contact Details
                  </p>
                </div>

                <div>
                  <div className="md:border border-[#CDCED1]  md:p-[24px] rounded-[12px]">
                    <div className="flex justify-between mb-[10px]">
                      <p className="text-[#4E4F52] md:text-lg text-sm">Name</p>
                      <p className="text-[#181818] md:text-lg text-sm">
                        {savedBooking.contact?.name}
                      </p>
                    </div>

                    <div className="flex justify-between mb-[10px]">
                      <p className="text-[#4E4F52] md:text-lg text-sm">
                        Email Address
                      </p>
                      <p className="text-[#181818] md:text-lg text-sm">
                        {savedBooking.contact?.email}
                      </p>
                    </div>

                    <div className="flex justify-between mb-[10px]">
                      <p className="text-[#4E4F52] md:text-lg text-sm ">
                        Phone Number
                      </p>
                      <p className="text-[#181818] md:text-lg text-sm">{""}</p>
                    </div>
                    {savedBooking.contact.dob && (
                      <div className="flex justify-between mb-[10px]">
                        <p className="text-[#4E4F52] md:text-lg text-sm">
                          Date Of Birth
                        </p>
                        <p className="text-[#181818] md:text-lg text-sm">
                          {/* 11/08/2024 */}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Divider sx={{ my: 3 }} />
              <div className="mt-[16px]">
                <div>
                  <p className="text-[20px] font-medium text-[#181818] mb-[16px]">
                    Passenger Contact Details
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {savedBooking?.passengers?.map((p: any, index: number) => (
                    <div
                      key={index}
                      className="md:border border-[#CDCED1] md:p-[24px] rounded-[12px]"
                    >
                      <div className="flex justify-between mb-[10px]">
                        <p className="text-[#4E4F52] md:text-lg text-sm">
                          Title
                        </p>
                        <p className="text-[#181818] md:text-lg text-sm">
                          {p.title || "-"}
                        </p>
                      </div>

                      <div className="flex justify-between mb-[10px]">
                        <p className="text-[#4E4F52] md:text-lg text-sm">
                          Name
                        </p>
                        <p className="text-[#181818] md:text-lg text-sm">
                          {`${p.first_name || ""} ${p.last_name || ""}`}
                        </p>
                      </div>

                      <div className="flex justify-between mb-[10px]">
                        <p className="text-[#4E4F52] md:text-lg text-sm">
                          Date Of Birth
                        </p>
                        <p className="text-[#181818] md:text-lg text-sm">
                          {p.date_of_birth || "-"}
                        </p>
                      </div>

                      <div className="flex justify-between mb-[10px]">
                        <p className="text-[#4E4F52] md:text-lg text-sm">
                          Gender
                        </p>
                        <p className="text-[#181818] md:text-lg text-sm">
                          {p.gender || "-"}
                        </p>
                      </div>

                      <div className="flex justify-between mb-[10px]">
                        <p className="text-[#4E4F52] md:text-lg text-sm">
                          Passport Number
                        </p>
                        <p className="text-[#181818] md:text-lg text-sm">
                          {p.passport_number || "-"}
                        </p>
                      </div>

                      <div className="flex justify-between mb-[10px]">
                        <p className="text-[#4E4F52] md:text-lg text-sm">
                          Passport Expiry Date
                        </p>
                        <p className="text-[#181818] md:text-lg text-sm">
                          {p.passport_expiry || "-"}
                        </p>
                      </div>

                      <div className="flex justify-between mb-[10px]">
                        <p className="text-[#4E4F52] md:text-lg text-sm">
                          Nationality
                        </p>
                        <p className="text-[#181818] md:text-lg text-sm">
                          {p.nationality || "-"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <>
                <Divider sx={{ my: 3 }} />
                <FlightCard
                  title="Departure Flight"
                  flight={savedBooking.state?.departureFlight}
                  ticketNumber="123456"
                />
                <Divider sx={{ my: 3 }} />
                {savedBooking.state?.returnFlight && (
                  <FlightCard
                    title="Return Flight"
                    flight={savedBooking.state?.returnFlight}
                    ticketNumber="654321"
                  />
                )}
              </>
            </div>
            <Divider sx={{ my: 3 }} />
            <div className="flex-1  grid max-h-[350px]">
              <PriceSummary  state={savedBooking.state}  final />

              {/* <Divider sx={{ my: 3 }} /> */}
              {/*
              
              <div className=" mt-[16px]">
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

                <div className="mt-[100px]">
                  <Link to="/">
                    <button
                      className="w-full text-white h-[56px] rounded-[6px] cursor-pointer
                            bg-[#023E8A]"
                    >
                      Back to home
                    </button>
                  </Link>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
};

export default FlightConfirmationPage;
