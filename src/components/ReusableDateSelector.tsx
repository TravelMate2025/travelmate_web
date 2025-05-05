import React, { useState, useEffect } from "react";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import { DateRange, RangeKeyDict } from "react-date-range";
import { addDays, format } from "date-fns";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { Typography, Box } from "@mui/material";

interface DateRangeType {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface ReusableDateSelectorProps {
  initialValue?: string;
  onDateChange: (date: string) => void;
  isOneWay?: boolean;
  borderColor?: string;
}

const ReusableDateSelector: React.FC<ReusableDateSelectorProps> = ({
  initialValue = "",
  onDateChange,
  isOneWay = false,
  borderColor = "light-gray",
}) => {
  const [dateRange, setDateRange] = useState<DateRangeType[]>([
    {
      startDate: new Date(),
      endDate: isOneWay ? new Date() : addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDate, setSelectedDate] = useState<string>(initialValue);
  const [monthsToShow, setMonthsToShow] = useState(2);
  const [, setOpened] = useState(false); 

  useEffect(() => {
    const updateMonths = () => {
      setMonthsToShow(window.innerWidth < 640 ? 1 : 2);
    };
    updateMonths();
    window.addEventListener("resize", updateMonths);
    return () => window.removeEventListener("resize", updateMonths);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpened((prevOpen) => !prevOpen); // Toggle opened state
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpened(false); // Close the popper
  };

  const formatDate = (date: Date) => format(date, "dd MMM yyyy");

  const handleSelectDate = () => {
    if (dateRange[0].startDate) {
      const startDateFormatted = formatDate(dateRange[0].startDate);
      const endDateFormatted = dateRange[0].endDate
        ? formatDate(dateRange[0].endDate)
        : startDateFormatted;

      const displayText =
        startDateFormatted === endDateFormatted
          ? startDateFormatted
          : `${startDateFormatted} - ${endDateFormatted}`;

      setSelectedDate(displayText);
      onDateChange(displayText);
      setOpened(false); // Close the popper
      handleClose();
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "date-range-popper" : undefined;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <TextField
        id="departure-date"
        variant="outlined"
        size="small"
        placeholder="Select Date"
        value={selectedDate}
        onClick={handleClick}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CalendarMonthOutlinedIcon sx={{ cursor: "pointer" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          maxwidth: "288px",
          "& .MuiInputBase-root": { height: "44px", borderRadius: "8px" },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: borderColor,
          },
          "& .MuiOutlinedInput-input": { padding: "8px 10px", cursor: "pointer" },
        }}
      />

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            elevation={3}
            sx={{
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column", // Arrange children vertically
              alignItems: "center",
              paddingBottom: "20px",
            }}
          >
            <Box sx={{ p: 2, width: '100%', textAlign: 'center' }}>
              <Typography sx={{ color: "#1A1A1A", fontWeight: 500 }}>
                {dateRange[0].startDate && dateRange[0].endDate
                  ? `${format(dateRange[0].startDate, "dd MMM")} - ${format(
                      dateRange[0].endDate,
                      "dd MMM"
                    )}`
                  : format(dateRange[0].startDate, "dd MMM")}
              </Typography>
            </Box>
            <div style={{ width: "100%", height: "100%" }}>
              <DateRange
                editableDateInputs={true}
                onChange={(item: RangeKeyDict) => {
                  setDateRange([
                    {
                      startDate: item.selection.startDate ?? new Date(),
                      endDate: item.selection.endDate ?? new Date(),
                      key: item.selection.key ?? "selection",
                    },
                  ]);
                }}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                rangeColors={["#FF6F1E"]}
                months={monthsToShow}
                direction="horizontal"
                showDateDisplay={false}
                className="w-full h-full"
              />

              <div className="w-[96%] m-auto mt-2">
              <p className="text-center mb-[20px] font-bold font-inter">
                {dateRange[0].startDate ? formatDate(dateRange[0].startDate) + (dateRange[0].endDate ? ` - ${formatDate(dateRange[0].endDate)}` : "") : "Pick a date"}
              </p>
                <button
                  className="w-full h-[52px] rounded-[4px] font-inter text-[14px] cursor-pointer"
                  style={{
                    backgroundColor: "#023E8A",
                    color: "white",
                  }}
                  onClick={handleSelectDate}
                >
                  Select Date
                </button>
              </div>
            </div>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

export default ReusableDateSelector;