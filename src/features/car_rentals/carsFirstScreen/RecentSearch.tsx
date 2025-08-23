import {
  ClickAwayListener,
  Divider,
  Paper,
  Popper,
  Typography,
} from "@mui/material";
import React from "react";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

type RecetSearchProps = {
  openFrom: boolean;
  fromClick: HTMLElement | null;
  handleCloseFrom: () => void;
  locations: any[];
  handleRemoveOption: (data: any) => void;
  handleFromOptionClick: (data: any) => void;
};
const RecentSearch = ({
  openFrom,
  handleCloseFrom,
  fromClick,
  handleFromOptionClick,
  handleRemoveOption,
  locations,
}: RecetSearchProps) => {
  return (
    <div>
      <Popper
        id="from-popper"
        open={openFrom}
        anchorEl={fromClick}
        placement="bottom-start"
        className="hidden md:block"
      >
        <ClickAwayListener onClickAway={handleCloseFrom}>
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
            <Typography
              variant="subtitle1"
              className="font-inter text-[#343537] text-lg pl-[24px] pt-[24px] pr-[24px]"
            >
              Recent Searches
            </Typography>

            {locations.length === 0 ? (
              <Typography
                sx={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#777",
                }}
                className="font-inter"
              >
                No recent searches
              </Typography>
            ) : (
              locations.map((location, index) => (
                <React.Fragment key={location}>
                  <div className="flex justify-between pl-[24px] pt-[24px] pr-[24px] cursor-pointer">
                    <div
                      className="flex gap-[8px]"
                      onClick={() => handleFromOptionClick(location)}
                    >
                      <div className="h-[28px] w-[28px] rounded-[4px] border border-[#FF6F1E] bg-[#FF6F1E0A] text-center">
                        <RoomOutlinedIcon
                          className="text-[#FF6F1E]"
                          sx={{ fontSize: "16px" }}
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
                      sx={{ color: "gray" }}
                    />
                  </div>

                  {index !== locations.length - 1 && (
                    <Divider sx={{ marginTop: "15px" }} />
                  )}
                </React.Fragment>
              ))
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

export default RecentSearch;
