import React from "react";
import Navbar from "../pages/homePage/Navbar";
import { GrStatusGood } from "react-icons/gr";
import HotelCard from "../components/BookingProgressHotelCard";
import GuestInformation from "../components/booking-progress/GuestInformation";
import PriceSummary from "../components/confirmation/PriceSummary";
import BookingDetails from "../components/booking-progress/BookingDetails";
import PaymentMethod from "../components/booking-progress/PaymentMethod";
import RefundCancellation from "../components/booking-progress/RefundCancellation";
import Policies from "../components/booking-progress/Policies";
import Footer from "../components/2Footer";

const BookingProgress: React.FC = () => {
  const cancellationDate = new Date();
  cancellationDate.setDate(cancellationDate.getDate() + 1);
  const formattedDate = cancellationDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const formattedTime = "11:59 PM";

  return (
    <div>
      <Navbar />

      <div className="w-[93%] mx-auto my-22 space-y-6">
        {/* Notification */}
        <div className="bg-green-100 border border-green-700 px-4 py-2 rounded-lg flex items-center gap-3">
          <GrStatusGood size={24} className="text-green-600" />
          <p>
            Cancellations made after {formattedTime} on {formattedDate} or no-shows are subject to a fee 
            equal to 100% of the amount paid for the reservation.
          </p>
        </div>

        {/* Hotel Details - Using HotelCard Component */}
        <HotelCard
          imageUrl="src/assets/images/StayImage3.png"
          roomDetails="Standard King Room"
          name="Grand Farheinheit Hotel"
          location="80 Ademola Adetokumbo Street, Victoria Island Lagos."
          refundableUntil={formattedTime}
        />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-4">
              <GuestInformation />
              <RefundCancellation formattedTime={""} formattedDate={""} refundableUntil={""} />
              <Policies />
            </div>
          
            <div className="space-y-4">
                <PriceSummary />
                <BookingDetails />
                <PaymentMethod />
            </div>
          
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingProgress;
