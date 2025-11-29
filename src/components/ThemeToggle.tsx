import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import { useThemeMode } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { mode, resolvedMode, cycleMode } = useThemeMode();

  const icon =
    mode === "system" ? (
      <SettingsBrightnessIcon />
    ) : mode === "light" ? (
      <Brightness7Icon />
    ) : (
      <Brightness4Icon />
    );

  const label =
    mode === "system"
      ? `Mode: System (${resolvedMode})`
      : `Mode: ${mode.charAt(0).toUpperCase()}${mode.slice(1)}`;

  return (
    <Tooltip title={label}>
      <IconButton
        color="inherit"
        onClick={cycleMode}
        aria-label="Toggle appearance mode"
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
