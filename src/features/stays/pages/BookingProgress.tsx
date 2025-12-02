import Navbar from "../../../pages/homePage/Navbar";
import { GrStatusGood } from "react-icons/gr";
import HotelCard from "../components/BookingProgressHotelCard";
import GuestInformation from "../components/booking-progress/GuestInformation";
import PriceSummary from "../components/booking-progress/PriceSummary";
import BookingDetails from "../components/booking-progress/BookingDetails";
import PaymentMethod from "../components/booking-progress/PaymentMethod";
import RefundCancellation from "../components/booking-progress/RefundCancellation";
import Policies from "../components/booking-progress/Policies";
import Footer from "../../../components/2Footer";
import { useState } from "react";
import Stepper from "react-stepper-horizontal";
import { IoChevronBack } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createBookingAsync } from "../slice";
import { RootState, AppDispatch } from "../../../store";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Info, Loader } from "lucide-react";
import { BookStaysRequest } from "../types";

const BookingProgress: React.FC = () => {
  const cancellationDate = new Date();
  cancellationDate.setDate(cancellationDate.getDate() + 1);
  const formattedDate = cancellationDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const formattedTime = "11:59 PM";

  const dispatch = useDispatch<AppDispatch>();
  const { searchParams } = useSelector((state: RootState) => state.stays);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedRoom, selectedRate } = location.state || {};

  const [currentStep, setCurrentStep] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  // const [isValid, setIsValid] = useState(false);
  const loggedIn = localStorage.getItem("accessToken");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    countryCode: "",
    address: "",
    postal: "",
    city: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    countryCode: "",
    address: "",
    postal: "",
    city: "",
  });
  const validatePersonalInfo = () => {
    const newErrors: any = {};
    if (!guestInfo.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!guestInfo.lastName.trim())
      newErrors.lastName = "Last name is required.";
    if (!guestInfo.dateOfBirth.trim())
      newErrors.dateOfBirth = "Date of birth is required.";
    if (
      guestInfo.dateOfBirth &&
      new Date(guestInfo.dateOfBirth).toISOString() > new Date().toISOString()
    )
      newErrors.dateOfBirth = "Date of Birth cannot be future date.";
    if (!guestInfo.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(guestInfo.email))
      newErrors.email = "Email is invalid.";
    if (!guestInfo.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!guestInfo.countryCode.trim())
      newErrors.countryCode = "Country code is required.";
    if (!guestInfo.address.trim()) newErrors.address = "Address is required.";
    if (!guestInfo.postal.trim()) newErrors.postal = "Postal code is required.";
    if (!guestInfo.city.trim()) newErrors.city = "City is required.";
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    // setIsValid(isValid);
    return isValid;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validatePersonalInfo()) {
        console.log(errors);
        return;
      }
    }
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else {
      navigate(-1);
    }
  };
  const handleSubmit = async () => {
    if (!searchParams || !accessToken || !selectedRoom) return;

    const bookingData: BookStaysRequest = {
      rate_key: selectedRoom.rates?.[0]?.rateKey || "",
      customer: {
        name: guestInfo.firstName,
        surname: guestInfo.lastName,
        email: guestInfo.email,
        phone: `${guestInfo.countryCode}${guestInfo.phone}`,
        age: new Date(guestInfo.dateOfBirth).getFullYear()
          ? new Date().getFullYear() -
            new Date(guestInfo.dateOfBirth).getFullYear()
          : 0,
        address: guestInfo.address,
        city: "New York",
        postal_code: guestInfo.postal,
        country: "US",
        children: [],
      },
      hold_suite: true,
    };
    console.log(bookingData);

    try {
      setSubmitLoading(true);
      const response = await dispatch(
        createBookingAsync({
          bookingData,
          token: accessToken,
        })
      ).unwrap();
      console.log(response);
      if (response.success && response.checkout_url) {
        window.location.href = response.checkout_url;
      } else {
        console.error("Payment failed or invalid response:", response);
      }
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error(`Booking failed: ${(error as Error).message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />

      <div className="md:w-full lg:px-10 px-4 mx-auto my-28 space-y-6">
        <div className="px-4 py-2 flex gap-6">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md shadow-sm p-1 cursor-pointer"
          >
            <IoChevronBack size={24} />
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold">
            {currentStep === 0
              ? "Booking Overview"
              : currentStep === 1
              ? "Guest Information"
              : "Payment Details"}
          </h1>
        </div>

        <div className="lg:px-4 justify-center flex items-center">
          <Stepper
            steps={[
              { title: "Booking Overview" },
              { title: "Guest Information" },
              { title: "Payment Details" },
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

        {/* {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-4 sm:mx-0">
            {error}
          </div>
        )} */}

        <div className="px-1 space-y-4">
          {currentStep === 0 && (
            <>
              <div className="bg-blue-100 border border-[#023E8A] px-4 py-2 rounded-lg flex flex-row justify-normal items-center gap-3 ">
                <GrStatusGood className="text-green-600 size-12 lg:size-6" />

                <p className=" lg:text-base text-gray-800 leading-relaxed text-sm">
                  Cancellations made after {formattedTime} on {formattedDate} or
                  no-shows are subject to a fee equal to 100% of the amount paid
                  for the reservation.
                </p>
              </div>

              {!loggedIn && (
                <div className="bg-red-100 border border-red-400 px-4 py-2 rounded-lg flex flex-row items-start sm:items-center gap-3 mx-4 sm:mx-0">
                  <Info stroke="#D72638" />

                  <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                    To continue your booking, please create an account or log
                    in.
                  </p>
                </div>
              )}

              <HotelCard
                imageUrl={
                  selectedRoom?.images[0].url ||
                  "src/assets/images/StayImage3.png"
                }
                roomDetails={selectedRoom?.description || "---"}
                name={selectedRoom?.bed_type || "---"}
                location="80 Ademola Adetokumbo Street, Victoria Island Lagos."
                refundableUntil={formattedTime || "---"}
              />
              <div className="lg:grid grid-cols-2 gap-4 items-start">
                <BookingDetails
                  roomType={selectedRoom?.description}
                  bedType={selectedRoom?.bed_type}
                  checkIn={searchParams?.checkIn}
                  checkOut={searchParams?.checkOut}
                  guests={`${searchParams?.adults} Adults${
                    searchParams?.children
                      ? `, ${searchParams.children} Children`
                      : ""
                  }`}
                />
                <div className="lg:order-5">
                  <PriceSummary
                    roomPrice={
                      selectedRate?.net ? parseFloat(selectedRate?.net) : 0
                    }
                    nights={
                      searchParams
                        ? Math.ceil(
                            (new Date(searchParams.checkOut).getTime() -
                              new Date(searchParams.checkIn).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        : 1
                    }
                    roomType={selectedRoom?.description}
                    numberOfRooms={searchParams?.rooms}
                  />
                  <div className="lg:flex  hidden justify-center items-center ">
                    <button
                      onClick={handleNext}
                      className="bg-[#023E8A] text-white p-3 mt-12 rounded-lg w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={!loggedIn}
                    >
                      Continue
                    </button>
                  </div>
                </div>
                <div className="lg:order-3">
                  <RefundCancellation
                    formattedTime={formattedTime}
                    formattedDate={formattedDate}
                    refundableUntil={formattedTime}
                  />
                </div>
                <div className="lg:order-4">
                  {" "}
                  <Policies />
                </div>
              </div>
              <div className="flex justify-center items-center lg:hidden">
                <button
                  onClick={handleNext}
                  className="bg-[#023E8A] text-white p-3 mt-12 rounded-lg lg:w-[40%] w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!loggedIn}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {currentStep === 1 && (
            <>
              <GuestInformation
                onGuestInfoChange={(info) =>
                  setGuestInfo({
                    firstName: info.firstName || "",
                    lastName: info.lastName || "",
                    email: info.email || "",
                    phone: info.phone || "",
                    dateOfBirth: info.dateOfBirth || "",
                    countryCode: info.countryCode || "",
                    address: info.address || "",
                    postal: info.postal || "",
                    city: info.city || "",
                  })
                }
                formData={guestInfo}
                errors={errors}
              />
              <div className="flex justify-center items-center">
                <button
                  onClick={handleNext}
                  className="bg-[#023E8A] text-white p-3 mt-12 rounded-lg lg:w-[40%] w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                  // disabled={!isValid}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <div>
              <PaymentMethod
                checked={isChecked}
                toggleCheck={() => setIsChecked(!isChecked)}
                roomPrice={
                  selectedRate?.net ? parseFloat(selectedRate?.net) : 0
                }
              />
              <div className="flex justify-center items-center">
                <button
                  onClick={handleSubmit}
                  disabled={!isChecked || submitLoading}
                  className={`p-3 rounded-lg mt-12 lg:w-[40%] w-full text-white disabled:bg-gray-400 disabled:cursor-not-allowed ${
                    isChecked && !submitLoading
                      ? "bg-[#023E8A] hover:bg-blue-700"
                      : "bg-gray-400"
                  }`}
                >
                  {submitLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      Processing... <Loader className="animate-spin" />
                    </div>
                  ) : (
                    "Make Payment"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingProgress;
