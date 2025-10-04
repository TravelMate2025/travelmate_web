"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { X, Search } from "lucide-react";
import {
  ClickAwayListener,
  Dialog,
  DialogContent,
  Drawer,
  Input,
  Paper,
  Popper,
  useMediaQuery,
  useTheme,
  Fade,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import { Button } from "./ui/button";
import { ScrollArea } from "./ScrollArea";
import { useGetNationsQuery } from "../api/nationalityApi";

interface NationalitySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function NationalitySelector({
  onChange,
  value,
}: NationalitySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: countries } = useGetNationsQuery();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
 const anchorRef = useRef<HTMLButtonElement | null>(null);
 const dropdownRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countries || [];
    return (
      countries?.filter((country) =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) || []
    );
  }, [searchQuery, countries]);

  const handleSelect = (code: string) => {
    onChange(code);
    setOpen(false);
    setSearchQuery("");
  };

  const selectedCountryName = useMemo(() => {
    if (!value) return "";
    return countries?.find((c) => c.code === value)?.name || value;
  }, [value, countries]);

  const handleClose = () => {
    setOpen(false);
    setSearchQuery("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !anchorRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const content = (
    <div className="flex flex-col h-[400px] max-h-[80vh]">
      {/* Search Input */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <TextField
            value={searchQuery}
            autoFocus
            slotProps={{
              input: {
                
                startAdornment:(
                  <InputAdornment position="start">
                    <Search className="h-5 w-5 text-gray-400" />
                  </InputAdornment>
                ),
                sx: {
                  height:"2rem"
                }
              }
            }}
            
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search countries..."
            className="pl-10 pr-10 w-full h-10 "

          />
          {searchQuery && (
            <X
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
              onClick={() => setSearchQuery("")}
            />
          )}
        </div>
      </div>

      {/* Countries List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* All Countries option */}
          <button
            onClick={() => handleSelect("All Countries")}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
          >
            All Countries
          </button>

          {/* Filtered countries */}

          <MenuItem onClick={() => handleSelect("All Countries")}>
        
            {value === "All Countries" && (
              <ListItemIcon sx={{ minWidth: 24 }}>
                <CheckIcon fontSize="small" />
              </ListItemIcon>
            )}
          </MenuItem>

          <Divider />

          {filteredCountries.map((country, index) => (
            <div key={country.code}>
              <MenuItem onClick={() => handleSelect(country.code)}>
                <ListItemText>{country.name}</ListItemText>
                {value === country.name && (
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <CheckIcon fontSize="small" />
                  </ListItemIcon>
                )}
              </MenuItem>
              {index < filteredCountries.length - 1 && <Divider />}
            </div>
          ))}

          {filteredCountries.length === 0 && searchQuery && (
            <div className="px-3 py-8 text-center text-gray-500">
              No countries found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <>
      <Button
        onClick={() => setOpen((prev) => !prev)} // Toggle open state
        variant="outline"
        ref={anchorRef}
        type="button"
        className="w-full justify-start text-left"
      >
        {selectedCountryName || "Select Nationality"}
      </Button>

      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={open}
          onClose={handleClose}
          PaperProps={{
            className: "rounded-t-lg max-h-[80vh]",
          }}
        >
          {content}
        </Drawer>
      ) : (
        <div>
          {open && (
            <Paper
              ref={dropdownRef}
              className="shadow-lg rounded-lg overflow-hidden w-full"
              elevation={1}
            >
              <div>{content}</div>
            </Paper>
          )}
        </div>
      )}
    </>
  );
}
