import { TextField } from "@mui/material";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
type priceProps = {
  openClick: boolean;
  handleCloseClick: () => void;
  openNoModal: boolean;
  miniprice: number;
  maxprice: number;
  handleSubmitOffer: (min: number, max: number) => void;
};
const PriceRange = ({
  handleCloseClick,
  miniprice,
  maxprice,
  handleSubmitOffer,
}: priceProps) => {
  const [localMin, setLocalMin] = useState(miniprice);
  const [localMax, setLocalMax] = useState(maxprice);

  useEffect(() => {
    setLocalMin(miniprice);
    setLocalMax(maxprice);
  }, [miniprice, maxprice]);

const handleLocalChange = (
  field: "min" | "max",
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const rawInput = event.target.value;
  const cleanedValue = rawInput.replace(/[^0-9]/g, ""); 
  const numericValue = Number(cleanedValue);

  if (field === "min") {
    setLocalMin(numericValue);
  } else {
    setLocalMax(numericValue);
  }
};
  return (
    <div className="inset-0 fixed z-50">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={handleCloseClick}/>

      {/* Modal Container */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full lg:h-auto lg:w-auto lg:min-w-sm lg:max-w-sm bg-white lg:rounded-lg shadow-2xl z-[99] flex flex-col mt-6 lg:mt-0">
        <div className="lg:p-6 py-6 pb-0">
          <div className="lg:hidden pt-12 lg:static relative pb-5 lg:border-b border-gray-200">
            <div className="p-2 absolute left-6 size-10 bg-white lg:border-[0.5px] lg:border-[#EBECED] shadow-md rounded-sm cursor-pointer">
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
            typeof="number"
            placeholder="Enter your price"
            value={new Intl.NumberFormat().format(localMin)}
            onChange={(e) => handleLocalChange("min", e)}
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
            typeof="number"
            placeholder="Enter your price"
            value={new Intl.NumberFormat().format(localMax)}
            onChange={(e) => handleLocalChange("max", e)}
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

        <div className="p-6 pt-3 mb-12 lg:mb-0 lg:mt-12">
          <button
            onClick={() => {
              handleSubmitOffer(localMin, localMax);
              handleCloseClick();
            }}
            disabled={!localMax || !localMin || localMin > localMax}
            className="w-full p-3 lg:p-2 rounded-[6px] text-white cursor-pointer bg-[#023E8A] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceRange;
