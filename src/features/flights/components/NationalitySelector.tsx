import { useState, useMemo,  } from "react";
import { X, Search } from "lucide-react";
import {
  Drawer,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  InputAdornment,
  TextField,
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
  const { data: countries,  isFetching } = useGetNationsQuery();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
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
    handleClose();
    setSearchQuery("");
  };

  const selectedCountryName = useMemo(() => {
    if (!value) return "";
    return countries?.find((c) => c.code === value)?.name || value;
  }, [value, countries]);

  const handleClose = () => {
    setAnchorEl(null);
    setSearchQuery("");
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Content inside menu/drawer
  const content = (
    <div className="flex flex-col h-[400px] max-h-[80vh] ">
      {/* Search Input */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <TextField
            value={searchQuery}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="h-5 w-5 text-gray-400" />
                </InputAdornment>
              ),
              sx: {
                height: "2rem",
              },
            }}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search countries..."
            className="pl-10 pr-10 w-full h-10"
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
      <ScrollArea className="flex-1 w-full">
        {isFetching ?
          <div className="">
            <p>Loading...</p>
          </div> :
          
        <div className="p-2">
          {/* All Countries option */}
          <MenuItem onClick={() => handleSelect("All Countries")} sx={{width:"100%"}} disabled>
            <ListItemText>All Countries</ListItemText>
            {value === "All Countries" && (
              <ListItemIcon sx={{ minWidth: 24, width:"100%" }}>
                <CheckIcon fontSize="small" />
              </ListItemIcon>
            )}
          </MenuItem>

          <Divider />

          {filteredCountries.map((country, index) => (
            <div key={country.code}>
              <MenuItem onClick={() => handleSelect(country.code)}>
                <ListItemText>{country.name}</ListItemText>
                {value === country.code && (
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
      }

      </ScrollArea>
    </div>
  );

  return (
    <>
      <Button
        onClick={handleButtonClick}
        variant="outline"
        type="button"
        className="w-full justify-start text-left"
      >
        {selectedCountryName || "Select Nationality"}
      </Button>

      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            className: "rounded-t-lg max-h-[80vh]",
          }}
        >
          {content}
        </Drawer>
      ) : (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{ style: { maxHeight: "80vh", width: 500 } }}
          MenuListProps={{ style: { padding: 0 } }}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          {content}
        </Menu>
      )}
    </>
  );
}
