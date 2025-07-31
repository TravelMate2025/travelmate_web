import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { SearchIcon, X } from "lucide-react";
type Props = {
  searchPickOrDrop: boolean;
  closeDialog: () => void;
  handleFromClick: (event: React.MouseEvent<HTMLElement>) => void;
  pickOrDrop: string;
  value: string;
  setValue: (value: string) => void;
};
const SearchLoaction = ({
  closeDialog,
  handleFromClick,
  pickOrDrop,
  value,
  setValue
}: Props) => {
  return (
    <>
      <div className="min-w-screen min-h-screen p-8 rounded-lg bg-white shadow-2xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:hidden block z-[99] mt-5 ">
        <div className="flex justify-normal items-center gap-24 my-5 w-full">
          <div className=" p-[8px]  bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] ">
            <X onClick={closeDialog} className="font-bold " />
          </div>
          <h2 className="font-bold text-lg">
            {pickOrDrop === "pick" ? `Pick Up` : `Drop Off`}
          </h2>
        </div>
        <div className="mt-6">
          <TextField
            id="to"
            variant="outlined"
            size="small"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onClick={handleFromClick}
            placeholder={
              pickOrDrop === "pick" ? "Search Airports" : "Search Destinations"
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            className=" w-full"
            sx={{
              "& .MuiInputBase-root": {
                height: "44px",
                borderRadius: "8px",
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default SearchLoaction;
