import React, { MutableRefObject } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Popper,
  Paper,
  ClickAwayListener,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from "@mui/material";
import FlightClassOutlinedIcon from "@mui/icons-material/FlightClassOutlined";

interface FlightClassSelectorProps {
  selectedClass: string;
  setSelectedClass: (value: string) => void;
  anchorRef: MutableRefObject<HTMLElement | null>;
  open: boolean;
  setOpen: (value: boolean) => void;
}

const FlightClassSelector: React.FC<FlightClassSelectorProps> = ({
  selectedClass,
  setSelectedClass,
  anchorRef,
  open,
  setOpen,
}) => (
  <Box sx={{ display: "flex", flexDirection: "column" }}>
    <label htmlFor="class" className="text-[14px] mb-2">
      Class
    </label>
    <TextField
      id="class"
      variant="outlined"
      size="small"
      placeholder="Economy"
      value={selectedClass}
      inputRef={anchorRef}
      onClick={() => setOpen(true)}
      onChange={(e) => setSelectedClass(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FlightClassOutlinedIcon />
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
      }}
    />
    <Popper open={open} anchorEl={anchorRef.current} placement="bottom-start">
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Paper
          elevation={3}
          sx={{
            width: "317px",
            borderRadius: "6px",
            p: 2,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <RadioGroup
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setOpen(false);
            }}
          >
            {["Economy", "Business", "First Class"].map((cls, idx) => (
              <React.Fragment key={cls}>
                <FormControlLabel
                  value={cls}
                  control={<Radio />}
                  label={cls}
                  className="pl-10"
                />
                {idx !== 2 && <Divider sx={{ my: 2 }} />}
              </React.Fragment>
            ))}
          </RadioGroup>
        </Paper>
      </ClickAwayListener>
    </Popper>
  </Box>
);

export default FlightClassSelector;
