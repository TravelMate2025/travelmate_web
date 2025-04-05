// components/HotelGuestSelector.tsx
import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Dialog,
  DialogContent,
  Divider,
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";

interface Counts {
  rooms: number;
  adults: number;
  children: number;
  infants: number;
}

interface HotelGuestSelectorProps {
  guestText: string;
  handleOpen: (e: React.MouseEvent<HTMLElement>) => void;
  guestAnchor: HTMLElement | null;
  handleClose: () => void;
  handleIncrement: (key: keyof Counts) => void;
  handleDecrement: (key: keyof Counts) => void;
  counts: Counts;
  updateGuestText: () => void;
}

const HotelGuestSelector: React.FC<HotelGuestSelectorProps> = ({
  guestText,
  handleOpen,
  guestAnchor,
  handleClose,
  handleIncrement,
  handleDecrement,
  counts,
  updateGuestText,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor="guests" className="mb-1 text-[16px] font-medium text-gray-500">
        Rooms & Guests
      </label>
      <TextField
        id="guests"
        variant="outlined"
        size="small"
        placeholder="1 Room, 2 Guests"
        value={guestText}
        onClick={handleOpen}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonOutlineOutlinedIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          width: "100%",
          "& .MuiInputBase-root": { height: "44px", borderRadius: "8px" },
          
        }}
      />

        <Dialog
            open={Boolean(guestAnchor)}
            onClose={handleClose}
            hideBackdrop
            sx={{
                "& .MuiPaper-root": {
                backgroundColor: "white",
                borderRadius: "10px",
                boxShadow: 3,
                width: 320,
                position: "absolute",
                top: 100, // adjust this or calculate from guestAnchor
                left: "50%",
                transform: "translateX(-50%)",
                },
            }}
            >
            <DialogContent
                sx={{
                overflowY: "auto",
                paddingY: 2,
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
                }}
            >
                {/* Removed Header */}
                {[
                { label: "Number of Rooms", key: "rooms", note: "" },
                { label: "Adults", key: "adults", note: "Ages 16 and above" },
                { label: "Children", key: "children", note: "Ages 3 – 15" },
                { label: "Infants", key: "infants", note: "Ages 0 – 2" },
                ].map(({ label, key, note }) => (
                <div key={key}>
                    <div className="flex justify-between mb-3">
                    <div>
                        <p className="text-[16px] font-semibold">{label}</p>
                        {note && <p className="text-sm text-[#818489]">{note}</p>}
                    </div>
                    <div className="w-[95px] h-[30px] rounded-[4px] border border-[#023E8A] flex justify-between items-center px-2">
                        <RemoveOutlinedIcon
                        className="text-[#ACAEB3] cursor-pointer"
                        onClick={() => handleDecrement(key as keyof Counts)}
                        />
                        <div>{counts[key as keyof Counts]}</div>
                        <AddOutlinedIcon
                        className="cursor-pointer"
                        onClick={() => handleIncrement(key as keyof Counts)}
                        />
                    </div>
                    </div>
                    <Divider sx={{ marginBottom: "20px" }} />
                </div>
                ))}

                <button
                onClick={updateGuestText}
                className="bg-[#023E8A] w-full h-[52px] text-white rounded-[6px] mt-[30px] font-medium text-[16px] cursor-pointer"
                >
                Done
                </button>
            </DialogContent>
        </Dialog>

    </Box>
  );
};

export default HotelGuestSelector;
