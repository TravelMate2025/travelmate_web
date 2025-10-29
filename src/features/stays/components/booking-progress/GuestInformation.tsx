import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaCaretDown,
  FaPhoneAlt,
} from "react-icons/fa";
import { GuestInfoProps } from "../../slice";
import { FormControlLabel, Switch } from "@mui/material";
import CountryCodeModal from "../modals/CountryCodeModal";

interface GuestInformationProps {
  onGuestInfoChange: (info: GuestInfoProps) => void;
  formData: GuestInfoProps;
  setFormData: (data: GuestInfoProps) => void;
  errors: GuestInfoProps;
  // submitted: boolean;
}

const GuestInformation: React.FC<GuestInformationProps> = ({
  onGuestInfoChange,
  formData,
  setFormData,
  errors,
  // submitted,
}) => {
  const [useProfileInfo, setUseProfileInfo] = useState(false);
  const [modal, setModal] = useState(false);
  const [state, setState] = useState({
    gilad: true,
    jason: false,
    antoine: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    onGuestInfoChange(newData);
  };

  const handleProfileSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseProfileInfo(!useProfileInfo);
    const checked = e.target.checked;
    setState((prev: any) => ({ ...prev, jason: checked }));
    handleChange(e);

    const userInfo = JSON.parse(localStorage.getItem("persist:root") || "{}");
    const profileStr = userInfo.profile || "{}";
    console.log;

    type Profile = {
      first_name: string;
      last_name: string;
      date_of_birth: string;
      email: string;
      mobile_number: string;
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
      setFormData({
        firstName: profile?.first_name || "",
        lastName: profile?.last_name || "",
        dateOfBirth: profile?.date_of_birth || "",
        email: profile?.email || "",
        phone: profile?.mobile_number || "",
        countryCode: "",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        email: "",
        phone: "",
        countryCode: "",
      });
    }
  };
  const handleSubmit = () => {
    console.log("submitted");
  };

  return (
    <div>
      {modal && (
        <CountryCodeModal
          closeDialog={() => setModal(false)}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      <div className="w-full">
        {/* Notification */}
        {/* <div className="bg-blue-100 border border-[#023E8A] px-4 py-3 rounded-lg flex flex-row items-start sm:items-center gap-3 w-full">
          <div className="pt-1">
            <FaExclamationCircle className="text-[#023E8A] text-lg mt-4 sm:mt-0 sm:text-xl" />
          </div>
          <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
            Guests checking into hotel rooms must be 21 or older and should
            present a valid photo ID card.
          </p>
        </div> */}

        {/* <hr className="border-gray-300" /> */}

        {/* Profile Info Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex-1 py-4">
            <p className="font-semibold text-left text-lg ">
              Use my profile information
            </p>
            <p className="text-sm text-gray-600 text-left">
              This field will be automatically filled based on your information
              with us.
            </p>
          </div>
          {/* Toggle Switch */}
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 border-[1px] border-gray-300 rounded-lg p-6">
            {/* First Name */}
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-base">First Name</p>
              <div
                className={`flex items-center border  ${
                  errors.firstName ? `border-red-600` : `border-gray-300`
                }  p-2 rounded-lg`}
              >
                <FaUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter First Name"
                  className="w-full outline-none bg-transparent placeholder:text-xs"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.firstName && (
                <p className="text-red-600">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-base">Last Name</p>
              <div
                className={`flex items-center border  ${
                  errors.lastName ? `border-red-600` : `border-gray-300`
                }  p-2 rounded-lg`}
              >
                <FaUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Enter Last Name"
                  name="lastName"
                  className="w-full outline-none bg-transparent placeholder:text-xs"
                  value={formData.lastName}
                  // error={!!errors.phone && submitted}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.lastName && (
                <p className="text-red-600">{errors.lastName}</p>
              )}
            </div>

            {/* Date of Birth (Full Width) */}
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-base">Date of Birth</p>
              <div
                className={`flex items-center border  ${
                  errors.dateOfBirth ? `border-red-600` : `border-gray-300`
                }  p-2 rounded-lg col-span-1 md:col-span-2`}
              >
                <FaCalendarAlt className="text-gray-500 mr-2" />
                <input
                  type="date"
                  name="dateOfBirth"
                  className="w-full outline-none bg-transparent "
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.dateOfBirth && (
                <p className="text-red-600">{errors.dateOfBirth}</p>
              )}
            </div>
          </div>
          <div className="mt-5">
            <h5 className="py-4 font-bold text-lg">Contact Details</h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 border-[1px] border-gray-300 rounded-lg p-6">
              {/* Email Address */}
              <div className="flex flex-col gap-2  lg:col-span-2">
                <p className="font-semibold text-base">Email Address</p>
                <div
                  className={`flex items-center border  ${
                    errors.email ? `border-red-600` : `border-gray-300`
                  }  p-2 rounded-lg`}
                >
                  <FaEnvelope className="text-gray-500 mr-2" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full outline-none bg-transparent"
                    value={formData.email}
                    name="email"
                    onChange={handleChange}
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" // Email pattern validation
                  />
                </div>
                {errors.email && <p className="text-red-600">{errors.email}</p>}
              </div>
              {/* Country Code  */}
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-base">Country Code</p>
                <div
                  className={`flex items-center border  ${
                    errors.countryCode ? `border-red-600` : `border-gray-300`
                  }  p-2 rounded-lg`}
                >
                  <input
                    type="text"
                    placeholder="Select Country Code"
                    className="w-full outline-none bg-transparent cursor-pointer"
                    value={formData.countryCode}
                    name="countryCode"
                    onChange={handleChange}
                    onFocus={() => setModal(true)}
                    required
                    readOnly
                  />
                  <FaCaretDown />
                </div>
                {errors.countryCode && (
                  <p className="text-red-600">{errors.countryCode}</p>
                )}
              </div>
              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-base">Phone Number</p>
                <div
                  className={`flex items-center border  ${
                    errors.phone ? `border-red-600` : `border-gray-300`
                  }  p-2 rounded-lg`}
                >
                  <FaPhoneAlt className="text-gray-500 mr-2" />
                  <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    className="w-full outline-none bg-transparent"
                    value={formData.phone}
                    name="phone"
                    onChange={handleChange}
                    required
                    pattern="^\+?[0-9]{10,15}$" // Phone number pattern validation (basic)
                  />
                </div>
                {errors.phone && <p className="text-red-600">{errors.phone}</p>}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestInformation;
