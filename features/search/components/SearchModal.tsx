"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  InputAdornment,
  Typography,
  Box,
  Divider,
  CircularProgress,
  DialogActions,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Search as SearchIcon, Close as CloseIcon, History as HistoryIcon, DeleteSweep as DeleteSweepIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useSearch } from "../hooks/useSearch";
import { useRecentSearches } from "../hooks/useRecentSearches";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useDevice } from "@/context/DeviceContext";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const device = useDevice();
  const fullScreen = device.isMobile;
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  
  const { threads, loading, search } = useSearch();
  const { 
    recentSearches, 
    addSearch, 
    removeSearch, 
    clearSearches, 
    isAutoSaveEnabled, 
    toggleAutoSave 
  } = useRecentSearches();

  // Reset query when modal opens - now handled by 'key' in parent
  // useEffect(() => {
  //   if (open) {
  //     setQuery("");
  //   }
  // }, [open]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      search(debouncedQuery, "threads");
    }
  }, [debouncedQuery, search]);

  const handleSearch = useCallback((keyword: string) => {
    if (!keyword.trim()) return;
    addSearch(keyword);
    onClose();
    router.push(`/search?q=${encodeURIComponent(keyword)}&tab=threads`);
  }, [addSearch, onClose, router]);

  const handleApplySuggestion = (text: string) => {
    handleSearch(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  const showRecentSearches = !query.trim() && recentSearches.length > 0;
  // Show auto-save toggle when not searching or always? Usually always accessible implies good UX, 
  // but spec says "rendered at the bottom".
  
  const showSuggestions = !!query.trim();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
          mt: fullScreen ? 0 : 8,
          minHeight: fullScreen ? "100%" : 450,
          maxHeight: fullScreen ? "100%" : 650,
          verticalAlign: "top",
          alignSelf: "flex-start",
        },
      }}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          fullWidth
          autoFocus
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton onClick={() => setQuery("")} size="small">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
        {fullScreen && (
          <IconButton onClick={onClose}>
            <Typography variant="body2">Cancel</Typography>
          </IconButton>
        )}
      </Box>
      
      <Divider />

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        {showRecentSearches && (
          <Box>
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              px: 2, 
              py: 1.5,
              bgcolor: 'background.default'
            }}>
              <Typography variant="subtitle2" color="text.secondary">
                Recent Searches
              </Typography>
              <Button 
                size="small" 
                color="error" 
                onClick={clearSearches}
                startIcon={<DeleteSweepIcon fontSize="small" />}
                sx={{ textTransform: 'none', fontSize: '0.75rem' }}
              >
                Clear All
              </Button>
            </Box>
            <Divider />
            <List disablePadding>
              {recentSearches.map((term) => (
                <ListItem
                  key={term}
                  disablePadding
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={(e) => {
                      e.stopPropagation();
                      removeSearch(term);
                    }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemButton onClick={() => handleApplySuggestion(term)}>
                    <Box component={HistoryIcon} sx={{ mr: 2, color: "text.secondary", fontSize: 20 }} />
                    <ListItemText primary={term} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {showSuggestions && (
          <Box>
             {loading ? (
               <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                 <CircularProgress size={24} />
               </Box>
             ) : (
                <List disablePadding>
                  {threads.length > 0 ? (
                    threads.slice(0, 5).map((thread) => (
                      <ListItem key={thread.id} disablePadding>
                        <ListItemButton onClick={() => handleApplySuggestion(thread.title)}>
                          <Box component={SearchIcon} sx={{ mr: 2, color: "text.secondary", fontSize: 20 }} />
                          <ListItemText 
                            primary={thread.title} 
                            secondary="Thread"
                            primaryTypographyProps={{ 
                              noWrap: true,
                              fontWeight: 500
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))
                  ) : (
                    <Box sx={{ p: 3, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        No results found for &quot;{query}&quot;
                      </Typography>
                    </Box>
                  )}
                </List>
             )}
          </Box>
        )}
      </DialogContent>

      <Divider />
      
      <DialogActions sx={{ justifyContent: "flex-start", px: 3, py: 1.5, bgcolor: 'background.paper' }}>
        <FormControlLabel
          control={
            <Switch
              checked={isAutoSaveEnabled}
              onChange={toggleAutoSave}
              size="small"
              color="primary"
            />
          }
          label={
            <Typography variant="body2" color="text.secondary">
              Auto-save search history
            </Typography>
          }
        />
      </DialogActions>
    </Dialog>
  );
}
