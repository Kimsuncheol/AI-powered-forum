import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  const [showKeywords, setShowKeywords] = useState(true);

  useEffect(() => {
    const storedKeywords = localStorage.getItem("recentKeywords");
    if (storedKeywords) {
      setRecentKeywords(JSON.parse(storedKeywords));
    }
  }, []);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      const newKeywords = [
        searchTerm,
        ...recentKeywords.filter((k) => k !== searchTerm),
      ].slice(0, 5);
      setRecentKeywords(newKeywords);
      localStorage.setItem("recentKeywords", JSON.stringify(newKeywords));
      setSearchTerm("");
      // Perform search action here
      console.log("Searching for:", searchTerm);
    }
  };

  const handleDeleteKeyword = (keywordToDelete: string) => {
    const newKeywords = recentKeywords.filter((k) => k !== keywordToDelete);
    setRecentKeywords(newKeywords);
    localStorage.setItem("recentKeywords", JSON.stringify(newKeywords));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <TextField
            autoFocus
            fullWidth
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
          <IconButton onClick={onClose} sx={{ ml: 1 }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Recent Keywords
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={showKeywords}
                onChange={(e) => setShowKeywords(e.target.checked)}
                size="small"
              />
            }
            label="Show"
          />
        </Box>

        {showKeywords && (
          <List>
            {recentKeywords.map((keyword) => (
              <ListItem
                key={keyword}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteKeyword(keyword)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                sx={{
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <ListItemText primary={keyword} />
              </ListItem>
            ))}
            {recentKeywords.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ py: 2 }}
              >
                No recent searches
              </Typography>
            )}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
