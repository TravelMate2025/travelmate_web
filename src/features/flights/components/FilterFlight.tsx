import React, { useMemo, useCallback } from "react";
import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  Divider,
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
  Slider,
  Typography,
  Button,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export interface FlightFilters {
  priceRange: number[];
  stops: string | null;
  refundPolicy: string | null;
  airlines: string[];
}

interface FilterFlightProps {
  isMobile?: boolean;
  filters: FlightFilters;
  open?: boolean;
  onClose?: () => void;
  onChange: (filters: FlightFilters) => void;
  onApply?: () => void; // ✅ optional callback for apply action
}

const MAX_PRICE = 1_000_000;
const DEFAULT_FILTERS: FlightFilters = {
  priceRange: [2000, 10_000_000],
  stops: null,
  refundPolicy: null,
  airlines: [],
};

const FilterFlight: React.FC<FilterFlightProps> = ({
  isMobile,
  filters,
  onChange,
  onClose,
  open = false,
  onApply,
}) => {
  const airlinesList = useMemo(
    () => ["Aero", "Arik Air", "Value Jet", "Air Peace", "United Nigeria"],
    []
  );
  const stopsOptions = useMemo(() => ["Non Stop", "1 Stop", "1+ Stop"], []);

  const handleSliderChange = useCallback(
    (_: Event, newValue: number | number[]) =>
      onChange({ ...filters, priceRange: newValue as number[] }),
    [filters, onChange]
  );

  const handleStopsClick = useCallback(
    (label: string) => onChange({ ...filters, stops: label }),
    [filters, onChange]
  );

  const handleRefundChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange({
        ...filters,
        refundPolicy: event.target.checked ? event.target.name : null,
      }),
    [filters, onChange]
  );

  const handleAirlinesChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = event.target;
      if (name === "all") {
        onChange({ ...filters, airlines: checked ? airlinesList : [] });
      } else {
        onChange({
          ...filters,
          airlines: checked
            ? [...filters.airlines, name]
            : filters.airlines.filter((a) => a !== name),
        });
      }
    },
    [filters, onChange, airlinesList]
  );

  const handleClearAll = useCallback(
    () => onChange(DEFAULT_FILTERS),
    [onChange]
  );

  const renderContent = () => (
    <Box sx={{ flex: 1, overflowY: "auto", pb: 10 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography
          variant="body2"
          color="primary"
          fontWeight="bold"
          sx={{ cursor: "pointer" }}
          onClick={handleClearAll}
        >
          Clear All
        </Typography>
        <Typography variant="h6" fontWeight="medium">
          Filter By
        </Typography>
        <IconButton onClick={onClose} aria-label="close">
          <CloseOutlinedIcon />
        </IconButton>
      </Box>

      {/* Price Range */}
      <Box mb={3} mt={2}>
        <Typography variant="subtitle1" fontWeight="medium">
          Price Range
        </Typography>
        <Slider
          value={filters.priceRange}
          onChange={handleSliderChange}
          min={0}
          max={MAX_PRICE}
          sx={{ width: "90%", ml: 2 }}
          step={1000}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) =>
            new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(
              v
            )
          }
        />
      </Box>

      {/* Stops */}
      <Typography variant="subtitle1" fontWeight="medium">
        Stops
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        {stopsOptions.map((label) => (
          <button
            key={label}
            className={`border w-full rounded-[6px] h-[2.2rem] ${
              filters.stops === label
                ? "bg-[#023E8A] text-white"
                : "bg-white text-black border-[#DEDFE1]"
            }`}
            onClick={() => handleStopsClick(label)}
          >
            {label}
          </button>
        ))}
      </Box>
      <Divider sx={{ my: 2 }} />

      {/* Refund Policy */}
      <Typography variant="subtitle1" fontWeight="medium">
        Refund Policy
      </Typography>
      <FormGroup>
        {["Refundable", "Non-Refundable"].map((policy) => (
          <FormControlLabel
            key={policy}
            control={
              <Checkbox
                checked={filters.refundPolicy === policy}
                onChange={handleRefundChange}
                name={policy}
              />
            }
            label={policy}
          />
        ))}
      </FormGroup>
      <Divider sx={{ my: 2 }} />

      {/* Airlines */}
      <Typography variant="subtitle1" fontWeight="medium">
        Airlines
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.airlines.length === airlinesList.length}
              indeterminate={
                filters.airlines.length > 0 &&
                filters.airlines.length < airlinesList.length
              }
              onChange={handleAirlinesChange}
              name="all"
            />
          }
          label="Select All carriers"
        />
        {airlinesList.map((airline) => (
          <FormControlLabel
            key={airline}
            control={
              <Checkbox
                checked={filters.airlines.includes(airline)}
                onChange={handleAirlinesChange}
                name={airline}
              />
            }
            label={airline}
          />
        ))}
      </FormGroup>
    </Box>
  );

  const applyButton = (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        backgroundColor: "white",
        py: 2,
        px: 3,
        borderTop: "1px solid #eee",
      }}
    >
      <Button
        fullWidth
        variant="contained"
        sx={{
          textTransform: "none",
          fontWeight: "bold",
          backgroundColor: "#023E8A",
          "&:hover": { backgroundColor: "#0353A4" },
        }}
        onClick={onApply || onClose}
      >
        Apply 
      </Button>
    </Box>
  );

  return isMobile ? (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          minHeight: "50vh",
          borderRadius: "20px 20px 0 0",
          backgroundColor: "white",
          p: 2,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {renderContent()}
      {applyButton}
    </Drawer>
  ) : (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      sx={{
        "& .MuiBackdrop-root": { backgroundColor: "rgba(0, 0, 0, 0.3)" },
        "& .MuiPaper-root": {
          maxWidth: "432px",
          height: 880,
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>{renderContent()}</DialogContent>
      {applyButton}
    </Dialog>
  );
};

export default FilterFlight;
