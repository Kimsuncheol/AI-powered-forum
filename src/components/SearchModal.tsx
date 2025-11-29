import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  InputBase,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Switch,
  Box,
  Divider,
  alpha,
  styled,
  FormControlLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchInputContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [showKeywords, setShowKeywords] = useState(true);

  // Load keywords from local storage on mount
  useEffect(() => {
    const storedKeywords = localStorage.getItem("searchKeywords");
    if (storedKeywords) {
      setKeywords(JSON.parse(storedKeywords));
    }
  }, []);

  // Save keywords to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("searchKeywords", JSON.stringify(keywords));
  }, [keywords]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      if (!keywords.includes(query.trim())) {
        setKeywords([query.trim(), ...keywords].slice(0, 10)); // Keep last 10
      }
      // Perform search action here (e.g., navigate to results)
      console.log("Searching for:", query);
      setQuery("");
      onClose();
    }
  };

  const handleDeleteKeyword = (keywordToDelete: string) => {
    setKeywords(keywords.filter((k) => k !== keywordToDelete));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          position: "absolute",
          top: 50,
          m: 0,
          borderRadius: 2,
          minHeight: "40vh",
        },
      }}
    >
      <DialogContent>
        <SearchInputContainer>
          <SearchIcon color="action" sx={{ mr: 1 }} />
          <InputBase
            placeholder="Search..."
            fullWidth
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </SearchInputContainer>

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
                size="small"
                checked={showKeywords}
                onChange={(e) => setShowKeywords(e.target.checked)}
              />
            }
            label={<Typography variant="caption">Show History</Typography>}
          />
        </Box>

        <Divider />

        {showKeywords && (
          <List>
            {keywords.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="No recent searches"
                  sx={{ color: "text.secondary", fontStyle: "italic" }}
                />
              </ListItem>
            ) : (
              keywords.map((keyword, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteKeyword(keyword)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemText primary={keyword} />
                </ListItem>
              ))
            )}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
