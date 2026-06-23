import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
} from "react-icons/fa";
import { GuestInfoProps } from "../../slice";
import { FormControlLabel, Switch } from "@mui/material";

interface GuestInformationProps {
  onGuestInfoChange: (info: GuestInfoProps) => void;
  formData: GuestInfoProps;
  errors: Partial<Record<keyof GuestInfoProps, string>>;
}

const GuestInformation: React.FC<GuestInformationProps> = ({
  onGuestInfoChange,
  formData,
  errors,
}) => {
  const [useProfileInfo, setUseProfileInfo] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    onGuestInfoChange(newData);
  };

  const handleProfileSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setUseProfileInfo(checked);

    const userInfo = JSON.parse(localStorage.getItem("persist:root") || "{}");
    const profileStr = userInfo.profile || "{}";

    type Profile = {
      first_name: string;
      last_name: string;
      email: string;
    };
    let profile: Profile = {
      first_name: "",
      last_name: "",
      email: "",
    };
    try {
      profile = JSON.parse(profileStr).profile;
    } catch {
      // keep defaults
    }
    if (checked) {
      onGuestInfoChange({
        firstName: profile?.first_name || "",
        lastName: profile?.last_name || "",
        email: profile?.email || "",
      });
    } else {
      onGuestInfoChange({
        firstName: "",
        lastName: "",
        email: "",
      });
    }
  };

  return (
    <div>
      <div className="w-full">
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
                  checked={useProfileInfo}
                  onChange={handleProfileSwitch}
                  name="useProfileInfo"
                />
              }
              label=""
            />
          </div>
        </div>

        {/* Form */}
        <form>
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
            <div className="flex flex-col gap-2 lg:col-span-2">
              <p className="font-semibold text-base">Email Address</p>
              <div
                className={`flex items-center border ${
                  errors.email ? "border-red-600" : "border-gray-300"
                } p-2 rounded-lg`}
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
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                />
              </div>
              {errors.email && <p className="text-red-600">{errors.email}</p>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestInformation;
