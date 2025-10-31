import type React from "react";
import { useState, memo, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  Popper,
  ClickAwayListener,
  Paper,
  Drawer,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { Calendar, DateRange } from "react-date-range";
import { format, parse } from "date-fns";

export interface DateSelectorProps {
  id: string;
  label: string;
  value: string;
  defaultDate?: Date | { startDate: Date; endDate: Date };
  onChange?: (value: string) => void;
  onDateChange: (date: Date | { startDate: Date; endDate: Date }) => void;
  range?: boolean;
}

export const DateSelector = memo<DateSelectorProps>(
  ({ id, label, value, onChange, onDateChange, range = false }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedRange, setSelectedRange] = useState<{
      startDate: Date;
      endDate: Date;
      key: string;
    }>({
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Sync with parent value
    useEffect(() => {
  
      if (!value || typeof value !== "string") return;

      if (range && (value.includes("to") || value.includes("-"))) {
        const parts = value.includes("to")
          ? value.split(" to ")
          : value.split("-");
        const [startStr, endStr] = parts.map((s) => s.trim());
        const start = parse(startStr, "dd MMM yyyy", new Date());
        const end = parse(endStr, "dd MMM yyyy", new Date());
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          setSelectedRange({
            startDate: start,
            endDate: end,
            key: "selection",
          });
        }
      } else {
        const parsed = parse(value, "dd MMM yyyy", new Date());

        if (!isNaN(parsed.getTime())) {
          setSelectedDate(parsed);
        }
      }
    }, [value, range]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
      setAnchorEl(null);
    };

    const handleSelectDate = (date: Date) => {
      console.log("date selected", date);
      
      setSelectedDate(date);
      const formatted = format(date, "dd MMM yyyy");
  
      
      onChange?.(formatted);
      onDateChange(date);
       handleClose();
    };

    const handleSelectRange = (ranges: any) => {
      const { startDate, endDate } = ranges.selection;
      setSelectedRange(ranges.selection);
      const formatted = `${format(startDate, "dd MMM yyyy")} - ${format(
        endDate,
        "dd MMM yyyy"
      )}`;
      onChange?.(formatted);
      onDateChange({ startDate, endDate });
    };

    console.log(selectedDate, value);
    

    const CalendarContent = (
      <Box p={2}>
        {range ? (
          <DateRange
            ranges={[selectedRange]}
            editableDateInputs
            onChange={handleSelectRange}
            months={2}
            
            showMonthAndYearPickers={false}
            moveRangeOnFirstSelection={false}
            direction={isMobile ? "vertical" : "horizontal"}
            showDateDisplay={false}
            className="w-full h-full mx-auto"
            rangeColors={["#FF6F1E"]}
          />
        ) : (
          <Calendar
            date={selectedDate || new Date()}
            onChange={handleSelectDate}
            color="#FF6F1E"
          />
        )}

        {range && (
          <div className="w-11/12 mx-auto mt-2">
            <p className="text-center text-sm">
              {selectedRange.startDate
                ? `${format(selectedRange.startDate, "dd MMM yyyy")} - ${format(
                    selectedRange.endDate,
                    "dd MMM yyyy"
                  )}`
                : "Pick a date"}
            </p>
            <button
              className="w-full h-10 mt-2 rounded font-inter text-sm cursor-pointer text-white bg-[#023E8A]"
              onClick={handleClose}
            >
              Select Date
            </button>
          </div>
        )}
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
          placeholder={range ? "Select Date Range" : "Select Date"}
          value={value}
          autoComplete="off"
          onClick={handleClick}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarMonthOutlinedIcon />
              </InputAdornment>
            ),
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
            "& .MuiOutlinedInput-input": {
              padding: "8px 10px",
              cursor: "pointer",
            },
          }}
        />

        {/* Desktop → Popper */}
        {!isMobile && (
          <Popper open={isOpen} anchorEl={anchorEl} placement="bottom-start">
            <ClickAwayListener onClickAway={handleClose}>
              <Paper elevation={3}>{CalendarContent}</Paper>
            </ClickAwayListener>
          </Popper>
        )}

        {/* Mobile → Drawer */}
        {isMobile && (
          <Drawer
            anchor="bottom"
            open={isOpen}
            onClose={handleClose}
            PaperProps={{
              sx: {
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                // overflow: "hidden",
                minHeight: "80vh",  
                transform: "scale(0.9)", // 👈 shrink to 90%
                transformOrigin: "top center", // keep alignment
              },
            }}
          >
            {CalendarContent}
          </Drawer>
        )}
      </div>
    );
  }
);

DateSelector.displayName = "DateSelector";
