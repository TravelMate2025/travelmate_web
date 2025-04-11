import React, { useState } from "react";
import {
  TextField,
  Popper,
  Paper,
  Typography,
  InputAdornment,
  Divider,
  ClickAwayListener,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

interface LocationDropdownProps {
  label: string;
  placeholder?: string;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  locations: string[];
  onRemoveLocation: (location: string) => void;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({
  label,
  placeholder = "Enter destination",
  selectedValue,
  setSelectedValue,
  locations,
  onRemoveLocation,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (location: string) => {
    setSelectedValue(location);
    handleClose();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label className="mb-1 text-gray-700 text-sm">{label}</label>
      <TextField
        variant="outlined"
        size="small"
        placeholder={placeholder}
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
        onClick={handleClick}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon />
            </InputAdornment>
          ),
        }}
        className="w-full md:w-[23vw] lg:w-[23vw]"
        sx={{
          "& .MuiInputBase-root": { height: "44px", borderRadius: "8px" },
        }}
      />

      <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            elevation={3}
            sx={{
              width: "317px",
              borderRadius: "6px",
              backgroundColor: "white",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              paddingBottom: "25px",
            }}
          >
            <Typography variant="subtitle1" className="font-inter text-[#343537] text-lg p-4">
              Recent Destinations
            </Typography>

            {locations.length === 0 ? (
              <Typography sx={{ textAlign: "center", padding: "20px", color: "#777" }} className="font-inter">
                No recent destinations
              </Typography>
            ) : (
              locations.map((location, index) => (
                <React.Fragment key={location}>
                  <div className="flex justify-between items-center px-6 py-3 cursor-pointer">
                    <div className="flex gap-2" onClick={() => handleOptionClick(location)}>
                      <div className="h-[28px] w-[28px] rounded-[4px] border border-[#FF6F1E] bg-[#FF6F1E0A] flex items-center justify-center">
                        <RoomOutlinedIcon className="text-[#FF6F1E]" sx={{ fontSize: "16px" }} />
                      </div>
                      <p>{location}</p>
                    </div>
                    <CloseOutlinedIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveLocation(location);
                      }}
                      className="cursor-pointer"
                      sx={{ color: "gray" }}
                    />
                  </div>
                  {index !== locations.length - 1 && <Divider sx={{ marginTop: "15px" }} />}
                </React.Fragment>
              ))
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

export default LocationDropdown;
