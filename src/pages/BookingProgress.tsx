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
import { useState } from "react";


const BookingProgress: React.FC = () => {
  const cancellationDate = new Date();
  cancellationDate.setDate(cancellationDate.getDate() + 1);
  const formattedDate = cancellationDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const formattedTime = "11:59 PM";

  const [isChecked, setIsChecked] = useState(false);


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
              <RefundCancellation formattedTime={formattedTime} formattedDate={formattedDate} refundableUntil={formattedTime} />
              <Policies />
            </div>
          
            <div className="space-y-4">
                <PriceSummary />
                <BookingDetails />
                <PaymentMethod />



  

              
                <div className="mt-16">
                  {/* Terms and Conditions Checkbox */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="termsCheckbox"
                      checked={isChecked}
                      onChange={() => setIsChecked(!isChecked)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <p className="m-2 text-sm text-gray-700">
                      I agree to the 
                      <a href="/booking-conditions" className="text-[#023E8A] cursor-pointer hover:underline">
                        {" "}Booking Conditions
                      </a>, 
                      <a href="/terms-and-conditions" className="text-[#023E8A] cursor-pointer hover:underline">
                        {" "}TravelMate Terms and Conditions
                      </a> 
                      <span className="text-black"> and </span> 
                      <a href="/privacy-policy" className="text-[#023E8A] cursor-pointer hover:underline">
                        Privacy Policy
                      </a>.
                    </p>

                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className={`w-full px-6 py-2 rounded-lg mt-4 text-white ${
                      isChecked ? "bg-[#023E8A] hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!isChecked}
                  >
                    Make Payment
                  </button>
                </div>

            </div>
          
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingProgress;
