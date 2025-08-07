import React from "react";
import { Card, Rating, Stack, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import circle from "../../assets/circle.svg";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import {
  Divider,
  InputAdornment,
  TextField,
  FormControlLabel,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import Switch from "@mui/material/Switch";
import { Checkbox } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import master from "../../assets/master.svg";
import visa from "../../assets/visa.svg";
import { Link } from "react-router-dom";
import Footer from "../../components/2Footer";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { Box, Stepper, Step, StepLabel } from "@mui/material";
import { CheckCircleIcon, Phone } from "lucide-react";

export type DeskProps = {
  handleBack: () => void;
  handleNext: () => void;
  steps: any[];
  activeStep: number;
  carList: any[];
  value: number;
  formData: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
    agreement: boolean;
  };
  errors: {
    cardNumber: boolean;
    cardHolder: boolean;
    expiryDate: boolean;
    cvv: boolean;
  };
  touched: {
    cardNumber: boolean;
    cardHolder: boolean;
    expiryDate: boolean;
    cvv: boolean;
  };
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  state: {
    gilad: boolean;
    jason: boolean;
    antoine: boolean;
  };
  handleChangePayment: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  isFormValid: boolean;
  isFormValids: boolean | string;
  passFormData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
  };
  setPassFormData: (passFormData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    [key: string]: any;
  }) => void;
  isTheFormValid: boolean;
  setIsTheFormValid: (isTheFormValid: boolean) => void;
};
const DeskWeb = ({
  handleBack,
  steps,
  activeStep,
  carList,
  value,
  formData,
  errors,
  touched,
  handleChange,
  state,
  handleChangePayment,
  handleBlur,
  handleCheckboxChange,
  isFormValid,
  isFormValids,
  handleSubmit,
}: DeskProps) => {
  return (
    <div>
      {" "}
      <div className=" mt-24">
        <div className="mb-6 md:hidden">
          <div className="mb-6 flex justify-between items-center gap-6">
            <div
              style={{ position: "absolute", left: "28px", top: "76px" }}
              className="w-[40px] h-[40px] p-[8px]  bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] "
            >
              <ArrowBackIosNewOutlinedIcon
                onClick={handleBack}
                className="font-bold "
              />
            </div>
            <p className="text-center font-medium text-[20px]  mt-[80px] md:px-10 px-6">
              {steps[activeStep]}
            </p>
          </div>
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        color: index <= activeStep ? "#023E8A" : "#D3D3D3", // Active/Completed = Blue, Inactive = Grey
                        // fontSize: "16px",
                        "& .MuiSvgIcon-root": {
                          backgroundColor:
                            index <= activeStep ? "#023E8A" : "#D3D3D3", // Change background color
                          color: "#fff", // White text inside step icon
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
        </div>
        <div className="md:mb-8 mb-6 md:px-10 px-6">
          <div className="border-1  border-[#023E8A] w-full bg-[#CCD8E81A] py-4 px-3 rounded-lg">
            <div className="flex gap-2">
              <div>
                <div>
                  <ErrorOutlineIcon className=" text-[#023E8A]" />
                </div>
              </div>
              <div className="text-[#181818] md:text-base text-sm">
                Cancellation allowed 24 hours before pick up
              </div>
            </div>
          </div>
        </div>
        <div className=" md:px-10 px-6">
          {carList.map((car) => (
            <Card key={car.id} className="p-5 w-full cursor-pointer">
              <div className="flex justify-between gap-2 ">
                <div className="flex gap-2">
                  <img
                    src={circle}
                    alt=""
                    className="md:w-[76px] md:h-[76px] w-12 h-12"
                  />
                  <div>
                    <div className="flex gap-[2px]">
                      <p className="mt-[10px] text-[#181818] text-[16px]">
                        Elvis
                      </p>
                      <Stack direction="row" sx={{ marginTop: "10px" }}>
                        <Rating value={1} max={1} readOnly />
                        <Typography variant="body1">{value}</Typography>
                      </Stack>
                    </div>

                    <p className="text-[#67696D] md:text-[16px] text-sm">
                      Red Toyota Corolla
                    </p>
                  </div>
                </div>

                <div className="relative ">
                  <img
                    src={car.image}
                    alt=""
                    className="md:h-[102px] md:w-[102px] w-20 h-20"
                  />
                </div>
              </div>
              <div className="flex gap-[3px] mb-1 md:mt-[-18px] mt-5">
                <p>
                  {car.seatLeft} {car.spaceleft}
                </p>
                <CircleIcon
                  sx={{
                    width: "4px",
                    height: "4px",
                    marginTop: "10px",
                    marginLeft: "2px",
                  }}
                />
                <div>
                  {car.fuelIcon} {car.full}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 py-3">
                  <CheckCircleIcon className="w-5 h-5" stroke="#2D9C5E" />
                  <p className="text-[#2D9C5E] md:text-base text-sm">
                    {car.noShows}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <CheckCircleIcon className="w-5 h-5" stroke="#2D9C5E" />
                  <p className="text-[#2D9C5E] md:text-base text-sm">
                    {car.refundable}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex md:flex-row flex-col md:justify-between justify-normal w-full gap-6 md:px-10 px-6">
          <div className="mt-[30px] md:w-1/2 w-full">
            <div className="">
              <p className="text-5 font-inter font-medium text-[#181818]">
                Passenger Information
              </p>
              <div className="border border-[#CDCED1] rounded-[10px]  p-5 mt-5">
                <div>
                  <div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-[17px] font-inter font-medium text-[#181818]">
                          Use my Profile Information
                        </p>
                        <p className="text-[#4E4F52] font-normal text-[14px]">
                          The fields will be automatically field based on your
                          information with us
                        </p>
                      </div>

                      <div>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={state.jason}
                              onChange={handleChange}
                              name="jason"
                            />
                          }
                          label=""
                        />
                      </div>
                    </div>

                    <Divider sx={{ marginBottom: "16px", marginTop: "16px" }} />
                    <p className="text-5 font-inter font-semibold text-[#181818]">
                      Primary Passenger: Adult
                    </p>

                    <div className="flex flex-col justify-between  gap-3 w-full">
                      <div className="flex justify-between md:flex-row flex-col items-center mt-5 w-full gap-3">
                        <div className="flex flex-col w-full">
                          <label htmlFor="firstName" className="mb-1 text-sm">
                            First Name
                          </label>
                          <TextField
                            id="firstName"
                            variant="outlined"
                            size="small"
                            placeholder="Enter First Name"
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
                        <div className="flex flex-col w-full">
                          <label
                            htmlFor="lastName"
                            className="mb-1 text-[14px]"
                          >
                            Last Name
                          </label>
                          <TextField
                            id="lastName"
                            variant="outlined"
                            size="small"
                            placeholder="Enter Last Name"
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
                      </div>

                      <div className="flex justify-between md:flex-row flex-col items-center mt-5 w-full gap-3">
                        <div className="flex flex-col w-full">
                          <label htmlFor="email" className="mb-1 text-[14px]">
                            Email Address
                          </label>
                          <TextField
                            id="email"
                            variant="outlined"
                            size="small"
                            placeholder="name@email.com"
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
                        <div className="flex flex-col w-full">
                          <label
                            htmlFor="phoneNumber"
                            className="mb-1 text-[14px]"
                          >
                            Phone Number
                          </label>
                          <TextField
                            id="phoneNumber"
                            variant="outlined"
                            size="small"
                            placeholder="Enter Phone Number"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Phone />
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

                    <div className="flex flex-col mt-5">
                      <label htmlFor="from" className="mb-1 text-sm">
                        Date Of Birth
                      </label>
                      <TextField
                        id="dateOfBirth"
                        type="date"
                        variant="outlined"
                        size="small"
                        placeholder="Enter Phone Number"
                        // value={from}
                        // onClick={handleFromClick}
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
            </div>

            <div className="mt-5">
              <p className="text-lg font-inter font-medium text-[#181818] py-5">
                Refunds and Cancellations
              </p>
              <div className="border border-[#CDCED1] rounded-[10px] p-5 ">
                <div>
                  <p className="mb-[28px]">Cancellations</p>
                  <div className="flex gap-4 mb-[28px]">
                    <CircleIcon
                      sx={{ width: "4px", height: "4px", marginTop: "8px" }}
                    />
                    <p>Cancellations allowed 24 hours before pick Up</p>
                  </div>
                </div>

                <Divider />

                <div>
                  <p className="mb-[28px] mt-[28px]">Refunds</p>
                  <div className="flex gap-4">
                    <CircleIcon
                      sx={{ width: "4px", height: "4px", marginTop: "8px" }}
                    />
                    <p>Full refund if cancelled 24 hours before pick up</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 w-full">
            <div className="mt-[30px]">
              <p className="text-5 font-inter font-medium text-[#181818]">
                Price Summary
              </p>
              <div className="border border-[#CDCED1] rounded-[10px] p-5 mt-5">
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

            <div className="mt-[30px]">
              <p className="text-lg font-inter font-medium text-[#181818]">
                Trip Details
              </p>
              <div className="border border-[#CDCED1] rounded-[10px] p-5 mt-5">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-[18px] font-inter font-normal text-[#4E4F52]">
                        Pick Up location
                      </p>
                    </div>
                    <div>
                      <p className="text-[#181818] text-[16px] font-inter">
                        ₦40,000
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

            <div className="mt-[30px]">
              <p className="text-lg font-inter font-medium text-[#181818]">
                Driver Details
              </p>
              <div className="border border-[#CDCED1] rounded-[10px]  p-5 mt-5">
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

            <div className="mt-[30px]">
              <p className="text-lg font-inter font-medium text-[#181818]">
                Payment Method
              </p>
              <div className="border border-[#CDCED1] rounded-[10px]  p-5 mt-5">
                <div className="flex justify-between mb-[25px]">
                  <div>
                    <CreditCardIcon /> <span>Card</span>
                  </div>
                  <div className="flex gap-3">
                    <img src={master} alt="master-card" />
                    <img src={visa} alt="visa-card" />
                  </div>
                </div>

                <div className="flex flex-col mb-5">
                  <label className="mb-[12px] text-[#181818] font-medium text-[14px]">
                    Card Number
                  </label>
                  <TextField
                    name="cardNumber"
                    type="number"
                    variant="outlined"
                    size="small"
                    placeholder="1234 5678 9876 0192"
                    value={formData.cardNumber}
                    onChange={handleChangePayment}
                    onBlur={handleBlur}
                    error={errors.cardNumber && touched.cardNumber}
                    helperText={
                      errors.cardNumber && touched.cardNumber
                        ? "Card number must be 16 digits"
                        : ""
                    }
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": {
                        height: "44px",
                        borderRadius: "8px",
                        borderColor: touched.cardNumber
                          ? errors.cardNumber
                            ? "red"
                            : "#818489"
                          : "#818489",
                      },
                    }}
                  />
                </div>

                <div className="flex flex-col mb-5">
                  <label className="mb-[12px] text-[#181818] font-medium text-[14px]">
                    Cardholder's Name
                  </label>
                  <TextField
                    name="cardHolder"
                    type="text"
                    variant="outlined"
                    size="small"
                    placeholder="Enter Name"
                    value={formData.cardHolder}
                    onChange={handleChangePayment}
                    error={errors.cardHolder && touched.cardHolder}
                    helperText={
                      errors.cardHolder && touched.cardHolder
                        ? "Cardholder's name is required"
                        : ""
                    }
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": {
                        height: "44px",
                        borderRadius: "8px",
                        borderColor: touched.cardHolder
                          ? errors.cardHolder
                            ? "red"
                            : "#818489"
                          : "#818489",
                      },
                    }}
                  />
                </div>

                <div className="flex flex-col mb-5">
                  <label className="mb-[12px] text-[#181818] font-medium text-[14px]">
                    Expiry Date
                  </label>
                  <TextField
                    name="expiryDate"
                    type="month"
                    variant="outlined"
                    size="small"
                    value={formData.expiryDate}
                    onChange={handleChangePayment}
                    error={errors.expiryDate && touched.expiryDate}
                    helperText={
                      errors.expiryDate && touched.expiryDate
                        ? "Expiry date is required"
                        : ""
                    }
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": {
                        height: "44px",
                        borderRadius: "8px",
                        borderColor: touched.expiryDate
                          ? errors.expiryDate
                            ? "red"
                            : "#818489"
                          : "#818489",
                      },
                    }}
                  />
                </div>

                <div className="flex flex-col mb-5">
                  <label className="mb-[12px] text-[#181818] font-medium text-[14px]">
                    CVV
                  </label>
                  <TextField
                    name="cvv"
                    type="number"
                    variant="outlined"
                    size="small"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleChangePayment}
                    error={errors.cvv && touched.cvv}
                    helperText={
                      errors.cvv && touched.cvv ? "CVV must be 3 digits" : ""
                    }
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": {
                        height: "44px",
                        borderRadius: "8px",
                        borderColor: touched.cvv
                          ? errors.cvv
                            ? "red"
                            : "#818489"
                          : "#818489",
                      },
                    }}
                  />
                </div>
                <FormControlLabel
                  control={<Checkbox disabled={!isFormValids} />}
                  label="Set as default Payment Method"
                />
              </div>
            </div>

            <div className="ml-[3px] mt-[30px]">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.agreement}
                    onChange={handleCheckboxChange}
                  />
                }
                label={
                  <p>
                    I agree to the{" "}
                    <span className="text-[#023E8A]">
                      booking conditions, TravelMate terms, and Privacy Policy.
                    </span>
                  </p>
                }
              />
            </div>

            <Link to="/car-payment-successful">
              <div className="mt-[32px]">
                <button
                  className={`w-full text-white h-[56px] rounded-[6px] cursor-pointer ${
                    isFormValid
                      ? "bg-[#023E8A]"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!isFormValid}
                  onClick={handleSubmit}
                >
                  Make Payment
                </button>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-[197px]">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DeskWeb;
