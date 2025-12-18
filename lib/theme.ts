import { ThemeOptions, PaletteMode } from "@mui/material";

export const getThemeOptions = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    // Premium Color Palette
    primary: {
      main: "#6200ea", // Deep Purple Accent
      light: "#9d46ff",
      dark: "#0a00b6",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#00b0ff", // Light Blue Accent
      light: "#69e2ff",
      dark: "#0081cb",
      contrastText: "#000000",
    },
    background: {
      default: mode === "light" ? "#f5f7fa" : "#0a1929", // Soft white / Deep dark blue
      paper: mode === "light" ? "#ffffff" : "#132f4c",
    },
    text: {
      primary: mode === "light" ? "#1a2027" : "#e3f2fd",
      secondary: mode === "light" ? "#3e5060" : "#b0bec5",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      letterSpacing: "-0.01562em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      letterSpacing: "-0.00833em",
    },
    button: {
      fontWeight: 600,
      textTransform: "none", // Modern feel
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Modern rounded corners
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none", // Clean look in dark mode
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiIconButton: {
        styleOverrides: {
            root: {
                borderRadius: 8,
            }
        }
    }
  },
});
