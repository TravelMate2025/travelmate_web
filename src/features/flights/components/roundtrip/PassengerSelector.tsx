import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Popper,
  Paper,
  ClickAwayListener,
  Divider,
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";

interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

interface PassengersSelectorProps {
  passengers: string;
  setPassengers: (value: string) => void;
  counts: PassengerCounts;
  handleIncrement: (type: keyof PassengerCounts) => void;
  handleDecrement: (type: keyof PassengerCounts) => void;
  handleDone: () => void;
  anchorEl: null | HTMLElement;
  setAnchorEl: (el: null | HTMLElement) => void;
}

const PassengersSelector: React.FC<PassengersSelectorProps> = ({
  passengers,
  setPassengers,
  counts,
  handleIncrement,
  handleDecrement,
  handleDone,
  anchorEl,
  setAnchorEl,
}) => (
  <Box sx={{ display: "flex", flexDirection: "column" }}>
    <label htmlFor="passengers" className="text-[14px] mb-2">
      Passengers
    </label>
    <TextField
      id="passengers"
      variant="outlined"
      size="small"
      placeholder="1 Passenger"
      value={passengers}
      onClick={(e) => setAnchorEl(e.currentTarget)}
      onChange={(e) => setPassengers(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PersonOutlineOutlinedIcon />
          </InputAdornment>
        ),
      }}
      sx={{
        width: "200px",
        "& .MuiInputBase-root": { height: "44px", borderRadius: "8px" },
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#818489" },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#818489" },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#818489",
        },
      }}
    />

    <Popper
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      placement="bottom-start"
      modifiers={[{ name: "preventOverflow", options: { boundary: "window" } }]}
    >
      <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
        <Paper
          elevation={3}
          sx={{
            width: "376px",
            borderRadius: "6px",
            bg: "white",
            p: 2,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {(["adults", "children", "infants"] as (keyof PassengerCounts)[]).map(
            (type, idx) => (
              <React.Fragment key={type}>
                <div className="flex justify-between mb-3">
                  <div>
                    <p className="text-[16px] font-semibold text-[#181818] font-inter capitalize">
                      {type}
                    </p>
                    <p className="text-[#818489] text-[14px] font-inter font-normal">
                      {type === "adults"
                        ? "Ages 16 and Above"
                        : type === "children"
                        ? "Ages 3 - 15"
                        : "Ages 0 - 2"}
                    </p>
                  </div>
                  <div className="w-[95px] h-[30px] mt-1.5 rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                    <RemoveOutlinedIcon
                      className="text-[#ACAEB3] cursor-pointer"
                      onClick={() => handleDecrement(type)}
                    />
                    <div>{counts[type]}</div>
                    <AddOutlinedIcon
                      className="cursor-pointer"
                      onClick={() => handleIncrement(type)}
                    />
                  </div>
                </div>
                {idx !== 2 && <Divider sx={{ mb: 1 }} />}
              </React.Fragment>
            )
          )}
          <button
            onClick={handleDone}
            className="bg-[#023E8A] w-full h-[52px] text-white rounded-[6px] mt-[20px] font-inter text-[16px] cursor-pointer"
          >
            Done
          </button>
        </Paper>
      </ClickAwayListener>
    </Popper>
  </Box>
);

export default PassengersSelector;
