

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BeachSide from "../../assets/beachside.svg";

const Updates = () => {
  return (
    <div className="bg-[#CCD8E833] w-full h-[100%] pb-20 mb-24">
      <div className="w-[90%] mx-auto">
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6">

          <div className="pt-16 md:pt-28 text-center md:text-left w-full md:w-1/2">
            <p className="text-2xl font-semibold font-inter text-[#181818] mt-3">
              Get Updates & Exclusive Offers
            </p>
            <p className="text-[#4E4F52] font-inter mb-6">
              Subscribe to our newsletter and never miss out on great deals.
            </p>

        
            <div className="flex flex-col sm:flex-row gap-4">
              <Box sx={{ width: "100%" }}>
                <TextField
                  id="from"
                  variant="outlined"
                  size="small"
                  placeholder="Enter Email Address"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: "100%",
                    "& .MuiInputBase-root": { height: "44px" },
                    "& .MuiOutlinedInput-input": { fontSize: "14px" },
                    "& .MuiInputAdornment-root svg": { fontSize: "20px" },
                  }}
                />
              </Box>

              <button className="bg-[#023E8A] h-[44px] px-6 text-white font-inter text-sm rounded-md">
                Subscribe
              </button>
            </div>
          </div>

          <div className="w-full mt-[75px] mt:0 md:w-1/2 flex justify-center md:justify-end">
            <img src={BeachSide} alt="Beach Side" className="w-full h-auto md:max-w-[400px]" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Updates;
