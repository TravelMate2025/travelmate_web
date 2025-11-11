import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { Box, Stepper, Step, StepLabel, StepConnector } from "@mui/material";
import carImage from "../../../assets/carImage.png";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import {
  Divider,
  InputAdornment,
  TextField,
  FormControlLabel,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import Switch from "@mui/material/Switch";
import { Checkbox } from "@mui/material";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { FaCaretDown, FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import { ArrowRight, ChevronRight, Dot, Info, Loader } from "lucide-react";
import { useState } from "react";
import Complete from "./Complete";
import { FiPhone } from "react-icons/fi";
import { DeskProps } from "./Page";
import { ToastContainer } from "react-toastify";
import CountryCodeModal from "../../stays/components/modals/CountryCodeModal";

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`& .MuiStepConnector-line`]: {
    borderTopWidth: 3,
    borderColor: theme.palette.grey[400],
    transition: "border-color 0.3s ease-in-out",
  },
  [`&.Mui-completed .MuiStepConnector-line`]: {
    borderColor: "#023E8A",
  },
  [`&.Mui-active .MuiStepConnector-line`]: {
    borderColor: "#023E8A",
  },
}));

const MobilePage = ({
  activeStep,
  steps,
  handleBack,
  handleNext,
  handleConfirm,
  state,
  setState,
  handleChange,
  handleCheckboxChange,
  errors,
  isFormValids,
  handleSubmit,
  passFormData,
  setPassFormData,
  loadingSubmit,
  formData,
  isTheFormValid,
  submitted,
}: DeskProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPassFormData({
      ...passFormData,
      [id]: value,
    });
  };
  const [showAllModal, setShowAllModal] = useState(false);
  const loggedIn = localStorage.getItem("accessToken");
  const location = useLocation();
  const { car, departureInfo } = location.state || {};
  const [countryModal, setCountryModal] = useState(false);
  const handleProfileSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setState((prev: any) => ({ ...prev, jason: checked }));
    handleChange(e);

    const userInfo = JSON.parse(localStorage.getItem("persist:root") || "{}");
    const profileStr = userInfo.profile || "{}";
    ;

    type Profile = {
      // profile: {
      first_name: string;
      last_name: string;
      date_of_birth: string;
      email: string;
      mobile_number: string;
      // };
    };
    let profile: Profile = {
      first_name: "",
      last_name: "",
      date_of_birth: "",
      email: "",
      mobile_number: "",
    };
    try {
      profile = JSON.parse(profileStr).profile;
    } catch {
      // keep defaults
    }
    if (checked) {
      setPassFormData({
        firstName: profile?.first_name || "",
        lastName: profile?.last_name || "",
        dateOfBirth: profile?.date_of_birth || "",
        email: profile?.email || "",
        phone: profile?.mobile_number || "",
        countryCode: "",
      });
    } else {
      setPassFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        email: "",
        phone: "",
        countryCode: "",
      });
      (profile);
    }
  };

  const addDurationToTime = (pickupTime: string, durationStr: string) => {
    const [h, m] = pickupTime.split(":").map(Number);
    let totalMin = h * 60 + m;

    // Try to extract hours and minutes if specified
    const hourMatch = durationStr?.match(/(\d+)\s*hour(s)?/i);
    const minMatch = durationStr?.match(/(\d+)\s*min/i);

    if (hourMatch) totalMin += parseInt(hourMatch[1]) * 60;
    if (minMatch) totalMin += parseInt(minMatch[1]);

    // If only a plain number is provided (like "35"), treat as minutes
    if (!hourMatch && !minMatch && !isNaN(Number(durationStr))) {
      totalMin += Number(durationStr);
    }

    const newH = Math.floor(totalMin / 60) % 24;
    const newM = totalMin % 60;

    return `${newH.toString().padStart(2, "0")}:${newM
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div>
      <ToastContainer />
      {showAllModal && (
        <Complete closeDialog={() => setShowAllModal(false)} car={car} />
      )}
      {countryModal && (
        <CountryCodeModal
          closeDialog={() => setCountryModal(false)}
          formData={passFormData}
          setFormData={setPassFormData}
        />
      )}
      <div className="mt-4">
        <div className="lg:pt-20 pt-20 mb-6 flex justify-normal items-center px-6 gap-8">
          <div className=" p-[8px]  bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] ">
            <ArrowBackIosNewOutlinedIcon
              onClick={handleBack}
              className="font-bold cursor-pointer"
            />
          </div>
          <p className="text-center font-medium text-sm ">
            {steps[activeStep]}
          </p>
        </div>
        <Box sx={{ width: "100%" }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            connector={<CustomConnector />}
          >
            {steps.map((label: any, index) => (
              <Step key={index}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      "& .MuiStepConnector-line": {
                        borderColor: index < activeStep ? "#007BFF" : "#D3D3D3",
                      },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        {!loggedIn && (
          <div className="flex items-center gap-3 bg-red-50 p-2 rounded-md m-2 border border-[#D72638] mx-3 my-6">
            <Info stroke="#D72638" />
            <p className="text-[#181818] text-xs font-sans">
              To continue your booking, please create an account or log in.
            </p>
          </div>
        )}
        {/* <----------------------------------------------------FIRST STEP ----------------------------------------------------> */}
        {activeStep === 0 && (
          <div>
            <div className="flex items-center gap-4 p-6">
              <img
                src={car?.content?.images[0]?.url || carImage}
                alt=""
                className="w-28 h-28 p-2 object-contain bg-[#0000001A] rounded-lg"
              />
              <p className="text-[#67696D] text-[14px] ">
                {car?.vehicle.name} {car?.vehicle.code}
              </p>
            </div>

            <Divider
              sx={{ marginTop: "8px", marginBottom: "8px" }}
              className="lg:hidden"
            />

            <div className="mx-6  my-4 ">
              <p className="text-[16px] font-inter font-medium text-[#181818]">
                Trip Details
              </p>
              <div className="lg:border rounded-lg lg:p-5 mt-[10px] flex flex-col justify-normal items-start gap-4 border-[#CDCED1]">
                <div className="flex justify-normal gap-4 items-center">
                  <div className="size-6 bg-[#023E8A] rounded-full" />
                  <div>
                    <p>{departureInfo.pickupLocaDescription}</p>
                    <div className="flex items-center justify-normal gap-1 text-gray-500">
                      <FaRegCalendarAlt />
                      <p>{departureInfo.pickupDate}</p>
                      <Dot fill="#4E4F52" />
                      <FaRegClock />
                      <p>{departureInfo.pickupTime}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-5 items-center ml-3">
                  {" "}
                  <div className="border-l-2 border-l-[#4E4F52] h-16" />{" "}
                  <p className="text-[#4E4F52]">
                    {car?.content?.transferDetailInfo[0]?.value}{" "}
                    {car?.content?.transferDetailInfo[0]?.description}
                  </p>{" "}
                </div>
                <div className="flex justify-normal gap-4 items-center">
                  <div className="size-6 bg-[#D72638] rounded-full object-contain absolute" />
                  <div className="relative left-10 text-wrap">
                    <p>{departureInfo.dropoffLocation}</p>
                    <div className="flex items-center justify-normal gap-1 text-gray-500 pt-3">
                      <FaRegCalendarAlt />
                      <p>{departureInfo.pickupDate}</p>
                      <Dot fill="#4E4F52" />
                      <FaRegClock />

                      <p>
                        {addDurationToTime(
                          departureInfo.pickupTime,
                          car?.content?.transferDetailInfo[0]?.value
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Divider
              sx={{ marginTop: "8px", marginBottom: "8px" }}
              className="lg:hidden"
            />

            <div className="lg:px-6 px-3">
              <p className="text-[16px] font-inter font-medium text-[#181818] pl-3 lg:pl-0">
                Taxi Details
              </p>

              <div className="flex flex-col gap-2 items-center  mt-[10px] lg:border rounded-lg p-5 border-[#CDCED1]">
                <div className="flex justify-between items-center w-full">
                  <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                    Type
                  </p>

                  <p className="text-[#181818] text-sm font-inter">
                    {car?.category.name} Car
                  </p>
                </div>

                <div className="flex justify-between w-full items-center">
                  <p className="text-sm font-inter font-normal text-[#4E4F52]">
                    Seats
                  </p>

                  <p className="text-sm text-[#181818]">
                    {car?.maxPaxCapacity ||
                      car?.content?.transferDetailInfo[2]?.description}{" "}
                    {car?.maxPaxCapacity && `Seats`}
                  </p>
                </div>

                <div className="flex justify-between items-start w-full text-right">
                  <p className="text-sm font-inter font-normal text-[#4E4F52]">
                    Bags
                  </p>
                  <p className="text-[#181818] text-sm font-inter">
                    {car?.content?.transferDetailInfo[3]?.value}{" "}
                    {car?.content?.transferDetailInfo[3]?.description}
                  </p>
                </div>

                <div className="flex justify-between items-center w-full">
                  <p className="text-sm font-inter font-normal text-[#4E4F52]">
                    Provider
                  </p>

                  <p className="text-[#181818] text-[14px] font-inter">
                    {car?.supplier || "Not Available"}
                  </p>
                </div>
              </div>
            </div>
            <Divider
              sx={{ marginTop: "8px", marginBottom: "8px" }}
              className="lg:hidden"
            />

            <div className="lg:px-6 px-3">
              <p className="text-[16px] font-inter font-medium text-[#181818] pt-4 pl-3 lg:pl-0">
                Price Summary
              </p>
              <div className="flex  justify-between w-full itmes-center lg:border rounded-lg p-5 mt-[10px border-[#CDCED1]]">
                <p className="text-[14px] font-inter font-normal text-[#4E4F52]">
                  Total
                </p>

                <p className="text-[#181818] text-[14px] font-bold font-inter">
                  {" "}
                  €{car?.price.totalAmountWithFee}
                </p>
              </div>
            </div>

            <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} />
            <div className="lg:px-6 px-3">
              <div className="flex w-full justify-between items-center p-4 pl-3 lg:pl-0">
                <p className="text-[16px] font-inter font-bold text-[#181818]">
                  Important information
                </p>
                <div
                  className="flex gap-1 items-center text-[#023E8A]"
                  onClick={() => setShowAllModal(true)}
                >
                  <p>Show all</p>
                  <ChevronRight />
                </div>
              </div>
              <div className="lg:border rounded-lg lg:p-5 p-3 lg:mt-2 border-[#CDCED1]">
                <ul className="list-disc pl-4 flex flex-col gap-2">
                  <li>
                    Your driver will wait up to 60 minutes after your taxi
                    arrives
                  </li>
                  <li>
                    You’ll get pickup instructions in your confirmation email.
                  </li>
                </ul>
              </div>
            </div>
            <Divider
              sx={{ marginTop: "8px", marginBottom: "8px" }}
              className="lg:hidden"
            />
            <div className="lg:px-6 px-3">
              <p className="text-[16px] font-inter font-bold text-[#181818] lg:p-4 p-3 lg:pl-0">
                Refunds and Cancellations
              </p>
              <div className="lg:border rounded-lg lg:p-5 p-3 lg:mt-2 border-[#CDCED1]">
                <ul className="list-disc pl-4 flex flex-col gap-2">
                  <li>Cancellations allowed 24 hours before pick Up</li>
                  <li>Full refund if cancelled 24 hours before pick up</li>
                </ul>
              </div>
            </div>

            <Divider sx={{ marginTop: "60px", marginBottom: "20px" }} />
          </div>
        )}

        {/* <----------------------------------------------------------SECOND STEP-----------------------------------------------------------------> */}
        {activeStep === 1 && (
          <div className="lg:px-6">
            <div>
              <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} />

              <div className="">
                <div className=" mt-[10px]">
                  <div>
                    <h2 className="py-3 text-lg lg:tex-x;l font-bold p-5 lg:p-0">
                      Passenger Information
                    </h2>
                    <div className="lg:border rounded-lg p-5 border-[#CDCED1]">
                      <div className="flex justify-between gap-6 w-[100%]">
                        <div className="text-start ">
                          <p className="text-[17px] font-inter font-medium text-[#181818]">
                            Use my Profile Information
                          </p>
                          <p className="text-[#4E4F52] font-normal text-[14px]">
                            The fields will be automatically field based on your
                            information with us
                          </p>
                        </div>

                        <div className="">
                          <FormControlLabel
                            className="w-full "
                            control={
                              <Switch
                                checked={state.jason}
                                onChange={handleProfileSwitch}
                                name="jason"
                              />
                            }
                            label=""
                          />
                        </div>
                      </div>

                      <Divider
                        sx={{ marginBottom: "16px", marginTop: "16px" }}
                      />

                      <div className="flex-col gap-4 w-full">
                        <div className="block lg:grid grid-cols-2 gap-4">
                          <div className="flex flex-col mt-[10px] mb-[10px]">
                            <label
                              htmlFor="firstName"
                              className="mb-1 text-[16px] text-start font-medium"
                            >
                              First Name
                            </label>
                            <TextField
                              id="firstName"
                              variant="outlined"
                              size="small"
                              placeholder="Enter First Name"
                              value={passFormData.firstName}
                              error={!!errors.firstName && submitted}
                              helperText={submitted ? errors.firstName : ""}
                              onChange={handleInputChange}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PersonOutlineOutlinedIcon />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                width: "100%",
                                "& .MuiInputBase-root": {
                                  height: "44px",
                                  borderRadius: "8px",
                                },
                              }}
                            />
                          </div>

                          <div className="flex flex-col mt-[10px] mb-[10px]">
                            <label
                              htmlFor="lastName"
                              className="mb-1 text-[16px] text-start font-medium"
                            >
                              Last Name
                            </label>
                            <TextField
                              id="lastName"
                              variant="outlined"
                              size="small"
                              placeholder="Enter Last Name"
                              value={passFormData.lastName}
                              error={!!errors.lastName && submitted}
                              helperText={submitted ? errors.lastName : ""}
                              onChange={handleInputChange}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PersonOutlineOutlinedIcon />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                width: "100%",
                                "& .MuiInputBase-root": {
                                  height: "44px",
                                  borderRadius: "8px",
                                },
                              }}
                            />
                          </div>
                          <div className="flex flex-col col-span-full">
                            <label
                              htmlFor="dateOfBirth"
                              className="mb-1 text-[16px] text-start font-medium"
                            >
                              Date Of Birth
                            </label>
                            <TextField
                              id="dateOfBirth"
                              type="date"
                              variant="outlined"
                              size="small"
                              placeholder=""
                              value={passFormData.dateOfBirth}
                              error={!!errors.dateOfBirth && submitted}
                              helperText={submitted ? errors.dateOfBirth : ""}
                              onChange={handleInputChange}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <DateRangeOutlinedIcon />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                width: "100%",

                                "& .MuiInputBase-root": {
                                  height: "44px",
                                  borderRadius: "8px",
                                },
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <Divider
                      sx={{ marginTop: "18px", marginBottom: "8px" }}
                      className="lg:hidden"
                    />
                    <div className="">
                      <h2 className="py-3 font-bold text-lg lg:text-xl p-5 lg:p-0">
                        Contact Information
                      </h2>
                      <div className="lg:border rounded-lg p-5 block lg:grid grid-cols-2 gap-4 border-[#CDCED1]">
                        <div className="flex flex-col mb-[10px] col-span-full">
                          <label
                            htmlFor="email"
                            className="mb-1 text-[16px] text-start font-medium"
                          >
                            Email Address
                          </label>
                          <TextField
                            id="email"
                            variant="outlined"
                            size="small"
                            placeholder="name@email.com"
                            value={passFormData.email}
                            error={!!errors.email && submitted}
                            helperText={submitted ? errors.email : ""}
                            onChange={handleInputChange}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailOutlinedIcon />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              width: "100%",
                              "& .MuiInputBase-root": {
                                height: "44px",
                                borderRadius: "8px",
                              },
                            }}
                          />
                        </div>
                        <div className="flex flex-col mb-[10px]">
                          <label
                            htmlFor="countryCode"
                            className="mb-1 text-[16px] text-start font-medium"
                          >
                            Country Code
                          </label>

                          <TextField
                            id="countryCode"
                            name="countryCode"
                            variant="outlined"
                            value={passFormData.countryCode}
                            onChange={(e) => {
                              handleInputChange({
                                target: {
                                  id: "countryCode",
                                  value: e.target.value,
                                },
                              } as any);
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <FaCaretDown />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              width: "100%",
                              "& .MuiInputBase-root": {
                                height: "44px",
                                borderRadius: "8px",
                              },
                            }}
                            slotProps={{
                              input: {
                                readOnly: true,
                              },
                            }}
                            onFocus={() => setCountryModal(true)}
                            error={!!errors.countryCode && submitted}
                          />
                          {submitted && errors.countryCode && (
                            <p className="text-red-500 text-[12px] mt-1">
                              {errors.countryCode}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col mb-[10px]">
                          <label
                            htmlFor="phoneNumber"
                            className="mb-1 text-[16px] text-start font-medium"
                          >
                            Phone Number
                          </label>
                          <TextField
                            id="phone"
                            variant="outlined"
                            size="small"
                            placeholder="Enter Phone Number"
                            value={passFormData.phone}
                            error={!!errors.phone && submitted}
                            helperText={submitted ? errors.phone : ""}
                            onChange={handleInputChange}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FiPhone />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              width: "100%",
                              "& .MuiInputBase-root": {
                                height: "44px",
                                borderRadius: "8px",
                              },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Divider sx={{ marginTop: "60px", marginBottom: "20px" }} />
            </div>
          </div>
        )}

        {/* <----------------------------------------------------------------THIRD STEP ------------------------------------------> */}
        {activeStep === 2 && (
          <div className="lg:px-6 px-4 mt-12">
            <div className="border-[#CDCED1] lg:border rounded-lg p-5">
              <div className="flex items-center gap-1 mb-4">
                <img
                  src="src/assets/images/paypal.png"
                  alt="stripe icon"
                  className="lg:w-24 w-16 h-6 lg:h-10 object-cover bg-white rounded-lg p-2 border-1 border-[#CDCED1]"
                />
                <p className="font-bold text-lg">Stripe</p>
              </div>
              <div className="flex flex-col justify-center items-center gap-4 bg-[#FAFAFA] rounded-lg lg:p-26 p-12 ">
                <ArrowRight className="font-bold lg:w-12 lg:h-12 h-8 w-8" />
                <p className="text-[#4E4F52]">
                  You'll be redirected to Stripe to complete your secure payment
                </p>
              </div>
            </div>

            <p className="text-[14px] font-inter  text-[#181818] py-3 font-bold text-lg lg:text-xl">
              Price Summary
            </p>
            <div className="px-6  border-[#CDCED1] lg:border rounded-lg p-5 flex justify-between items-center w-full">
              <p className="font-bold text-[#4E4F52]">Total</p>
              <p className="font-bold">€{car?.price.totalAmountWithFee}</p>
            </div>

            <Divider
              sx={{ marginTop: "8px", marginBottom: "8px" }}
              className="lg:hidden"
            />

            <div className="px-6 mt-5">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.agreement}
                    onChange={handleCheckboxChange}
                  />
                }
                label={
                  <p className="text-[11px]">
                    I agree to the{" "}
                    <span className="text-[#023E8A]">
                      booking conditions, TravelMate terms and conditions, and
                      Privacy Policy.
                    </span>
                  </p>
                }
              />
            </div>
          </div>
        )}
        {activeStep === 2 ? (
          <div className="mx-6 my-6 flex items-center justify-center">
            <button
              className={`flex items-center justify-center gap-5 w-full lg:w-96 text-white bg-[#023E8A] h-[56px] rounded-[6px] cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed
                `}
              disabled={!isFormValids || loadingSubmit}
              onClick={handleSubmit}
            >
              <span>Pay with Stripe</span>
              {loadingSubmit && (
                <Loader className="animate-spin " stroke="#ffffff" />
              )}
            </button>
          </div>
        ) : (
          <div className="mx-6 mb-20 flex items-center justify-center">
            <button
              className="flex items-center justify-center gap-5 w-full lg:w-96 text-white h-[56px] rounded-[6px] cursor-pointer bg-[#023E8A]  disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={
                !loggedIn ||
                loadingSubmit ||
                (activeStep === 1 && !isTheFormValid)
              }
              onClick={() => {
                activeStep === 0 ? handleNext() : handleConfirm();
              }}
            >
              <span>Continue</span>
              {loadingSubmit && (
                <Loader className="animate-spin " stroke="#ffffff" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobilePage;
