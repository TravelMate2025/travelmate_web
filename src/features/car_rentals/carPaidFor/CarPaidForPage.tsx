import { Divider, Rating, Stack, Typography } from "@mui/material";
import Navbar from "../../../pages/homePage/Navbar";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CheckIcon from "@mui/icons-material/Check";
import { Link } from "react-router-dom";
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
import { Download, Loader, Share } from "lucide-react";
import ShareModal from "../../stays/components/modals/ShareModal";
import CarFailedPayment from "./CarFailedPayment";

const CarPaidForPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any>([]);
  const dispatch = useDispatch();
  const { clearSavedData } = useFormPersistence({} as BookingFormData);
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams?.get("session_id");
  const [showShareModal, setShowShareModal] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

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
          return <CarFailedPayment />;
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

  const handleDownload = (cars: any) => {
    try {
      setDownloadLoading(true);
      window.open(
        `/car-paid/download?data=${encodeURIComponent(JSON.stringify(cars))}`,
        "_blank"
      );
    } catch (error) {
      toast.error("Failed to download, try again ");
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      {booking?.map((cars: any, index:any) => (
        <div className="lg:pt-32 pt-20" key={index}>
          {showShareModal && (
            <ShareModal
              onClose={() => setShowShareModal(false)}
              shareLink={`/cars/bookings/`}
            />
          )}
          <div className="lg:hidden px-6 lg:px-8 py-6 m-auto flex justify-between">
            <Link to="/">
              <p className="text-[14px] mt-[5px] font-medium font-inter">
                Done
              </p>
            </Link>
            <p className="text-[20px] font-semibold font-inter">
              Car Confirmation
            </p>

            <div
              className="w-[35px] h-[35px] p-[4px]  bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] "
              onClick={() => {
                handleDownload(cars);
              }}
            >
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
                onClick={() => {
                  handleDownload(cars);
                }}
                className="flex items-center gap-2 rounded-md border-[1px] border-[#ACAEB3] p-2 cursor-pointer"
              >
                {downloadLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Download />
                )}
                <span>Download</span>
              </div>
            </div>
          </div>

          {cars.status === "CONFIRMED" && (
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
                    Payment Successful. Car confirmation Details will also be
                    sent to {cars.holder.email}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div id="pdf-content" className="lg:grid lg:grid-cols-2 lg:w-full">
            <div className="px-6 lg:px-8 m-auto lg:m-0 lg:order-1">
              <p className="text-[16px] font-medium text-[#181818] mb-[15px]">
                Confirmation Details
              </p>
              <div className="lg:rounded-md lg:p-3 lg:border-[1px] lg:border-[#ACAEB3]">
                <div className="flex justify-between">
                  <p className="text-[#4E4F52] text-[14px] font-normal">
                    Payment Status
                  </p>
                  <p className="text-[#2D9C5E] text-[14px] font-normal">
                    {cars.status}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#4E4F52] text-[14px] font-normal">
                    Booking ID
                  </p>
                  <p className="text-[14px] font-normal">{cars.reference}</p>
                </div>
              </div>
            </div>

          <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} />

          <div className="w-[90%] m-auto">
            <p className="text-[14px] font-inter mb-4 font-medium text-[#181818]">
              Trip Details
            </p>
            <div className="">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <div>
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Pick Up location
                    </p>
                  </div>
                  <div>
                    <p className="text-[#181818] text-[14px] font-inter">
                      Ikeja
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Pick Up Date
                    </p>
                  </div>
                  <div>
                    <p className="text-[#181818] text-[14px] font-inter">
                      Feb 10, 2025
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Pick Up Time
                    </p>
                  </div>
                  <div>
                    <p className="text-[#181818] text-[14px] font-inter">
                      3:30 PM
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Drop Off Location
                    </p>
                  </div>
                  <div>
                    <p className="text-[#181818] text-[14px] font-inter">
                      Victoria Island
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} />

          <div className="w-[90%] m-auto">
            <p className="text-[14px] font-inter mb-4 font-medium text-[#181818]">
              Driver Details
            </p>
            <div className="">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <div>
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Name
                    </p>
                  </div>
                  <div>
                    <p className="text-[#181818] text-[14px] font-inter">
                      Elvis Igiebor
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Rating
                    </p>
                  </div>
                  <div>
                    <Stack direction="row">
                      <Rating
                        value={1}
                        max={1}
                        readOnly
                        sx={{ fontSize: "14px", marginTop: "3px" }}
                      />
                      <Typography variant="body1" sx={{ fontSize: "14px" }}>
                        {value}
                      </Typography>
                    </Stack>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Phone Number
                    </p>
                  </div>
                  <div>
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
          </div>

          <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} />

          <div className="w-[90%] m-auto">
            <p className="text-[14px] font-inter mb-4 font-medium text-[#181818]">
              Car Details
            </p>
            <div className="">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <div>
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Type
                    </p>
                  </div>
                  <div>
                    <p className="text-[#181818] text-[14px] font-inter">
                      Red Toyota Corolla
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Seats
                    </p>
                  </div>
                  <div>
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      3 Seats
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Luggages
                    </p>
                  </div>
                  <div>
                    <p className="text-[#181818] text-[14px] font-inter">
                      Up to 4 Luggages
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Plate Number
                    </p>
                  </div>
                  <div>
                    <p className="text-[#181818] text-[14px] font-inter">
                      AA1234FT
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} />

          <div className="w-[90%] m-auto">
            <div>
              <p className="text-[14px] font-medium text-[#181818] mb-4">
                Passenger Details
              </p>
            </div>

            <div>
              <div className="">
                <div className="flex justify-between mb-[6px]">
                  <p className="text-[#4E4F52] text-[14px]">Name</p>
                  <p className="text-[#181818] text-[14px]">Elvis Igiebor</p>
                </div>

                <div className="flex justify-between mb-[6px]">
                  <p className="text-[#4E4F52] text-[14px]">Email Address</p>
                  <p className="text-[#181818] text-[14px]">Elvis@gmail.com</p>
                </div>

                <div className="flex justify-between mb-[6px]">
                  <p className="text-[#4E4F52] text-[14px] ">Phone Number</p>
                  <p className="text-[#181818] text-[14px]">090123456782</p>
                </div>

                <div className="flex justify-between mb-[6px]">
                  <p className="text-[#4E4F52] text-[14px]">Date Of Birth</p>
                  <p className="text-[#181818] text-[14px]">11/08/2024</p>
                </div>
              </div>
            </div>
          </div>

          <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} />

          <div className="w-[90%] m-auto">
            <p className="text-[14px] font-inter mb-4 font-medium text-[#181818]">
              Price Summary
            </p>
            <div className="">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <div>
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                      Total
                    </p>
                  </div>
                  <div>
                    <p className="text-[#181818] text-[14px] font-inter">
                      ₦40,000
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} />
          <div className="w-[90%] m-auto">
            <div>
              <p className="text-[14px] font-medium text-[#181818] mb-4">
                Contacts
              </p>
            </div>

            <div>
              <div className="">
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
                    +234 808 412 2474
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} />

          <div className="w-[90%] m-auto">
            <div>
              <p className="text-[14px] font-medium text-[#181818] mb-4">
                Actions
              </p>
            </div>

            <div>
              <div className="">
                <p className="text-[#4E4F52] text-[14px] mb-2">
                  <ShareOutlinedIcon /> <span>Share this booking</span>
                </p>

                <p
                  className="text-[#181818] text-[14px]"
                  onClick={() => {
                    handleDownload(cars);
                  }}
                >
                  {" "}
                  {downloadLoading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <FileDownloadOutlinedIcon />
                  )}
                  <span>Download as PDF</span>
                </p>
              </div>
            </div>

          <Divider sx={{ marginTop: "150px", marginBottom: "30px" }} />

          <div className="">
            <Link to="/">
              <button className="w-full text-white h-[56px] rounded-[6px] cursor-pointer bg-[#023E8A]">
                Back to home
              </button>
            </Link>
          </div>

          <div className="mt-24">
            <Footer />
          </div>
        </div>
      ) : (
        // web view

        <div>
          <Link to="/">
            <div className="flex mt-26 mb-[24px] gap-[24px] w-[90%] m-auto cursor-pointer">
              <div className="w-[33px] h-[33px]  cursor-pointer bg-white border border-[#EBECED] rounded-[4px] shadow-md shadow-[#00000014] flex items-center justify-center">
                <KeyboardArrowLeftOutlinedIcon className="scale-150" />
              </div>
              <p className="mt-[5px] text-[18px]">Back to home</p>
            </div>
          </Link>

          <Divider />

          <div className="flex justify-between mt-[32px] mb-[32px] w-[90%] m-auto">
            <div>
              <p className="text-[#181818] text-[32px] font-bold font-inter">
                Car Confirmation
              </p>
            </div>
            <div className="flex gap-3">
              <button className="border-1 border-[#ACAEB3] p-[8px] rounded-[4px] flex gap-2">
                <IosShareOutlinedIcon className="w-[30%]" />
                <span className="mt-[2px]">Share</span>
              </button>
              <button className="border-1 border-[#ACAEB3]  p-[8px] rounded-[4px] flex gap-2">
                <FileDownloadOutlinedIcon className="w-[30%]" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div>
            <div className="mb-[32px] w-[90%] m-auto">
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
                  <div>
                    Payment Successful. Car confirmation Details will also be
                    sent to elvis@gmail.com
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[90%] m-auto flex justify-between">
            <div className="">
              <div>
                <div>
                  <p className="text-[20px] font-medium text-[#181818] mb-[15px]">
                    Confirmation Details
                  </p>
                </div>

                <div>
                  <div className="border border-[#CDCED1] w-[43.6vw] p-[20px] rounded-[12px]">
                    <div className="flex justify-between">
                      <p className="text-[#4E4F52] text-[18px]">
                        Payment Status
                      </p>
                      <p className="text-[#2D9C5E] text-[18px]">Paid</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-[15px]">
                <p className="text-[20px] font-inter font-medium text-[#181818]">
                  Trip Details
                </p>
                <div className="border border-[#CDCED1] rounded-[10px] w-[43.6vw] p-[20px] mt-[20px]">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-[18px] font-inter font-normal text-[#4E4F52]">
                          Pick Up location
                        </p>
                      </div>
                      <div>
                        <p className="text-[#181818] text-[16px] font-inter">
                          Ikeja
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <p className="text-[18px] font-inter font-normal text-[#4E4F52]">
                          Pick Up Date
                        </p>
                      </div>
                      <div>
                        <p className="text-[#181818] text-[16px] font-inter">
                          Feb 10, 2025
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <p className="text-[18px] font-inter font-normal text-[#4E4F52]">
                          Pick Up Time
                        </p>
                      </div>
                      <div>
                        <p className="text-[#181818] text-[16px] font-inter">
                          3:30 PM
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <p className="text-[18px] font-inter font-normal text-[#4E4F52]">
                          Drop Off Location
                        </p>
                      </div>
                      <div>
                        <p className="text-[#181818] text-[16px] font-inter">
                          Victoria Island
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-[15px]">
                <p className="text-[20px] font-inter font-medium text-[#181818]">
                  Driver Details
                </p>
                <div className="border border-[#CDCED1] rounded-[10px] w-[43.6vw] p-[20px] mt-[20px]">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-[18px] font-inter font-normal text-[#4E4F52]">
                          Name
                        </p>
                      </div>
                      <div>
                        <p className="text-[#181818] text-[16px] font-inter">
                          Elvis Igiebor
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <p className="text-[18px] font-inter font-normal text-[#4E4F52]">
                          Rating
                        </p>
                      </div>
                      <div>
                        <Stack direction="row">
                          <Rating value={1} max={1} readOnly />
                          <Typography variant="body1">{value}</Typography>
                        </Stack>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <p className="text-[18px] font-inter font-normal text-[#4E4F52]">
                          Phone Number
                        </p>
                      </div>
                      <div>
                        <p className="text-[#181818] text-[16px] font-inter">
                          090123456782
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-[15px]">
                <p className="text-[20px] font-inter font-medium text-[#181818]">
                  Car Details
                </p>
                <div className="border border-[#CDCED1] rounded-[10px] w-[43.6vw] p-[20px] mt-[20px]">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-[18px] font-inter font-normal text-[#4E4F52]">
                          Type
                        </p>
                      </div>
                      <div>
                        <p className="text-[#181818] text-[16px] font-inter">
                          Red Toyota Corolla
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <p className="text-[18px] font-inter font-normal text-[#4E4F52]">
                          Seats
                        </p>
                      </div>
                      <div>
                        <p>3 Seats</p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <p className="text-[18px] font-inter font-normal text-[#4E4F52]">
                          Luggages
                        </p>
                      </div>
                      <div>
                        <p className="text-[#181818] text-[16px] font-inter">
                          Up to 4 Luggages
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <p className="text-[18px] font-inter font-normal text-[#4E4F52]">
                          Plate Number
                        </p>
                      </div>
                      <div>
                        <p className="text-[#181818] text-[16px] font-inter">
                          AA1234FT
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-[15px]">
                <div>
                  <p className="text-[20px] font-medium text-[#181818] mb-[16px]">
                    Passenger Details
                  </p>
                </div>

                <div>
                  <div className="border border-[#CDCED1] w-[43.6vw] p-[24px] rounded-[12px]">
                    <div className="flex justify-between mb-[10px]">
                      <p className="text-[#4E4F52] text-[18px]">Name</p>
                      <p className="text-[#181818] text-[18px]">
                        Elvis Igiebor
                      </p>
                    </div>

                    <div className="flex justify-between mb-[10px]">
                      <p className="text-[#4E4F52] text-[18px]">
                        Email Address
                      </p>
                      <p className="text-[#181818] text-[18px]">
                        Elvis@gmail.com
                      </p>
                    </div>

                    <div className="flex justify-between mb-[10px]">
                      <p className="text-[#4E4F52] text-[18px] ">
                        Phone Number
                      </p>
                      <p className="text-[#181818] text-[18px]">090123456782</p>
                    </div>

                    <div className="flex justify-between mb-[10px]">
                      <p className="text-[#4E4F52] text-[18px]">
                        Date Of Birth
                      </p>
                      <p className="text-[#181818] text-[18px]">11/08/2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="mt-[]">
                <p className="text-[20px] font-inter font-medium text-[#181818]">
                  Price Summary
                </p>
                <div className="border border-[#CDCED1] rounded-[10px] w-[43.6vw] p-[20px] mt-[15px]">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-[18px] font-inter font-normal text-[#4E4F52]">
                          Total
                        </p>
                      </div>
                      <div>
                        <p className="text-[#181818] text-[16px] font-inter">
                          ₦40,000
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className=" mt-[15px]">
                <div>
                  <p className="text-[20px] font-medium text-[#181818] mb-[16px]">
                    Contacts
                  </p>
                </div>

                <div>
                  <div className="border border-[#CDCED1] w-[43.6vw] p-[20px] rounded-[12px]">
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <LocalPhoneOutlinedIcon />
                        <p className="text-[#4E4F52] text-[18px]">
                          Customer Support
                        </p>
                      </div>
                      <p className="text-[#181818] text-[18px]">
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
              </div>
            </div>
          </div>

          <div className="mt-[197px]">
            <Footer />
          </div>
        </div>
      )}
    </div>
  );
};

export default CarPaidForPage;
