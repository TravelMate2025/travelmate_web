import { createTheme } from "@mui/material/styles";
// Required for TS to recognize Pickers-namespaced keys (MuiPickersDay etc.)
// in the `components` override object below.
import "@mui/x-date-pickers/themeAugmentation";

// The app has hand-built Tailwind components in the brand navy (#023E8A)
// sitting next to unthemed MUI components, which default to stock Material
// blue (#1976d2) -- this was the single biggest source of the site reading
// as "default MUI" (date pickers, radios, checkboxes, sliders, pagination,
// switches). One theme, applied once in main.tsx, fixes all of them.
const brandNavy = "#023E8A";
const neutral = "#8A9096";

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: brandNavy,
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  components: {
    MuiRadio: {
      styleOverrides: {
        root: {
          color: neutral,
          "&.Mui-checked": { color: brandNavy },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: neutral,
          "&.Mui-checked": { color: brandNavy },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: brandNavy,
            "& + .MuiSwitch-track": { backgroundColor: brandNavy, opacity: 0.5 },
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: brandNavy },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: brandNavy,
            color: "#fff",
            "&:hover": { backgroundColor: brandNavy },
          },
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: `${brandNavy} !important`,
          },
          "&.MuiPickersDay-today": {
            borderColor: brandNavy,
          },
        },
      },
    },
  },
});
