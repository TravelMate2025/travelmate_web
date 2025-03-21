import React, { useState, useRef, useEffect } from "react";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import { DateRange, RangeKeyDict } from "react-date-range";
import { addDays, format } from "date-fns";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

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

const ReusableDateSelector: React.FC<ReusableDateSelectorProps> = ({ initialValue = "", onDateChange, isOneWay = false, borderColor = "black", }) => {
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


  useEffect(() => {
    const updateMonths = () => {
      setMonthsToShow(window.innerWidth < 640 ? 1 : 2);
    };
    updateMonths();
    window.addEventListener("resize", updateMonths);
    return () => window.removeEventListener("resize", updateMonths);
  }, []);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectDate = () => {
    const formattedDate = isOneWay
      ? format(dateRange[0].startDate, "dd MMM yyyy")
      : `${format(dateRange[0].startDate, "dd MMM yyyy")} - ${format(dateRange[0].endDate, "dd MMM yyyy")}`;

    setSelectedDate(formattedDate);
    onDateChange(formattedDate);
    handleClose();
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
              <CalendarMonthOutlinedIcon sx={{ cursor: "pointer" }}/>
            </InputAdornment>
          ),
        }}
        sx={{
         maxwidth: "288px",
          "& .MuiInputBase-root": { height: "44px", borderRadius: "8px", },
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
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: "20px",
            }}
          >
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

              <div className="w-[96%] m-auto">
                <button
                  className="w-full h-[52px] rounded-[4px] font-inter text-[14px] cursor-pointer"
                  style={{
                    backgroundColor: "#023E8A",
                    color: "white",
                    marginTop: 2,
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