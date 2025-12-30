"use client";

import { Paper, TextField, Button, CircularProgress } from "@mui/material";
import { Search } from "@mui/icons-material";

interface AnswerSearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  loading: boolean;
  onSearch: () => void;
}

export const AnswerSearchBar = ({ query, setQuery, loading, onSearch }: AnswerSearchBarProps) => {
  return (
    <Paper 
      elevation={4} 
      sx={{ 
        p: 1, 
        display: 'flex', 
        alignItems: 'center', 
        mb: 6, 
        borderRadius: 8, 
        border: '1px solid', 
        borderColor: 'divider' 
      }}
    >
      <Search sx={{ color: 'action.active', mr: 2, ml: 2, fontSize: 28 }} />
      <TextField 
        fullWidth 
        placeholder="What do you want to know?"
        variant="standard"
        InputProps={{ disableUnderline: true, style: { fontSize: '1.1rem' } }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch();
        }}
      />
      <Button 
        variant="contained" 
        onClick={onSearch} 
        disabled={loading}
        sx={{ borderRadius: 6, px: 4, py: 1.5, textTransform: 'none', fontSize: '1rem', fontWeight: 'bold' }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Ask'}
      </Button>
    </Paper>
  );
};
