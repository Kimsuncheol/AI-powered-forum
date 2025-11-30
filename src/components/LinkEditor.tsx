import React, { useState } from "react";
import { Box, TextField, Button, Paper } from "@mui/material";

interface LinkEditorProps {
  onPost: (data: { url: string; caption: string }) => void;
}

const LinkEditor: React.FC<LinkEditorProps> = ({ onPost }) => {
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState(false);

  const validateUrl = (value: string) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$", // fragment locator
      "i"
    );
    return !!pattern.test(value);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    if (value && !validateUrl(value)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handlePost = () => {
    if (url && !error) {
      onPost({ url, caption });
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
        <TextField
          fullWidth
          label="Link URL"
          placeholder="https://example.com"
          value={url}
          onChange={handleUrlChange}
          error={error}
          helperText={error ? "Please enter a valid URL" : ""}
          variant="outlined"
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Caption"
          placeholder="Add a caption or description..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          variant="outlined"
        />
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handlePost}
          disabled={!url || error}
        >
          Post
        </Button>
      </Box>
    </Box>
  );
};

export default LinkEditor;
