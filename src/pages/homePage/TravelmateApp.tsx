import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import playstore from "../../assets/playstore.svg";
import googleplay from "../../assets/googleplay.svg";
import scan from "../../assets/scan.svg";

const TravelmateApp = () => {
  return (
    <div className="w-[90%] mx-auto">
      <div className="bg-white mt-24 w-full h-auto p-8 border border-[#CDCED1] rounded-md shadow-md shadow-[#00000014] mb-24">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          
          {/* Left Section */}
          <div className="w-full md:w-1/2">
            <p className="text-2xl font-semibold font-inter text-[#181818]">
              Get the TravelMate App Now!
            </p>
            <p className="text-[#4E4F52] font-inter mt-2">
              Discover hotel, flight, and rental car deals exclusively in the app.
            </p>
            <p className="text-[#4E4F52] font-inter mt-2">
              Download today to stay connected with important trip details.
            </p>

            {/* Input & Button */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
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

            <button className="bg-[#023E8A] w-full sm:w-40 h-[44px] px-6 text-white font-inter text-sm rounded-md">
            Send Link
            </button>

            </div>
          </div>

          {/* Right Section - Images */}
          <div className="flex flex-col sm:flex-row gap-6 items-center md:items-start">
            <div className="flex flex-col items-center sm:items-start mt-5">
              <img src={googleplay} alt="Google Play" className="max-w-[150px] sm:max-w-[180px] w-full h-[66px] mb-4" />
              <img src={playstore} alt="Play Store" className="max-w-[150px] sm:max-w-[180px] w-full h-[66px]" />
            </div>

            <div>
              <img src={scan} alt="QR Code" className="max-w-[120px] mt-4 sm:max-w-[150px] w-full h-[156px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelmateApp;
