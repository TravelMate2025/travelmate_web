import {
  Divider,
  FormControlLabel,
  InputAdornment,
  Switch,
  TextField,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { FiPhone } from "react-icons/fi";
import { DeskProps } from "../Page";
import { FaCaretDown } from "react-icons/fa";

type props = { setCountryModal: (data: boolean) => void };
type PersonalInfoProps = props & DeskProps;

const PersonalInfo = ({
  setCountryModal,
  passFormData,
  setPassFormData,
  state,
  setState,
  handleChange,
  submitted,
  errors,
}: PersonalInfoProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPassFormData({
      ...passFormData,
      [id]: value,
    });
  };
  const handleProfileSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setState((prev: any) => ({ ...prev, jason: checked }));
    handleChange(e);

    const userInfo = JSON.parse(localStorage.getItem("persist:root") || "{}");
    const profileStr = userInfo.profile || "{}";
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
      profile;
    }
  };

  return (
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

                <Divider sx={{ marginBottom: "16px", marginTop: "16px" }} />

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
  );
};

export default PersonalInfo;
