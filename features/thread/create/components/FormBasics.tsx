import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { CATEGORIES } from "@/features/meta/categories";
import { ProgressiveTagInput } from "@/components/inputs/ProgressiveTagInput";

interface FormBasicsProps {
  title: string;
  setTitle: (value: string) => void;
  categoryId: string;
  setCategoryId: (value: string) => void;
  tagIds: string[];
  setTagIds: (value: string[]) => void;
  loading: boolean;
  touched: { title: boolean; category: boolean };
  errors: { title?: string; category?: string };
  onBlur: (field: string) => void;
}

export function FormBasics({
  title,
  setTitle,
  categoryId,
  setCategoryId,
  tagIds,
  setTagIds,
  loading,
  touched,
  errors,
  onBlur,
}: FormBasicsProps) {
  return (
    <>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => onBlur("title")}
        error={touched.title && !!errors.title}
        helperText={(touched.title && errors.title) || `${title.length}/120`}
        required
        fullWidth
        disabled={loading}
        placeholder="What's on your mind?"
        slotProps={{ htmlInput: { maxLength: 120 } }}
      />

      <FormControl fullWidth required error={touched.category && !!errors.category}>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          value={categoryId}
          label="Category"
          onChange={(e) => setCategoryId(e.target.value as string)}
          onBlur={() => onBlur("category")}
          disabled={loading}
        >
          {CATEGORIES.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.label}
            </MenuItem>
          ))}
        </Select>
        {touched.category && errors.category && (
          <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 0.5, mx: 1.75 }}>
            {errors.category}
          </Box>
        )}
      </FormControl>

      <ProgressiveTagInput
        value={tagIds}
        onChange={setTagIds}
        disabled={loading}
        maxTags={5}
      />
    </>
  );
}
