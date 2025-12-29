"use client";

import { useState } from "react";
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
import { AddCircleOutlineOutlined, Search as SearchIcon, ChatBubbleOutline } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import SignInModal from "@/features/auth/components/SignInModal";
import SignUpModal from "@/features/auth/components/SignUpModal";
import SearchModal from "@/features/search/components/SearchModal";
import { ChatModal } from "@/features/chat/components/ChatModal";

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
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
    <AppBar position="sticky" sx={{ bgcolor: "background.paper" }}>
      <Container sx={{ maxWidth: "xl" }}>
        <Toolbar disableGutters sx={{ minHeight: 48, height: 48, display: "flex", justifyContent: "space-between" }}>
          {/* First Box: Logo */}
          <Box
            component={Link}
            href="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "primary.main",
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1.125rem",
                color: "white",
              }}
            >
              F
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1.25rem",
                display: { xs: "none", sm: "block" },
              }}
            >
              Forum
            </Typography>
          </Box>

          {/* Second Box: Search, Inbox, Create, Avatar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, ml: 4, justifyContent: "flex-end" }}>
            {/* Search Bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "action.hover",
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
              cursor: "pointer",
              width: { xs: "auto", sm: 240 },
              flexGrow: 1,
              maxWidth: 600,
              border: "1px solid",
              borderColor: "divider",
              transition: "border-color 0.2s, background-color 0.2s",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "background.paper",
              },
            }}
            onClick={() => setSearchOpen(true)}
          >
            <SearchIcon sx={{ color: "text.secondary", mr: 1, fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                Search
              </Typography>
            </Box>

            {/* Auth Controls */}
            {loading ? (
              <Skeleton variant="circular" width={32} height={32} />
            ) : user ? (
              <>
                <IconButton
                  component={Link}
                  href="/inbox"
                  size="small"
                  sx={{ p: 0.75 }}
                >
                  <InboxRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <IconButton
                  onClick={() => setChatOpen(true)}
                  size="small"
                  sx={{ p: 0.75 }}
                  data-testid="chat-trigger-button"
                >
                  <ChatBubbleOutline sx={{ fontSize: 20 }} />
                </IconButton>
                <Button
                  component={Link}
                  href="/threads/new"
                  variant="outlined"
                  color="primary"
                  startIcon={<AddCircleOutlineOutlined sx={{ fontSize: 18 }} />}
                  sx={{ 
                    textTransform: "none", 
                    borderRadius: 20,
                    fontSize: "0.875rem",
                    px: 2,
                    py: 0.5,
                    fontWeight: 700,
                  }}
                >
                  Create
                </Button>
                <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 1 }}>
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
                sx={{ 
                  textTransform: "none",
                  borderRadius: 20,
                  px: 3,
                  py: 0.5,
                  fontSize: "0.875rem",
                  fontWeight: 700,
                }}
              >
                Log In
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
      <ChatModal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </AppBar>
  );
}
