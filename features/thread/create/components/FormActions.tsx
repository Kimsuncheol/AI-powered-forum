import React from "react";
import { CardActions, Button } from "@mui/material";

interface FormActionsProps {
  loading: boolean;
  isValid: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function FormActions({
  loading,
  isValid,
  onCancel,
  onSubmit,
}: FormActionsProps) {
  return (
    <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-end", gap: 1 }}>
      <Button variant="text" onClick={onCancel} disabled={loading}>
        Cancel
      </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={loading || !isValid}
        onClick={onSubmit}
      >
        {loading ? "Publishing..." : "Publish"}
      </Button>
    </CardActions>
  );
}
