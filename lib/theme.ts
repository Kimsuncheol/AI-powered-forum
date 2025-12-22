import { ThemeOptions, PaletteMode } from "@mui/material";

export const getThemeOptions = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    // Reddit Color Palette
    primary: {
      main: "#FF4500", // Reddit Orange
      light: "#FF6A33",
      dark: "#CC3700",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0079D3", // Reddit Blue (for downvotes/links)
      light: "#339DFF",
      dark: "#0066B8",
      contrastText: "#ffffff",
    },
    error: {
      main: "#EA0027",
    },
    background: {
      default: mode === "light" ? "#DAE0E6" : "#030303", // Reddit light gray / Dark
      paper: mode === "light" ? "#FFFFFF" : "#1A1A1B",
    },
    text: {
      primary: mode === "light" ? "#1c1c1c" : "#D7DADC",
      secondary: mode === "light" ? "#7c7c7c" : "#818384",
    },
    divider: mode === "light" ? "#EDEFF1" : "#343536",
    action: {
      hover: mode === "light" ? "#F6F7F8" : "#1A1A1B",
      selected: mode === "light" ? "#E9EBED" : "#272729",
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
      fontWeight: 600,
      fontSize: "2rem",
      letterSpacing: "-0.005em",
    },
    h2: {
      fontWeight: 600,
      fontSize: "1.5rem",
      letterSpacing: "-0.005em",
    },
    h6: {
      fontWeight: 500,
      fontSize: "1.125rem",
    },
    body1: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
      fontSize: "0.875rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20, // Reddit pill-shaped buttons
          padding: "6px 16px",
          textTransform: "none",
          fontWeight: 700,
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        outlined: {
          borderWidth: "1px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "1px solid",
          borderColor: mode === "light" ? "#EDEFF1" : "#343536",
          borderRadius: 4,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        rounded: {
          borderRadius: 4,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderBottom: "1px solid",
          borderColor: mode === "light" ? "#EDEFF1" : "#343536",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          "&:hover": {
            backgroundColor: mode === "light" ? "#F6F7F8" : "#272729",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
        },
      },
    },
  },
});
