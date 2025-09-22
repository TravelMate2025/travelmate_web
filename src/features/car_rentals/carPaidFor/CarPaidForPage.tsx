import { Divider } from "@mui/material";
import Navbar from "../../../pages/homePage/Navbar";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CheckIcon from "@mui/icons-material/Check";
import { Link, useLocation } from "react-router-dom";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import Footer from "../../../components/2Footer";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { useDispatch } from "react-redux";
import { resetForm } from "../carPaymentSlice";
import { useEffect, useState } from "react";
import { transferService } from "../services/transferService";
import { toast, ToastContainer } from "react-toastify";
import { useFormPersistence } from "../hooks/useFormPersistence";
import { BookingFormData } from "../types/booking";
import SkeletonConfirm from "./Skeleton";
import { Download, Share } from "lucide-react";
import ShareModal from "../../stays/components/modals/ShareModal";

const CarPaidForPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState([]);
  const dispatch = useDispatch();
  const { clearSavedData } = useFormPersistence({} as BookingFormData);
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get("session_id");
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      const isSuccess =
        searchParams.has("success") || location.pathname.includes("success");
      try {
        setLoading(true);
        if (isSuccess) {
          const res = await transferService.getBookingBySession(sessionId);
          console.log(res);
          setBooking(res?.data?.bookings);
        } else {
          toast.error("Booking falied please try again!");
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchBooking();
  }, [sessionId]);

  if (loading) return <SkeletonConfirm />;
  if (!booking)
    return (
      <div className="text-center pt-12 flex flex-col gap-6">
        <p>No booking found for this session.</p>
        <div className="mx-6 lg:mx-8  lg:order-6">
          <Link to="/">
            <button
              className="px-4 py-3 text-white rounded-[6px] cursor-pointer bg-[#023E8A]"
              onClick={() => {
                dispatch(resetForm());
                clearSavedData();
              }}
            >
              Back to home
            </button>
          </Link>
        </div>
      </div>
    );

  const handleDownloadPDF = () => {
    // Example: pretend this Blob is your generated PDF
    const blob = new Blob(["Hello, PDF!"], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Create a temporary <a> element to download
    const link = document.createElement("a");
    link.href = url;
    link.download = "confirmation.pdf";
    link.click();

    // Clean up
    URL.revokeObjectURL(url);

    // Show confirmation (replace with toast/snackbar)
    alert("✅ PDF downloaded successfully!");
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />

      {booking?.map((cars: any) => (
        <div className="lg:pt-32 pt-20">
          {showShareModal && (
            <ShareModal
              onClose={() => setShowShareModal(false)}
              shareLink={`/cars/bookings/`}
            />
          )}
          <div className="lg:hidden px-6 lg:px-8 py-6 m-auto flex justify-between">
            <Link to="/">
              {" "}
              <p className="text-[14px] mt-[5px] font-medium font-inter">
                Done
              </p>
            </Link>
            <p className="text-[20px] font-semibold font-inter">
              Taxi Confirmation
            </p>

            <div className="w-[35px]my-6 h-[35px] p-[4px]  bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] ">
              <FileDownloadOutlinedIcon className="font-bold " />
            </div>
          </div>
          <div className="hidden px-6 lg:px-8 py-6 m-auto lg:flex justify-between">
            <p className="text-[20px] font-semibold font-inter">
              Taxi Confirmation
            </p>

            <div className="flex items-center justify-end gap-4">
              <div
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 rounded-md border-[1px] border-[#ACAEB3] p-2 cursor-pointer"
              >
                <Share />
                <span>Share</span>
              </div>
              <div
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 rounded-md border-[1px] border-[#ACAEB3] p-2 cursor-pointer"
              >
                <Download />
                <span>Download</span>
              </div>
            </div>
            <div className="lg:hidden w-[35px]my-6 h-[35px] p-[4px]  bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] ">
              <FileDownloadOutlinedIcon className="font-bold " />
            </div>
          </div>

          <div className="mb-8 px-6 lg:px-8 m-auto">
            <div className="border-1 border-[#2D9C5E] w-full bg-[#D5EBDF4D] pt-[10px] pb-[10px] pr-[10px] pl-[10px] rounded-[8px]">
              <div className="flex gap-2 items-center">
                <div className="border-[#2D9C5E] h-[20px]  w-[20px] border-2 mt-[6px] rounded-full flex justify-center">
                  <CheckIcon
                    sx={{
                      width: "15px",
                      position: "relative",
                      top: "-3px",
                      color: "#2D9C5E",
                    }}
                  />
                </div>

                <div className="text-[12px]">
                  Payment Successful. Car confirmation Details will also be sent
                  to {cars.holder.email}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:grid lg:grid-cols-2 lg:w-full">
            <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-1">
              <p className="text-[16px] font-medium text-[#181818] mb-[15px]">
                Confirmation Details
              </p>
              <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
                <div className="flex justify-between">
                  <p className="text-[#4E4F52] text-[14px] font-normal">
                    Payment Status
                  </p>
                  <p className="text-[#2D9C5E] text-[14px] font-normal">Paid</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#4E4F52] text-[14px] font-normal">
                    Booking ID
                  </p>
                  <p className="text-[14px] font-normal">{cars.reference}</p>
                </div>
              </div>
            </div>

            <Divider
              sx={{ marginTop: "15px", marginBottom: "15px" }}
              className="lg:hidden"
            />

            <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-3">
              <p className="text-[14px] font-inter py-4 font-medium text-[#181818]">
                Trip Details
              </p>
              <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Pick Up location
                    </p>

                    <p className="text-[#181818] text-[14px] font-inter">
                      {cars.transfers[0]?.pickupInformation.from.description}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Pick Up Date
                    </p>

                    <p className="text-[#181818] text-[14px] font-inter">
                      {cars.transfers[0]?.pickupInformation.date}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Pick Up Time
                    </p>

                    <p className="text-[#181818] text-[14px] font-inter">
                      {cars.transfers[0]?.pickupInformation.time}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Drop Off Location
                    </p>

                    <p className="text-[#181818] text-[14px] font-inter">
                      {cars.transfers[0]?.pickupInformation.to.description}
                    </p>
                  </div>
                  <div className="flex justify-between w-full">
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Estimated Duration
                    </p>

                    <p className="text-[#181818] text-[14px] font-inter">
                      {cars.transfers[0]?.content.transferDetailInfo[0].value}{" "}
                      {
                        cars.transfers[0]?.content.transferDetailInfo[0]
                          .description
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Divider
              sx={{ marginTop: "15px", marginBottom: "15px" }}
              className="lg:hidden"
            />
            <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-5">
              <p className="text-[14px] font-inter py-4 font-medium text-[#181818]">
                Taxi Details
              </p>
              <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Type
                    </p>
                    <p className="text-[#181818] text-[14px] font-inter">
                      {cars?.transfers[0]?.category.name} Car
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Seats
                    </p>

                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      {cars.transfers[0]?.content.transferDetailInfo[2]?.value}{" "}
                      Seats
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Luggages
                    </p>

                    <p className="text-[#181818] text-[14px] font-inter">
                      {cars.transfers[0]?.content.transferDetailInfo[3].value}{" "}
                      {
                        cars.transfers[0]?.content.transferDetailInfo[3]
                          .description
                      }
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Provider
                    </p>

                    <p className="text-[#181818] text-[14px] font-inter">
                      {cars.supplier.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Divider
              sx={{ marginTop: "15px", marginBottom: "15px" }}
              className="lg:hidden"
            />

            <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-7">
              <p className="text-[14px] font-medium text-[#181818] py-4">
                Passenger Details
              </p>

              <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
                <div className="flex justify-between mb-[6px]">
                  <p className="text-[#4E4F52] text-[14px]">Name</p>
                  <p className="text-[#181818] text-[14px]">
                    {cars.holder.name} {cars.holder.surname}
                  </p>
                </div>
                <div className="flex justify-between mb-[6px]">
                  <p className="text-[#4E4F52] text-[14px]">Email Address</p>
                  <p className="text-[#181818] text-[14px]">
                    {cars.holder.email}
                  </p>
                </div>
                <div className="flex justify-between mb-[6px]">
                  <p className="text-[#4E4F52] text-[14px] ">Phone Number</p>
                  <p className="text-[#181818] text-[14px]">
                    {cars.holder.phone}
                  </p>
                </div>
                {/* <div className="flex justify-between mb-[6px]"> */}
                {/* <p className="text-[#4E4F52] text-[14px]">Date Of Birth</p> */}
                {/* <p className="text-[#181818] text-[14px]"> */}
                {/* {booking.passFormData.dateOfBirth} */}
                {/* </p> */}
                {/* // </div> */}
              </div>
            </div>

            <Divider
              sx={{ marginTop: "15px", marginBottom: "15px" }}
              className="lg:hidden"
            />

            <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-2">
              <p className="text-[14px] font-inter py-4 font-medium text-[#181818]">
                Price Summary
              </p>
              <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
                <div className="flex justify-between">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Total
                  </p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    &#8364;{cars.totalNetAmount}
                  </p>
                </div>
              </div>
            </div>

            <Divider
              sx={{ marginTop: "15px", marginBottom: "15px" }}
              className="lg:hidden"
            />
            <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-4">
              <p className="text-[14px] font-medium text-[#181818] py-4">
                Contacts
              </p>
              <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <LocalPhoneOutlinedIcon
                      sx={{ fontSize: "14px", marginTop: "2px" }}
                    />
                    <p className="text-[#4E4F52] text-[14px]">
                      Customer Support
                    </p>
                  </div>
                  <p className="text-[#181818] text-[14px]">
                    +234 800 123 4567
                  </p>
                </div>
              </div>
            </div>

            <Divider
              sx={{ marginTop: "15px", marginBottom: "15px" }}
              className="lg:hidden"
            />

            <div className="px-6 lg:px-8 m-auto lg:m-0 lg:hidden">
              <p className="text-[14px] font-medium text-[#181818] mb-4">
                Actions
              </p>

              <div>
                <p
                  onClick={() => setShowShareModal(true)}
                  className="text-[#4E4F52] text-[14px] mb-2"
                >
                  <ShareOutlinedIcon /> <span>Share this booking</span>
                </p>

                <p className="text-[#181818] text-[14px]">
                  {" "}
                  <FileDownloadOutlinedIcon />
                  <span>Download as PDF</span>
                </p>
              </div>
            </div>

            <Divider
              sx={{ marginTop: "150px", marginBottom: "30px" }}
              className="lg:hidden"
            />

            <div className="mx-6 lg:mx-8  lg:order-6">
              <Link to="/">
                <button
                  className="w-full text-white px-2 py-3 rounded-[6px] cursor-pointer bg-[#023E8A]"
                  onClick={() => {
                    dispatch(resetForm());
                    clearSavedData();
                  }}
                >
                  Back to home
                </button>
              </Link>
            </div>
          </div>

          <div className="mt-24">
            <Footer />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarPaidForPage;
