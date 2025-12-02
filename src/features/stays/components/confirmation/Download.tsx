import { Divider } from "@mui/material";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { useEffect, useState } from "react";
import TravelMateLogo from "../../../../assets/Logo.svg";

const DownloadStaysPage = () => {
  const search = new URLSearchParams(window.location.search);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  let bookingData: any = {};
  try {
    bookingData = JSON.parse(search.get("data") || "{}");
  } catch {}

  useEffect(() => {
    if (isImageLoaded) {
      setTimeout(() => {
        window.print();
      }, 300);
    }
  }, [isImageLoaded]);
  if (!bookingData) return <div>No booking data found.</div>;


  return (
    <div>
      <div className="flex justify-center items-center my-4">
        <img
          src={TravelMateLogo}
          alt="TravelMate Logo"
          className="w-32"
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>
      <Divider
        sx={{ marginTop: "15px", marginBottom: "15px" }}
        className="lg:hidden"
      />

      <div className="w-full bg-white">
        <div className="px-6 lg:px-8 m-auto lg:m-0 ">
          <p className="text-[16px] font-bold text-[#181818] mb-[15px]">
            Stays Confirmation
          </p>
          <div className="flex justify-normal gap-2">
            <p className="text-[#4E4F52] text-[14px] font-normal">
              Payment Status
            </p>
            <p className="text-[#2D9C5E] text-[14px] font-normal">
              {bookingData?.payment_status.toUpperCase()}
            </p>
          </div>
          <div className="flex justify-normal gap-2">
            <p className="text-[#4E4F52] text-[14px] font-normal">Booking ID</p>
            <p className="text-[14px] font-normal">
              {bookingData.reference || bookingData.id}
            </p>
          </div>
        </div>

        <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} />

        <div className="px-6 lg:px-8 m-auto lg:m-0">
          <p className="text-[14px] font-inter py-2 font-bold text-[#181818]">
            Hotel Details
          </p>
          <div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-normal gap-2">
                <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                  Hotel Name
                </p>
                <p className="text-[#181818] text-[14px] font-inter">
                  {bookingData?.hotel_name}
                </p>
              </div>
              <div className="flex justify-normal gap-2">
                <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                  Hotel Location
                </p>
                <p className="text-[#181818] text-[14px] font-inter">
                  {bookingData?.hotel_location?.address}{" "}
                  {bookingData?.hotel_location?.destination?.city_name}
                </p>
              </div>
              <div className="flex justify-normal gap-2">
                <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                  Hotel Code
                </p>
                <p className="text-[#181818] text-[14px] font-inter">
                  {bookingData?.hotel_code}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} />

        <div className="px-6 lg:px-8 m-auto lg:m-0">
          <p className="text-[14px] font-inter py-2 font-bold text-[#181818]">
            Room Details
          </p>
          {Array(bookingData?.room_details).length > 0 ? (
            <div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-normal gap-2">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Room Type:
                  </p>
                  <p className="text-[#181818] text-[14px] font-inter">
                    {Array(bookingData?.room_details).map((item)=> item)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p>No Information Available </p>
          )}
        </div>

        <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} />

        <div className="px-6 lg:px-8 m-auto lg:m-0 ">
          <p className="text-[14px] font-bold text-[#181818] py-2">
            Guest Details
          </p>
          <div>
            <div className="flex justify-normal gap-2 mb-[6px]">
              <p className="text-[#4E4F52] text-[14px]">Name:</p>
              <p className="text-[#181818] text-[14px]">
                {bookingData?.guest_details?.primary_guest.name}{" "}
                {bookingData?.guest_details?.primary_guest.surname}
              </p>
            </div>
            <div className="flex justify-normal gap-2 mb-[6px]">
              <p className="text-[#4E4F52] text-[14px]">Email Address:</p>
              <p className="text-[#181818] text-[14px]">
                {bookingData?.guest_details?.primary_guest.email}
              </p>
            </div>
            <div className="flex justify-normal gap-2 mb-[6px]">
              <p className="text-[#4E4F52] text-[14px] ">Phone Number:</p>
              <p className="text-[#181818] text-[14px]">
                {bookingData?.guest_details?.primary_guest.phone}
              </p>
            </div>
          </div>
        </div>

        <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} />

        <div className="px-6 lg:px-8 m-auto lg:m-0">
          <p className="text-[14px] font-inter py-2 font-bold text-[#181818]">
            Price Summary
          </p>
          <div>
            <div className="flex justify-normal gap-2">
              <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                Total:
              </p>
              <p className="text-[#181818] text-[14px] font-inter">
                €{bookingData?.total_price}
              </p>
            </div>
          </div>
        </div>

        <Divider sx={{ marginTop: "15px", marginBottom: "15px" }} />

        <div className="px-6 lg:px-8 m-auto lg:m-0">
          <p className="text-[14px] font-bold text-[#181818] py-2">Contacts</p>
          <div>
            <div className="flex justify-normal gap-2">
              <div className="flex gap-2">
                <LocalPhoneOutlinedIcon
                  sx={{ fontSize: "14px", marginTop: "2px" }}
                />
                <p className="text-[#4E4F52] text-[14px]">Customer Support</p>
              </div>
              <p className="text-[#181818] text-[14px]">+234 808 412 2474</p>
            </div>
          </div>
        </div>
        <Divider sx={{ marginTop: "150px", marginBottom: "30px" }} />

        <p className="text-center text-[#BDBDBD] text-[12px]">
          {` © ${new Date().getFullYear()} TravelMate. All rights reserved.`}
        </p>
      </div>
    </div>
  );
};

export default DownloadStaysPage;
