import React, { useState, memo, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  Popper,
  ClickAwayListener,
  Paper,
  Divider,
  Drawer,
  useMediaQuery,
  Box,
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import type { PassengerCounts } from "../hooks/useFlightBooking";

interface PassengerSelectorProps {
  id: string;
  label: string;
  value: string;
  counts: PassengerCounts;
  onChange: (counts: PassengerCounts) => void;
}

export const PassengerSelector = memo<PassengerSelectorProps>(
  ({ id, label, value, counts, onChange }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useMediaQuery("(max-width:600px)");

    // Local editable copy so defaults are preserved and user can confirm/cancel
    const [localCounts, setLocalCounts] = useState<PassengerCounts>(counts);

    useEffect(() => {
      setLocalCounts(counts);
    }, [counts]);

    const openSelector = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setIsOpen(true);
    };

    const closeSelector = () => {
      setIsOpen(false);
      setLocalCounts(counts); // reset
    };

    const commitAndClose = () => {
      onChange(localCounts);
      setIsOpen(false);
    };

    const handleIncrement = (type: keyof PassengerCounts) => {
      setLocalCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    };

    const handleDecrement = (type: keyof PassengerCounts) => {
      setLocalCounts((prev) => {
        const min = type === "adults" ? 1 : 0;
        const newVal = prev[type] > min ? prev[type] - 1 : prev[type];
        return { ...prev, [type]: newVal };
      });
    };

    const passengerTypes = [
      {
        key: "adults" as const,
        label: "Adults",
        description: "Ages 16 and Above",
      },
      {
        key: "children" as const,
        label: "Children",
        description: "Ages 3 - 15",
      },
      { key: "infants" as const, label: "Infant", description: "Ages 0 and 2" },
    ];

    const content = (
      <Box p={2}>
        {passengerTypes.map((type, index) => {
          const min = type.key === "adults" ? 1 : 0;
          const valueForType = localCounts[type.key];

          return (
            <React.Fragment key={type.key}>
              <div className="flex justify-between mb-3 items-center">
                <div>
                  <p className="text-[16px] text-[#181818] font-inter font-semibold">
                    {type.label}
                  </p>
                  <p className="text-[#818489] text-[14px] font-inter font-normal">
                    {type.description}
                  </p>
                </div>

                <div>
                  <div className="w-[95px] h-[36px] rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                    <RemoveOutlinedIcon
                      onClick={() => handleDecrement(type.key)}
                      style={{
                        cursor: valueForType > min ? "pointer" : "not-allowed",
                        opacity: valueForType > min ? 1 : 0.45,
                      }}
                      aria-label={`decrement-${type.key}`}
                    />
                    <div>{valueForType}</div>
                    <AddOutlinedIcon
                      onClick={() => handleIncrement(type.key)}
                      style={{ cursor: "pointer" }}
                      aria-label={`increment-${type.key}`}
                    />
                  </div>
                </div>
              </div>

              {index < passengerTypes.length - 1 && (
                <Divider sx={{ marginBottom: "8px" }} />
              )}
            </React.Fragment>
          );
        })}

        <button
          onClick={commitAndClose}
          className="bg-[#023E8A] w-full h-[52px] text-white rounded-[6px] mt-[16px] font-inter text-[16px] cursor-pointer"
        >
          Done
        </button>
      </Box>
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
          placeholder="1 Passenger"
          value={value}
          onClick={openSelector}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineOutlinedIcon />
              </InputAdornment>
            ),
            readOnly: true,
          }}
          sx={{
            "& .MuiInputBase-root": {
              height: "44px",
              borderRadius: "8px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#818489",
            },
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
            onClose={closeSelector}
            PaperProps={{
              sx: {
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              },
            }}
          >
            {content}
          </Drawer>
        ) : (
          <Popper open={isOpen} anchorEl={anchorEl} placement="bottom-start">
            <ClickAwayListener onClickAway={closeSelector}>
              <Paper
                elevation={3}
                sx={{
                  width: "376px",
                  borderRadius: "6px",
                  backgroundColor: "white",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                {content}
              </Paper>
            </ClickAwayListener>
          </Popper>
        )}
      </div>
    );
  }
);

PassengerSelector.displayName = "PassengerSelector";
