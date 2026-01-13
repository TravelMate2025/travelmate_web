import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { X } from "lucide-react";
import { useState } from "react";

type rideProps = {
  closeModal: () => void;
  selectedRide: string;
  handleSelectRide: (value: string) => void;
};

const RideType = ({
  closeModal,
  selectedRide,
  handleSelectRide,
}: rideProps) => {
  const [tempSelectedRide, setTempSelectedRide] = useState(selectedRide);

  const handleDone = () => {
    handleSelectRide(tempSelectedRide);
    closeModal();
  };

  return (
    <div className="inset-0 fixed z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 " onClick={closeModal} />
      
      {/* Modal Container */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full lg:h-auto lg:w-auto lg:min-w-[500px] lg:max-w-[600px] bg-white lg:rounded-lg shadow-2xl z-[99] flex flex-col mt-6 lg:mt-0">
        
        {/* Mobile Header */}
        <div className="lg:hidden pt-12 px-6 pb-5  lg:border-b border-gray-200 mt-4">
          <div className="p-2 absolute left-6 size-10 bg-white lg:border-[0.5px] lg:border-[#EBECED] shadow-md rounded-sm cursor-pointer">
            <X onClick={closeModal} className="font-bold" />
          </div>
          <h2 className="text-lg font-bold text-center">Ride Type</h2>
        </div>

        {/* Desktop Header */}
        <h2 className="hidden lg:block lg:border-b border-gray-200 text-center text-lg font-bold py-4 px-6">
          Ride Type
        </h2>

        {/* Content - Scrollable if needed */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <FormControl className="w-full">
            <RadioGroup
              aria-labelledby="ride-type-label"
              name="ride-type"
              value={tempSelectedRide}
              onChange={(e) => setTempSelectedRide(e.target.value)}
              sx={{ paddingY: "10px" }}
            >
              <FormControlLabel
                value="Private Ride"
                control={<Radio />}
                label="Private Ride"
              />
              <FormControlLabel
                value="Shared Ride"
                control={<Radio />}
                label="Shared Ride"
              />
              <FormControlLabel
                value="Private and Shared Ride"
                control={<Radio />}
                label="Private and Shared Ride"
              />
            </RadioGroup>
          </FormControl>
        </div>

        {/* Button - Sticky at bottom */}
        <div className="lg:border-t lg:border-gray-200 p-4 lg:p-6 bg-white mb-12 lg:mb-0">
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="bg-[#023E8A] rounded-lg text-white"
            onClick={handleDone}
            sx={{
              backgroundColor: "#023E8A",
              padding: "12px",
              "&:hover": {
                backgroundColor: "#012a5e",
              },
            }}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RideType;