import { Dialog, DialogContent, IconButton, TextField } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import offerNot from "/src/assets/offerNot.svg";

import React from "react";
type priceProps = {
  openClick: boolean;
  handleCloseClick: () => void;
  handlePriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  openNoModal: boolean;
  handleCloseNoModal: () => void;
  handleMaxPriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  miniprice: string;
  maxprice: string;
  handleSubmitOffer: () => void;
};
const PriceRange = ({
  openClick,
  handleCloseClick,
  handlePriceChange,
  openNoModal,
  handleCloseNoModal,
  handleMaxPriceChange,
  miniprice,
  maxprice,
  handleSubmitOffer,
}: priceProps) => {
  return (
    <div>
      {" "}
      <Dialog
        open={openClick}
        onClose={handleCloseClick}
        // TransitionComponent={Transition}
        keepMounted
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
          "& .MuiPaper-root": {
            backgroundColor: "white",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",

            width: "100%",
          },
        }}
      >
        <DialogContent
          sx={{
            width: "100%",
          }}
        >
          <div className="absolute z-40 top-0 left-0 right-0 bg-white  border-gray-300 rounded-t-[10px] pl-6 pr-4 pb-3 pt-4">
            <div className="flex items-center justify-center relative">
              <IconButton
                sx={{ position: "absolute", left: "0px", top: "-5px" }}
                onClick={handleCloseClick}
              >
                <CloseOutlinedIcon className="w-[40px] h-[40px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px]" />
              </IconButton>
              <p className="text-[22px] font-inter font-medium">Price Range</p>
            </div>
          </div>

          <div className="mt-[75px]">
            <p className="mt-[24px] text-[#181818] font-medium text-[18px] font-inter">
              Minimum Price
            </p>
            <TextField
              id="minPrice"
              variant="outlined"
              type="text"
              size="small"
              placeholder="Enter your price"
              value={miniprice}
              onChange={handlePriceChange}
              sx={{
                width: "100%",
                mt: "10px",
                mb: "24px",
                "& .MuiInputBase-root": {
                  height: "44px",
                  borderRadius: "8px",
                },
                "& .MuiInputBase-input::placeholder": {
                  fontSize: "14px",
                },
              }}
            />

            <p className="text-[#181818] font-medium text-[18px] font-inter">
              Maximum Price
            </p>
            <TextField
              id="maxPrice"
              variant="outlined"
              type="text"
              size="small"
              placeholder="Enter your price"
              value={maxprice}
              onChange={handleMaxPriceChange}
              sx={{
                width: "100%",
                mt: "10px",
                mb: "24px",
                "& .MuiInputBase-root": {
                  height: "44px",
                  borderRadius: "8px",
                },
                "& .MuiInputBase-input::placeholder": {
                  fontSize: "14px",
                },
              }}
            />
          </div>

          <Dialog
            open={openNoModal}
            onClose={handleCloseNoModal}
            keepMounted
            sx={{
              "& .MuiBackdrop-root": {
                backgroundColor: "rgba(0, 0, 0, 0.3)",
              },
              "& .MuiPaper-root": {
                backgroundColor: "white",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                width: "100%",
              },
            }}
          >
            <DialogContent
              sx={{
                // maxHeight: "80vh",
                // paddingBottom: "5px",
                width: "100%",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                <div className="w-[100%]">
                  <div className="flex justify-end">
                    <IconButton>
                      <CloseOutlinedIcon
                        onClick={handleCloseNoModal}
                        className="w-[32px] h-[32px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-[0px_4px_4px_rgba(0,0,0,0.06)] rounded-[4px]"
                      />
                    </IconButton>
                  </div>
                  <div className="flex justify-center mt-[30px]">
                    <img src={offerNot} alt="" />
                  </div>
                  <p className="text-[#181818] font-medium text-[20px] font-inter mt-[20px] text-center">
                    No Cars Available in Your Price Range
                  </p>
                  <p className="text-[#67696D] font-normal text-[16px] mt-[16px] mb-[25px] text-center">
                    Please increase your minimum price or adjust your maximum
                    price to see available options.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="mt-18">
            <button
              onClick={() => {
                handleSubmitOffer();
                handleCloseClick();
              }}
              disabled={!miniprice?.trim() || !maxprice?.trim()}
              className={`w-full h-[52px] rounded-[6px] text-white cursor-pointer ${
                miniprice?.trim() && maxprice?.trim()
                  ? "bg-[#023E8A]"
                  : "bg-[#023E8A] cursor-not-allowed opacity-50"
              }`}
            >
              Submit
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PriceRange;
