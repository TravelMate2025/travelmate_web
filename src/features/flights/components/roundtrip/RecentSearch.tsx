import React from "react";
import {
  Popper,
  ClickAwayListener,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

interface RecentSearchesPopperProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  locations: string[];
  handleOptionClick: (location: string) => void;
  handleRemoveOption: (location: string) => void;
}

const RecentSearchesPopper: React.FC<RecentSearchesPopperProps> = ({
  open,
  anchorEl,
  handleClose,
  locations,
  handleOptionClick,
  handleRemoveOption,
}) => (
  <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
    <ClickAwayListener onClickAway={handleClose}>
      <Paper
        elevation={3}
        sx={{
          width: "317px",
          borderRadius: "6px",
          backgroundColor: "white",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          pb: 3,
        }}
      >
        <Typography
          variant="subtitle1"
          className="font-inter text-[#343537] text-lg p-6 pb-0"
        >
          Recent Searches
        </Typography>

        {locations.length === 0 ? (
          <Typography sx={{ textAlign: "center", p: 2, color: "#777" }}>
            No recent searches
          </Typography>
        ) : (
          locations.map((location, index) => (
            <React.Fragment key={location}>
              <div
                className="flex justify-between p-6 cursor-pointer"
                onClick={() => handleOptionClick(location)}
              >
                <div className="flex gap-2">
                  <div className="h-7 w-7 rounded border border-[#FF6F1E] bg-[#FF6F1E0A] flex items-center justify-center">
                    <RoomOutlinedIcon
                      className="text-[#FF6F1E]"
                      sx={{ fontSize: 16 }}
                    />
                  </div>
                  <p>{location}</p>
                </div>
                <CloseOutlinedIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveOption(location);
                  }}
                  className="cursor-pointer"
                  sx={{ color: "black" }}
                />
              </div>
              {index !== locations.length - 1 && <Divider sx={{ mt: 2 }} />}
            </React.Fragment>
          ))
        )}
      </Paper>
    </ClickAwayListener>
  </Popper>
);

export default RecentSearchesPopper;
