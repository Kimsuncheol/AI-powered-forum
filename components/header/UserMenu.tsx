"use client";

import React from "react";
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";

interface UserMenuProps {
  user: User;
  anchorEl: HTMLElement | null;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onMenuClose: () => void;
  onLogout: () => void;
}

export default function UserMenu({
  user,
  anchorEl,
  onMenuOpen,
  onMenuClose,
  onLogout,
}: UserMenuProps) {
  const router = useRouter();

  return (
    <>
      <IconButton onClick={onMenuOpen} sx={{ p: 0, ml: 1 }}>
        <Avatar
          alt={user.displayName || "User"}
          src={user.photoURL || undefined}
          sx={{ width: 32, height: 32, fontSize: "0.875rem" }}
        >
          {user.email?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={onMenuClose}
      >
        <MenuItem disabled>
          <Typography variant="body2">{user.email}</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            router.push("/profile");
            onMenuClose();
          }}
        >
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            router.push("/settings");
            onMenuClose();
          }}
        >
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            router.push(`/collections/${user.uid}`);
            onMenuClose();
          }}
        >
          Collections
        </MenuItem>
        <MenuItem onClick={onLogout} sx={{ color: "error.main" }}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
