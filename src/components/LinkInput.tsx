import React, { useState, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";

interface LinkInputProps {
  onPost: (url: string) => void;
}

const LinkInput: React.FC<LinkInputProps> = ({ onPost }) => {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Simple URL regex validation
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    setIsValid(urlPattern.test(url));
  }, [url]);

  const handlePost = () => {
    if (isValid) {
      onPost(url);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        fullWidth
        label="Link URL"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        error={!!url && !isValid}
        helperText={!!url && !isValid ? "Please enter a valid URL" : ""}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={handlePost} disabled={!isValid}>
          Post
        </Button>
      </Box>
    </Box>
  );
};

export default LinkInput;
