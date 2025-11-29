import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDelete = (tagToDelete: string) => {
    onChange(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleAddClick = () => {
    setIsEditing(true);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        if (!tags.includes(inputValue.trim())) {
          onChange([...tags, inputValue.trim()]);
        }
        setInputValue("");
        setIsEditing(false);
      }
    } else if (e.key === "Backspace" && inputValue === "") {
      setIsEditing(false);
    } else if (e.key === "Escape") {
      setInputValue("");
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      if (!tags.includes(inputValue.trim())) {
        onChange([...tags, inputValue.trim()]);
      }
    }
    setInputValue("");
    setIsEditing(false);
  };

  return (
    <Box
      sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}
    >
      {tags.map((tag) => (
        <Chip key={tag} label={tag} onDelete={() => handleDelete(tag)} />
      ))}

      {isEditing ? (
        <TextField
          inputRef={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onBlur={handleBlur}
          size="small"
          variant="outlined"
          placeholder="New tag"
          sx={{ width: 100 }}
          InputProps={{
            style: { height: 32, padding: "0 8px" },
          }}
        />
      ) : (
        <IconButton
          onClick={handleAddClick}
          size="small"
          sx={{ border: "1px dashed grey" }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default TagInput;
