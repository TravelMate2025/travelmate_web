import { TextField } from "@mui/material";
import React from "react";
import { X } from "lucide-react";
type priceProps = {
  openClick: boolean;
  handleCloseClick: () => void;
  handlePriceChange: (
    field: "min" | "max",
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  openNoModal: boolean;
  handleCloseNoModal: () => void;
  handleMaxPriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  miniprice: string;
  maxprice: string;
  handleSubmitOffer: () => void;
};
const PriceRange = ({
  handleCloseClick,
  handlePriceChange,
  miniprice,
  maxprice,
  handleSubmitOffer,
}: priceProps) => {
  return (
    <div className="inset-0 fixed z-50">
      {/* Backdrop */}
      <div className="fixed inset-0" />

      {/* Modal Container */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full lg:h-auto lg:w-auto lg:min-w-sm lg:max-w-sm bg-white lg:rounded-lg shadow-2xl z-[99] flex flex-col mt-6 lg:mt-0">
        <div className="p-6 pb-0">
          <div className="lg:hidden pt-12 pb-5 flex items-center gap-24 lg:border-b border-gray-200">
            <div className="p-2 size-10 bg-white lg:border-[0.5px] lg:border-[#EBECED] shadow-md rounded-sm cursor-pointer">
              <X onClick={handleCloseClick} className="font-bold" />
            </div>
            <h2 className="text-lg font-bold text-center lg:hidden block">
              Price Range
            </h2>
          </div>
          <h2 className=" text-center lg:block hidden text-lg font-bold">
            Price Range
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <p className="mt-6 text-[#181818] font-medium text-[18px] font-inter">
            Minimum Price
          </p>
          <TextField
            id="minPrice"
            variant="outlined"
            type="text"
            size="small"
            placeholder="Enter your price"
            value={new Intl.NumberFormat().format(miniprice)}
            onChange={(e) => handlePriceChange("min", e)}
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
            value={new Intl.NumberFormat().format(maxprice)}
            onChange={(e) => handlePriceChange("max", e)}
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
        {/* 
          <div
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
            <div
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
            </div>
          </div> */}

        <div className="p-6 pt-3 mb-12 lg:mb-0 lg:mt-12">
          <button
            onClick={() => {
              handleSubmitOffer(miniprice, maxprice);
              handleCloseClick();
            }}
            disabled={!miniprice || !maxprice || (miniprice > maxprice)}
            className={`w-full p-3 lg:p-2 rounded-[6px] text-white cursor-pointer ${
              miniprice && maxprice
                ? "bg-[#023E8A]"
                : "bg-[#023E8A] cursor-not-allowed opacity-50"
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceRange;
