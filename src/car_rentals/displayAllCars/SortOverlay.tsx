import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { X } from "lucide-react";
import React from "react";

type Props = {
  closeDialog: () => void;
};
const SortOverlay = ({ closeDialog }: Props) => {
  return (
    <div>
      {" "}
      <div className="min-w-screen min-h-screen p-8 rounded-lg bg-white shadow-2xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  block z-[99] mt-12 ">
        <div className="flex justify-normal items-center gap-24 my-5 w-full">
          <div className=" p-[8px]  bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] ">
            <X onClick={closeDialog} className="font-bold " />
          </div>
          <h1 className="font-bold text-xl lg:text-2xl text-[#181818] text-center">
            Sort By
          </h1>
        </div>
        <div>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="reco"
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="reco"
                control={
                  <Radio
                    sx={{
                      color: "#023E8A",
                      "&.Mui-checked": {
                        color: "#023E8A",
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: 28,
                      },
                    }}
                  />
                }
                label="Recommended"
              />
              <FormControlLabel
                value="lth"
                control={
                  <Radio
                    sx={{
                      color: "#023E8A",
                      "&.Mui-checked": {
                        color: "#023E8A",
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: 28,
                      },
                    }}
                  />
                }
                label="Price:Low to High"
              />

              <FormControlLabel
                value="htl"
                control={
                  <Radio
                    sx={{
                      color: "#023E8A",
                      "&.Mui-checked": {
                        color: "#023E8A",
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: 28,
                      },
                    }}
                  />
                }
                label="Price: High to Low"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default SortOverlay;
