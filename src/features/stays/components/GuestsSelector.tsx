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

export interface GuestCounts {
  adults: number;
  children: number;
  rooms: number;
}

interface GuestsSelectorProps {
  id: string;
  label: string;
  counts: GuestCounts;
  onChange: (counts: GuestCounts) => void;
}

// Mirrors the Flights tab's PassengerSelector (one field, opens a
// stepper popover/drawer) instead of Stays' previous three separate
// Adults/Children/Rooms number inputs -- consolidated so the Stays form
// can sit in a single row like Flights and Transfers do.
export const GuestsSelector = memo<GuestsSelectorProps>(
  ({ id, label, counts, onChange }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useMediaQuery("(max-width:600px)");

    const [localCounts, setLocalCounts] = useState<GuestCounts>(counts);

    useEffect(() => {
      setLocalCounts(counts);
    }, [counts]);

    const openSelector = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setIsOpen(true);
    };

    const closeSelector = () => {
      setIsOpen(false);
      setLocalCounts(counts);
    };

    const commitAndClose = () => {
      onChange(localCounts);
      setIsOpen(false);
    };

    const handleIncrement = (type: keyof GuestCounts) => {
      setLocalCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    };

    const handleDecrement = (type: keyof GuestCounts) => {
      setLocalCounts((prev) => {
        const min = type === "children" ? 0 : 1;
        const newVal = prev[type] > min ? prev[type] - 1 : prev[type];
        return { ...prev, [type]: newVal };
      });
    };

    const guestTypes = [
      { key: "adults" as const, label: "Adults", description: "Ages 16 and above" },
      { key: "children" as const, label: "Children", description: "Ages 0 - 15" },
      { key: "rooms" as const, label: "Rooms", description: "How many rooms you need" },
    ];

    // Children omitted from the summary when zero (the common case) so the
    // text fits the field at the same width as the other single-row
    // fields instead of truncating -- the full breakdown is always one
    // click away in the popover/drawer.
    const value = [
      `${counts.adults} Adult${counts.adults === 1 ? "" : "s"}`,
      counts.children > 0 ? `${counts.children} Child${counts.children === 1 ? "" : "ren"}` : null,
      `${counts.rooms} Room${counts.rooms === 1 ? "" : "s"}`,
    ]
      .filter(Boolean)
      .join(", ");

    const content = (
      <Box p={2}>
        {guestTypes.map((type, index) => {
          const min = type.key === "children" ? 0 : 1;
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

              {index < guestTypes.length - 1 && <Divider sx={{ marginBottom: "8px" }} />}
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
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor={id} className="text-sm text-gray-700">
          {label}
        </label>
        <TextField
          id={id}
          variant="outlined"
          size="small"
          fullWidth
          value={value}
          onClick={openSelector}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineOutlinedIcon sx={{ color: "#8A9096" }} />
              </InputAdornment>
            ),
            readOnly: true,
          }}
          sx={{
            "& .MuiInputBase-root": { height: "48px", borderRadius: "12px", cursor: "pointer" },
            // This field's text is the longest of the row (adult/child/room
            // breakdown) -- a touch smaller than the other fields' 14px so
            // the worst case (adults + children + rooms all present)
            // doesn't truncate at the same field width.
            "& .MuiInputBase-input": { cursor: "pointer", fontSize: "13px" },
          }}
        />

        {isMobile ? (
          <Drawer
            anchor="bottom"
            open={isOpen}
            onClose={closeSelector}
            PaperProps={{
              sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, minHeight: "50vh" },
            }}
          >
            {content}
          </Drawer>
        ) : (
          <Popper open={isOpen} anchorEl={anchorEl} placement="bottom-start" sx={{ zIndex: 1300 }}>
            <ClickAwayListener onClickAway={closeSelector}>
              <Paper
                elevation={3}
                sx={{
                  width: "340px",
                  borderRadius: "12px",
                  backgroundColor: "white",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  mt: "6px",
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

GuestsSelector.displayName = "GuestsSelector";
