import React, { ChangeEvent, MouseEvent } from "react";
import { Box, TextField, InputAdornment } from "@mui/material";

interface SearchFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  icon?: React.ReactNode;
}

const SearchField: React.FC<SearchFieldProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  onClick,
  icon,
}) => (
  <Box sx={{ display: "flex", flexDirection: "column" }}>
    <label htmlFor={id} className="text-[14px] mb-2">
      {label}
    </label>
    <TextField
      id={id}
      variant="outlined"
      size="small"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onClick={onClick}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">{icon}</InputAdornment>
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
  </Box>
);

export default SearchField;
