import {

  Drawer,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import {  X } from "lucide-react";
interface ModalLayoutProps {
  isMobile?: boolean;
  open: boolean;
  onClose?: () => void;
setValue: (value: string) => void;
  value?: string;
handleApplyFilters: () => void;
}
const SortFlight = ({
  isMobile,
handleApplyFilters,
  onClose,
  value: selectedSort,
setValue,
  open,
}: ModalLayoutProps) => {

  const handleSortedChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    if (setValue) {
      setValue(value);
    }
  }
  if (isMobile) {
    return (
      <>
        <Drawer
          anchor="bottom"
          open={open}
          onClose={onClose}
          sx={{
            "& .MuiDrawer-paper": {
              width: "100%",
              minHeight: "50vh",
              boxSizing: "border-box",
              borderRadius: "20px 20px 0 0",
              backgroundColor: "white",

              padding: "16px",
            },
          }}
        >
          <FormControl>
            <div className="flex items-center justify-between mb-4">
              <IconButton
                sx={{
                  color: "black",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  borderRadius: "5px",
                  padding: "1px",
                }}
                onClick={onClose}
                aria-label="close"
              >
                <X />
              </IconButton>
              <div className="flex justify-center flex-1">
                <FormLabel
                  id="demo-radio-buttons-group-label"
                  sx={{ color: "black", fontWeight: 600, fontSize: "20px" }}
                >
                  Sort By
                </FormLabel>
              </div>
            </div>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="recommended"
              name="radio-buttons-group"
              value={selectedSort}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            >
              <FormControlLabel
                value="recommended"
                control={<Radio />}
                label="Recommended"
              />
              <FormControlLabel
                value="price_low"
                control={<Radio />}
                label="Price Low"
              />
              <FormControlLabel
                value="price_high"
                control={<Radio />}
                label="Price"
              />
              <FormControlLabel
                value="shortest_duration"
                control={<Radio />}
                label="Shortest Duration"
              />
              <FormControlLabel
                value="longest_duration"
                control={<Radio />}
                label="Longest Duration"
              />
            </RadioGroup>
          </FormControl>

          <button
            onClick={handleApplyFilters}
            className="w-full h-[52px] rounded-[6px] bg-[#023E8A] text-white cursor-pointer"
          >
            Apply
          </button>
        </Drawer>
      </>
    );
  }

  return (
    <Select
      id="sort"
      variant="outlined"
      size="small"
      value={selectedSort}
      renderValue={(value) => {
        if (isMobile) {
          return "Sort";
        }
        return `Sort by : ${
          value === "recommended"
            ? "Recommended"
            : value === "price_low"
            ? "Price: Low to High"
            : value === "price_high"
            ? "Price: High to Low"
            : value === "shortest_duration"
            ? "Shortest Duration"
            : value === "longest_duration"
            ? "Longest Duration"
            : ""
        }`;
      }}
      onChange={handleSortedChange}
      // displayEmpty
      startAdornment={
        <InputAdornment position="start">
          <SortIcon sx={{ color: "black" }} />
        </InputAdornment>
      }
      MenuProps={{
        PaperProps: {
          sx: {
            width: "300px",
            maxHeight: "335px",
            py: 0,
            m: 0,
            "& .MuiMenuItem-root": {
              paddingY: "10px",
              margin: 0,

              backgroundColor: "transparent !important",
              "&:hover": {
                backgroundColor: "#023E8A !important",
                color: "white",
              },
            },
            "& .MuiMenuItem-root.Mui-selected": {
              backgroundColor: "#023E8A !important",
              color: "white",
            },
            "& .MuiMenuItem-root.Mui-selected:hover": {
              backgroundColor: "#023E8A !important", // keep same on hover
            },
          },
        },
        MenuListProps: {
          sx: {
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
      }}
      sx={{
        width: {
          md: "255px",
        },
        display: {
          xs: "none",
          md: "flex",
        },
        "& .MuiInputBase-root": {
          height: "44px",
          borderRadius: "8px",
          borderColor: "#DEDFE1",
          fontSize: "14px",
        },
        "& .MuiSelect-icon": {
          display: isMobile ? "none" : "block",
        },
        borderRadius: "8px",
      }}
    >
      <MenuItem value="recommended">Recommended</MenuItem>
      <MenuItem value="price_low">Price: Low to High</MenuItem>
      <MenuItem value="price_high">Price: High to Low</MenuItem>
      <MenuItem value="shortest_duration">Shortest Duration</MenuItem>
      <MenuItem value="longest_duration">Longest Duration</MenuItem>
    </Select>
  );
};

export default SortFlight;
