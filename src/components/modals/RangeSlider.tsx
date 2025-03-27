
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

interface RangeSliderProps {
  value: number[];
  onChange: (newValue: number[]) => void;
}

export default function RangeSlider({ value, onChange }: RangeSliderProps) {
  return (
    <Box sx={{ width: "100%" }}>
      <Slider
        value={value}
        onChange={(_, newValue) => onChange(newValue as number[])}
        valueLabelDisplay="auto"
        min={0}
        max={1000000}
      />
    </Box>
  );
}
