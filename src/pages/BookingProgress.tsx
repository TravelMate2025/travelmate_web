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
import Stepper from "react-stepper-horizontal";
import { useMediaQuery } from "react-responsive";
import { IoChevronBack } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";

const BookingProgress: React.FC = () => {
  const cancellationDate = new Date();
  cancellationDate.setDate(cancellationDate.getDate() + 1);
  const formattedDate = cancellationDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const formattedTime = "11:59 PM";

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const [currentStep, setCurrentStep] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div>
      <Navbar />

      <div className="md:w-[93%] mx-auto my-22 space-y-6">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold hidden md:block">Booking Overview</h1>
        </div>
          {/* Mobile Progress Bar */}
          {isMobile && (
            <div className="px-4 py-2 flex gap-6">
              <button 
                  onClick={handleBack}
                  className="text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md shadow-sm p-1"
                >
                  <IoChevronBack size={24} />
              </button>

              <h1 className="text-2xl sm:text-3xl font-bold">Booking Overview</h1>
            </div>
            )}
            
            {isMobile && (
          <div className="px-4">

            <Stepper
              steps={[
                { title: "Booking Overview" },
                { title: "Guest Information" },
                { title: "Payment Details" }
              ]}
              activeStep={currentStep}
              activeColor="#023E8A"
              completeColor="#023E8A"
              completeBarColor="#023E8A"
              completeIcon={<FaCheck size={14} color="white" />}
              size={26}
              circleFontSize={14}
            />
          </div>
        )}

        {/* Notification */}
        <div className="bg-blue-100 border border-[#023E8A] px-4 py-2 rounded-lg flex flex-row items-start sm:items-center gap-3 mx-4 sm:mx-0">
          <div className="pt-1 sm:pt-0 flex justify-center sm:justify-start items-center">
            <GrStatusGood size={24} className="text-green-600 mt-5 md:mt-0" />
          </div>
          <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
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

        {/* Conditionally Render Steps on Mobile */}
        {isMobile ? (
          <div className="px-1 space-y-4">
            {currentStep === 0 && (
              <>
                <BookingDetails />
                <PriceSummary />
                <RefundCancellation formattedTime={formattedTime} formattedDate={formattedDate} refundableUntil={formattedTime} />
                <Policies />
                <button onClick={handleNext} className="bg-[#023E8A] text-white px-4 py-2 rounded-lg w-[90%] mx-[5%]">Continue</button>
              </>
            )}

            {currentStep === 1 && (
              <>
                <GuestInformation />
                <button onClick={handleNext} className="bg-[#023E8A] text-white px-4 py-2 rounded-lg w-[90%] mx-[5%]">Continue</button>
              </>
            )}

            {currentStep === 2 && (
              <>
                <PaymentMethod />
                <div className="flex items-center gap-2 mx-5">
                  <input
                    type="checkbox"
                    id="termsCheckbox"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <p className="text-sm text-gray-700">
                    I agree to the <a href="/booking-conditions" className="text-[#023E8A] hover:underline">Booking Conditions</a>, 
                    <a href="/terms-and-conditions" className="text-[#023E8A] hover:underline"> TravelMate Terms</a> and 
                    <a href="/privacy-policy" className="text-[#023E8A] hover:underline"> Privacy Policy</a>.
                  </p>
                </div>

            
                  <button
                    className={`w-[90%] mx-[5%] px-6 py-2 rounded-lg mt-4 text-white ${
                      isChecked ? "bg-[#023E8A]" : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!isChecked}
                  >
                    Make Payment
                  </button>
              </>
            )}
          </div>
        ) : (
          // Desktop Layout
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
              <div className="mt-16 mx-5 md:mx-0">
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
                    <a href="/booking-conditions" className="text-[#023E8A] cursor-pointer hover:underline"> Booking Conditions</a>, 
                    <a href="/terms-and-conditions" className="text-[#023E8A] cursor-pointer hover:underline"> TravelMate Terms</a> 
                    <span className="text-black"> and </span> 
                    <a href="/privacy-policy" className="text-[#023E8A] cursor-pointer hover:underline">Privacy Policy</a>.
                  </p>
                </div>

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
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BookingProgress;
