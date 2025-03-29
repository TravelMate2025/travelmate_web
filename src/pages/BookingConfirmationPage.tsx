import React from "react";
import Navbar from "../pages/homePage/Navbar";
import { FaShareAlt, FaDownload } from "react-icons/fa";
import { GrStatusGood } from "react-icons/gr";
import ConfirmationDetails from "../components/confirmation/ConfirmationDetails";
import GuestDetails from "../components/confirmation/GuestDetails";
import PriceSummary from "../components/confirmation/PriceSummary";
import HotelDetails from "../components/confirmation/HotelDetails";
import RoomDetails from "../components/confirmation/RoomDetails";
import BackHomeButton from "../components/confirmation/BackHomeButton";
import ContactDetails from "../components/confirmation/ContactDetails";

const BookingConfirmationPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="w-[93%] mx-auto mt-26 px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Booking Confirmation</h1>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg">
              <FaShareAlt size={18} />
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg">
              <FaDownload size={18} />
              Download
            </button>
          </div>
        </div>

        {/* Notification */}
        <div className="bg-green-100 border border-green-700 px-4 py-2 rounded-lg flex items-center gap-3">
            <GrStatusGood size={24} className="text-green-600" />
            <p>
                <span className="font-semibold">Payment Successful</span> and your stay is confirmed.
                Booking confirmation will also be sent to <span className="font-semibold">elvis@gmail.com</span>.
            </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <ConfirmationDetails />
            <PriceSummary />

          </div>
            
          <div className="space-y-4">
            <GuestDetails />
            <RoomDetails />
            <HotelDetails />
            <ContactDetails />
          </div>

        </div>

        <div className="mt-6 text-center">
          <BackHomeButton />
        </div>


      </div>
    </div>

      
  );
};

export default BookingConfirmationPage;
