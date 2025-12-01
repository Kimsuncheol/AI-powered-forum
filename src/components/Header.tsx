import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Avatar,
  Box,
  InputBase,
  alpha,
  styled,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import InboxIcon from "@mui/icons-material/Inbox";
import { useLocation, Link as RouterLink, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import SearchModal from "./SearchModal";
import AuthModal from "./AuthModal";

// Styled components for Search
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Mock auth state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleAuth = () => {
    setIsAuthenticated(!isAuthenticated);
  };

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const handleNavigation = (target: string) => {
    navigate(`/${target}`);
  };

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={1}
      sx={{ position: "sticky", top: 0, zIndex: 1200 }}
    >
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h6"
          noWrap
          component={RouterLink}
          to="/"
          sx={{
            display: { xs: "none", sm: "block" },
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
          }}
        >
          THREADS
        </Typography>

        {/* Search Bar */}
        <Search onClick={handleSearchOpen}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search", readOnly: true }} // Make readOnly to prevent typing before modal opens
          />
        </Search>

        <Box sx={{ flexGrow: 1 }} />

        {/* Action Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="large"
            aria-label="create new thread"
            color="inherit"
            onClick={() => handleNavigation("new-thread")}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            size="large"
            aria-label="chat"
            color="inherit"
            onClick={() => handleNavigation("chat")}
          >
            <ChatIcon />
          </IconButton>

          {/* Inbox */}
          <IconButton
            size="large"
            aria-label="inbox"
            color="inherit"
            onClick={() => handleNavigation("inbox")}
          >
            <InboxIcon />
          </IconButton>

          <ThemeToggle />

          {/* Auth State */}
          {isAuthenticated ? (
            <>
              <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 1 }}>
                <Avatar alt="User Name" src="/static/images/avatar/2.jpg" />
              </IconButton>
              <UserMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onSignOut={handleToggleAuth}
                username="Demo User"
              />
            </>
          ) : (
            <Button color="inherit" onClick={handleLoginClick}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
      <SearchModal open={isSearchOpen} onClose={handleSearchClose} />
      <AuthModal
        open={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </AppBar>
  );
};

export default Header;
