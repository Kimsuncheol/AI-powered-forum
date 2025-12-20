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
import { usePathname } from "next/navigation";
import { AddCircleOutlineOutlined, Search as SearchIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import SignInModal from "@/features/auth/components/SignInModal";
import SignUpModal from "@/features/auth/components/SignUpModal";
import SearchModal from "@/features/search/components/SearchModal";

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Box sx={{ height: 64, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }} />;
  }

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

          {/* Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "action.hover",
              px: 2,
              py: 0.75,
              borderRadius: 2,
              cursor: "pointer",
              width: { xs: "auto", sm: 300 },
              mx: 2,
              transition: "background-color 0.2s",
              "&:hover": {
                bgcolor: "action.selected",
              },
            }}
            onClick={() => setSearchOpen(true)}
          >
            <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Search...
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Theme Toggle moved to Settings page */}

            {/* Auth Controls */}
            {loading ? (
              <Skeleton variant="circular" width={40} height={40} />
            ) : user ? (
              <>
                <IconButton
                  component={Link}
                  href="/inbox"
                  sx={{ mr: 2, p: 0 }}
                >
                  <InboxRoundedIcon />
                </IconButton>
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
                  <MenuItem onClick={() => {
                      router.push("/settings");
                    handleMenuClose();
                  }}>Settings</MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="primary"
                variant="contained"
                onClick={() => setSignInOpen(true)}
                sx={{ textTransform: "none" }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      {/* Auth Modals */}
      <SignInModal 
        open={signInOpen} 
        onClose={() => setSignInOpen(false)} 
        onSwitchToSignUp={() => {
          setSignInOpen(false);
          setSignUpOpen(true);
        }}
      />
      <SignUpModal
        open={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        onSwitchToSignIn={() => {
          setSignUpOpen(false);
          setSignInOpen(true);
        }}
      />
      <SearchModal
        key={String(searchOpen)}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </AppBar>
  );
}
