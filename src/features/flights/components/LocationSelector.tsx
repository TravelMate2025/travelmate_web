import React, { memo, useEffect, useState } from "react";
import {
  TextField,
  InputAdornment,
  Popper,
  ClickAwayListener,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Box,
  Drawer,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Airport } from "../types";
import { useLazyFetchAirportsQuery } from "../api/flightApi";
import { useTheme } from "@mui/material/styles";

import { ScrollArea } from "./ScrollArea";

interface LocationSelectorProps {
  id: string;
  label: string;
  placeholder?: string;
  defaultValue?: Airport;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  onRemoveLocation: (location: string) => void;
  onSelect?: (location: Airport) => void;
  anchorEl: HTMLDivElement | null;
  setAnchorEl: (el: any) => HTMLDivElement | null;
}

export const LocationSelector = memo<LocationSelectorProps>(
  ({
    id,
    label,
    placeholder = "Search Destination",
    defaultValue,
    isOpen,
    setIsOpen,
    onRemoveLocation,
    onSelect,
    anchorEl,
    setAnchorEl,
  }) => {
    const [value, setValue] = useState("");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [triggerFetchAirports, { data: locations = [], isFetching,  }] =
      useLazyFetchAirportsQuery();

    const [lastSuccessfulLocations, setLastSuccessfulLocations] = useState<Airport[]>([]);
    const [searchError, setSearchError] = useState(false);

    // 🕐 Debounce delay time (ms)
    const DEBOUNCE_DELAY = 800;
    const [debouncedValue, setDebouncedValue] = useState(value);

    // Update debounced value after delay
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, DEBOUNCE_DELAY);

      return () => {
        clearTimeout(handler);
      };
    }, [value]);

    useEffect(() => {
  if (debouncedValue.trim()) {
    setSearchError(false); // reset error state
    triggerFetchAirports(debouncedValue)
      .unwrap()
      .then((res: Airport[]) => setLastSuccessfulLocations(res))
      .catch(() => setSearchError(true));
  }
    }, [debouncedValue, triggerFetchAirports]);


    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    useEffect(() => {
      if (defaultValue?.displayName) {
        setValue(defaultValue.displayName);
      }
    }, [defaultValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setValue(newValue);
      setIsOpen(true);
      if (!anchorEl) setAnchorEl(event.currentTarget);
    };

    const handleLocationSelect = (location: Airport) => {
      setValue(location.displayName);
      onSelect?.(location);
      handleClose();
    };
// const filteredLocations =  locations.filter((loc=>loc.type === "AIRPORT"));
   const resultsList = (
  <>
    {isFetching ? (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress size={24} />
      </Box>
    ) : searchError ? (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" py={4}>
        <Typography color="textSecondary" mb={2}>
          Failed to fetch locations
        </Typography>
        <button
          onClick={() => triggerFetchAirports(debouncedValue)}
          className="px-4 py-2 bg-orange-500 text-white rounded"
        >
          Retry
        </button>
      </Box>
    ) : (locations.length === 0 && lastSuccessfulLocations.length === 0) ? (
      <Box display="flex" justifyContent="center" py={4}>
        <Typography color="textSecondary">No location found</Typography>
      </Box>
    ) : (
      (locations.length > 0 ? locations : lastSuccessfulLocations).map((location, index) => (
        <React.Fragment key={location.id}>
          <div
            className="flex justify-between pl-6 pt-4 pr-6 cursor-pointer"
            onClick={() => handleLocationSelect(location)}
          >
            <div className="flex gap-2 items-center">
              <div className="h-7 w-7 rounded border border-[#FF6F1E] bg-[#FF6F1E0A] flex items-center justify-center">
                <RoomOutlinedIcon sx={{ fontSize: 16, color: "#FF6F1E" }} />
              </div>
              <Typography>
                {location.displayName.replace(/^None\s*-\s*/i, "").replace(/\(None\)/i, "").trim()}
              </Typography>
            </div>

            <CloseOutlinedIcon
              onClick={(e) => {
                e.stopPropagation();
                onRemoveLocation(location.id as string);
              }}
              sx={{ cursor: "pointer", color: "black" }}
            />
          </div>
          {index !== (locations.length > 0 ? locations : lastSuccessfulLocations).length - 1 && <Divider sx={{ mt: 2 }} />}
        </React.Fragment>
      ))
    )}
  </>
   );


    return (
      <div className="flex flex-col">
        <label htmlFor={id} className="mb-1 text-sm">
          {label}
        </label>

        <TextField
          id={id}
          variant="outlined"
          size="small"
          fullWidth
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onClick={handleClick}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnOutlinedIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiInputBase-root": { height: "44px", borderRadius: "8px" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#818489" },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#818489",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#818489",
            },
          }}
        />

        {isMobile ? (
          <Drawer
            anchor="bottom"
            open={isOpen}
            onClose={handleClose}
            PaperProps={{
              sx: {
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                height: "80vh", // ✅ Ensures it takes fixed viewport height
                display: "flex",
                flexDirection: "column",
              },
            }}
          >
            <Box sx={{ p: 2, flexShrink: 0 }}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Select Location</Typography>
                <IconButton onClick={handleClose}>
                  <CloseOutlinedIcon />
                </IconButton>
              </Box>

              <TextField
                fullWidth
                autoFocus
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  "& .MuiInputBase-root": {
                    height: "44px",
                    borderRadius: "8px",
                  },
                }}
              />
              <ScrollArea className="h-[60vh] pb-20">{resultsList}</ScrollArea>
            </Box>
          </Drawer>
        ) : (
          <Popper
            open={isOpen && (isFetching || locations.length >= 0)}
            anchorEl={anchorEl}
            placement="bottom-start"
          >
            <ClickAwayListener onClickAway={handleClose}>
              <Paper
                elevation={3}
                sx={{
                  width: "400px",
                  borderRadius: "6px",
                  maxHeight: "500px",
                  overflowY: "auto",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  backgroundColor: "white",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ pl: 3, pt: 3, pr: 3, fontWeight: 500 }}
                >
                  Recent Searches
                </Typography>
                {resultsList}
              </Paper>
            </ClickAwayListener>
          </Popper>
        )}
      </div>
    );
  }
);

LocationSelector.displayName = "LocationSelector";
