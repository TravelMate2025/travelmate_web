import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useEffect, useState } from "react";

type rideProps = {
  rideTypeModal: boolean;
  closeModal: () => void;
  selectedRide: string;
  handleSelectRide: (value: string) => void;
};

const RideType = ({
  rideTypeModal,
  closeModal,
  selectedRide,
  handleSelectRide,
}: rideProps) => {
  const [tempSelectedRide, setTempSelectedRide] = useState(selectedRide);
  useEffect(() => {
    setTempSelectedRide(selectedRide); // sync when modal opens
  }, [selectedRide, rideTypeModal]);

  const handleDone = () => {
    handleSelectRide(tempSelectedRide); // update actual value
    closeModal(); // close modal
  };
  return (
    <Dialog maxWidth="xs" fullWidth open={rideTypeModal} onClose={closeModal}>
      <DialogTitle className="border-b-1 border-b-gray-200 text-center">
        Ride Type
      </DialogTitle>
      <DialogContent sx={{padding:'0px'}}>
        <FormControl className="w-full  pb-4">
          <RadioGroup
            aria-labelledby="ride-type-label"
            name="ride-type"
            value={tempSelectedRide}
            className="border-b border-b-gray-200 mb-4"
            onChange={(e) => setTempSelectedRide(e.target.value)}
            sx={{paddingX:'10px', paddingY:"10px"}}
          >
            <FormControlLabel
              value="Private Ride"
              control={<Radio />}
              label="Private Ride"
            />
            <FormControlLabel
              value="Premium Ride"
              control={<Radio />}
              label="Premium Ride"
            />
            <FormControlLabel
              value="Shared Ride"
              control={<Radio />}
              label="Shared Ride"
            />
          </RadioGroup>
          <Button
            type="submit"
            variant="contained"
            // fullWidth
            className="bg-[#023E8A] rounded-lg p-2 text-white m-4"
            onClick={handleDone}
            sx={{backgroundColor:"#023E8A", margin:'10px'}}
          >
            Done
          </Button>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
};

export default RideType;
