import React, { useState } from "react";
import {
  TextField,
  Popper,
  Paper,
  Typography,
  InputAdornment,
  Divider,
  ClickAwayListener,
  CircularProgress,
  Box,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useMediaQuery } from "react-responsive";

interface Destination {
  name: string;
  code: string;
}
interface LocationDropdownProps {
  label: string;
  placeholder?: string;
  selectedValue: string;
  setSelectedValue: (
    name: string,
    code: string,
    isHotelNavigation?: boolean
  ) => void;
  locations: Destination[];
  loading?: boolean;
  onRemoveLocation?: (location: string) => void;
  token?: string | null;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({
  label,
  placeholder = "Enter destination",
  selectedValue,
  setSelectedValue,
  locations,
  loading = false,
  onRemoveLocation,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(e.target.value, "");
    setSearchQuery(e.target.value);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (location: Destination) => {
    setSelectedValue(location.name, location.code);
    handleClose();
  };

  const filteredLocations = (locations || [])
    .filter((location): location is Destination => {
      return !!location && typeof location.name === "string";
    })
    .filter((location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const isLoading = loading;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label className="mb-1 text-gray-700 text-sm">{label}</label>
      <TextField
        variant="outlined"
        size="small"
        placeholder={placeholder}
        value={selectedValue}
        onChange={handleInputChange}
        onClick={handleClick}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon />
            </InputAdornment>
          ),
          endAdornment: isLoading ? (
            <InputAdornment position="end">
              <CircularProgress size={20} />
            </InputAdornment>
          ) : null,
        }}
        className="w-full md:w-[23vw] lg:w-[23vw]"
        sx={{
          "& .MuiInputBase-root": { height: "44px", borderRadius: "8px" },
        }}
      />

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            className="w-full md:w-[23vw] lg:w-[23vw]"
            elevation={3}
            sx={{
              width: isMobile ? "100%" : "300px",
              borderRadius: "6px",
              backgroundColor: "white",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              paddingBottom: "25px",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {isLoading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <div className="w-full">
                {/* <Typography
                  variant="subtitle1"
                  className="font-inter text-[#343537] text-lg p-4 text-center"
                >
                   {searchQuery.length>2 && "Available Destinations"}
                </Typography> */}

                {filteredLocations.length === 0 ? (
                  <Typography
                    sx={{ textAlign: "center", padding: "20px", color: "#777" }}
                    className="font-inter"
                  >
                    {searchQuery.length>2 && "No matching destinations"}
                  </Typography>
                ) : (
                  filteredLocations.map((location, index) => (
                    <React.Fragment key={location.code}>
                      <div className="flex justify-between items-center px-6 py-3 cursor-pointer hover:bg-gray-50">
                        <div
                          className="flex gap-4 w-full items-center justify-normal"
                          onClick={() => handleOptionClick(location)}
                        >
                          <div className="h-[28px] w-[28px] rounded-[4px] border border-[#FF6F1E] bg-[#FF6F1E0A] flex items-center justify-center">
                            <RoomOutlinedIcon
                              className="text-[#FF6F1E]"
                              sx={{ fontSize: "16px" }}
                            />
                          </div>
                          <div className="flex flex-col">
                            <p className="font-medium">{location.name}</p>
                            <p className="text-sm text-gray-500">
                              {location.code}
                            </p>
                          </div>
                        </div>
                        {onRemoveLocation && (
                          <CloseOutlinedIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveLocation(location.name);
                            }}
                            className="cursor-pointer hover:text-red-500"
                            sx={{ color: "gray" }}
                          />
                        )}
                      </div>
                      {index !== filteredLocations.length - 1 && (
                        <Divider sx={{ marginTop: "15px" }} />
                      )}
                    </React.Fragment>
                  ))
                )}
              </div>
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

export default LocationDropdown;
