"use client";

import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Brightness4, Brightness7, SettingsBrightness } from "@mui/icons-material";
import { useThemeMode } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode();

  const getIcon = () => {
    switch (mode) {
      case "light":
        return <Brightness7 />;
      case "dark":
        return <Brightness4 />;
      case "system":
        return <SettingsBrightness />;
    }
  };

  const getLabel = () => {
    switch (mode) {
      case "light":
        return "Light Mode";
      case "dark":
        return "Dark Mode";
      case "system":
        return "System Default";
    }
  };

  return (
    <Tooltip title={getLabel()}>
      <IconButton onClick={toggleMode} color="inherit">
        {getIcon()}
      </IconButton>
    </Tooltip>
  );
}
