"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { Box, Chip, TextField, InputAdornment, IconButton, Tooltip, FormHelperText } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { normalizeTag, validateTag, TAG_RULES } from "@/lib/tagRules";

interface ProgressiveTagInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  maxTags?: number;
  disabled?: boolean;
  helperText?: string;
}

const DEFAULT_MAX_TAGS = 5;

export function ProgressiveTagInput({
  value,
  onChange,
  maxTags = DEFAULT_MAX_TAGS,
  disabled = false,
  helperText,
}: ProgressiveTagInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const canAddMore = value.length < maxTags;

  const handleStartEdit = () => {
    if (disabled || !canAddMore) return;
    setIsEditing(true);
    setInputValue("");
    setError(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const commitTag = () => {
    const normalized = normalizeTag(inputValue);

    if (!normalized) {
      setIsEditing(false);
      setInputValue("");
      setError(null);
      return;
    }

    const validation = validateTag(normalized, value, TAG_RULES);
    if (!validation.ok) {
      setError(validation.reason || "Invalid tag");
      return;
    }

    onChange([...value, normalized]);
    setInputValue("");
    setError(null);

    if (value.length + 1 < maxTags) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setInputValue("");
    setError(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitTag();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (inputValue.trim()) {
        commitTag();
      } else {
        cancelEdit();
      }
    }, 100);
  };

  const handleDeleteTag = (index: number) => {
    if (disabled) return;
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  };

  return (
    <Box role="group" aria-label="Tags">
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
        {/* Completed tags */}
        {value.map((tag, index) => (
          <Chip
            key={`${tag}-${index}`}
            label={tag}
            onDelete={disabled ? undefined : () => handleDeleteTag(index)}
            deleteIcon={<span aria-label={`Remove ${tag}`}>×</span>}
            color="primary"
            variant="outlined"
            aria-label={`Tag: ${tag}`}
          />
        ))}

        {/* Add tag chip */}
        {canAddMore && !isEditing && (
          <Tooltip title="Add tag">
            <Chip
              icon={<AddIcon />}
              label={value.length === 0 ? "Add tag" : ""}
              onClick={handleStartEdit}
              disabled={disabled}
              variant="outlined"
              sx={{ cursor: "pointer" }}
              aria-label="Add new tag"
            />
          </Tooltip>
        )}

        {/* Inline edit */}
        {canAddMore && isEditing && (
          <TextField
            inputRef={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            size="small"
            variant="standard"
            placeholder="Enter tag..."
            error={!!error}
            helperText={error}
            disabled={disabled}
            slotProps={{
              htmlInput: { 
                maxLength: TAG_RULES.maxLen,
                "aria-label": "New tag input",
              },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={commitTag}
                      disabled={!inputValue.trim()}
                      size="small"
                      edge="end"
                      aria-label="Confirm tag"
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ minWidth: 120 }}
          />
        )}
      </Box>

      {/* Helper text / count */}
      <FormHelperText sx={{ mt: 0.5 }}>
        {helperText || `${value.length}/${maxTags} tags`}
      </FormHelperText>
    </Box>
  );
}
