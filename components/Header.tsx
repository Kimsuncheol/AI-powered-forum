"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Skeleton,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import SignInModal from "@/features/auth/components/SignInModal";
import SignUpModal from "@/features/auth/components/SignUpModal";
import SearchModal from "@/features/search/components/SearchModal";
import { useMediaQuery } from "@mui/material";

import Logo from "./header/Logo";
import SearchBar from "./header/SearchBar";
import UserActions from "./header/UserActions";
import UserMenu from "./header/UserMenu";
import AuthButtons from "./header/AuthButtons";
import { ChatModal } from "@/features/chat/components/ChatModal";

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const pathname = usePathname();
  const isMobile = useMediaQuery("(min-width:430px)");

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
        <Toolbar
          disableGutters
          sx={{
            minHeight: 48,
            height: 48,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Logo Section */}
          <Logo />

          {/* Right Section: Search, Actions, Menu/Auth */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flex: 1,
              ml: 4,
              justifyContent: "flex-end",
            }}
          >
            {/* Search Bar */}
            <SearchBar onClick={() => setSearchOpen(true)} />

            {/* Auth/User Section */}
            {loading ? (
              <Skeleton variant="circular" width={32} height={32} />
            ) : user ? (
              <>
                <UserActions isMobile={isMobile} onChatClick={() => setChatOpen(true)} />
                <UserMenu
                  user={user}
                  anchorEl={anchorEl}
                  onMenuOpen={handleMenuOpen}
                  onMenuClose={handleMenuClose}
                  onLogout={handleLogout}
                />
              </>
            ) : (
              <AuthButtons onOpenSignIn={() => setSignInOpen(true)} />
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
      <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} />
    </AppBar>
  );
}

