import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Typography,
} from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import ReactMarkdown from "react-markdown";

interface TextEditorProps {
  onPost: (content: string, mode: "text" | "markdown") => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ onPost }) => {
  const [mode, setMode] = useState<"text" | "markdown">("text");
  const [content, setContent] = useState("");

  const handleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: "text" | "markdown" | null
  ) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handlePost = () => {
    if (content.trim()) {
      onPost(content, mode);
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          aria-label="editor mode"
          size="small"
        >
          <ToggleButton value="text" aria-label="text mode">
            Text
          </ToggleButton>
          <ToggleButton value="markdown" aria-label="markdown mode">
            Markdown
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {mode === "text" ? (
        <TextField
          multiline
          rows={10}
          fullWidth
          placeholder="Write your post here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="outlined"
        />
      ) : (
        <Box sx={{ display: "flex", gap: 2, height: 400 }}>
          <Box
            sx={{
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <CodeMirror
              value={content}
              height="100%"
              extensions={[markdown({ base: markdownLanguage })]}
              onChange={(value) => setContent(value)}
            />
          </Box>
          <Box
            sx={{
              flex: 1,
              border: "1px dashed #ccc",
              borderRadius: 1,
              p: 2,
              overflowY: "auto",
            }}
          >
            {content ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <Typography color="text.secondary">
                Preview will appear here...
              </Typography>
            )}
          </Box>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handlePost}
          disabled={!content.trim()}
        >
          Post
        </Button>
      </Box>
    </Box>
  );
};

export default TextEditor;
