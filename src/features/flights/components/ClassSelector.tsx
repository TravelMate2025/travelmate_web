import React, { useState, memo } from "react";
import {
  TextField,
  InputAdornment,
  Popper,
  ClickAwayListener,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Drawer,
  IconButton,
} from "@mui/material";
import FlightClassOutlinedIcon from "@mui/icons-material/FlightClassOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useMediaQuery } from "@mui/material";

interface ClassSelectorProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const flightClasses = ["Economy", "Business", "First Class"];

export const ClassSelector = memo<ClassSelectorProps>(
  ({ id, label, value, onChange }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const isMobile = useMediaQuery("(max-width:600px)");

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
      setAnchorEl(null);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
      handleClose();
    };

    const content = (
      <div className="w-full pt-4 pb-4">
        <RadioGroup
          aria-labelledby="flight-class-group"
          name="flight-class"
          value={value}
          onChange={handleChange}
        >
          {flightClasses.map((flightClass, index) => (
            <React.Fragment key={flightClass}>
              <FormControlLabel
                value={flightClass}
                control={<Radio />}
                label={flightClass}
                className="pl-10"
              />
              {index < flightClasses.length - 1 && (
                <Divider sx={{ marginTop: "16px", marginBottom: "16px" }} />
              )}
            </React.Fragment>
          ))}
        </RadioGroup>
      </div>
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
          placeholder="Economy"
          value={value}
          onClick={handleClick}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FlightClassOutlinedIcon />
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
            onClose={handleClose}
            PaperProps={{
              sx: {
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                padding: "16px",
              },
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Select Class</h2>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
            {content}
          </Drawer>
        ) : (
          <Popper open={isOpen} anchorEl={anchorEl} placement="bottom-start">
            <ClickAwayListener onClickAway={handleClose}>
              <Paper
                elevation={3}
                sx={{
                  width: "317px",
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

ClassSelector.displayName = "ClassSelector";
