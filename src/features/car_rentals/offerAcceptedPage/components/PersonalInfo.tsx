import {
  Divider,
  FormControlLabel,
  InputAdornment,
  Switch,
  TextField,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { FiPhone } from "react-icons/fi";
import { DeskProps } from "../Page";

const PersonalInfo = ({
  passFormData,
  setPassFormData,
  state,
  setState,
  handleChange,
  submitted,
  errors,
}: DeskProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPassFormData({
      ...passFormData,
      [id]: value,
    });
  };

  const handleProfileSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setState((prev) => ({ ...prev, jason: checked }));
    handleChange(e);

    const userInfo = JSON.parse(localStorage.getItem("persist:root") || "{}");
    const profileStr = userInfo.profile || "{}";
    type Profile = {
      first_name: string;
      last_name: string;
      email: string;
      mobile_number: string;
    };
    let profile: Profile = { first_name: "", last_name: "", email: "", mobile_number: "" };
    try {
      profile = JSON.parse(profileStr).profile;
    } catch {
      // keep defaults
    }
    if (checked) {
      setPassFormData({
        firstName: profile?.first_name || "",
        lastName: profile?.last_name || "",
        email: profile?.email || "",
        phone: profile?.mobile_number || "",
      });
    } else {
      setPassFormData({ firstName: "", lastName: "", email: "", phone: "" });
    }
  };

  return (
    <div className="lg:px-6">
      <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} />

      <div className="mt-[10px]">
        <h2 className="py-3 text-lg font-bold p-5 lg:p-0">Guest details</h2>
        <div className="lg:border rounded-lg p-5 border-[#CDCED1]">
          <div className="flex justify-between gap-6 w-full">
            <div className="text-start">
              <p className="text-[17px] font-medium text-[#181818]">
                Use my Profile Information
              </p>
              <p className="text-[#4E4F52] font-normal text-[14px]">
                The fields will be filled automatically from your saved profile information.
              </p>
            </div>
            <FormControlLabel
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

          <Divider sx={{ marginBottom: "16px", marginTop: "16px" }} />

          <div className="block lg:grid grid-cols-2 gap-4">
            <div className="flex flex-col mt-[10px] mb-[10px]">
              <label htmlFor="firstName" className="mb-1 text-[16px] text-start font-medium">
                First Name
              </label>
              <TextField
                id="firstName"
                variant="outlined"
                size="small"
                placeholder="Enter first name"
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
                sx={{ width: "100%", "& .MuiInputBase-root": { height: "44px", borderRadius: "8px" } }}
              />
            </div>

            <div className="flex flex-col mt-[10px] mb-[10px]">
              <label htmlFor="lastName" className="mb-1 text-[16px] text-start font-medium">
                Last Name
              </label>
              <TextField
                id="lastName"
                variant="outlined"
                size="small"
                placeholder="Enter last name"
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
                sx={{ width: "100%", "& .MuiInputBase-root": { height: "44px", borderRadius: "8px" } }}
              />
            </div>

          </div>
        </div>

        <Divider sx={{ marginTop: "18px", marginBottom: "8px" }} className="lg:hidden" />

        <h2 className="py-3 font-bold text-lg p-5 lg:p-0">Contact Information</h2>
        <div className="lg:border rounded-lg p-5 block lg:grid grid-cols-2 gap-4 border-[#CDCED1]">
          <div className="flex flex-col mb-[10px] col-span-full">
            <label htmlFor="email" className="mb-1 text-[16px] text-start font-medium">
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
              sx={{ width: "100%", "& .MuiInputBase-root": { height: "44px", borderRadius: "8px" } }}
            />
          </div>

          <div className="flex flex-col mb-[10px] col-span-full">
            <label htmlFor="phone" className="mb-1 text-[16px] text-start font-medium">
              Phone Number
            </label>
            <TextField
              id="phone"
              variant="outlined"
              size="small"
              placeholder="+234 800 000 0000"
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
              sx={{ width: "100%", "& .MuiInputBase-root": { height: "44px", borderRadius: "8px" } }}
            />
          </div>
        </div>
      </div>

      <Divider sx={{ marginTop: "60px", marginBottom: "20px" }} />
    </div>
  );
};

export default PersonalInfo;
