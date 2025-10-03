import { Divider } from "@mui/material";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { useEffect } from "react";
import TravelMateLogo from "../../../assets/Logo.svg";

const DownloadPage = () => {
  const search = new URLSearchParams(window.location.search);
  let bookingData: any = {};
  try {
    bookingData = JSON.parse(search.get("data") || "{}");
  } catch {}

  useEffect(() => {
    window.print();
  }, []);

  if (!bookingData) return <div>No booking data found.</div>;

  const transfer = bookingData.transfers?.[0] || {};
  const pickupInfo = transfer.pickupInformation || {};
  const content = transfer.content || {};
  const transferDetailInfo = content.transferDetailInfo || [];
  const infoRemarks = content.transferRemarks[0].description;
  const category = transfer.category || {};
  const supplier = bookingData.supplier || {};
  const holder = bookingData.holder || {};

  return (
    <div>
      <div className="flex justify-center items-center my-4">
        <img src={TravelMateLogo} alt="TravelMate Logo" className="w-32" />
      </div>
      <Divider
        sx={{ marginTop: "15px", marginBottom: "15px" }}
        className="lg:hidden"
      />

      <div className="w-full bg-white">

        <div className="px-6 lg:px-8 m-auto lg:m-0 ">
          <p className="text-[16px] font-bold text-[#181818] mb-[15px]">
            Taxi Confirmation
          </p>
          <div className="flex justify-normal gap-2">
            <p className="text-[#4E4F52] text-[14px] font-normal">
              Payment Status
            </p>
            <p className="text-[#2D9C5E] text-[14px] font-normal">Paid</p>
          </div>
          <div className="flex justify-normal gap-2">
            <p className="text-[#4E4F52] text-[14px] font-normal">Booking ID</p>
            <p className="text-[14px] font-normal">
              {bookingData.reference || bookingData.id}
            </p>
          </div>
        </div>

        <Divider
          sx={{ marginTop: "15px", marginBottom: "15px" }}
  
        />

        <div className="px-6 lg:px-8 m-auto lg:m-0">
          <p className="text-[14px] font-inter py-2 font-bold text-[#181818]">
            Trip Details
          </p>
          <div >
            <div className="flex flex-col gap-1">
              <div className="flex justify-normal gap-2">
                <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                  Pick Up location:
                </p>
                <p className="text-[#181818] text-[14px] font-inter">
                  {pickupInfo.from?.description}
                </p>
              </div>
              <div className="flex justify-normal gap-2">
                <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                  Pick Up Date:
                </p>
                <p className="text-[#181818] text-[14px] font-inter">
                  {pickupInfo.date}
                </p>
              </div>
              <div className="flex justify-normal gap-2">
                <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                  Pick Up Time:
                </p>
                <p className="text-[#181818] text-[14px] font-inter">
                  {pickupInfo.time}
                </p>
              </div>
              <div className="flex justify-normal gap-2">
                <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                  Drop Off Location:
                </p>
                <p className="text-[#181818] text-[14px] font-inter">
                  {pickupInfo.to?.description}
                </p>
              </div>
              <div className="flex justify-normal gap-2 w-full">
                <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                  Estimated Duration:
                </p>
                <p className="text-[#181818] text-[14px] font-inter">
                  {transferDetailInfo[0]?.value}{" "}
                  {transferDetailInfo[0]?.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Divider
          sx={{ marginTop: "15px", marginBottom: "15px" }}
  
        />

        <div className="px-6 lg:px-8 m-auto lg:m-0">
          <p className="text-[14px] font-inter py-2 font-bold text-[#181818]">
            Taxi Details
          </p>
          <div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-normal gap-2">
                <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                  Type:
                </p>
                <p className="text-[#181818] text-[14px] font-inter">
                  {category.name} Car
                </p>
              </div>
              <div className="flex justify-normal gap-2">
                <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                  Seats:
                </p>
                <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                  {transferDetailInfo[2]?.value} Seats
                </p>
              </div>
              <div className="flex justify-normal gap-2">
                <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                  Luggages:
                </p>
                <p className="text-[#181818] text-[14px] font-inter">
                  {transferDetailInfo[3]?.value}{" "}
                  {transferDetailInfo[3]?.description}
                </p>
              </div>
              <div className="flex justify-normal gap-2">
                <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                  Provider:
                </p>
                <p className="text-[#181818] text-[14px] font-inter">
                  {supplier.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Divider
          sx={{ marginTop: "15px", marginBottom: "15px" }}
  
        />

        <div className="px-6 lg:px-8 m-auto lg:m-0 ">
          <p className="text-[14px] font-bold text-[#181818] py-2">
            Passenger Details
          </p>
          <div>
            <div className="flex justify-normal gap-2 mb-[6px]">
              <p className="text-[#4E4F52] text-[14px]">Name:</p>
              <p className="text-[#181818] text-[14px]">
                {holder.name} {holder.surname}
              </p>
            </div>
            <div className="flex justify-normal gap-2 mb-[6px]">
              <p className="text-[#4E4F52] text-[14px]">Email Address:</p>
              <p className="text-[#181818] text-[14px]">{holder.email}</p>
            </div>
            <div className="flex justify-normal gap-2 mb-[6px]">
              <p className="text-[#4E4F52] text-[14px] ">Phone Number:</p>
              <p className="text-[#181818] text-[14px]">{holder.phone}</p>
            </div>
          </div>
        </div>

        <Divider
          sx={{ marginTop: "15px", marginBottom: "15px" }}
  
        />

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
                &#8364;{bookingData?.totalNetAmount}
              </p>
            </div>
          </div>
        </div>

        <Divider
          sx={{ marginTop: "15px", marginBottom: "15px" }}
  
        />

        <div className="px-6 lg:px-8 m-auto lg:m-0">
          <p className="text-[14px] font-inter py-2 font-bold text-[#181818]">
            Important Information
          </p>
          <div>
            {infoRemarks ? (
              <pre className=" whitespace-pre-wrap text-[#181818] text-[14px] font-inter">
                {infoRemarks}
              </pre>
            ) : (
              <pre className="whitespace-pre-wrap text-[#181818] text-[14px] font-inter">
                No Information
              </pre>
            )}
          </div>
        </div>

        <Divider
          sx={{ marginTop: "15px", marginBottom: "15px" }}

        />

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
              <p className="text-[#181818] text-[14px]">+234 800 123 4567</p>
            </div>
          </div>
        </div>
        <Divider
          sx={{ marginTop: "150px", marginBottom: "30px" }}
  
        />
      </div>
    </div>
  );
};

export default DownloadPage;
