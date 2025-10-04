import React, { MouseEvent } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Popper,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { DateRange, RangeKeyDict } from "react-date-range";
import { format } from "date-fns";

interface DateSelectorProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  dateRange: { startDate: Date; endDate: Date; key: string }[];
  setDateRange: (
    range: { startDate: Date; endDate: Date; key: string }[]
  ) => void;
  handleSelectDate: () => void;
  handleClick: (e: MouseEvent<HTMLDivElement>) => void;
  departureDate: string;
  setDepartureDate: (value: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  open,
  anchorEl,
  handleClose,
  dateRange,
  setDateRange,
  handleSelectDate,
  handleClick,
  departureDate,
  setDepartureDate,
}) => (
  <Box sx={{ display: "flex", flexDirection: "column" }}>
    <label htmlFor="departure-date" className="text-[14px] mb-2">
      Date
    </label>
    <TextField
      id="departure-date"
      variant="outlined"
      size="small"
      placeholder="Select Date"
      value={departureDate}
      onClick={handleClick}
      onChange={(e) => setDepartureDate(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <CalendarMonthOutlinedIcon />
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
        "& .MuiOutlinedInput-input": { padding: "8px 10px", cursor: "pointer" },
      }}
    />

    <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
      <ClickAwayListener onClickAway={handleClose}>
        <Paper
          elevation={3}
          sx={{
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pb: 2,
          }}
        >
          <div style={{ width: "100%", height: "100%" }}>
            <DateRange
              editableDateInputs
              onChange={(item: RangeKeyDict) =>
                setDateRange([
                  {
                    startDate: item.selection.startDate ?? new Date(),
                    endDate: item.selection.endDate ?? new Date(),
                    key: "selection",
                  },
                ])
              }
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              rangeColors={["#FF6F1E"]}
              months={2}
              direction="horizontal"
              showDateDisplay={false}
              className="w-full h-full"
            />
            <div className="w-[96%] m-auto">
              <p className="text-center mb-5 font-bold font-inter">
                {dateRange[0].startDate
                  ? format(dateRange[0].startDate, "MMM d, yyyy") +
                    (dateRange[0].endDate
                      ? ` - ${format(dateRange[0].endDate, "MMM d, yyyy")}`
                      : "")
                  : "Pick a date"}
              </p>
              <button
                className="w-full h-[52px] rounded-[4px] font-inter text-[14px] cursor-pointer bg-[#023E8A] text-white"
                onClick={handleSelectDate}
              >
                Select Date
              </button>
            </div>
          </div>
        </Paper>
      </ClickAwayListener>
    </Popper>
  </Box>
);

export default DateSelector;
