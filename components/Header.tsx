"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Container,
  Box,
  Skeleton,
} from "@mui/material";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import { usePathname } from "next/navigation";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/signin" || pathname === "/signup") {
    return null;
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await signOut();
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo / Title */}
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              mr: 2,
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              fontWeight: 700,
            }}
          >
            AI Forum
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Controls */}
            {loading ? (
              <Skeleton variant="circular" width={40} height={40} />
            ) : user ? (
              <>
                <Button
                  component={Link}
                  href="/threads/new"
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleOutlineOutlined />}
                  sx={{ mr: 2, textTransform: "none", borderRadius: 2 }}
                >
                  New Thread
                </Button>
                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                  <Avatar
                    alt={user.displayName || "User"}
                    src={user.photoURL || undefined}
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
                  onClose={handleMenuClose}
                >
                  <MenuItem disabled>
                    <Typography variant="body2">{user.email}</Typography>
                  </MenuItem>
                  {/* Placeholder for Profile link */}
                  <MenuItem onClick={() => {
                      router.push("/profile");
                    handleMenuClose();
                  }}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="primary"
                variant="contained"
                onClick={() => signInWithGoogle()}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
