import React, { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
  CardActions,
  Stack,
  Box,
  Typography,
} from "@mui/material";
import { ThreadCreateInput } from "../../types";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/features/meta/categories";
import { ProgressiveTagInput } from "@/components/inputs/ProgressiveTagInput";

interface CreateThreadFormProps {
  onSubmit: (data: ThreadCreateInput) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export function CreateThreadForm({ onSubmit, loading, error }: CreateThreadFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  
  const [touched, setTouched] = useState({ title: false, body: false, category: false });

  const validate = () => {
    const errors: { title?: string; body?: string; category?: string } = {};
    if (!title.trim()) errors.title = "Title is required";
    else if (title.length > 120) errors.title = "Title must be 120 characters or less";
    
    if (!body.trim()) errors.body = "Body content is required";
    if (!categoryId) errors.category = "Category is required";
    
    return errors;
  };

  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, body: true, category: true });
    
    if (!isValid) return;

    // Defensive: sanitize tags before submit (already validated by ProgressiveTagInput)
    const sanitizedTags = tagIds.map(t => t.trim()).filter(t => t.length > 0);

    try {
      await onSubmit({
        title: title.trim(),
        body: body.trim(),
        categoryId,
        tagIds: sanitizedTags,
      });
    } catch {
      // Error handled by parent
    }
  };

  return (
    <Card sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
            Create a New Thread
          </Typography>

          <Stack spacing={3} sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error">
                {error.message}
              </Alert>
            )}

            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
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
                onChange={(e) => setCategoryId(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, category: true }))}
                disabled={loading}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
              {touched.category && errors.category && (
                <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, mx: 1.75 }}>
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

            <TextField
              label="Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, body: true }))}
              error={touched.body && !!errors.body}
              helperText={touched.body && errors.body}
              required
              fullWidth
              multiline
              minRows={6}
              disabled={loading}
              placeholder="Elaborate on your topic..."
            />
          </Stack>
        </CardContent>
        <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-end", gap: 1 }}>
          <Button 
            variant="text" 
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !isValid}
          >
            {loading ? "Publishing..." : "Publish"}
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}
